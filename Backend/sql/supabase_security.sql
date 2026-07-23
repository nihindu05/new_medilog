-- ============================================================================
-- MedLogs: Supabase Auth integration and Row Level Security
-- Run AFTER tables.sql in the Supabase SQL editor.
-- ============================================================================

BEGIN;

-- Helper functions are SECURITY DEFINER so policies can inspect role membership
-- without recursively invoking RLS on user_account/user_role.
CREATE OR REPLACE FUNCTION public.current_medlogs_user_id()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT ua.user_id
    FROM public.user_account AS ua
    WHERE ua.auth_user_id = auth.uid()
      AND ua.account_status = 'Active'
    LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_medlogs_office_id()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT ua.jmo_office_id
    FROM public.user_account AS ua
    WHERE ua.auth_user_id = auth.uid()
      AND ua.account_status = 'Active'
    LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.has_medlogs_role(required_roles text[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_account AS ua
        JOIN public.user_role AS ur ON ur.user_id = ua.user_id
        JOIN public.roles AS r ON r.role_id = ur.role_id
        WHERE ua.auth_user_id = auth.uid()
          AND ua.account_status = 'Active'
          AND r.role_name = ANY(required_roles)
    )
$$;

REVOKE ALL ON FUNCTION public.current_medlogs_user_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_medlogs_office_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_medlogs_role(text[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_medlogs_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_medlogs_office_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_medlogs_role(text[]) TO authenticated;

-- Activate RLS for every public application table.
DO $$
DECLARE
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'hospital', 'jmo_office', 'ward', 'doctor', 'roles', 'user_account',
        'user_role', 'staff_posting', 'police_station', 'police_officer',
        'court', 'magistrate_isd', 'patient_victim', 'living_patient_details',
        'deceased_person_details', 'next_of_kin', 'forensic_case',
        'clinical_case_details', 'autopsy_case_details', 'hospital_admission',
        'case_doctor', 'examination', 'examination_doctor', 'injury',
        'internal_finding', 'body_diagram_marking', 'sample_evidence',
        'laboratory', 'lab_request', 'lab_result', 'report', 'case_document',
        'case_referral', 'court_case', 'authority_coordination_record',
        'chain_of_custody', 'report_version', 'report_signatory',
        'report_dispatch', 'task_notification', 'audit_log'
    ]
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END
$$;

-- Users can see their own profile. Administrators can manage all profiles.
CREATE POLICY user_account_select_self_or_admin
ON public.user_account FOR SELECT TO authenticated
USING (
    auth_user_id = auth.uid()
    OR public.has_medlogs_role(ARRAY['System Administrator'])
);

CREATE POLICY user_account_admin_write
ON public.user_account FOR ALL TO authenticated
USING (public.has_medlogs_role(ARRAY['System Administrator']))
WITH CHECK (public.has_medlogs_role(ARRAY['System Administrator']));

CREATE POLICY roles_authenticated_read
ON public.roles FOR SELECT TO authenticated
USING (public.current_medlogs_user_id() IS NOT NULL);

CREATE POLICY roles_admin_write
ON public.roles FOR ALL TO authenticated
USING (public.has_medlogs_role(ARRAY['System Administrator']))
WITH CHECK (public.has_medlogs_role(ARRAY['System Administrator']));

CREATE POLICY user_role_self_or_admin_read
ON public.user_role FOR SELECT TO authenticated
USING (
    user_id = public.current_medlogs_user_id()
    OR public.has_medlogs_role(ARRAY['System Administrator'])
);

CREATE POLICY user_role_admin_write
ON public.user_role FOR ALL TO authenticated
USING (public.has_medlogs_role(ARRAY['System Administrator']))
WITH CHECK (public.has_medlogs_role(ARRAY['System Administrator']));

-- Reference data is readable by every active application user.
DO $$
DECLARE
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'hospital', 'jmo_office', 'ward', 'doctor', 'staff_posting',
        'police_station', 'police_officer', 'court', 'magistrate_isd',
        'laboratory'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (public.current_medlogs_user_id() IS NOT NULL)',
            table_name || '_authenticated_read',
            table_name
        );
    END LOOP;
END
$$;

-- Administrators maintain reference data.
DO $$
DECLARE
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'hospital', 'jmo_office', 'ward', 'doctor', 'staff_posting',
        'police_station', 'police_officer', 'court', 'magistrate_isd',
        'laboratory'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (public.has_medlogs_role(ARRAY[''System Administrator''])) WITH CHECK (public.has_medlogs_role(ARRAY[''System Administrator'']))',
            table_name || '_admin_write',
            table_name
        );
    END LOOP;
END
$$;

-- Case records are isolated by JMO office. Administrators retain global access.
CREATE POLICY forensic_case_office_read
ON public.forensic_case FOR SELECT TO authenticated
USING (
    jmo_office_id = public.current_medlogs_office_id()
    OR public.has_medlogs_role(ARRAY['System Administrator'])
);

CREATE POLICY forensic_case_office_insert
ON public.forensic_case FOR INSERT TO authenticated
WITH CHECK (
    jmo_office_id = public.current_medlogs_office_id()
    AND registered_by_user_id = public.current_medlogs_user_id()
    AND public.has_medlogs_role(ARRAY[
        'System Administrator', 'Consultant JMO',
        'Medical Officer Medico-Legal', 'Administrative Clerk'
    ])
);

CREATE POLICY forensic_case_clinical_update
ON public.forensic_case FOR UPDATE TO authenticated
USING (
    jmo_office_id = public.current_medlogs_office_id()
    AND public.has_medlogs_role(ARRAY[
        'System Administrator', 'Consultant JMO',
        'Medical Officer Medico-Legal', 'Administrative Clerk'
    ])
)
WITH CHECK (jmo_office_id = public.current_medlogs_office_id());

-- Patient rows are accessible when linked to a case in the user's office.
-- Registration staff may insert a patient before creating the related case.
CREATE POLICY patient_victim_office_read
ON public.patient_victim FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.forensic_case AS fc
        WHERE fc.patient_id = patient_victim.patient_id
          AND fc.jmo_office_id = public.current_medlogs_office_id()
    )
    OR public.has_medlogs_role(ARRAY['System Administrator'])
);

CREATE POLICY patient_victim_staff_insert
ON public.patient_victim FOR INSERT TO authenticated
WITH CHECK (
    public.has_medlogs_role(ARRAY[
        'System Administrator', 'Consultant JMO',
        'Medical Officer Medico-Legal', 'Administrative Clerk'
    ])
);

CREATE POLICY patient_victim_staff_update
ON public.patient_victim FOR UPDATE TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.forensic_case AS fc
        WHERE fc.patient_id = patient_victim.patient_id
          AND fc.jmo_office_id = public.current_medlogs_office_id()
    )
    OR public.has_medlogs_role(ARRAY['System Administrator'])
);

-- Child-table policies use their parent case. These tables contain the core
-- medico-legal workflow and are never exposed to anonymous users.
DO $$
DECLARE
    table_name text;
BEGIN
    FOREACH table_name IN ARRAY ARRAY[
        'clinical_case_details', 'autopsy_case_details', 'hospital_admission',
        'case_doctor', 'examination', 'sample_evidence', 'report',
        'case_document', 'case_referral', 'court_case',
        'authority_coordination_record', 'task_notification'
    ]
    LOOP
        EXECUTE format(
            'CREATE POLICY %I ON public.%I FOR SELECT TO authenticated USING (
                EXISTS (
                    SELECT 1 FROM public.forensic_case fc
                    WHERE fc.case_id = %I.case_id
                      AND fc.jmo_office_id = public.current_medlogs_office_id()
                )
                OR public.has_medlogs_role(ARRAY[''System Administrator''])
            )',
            table_name || '_office_read',
            table_name,
            table_name
        );
    END LOOP;
END
$$;

-- Audit records cannot be changed through the client API.
CREATE POLICY audit_log_admin_read
ON public.audit_log FOR SELECT TO authenticated
USING (public.has_medlogs_role(ARRAY['System Administrator']));

COMMIT;
