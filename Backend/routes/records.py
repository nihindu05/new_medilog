from flask import Blueprint, g, jsonify, request

from database import get_connection
from security import require_auth


records_api = Blueprint("records_api", __name__)

READ_ROLES = (
    "System Administrator", "Consultant JMO", "Medical Officer Medico-Legal",
    "Assistant JMO", "Administrative Clerk", "Laboratory Staff",
    "Police Liaison", "Read-Only User",
)
CLINICAL_WRITE_ROLES = (
    "System Administrator", "Consultant JMO",
    "Medical Officer Medico-Legal", "Administrative Clerk",
)
EXAM_WRITE_ROLES = (
    "System Administrator", "Consultant JMO",
    "Medical Officer Medico-Legal", "Assistant JMO",
)
LAB_WRITE_ROLES = ("System Administrator", "Laboratory Staff")


def _body():
    return request.get_json(silent=True) or {}


def _required(data, *names):
    missing = [name for name in names if not str(data.get(name, "")).strip()]
    return missing


@records_api.route("/patients", methods=["GET"])
@require_auth(*READ_ROLES)
def list_patients():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT DISTINCT
                    p.patient_id, p.person_status, p.full_name, p.nic_passport_no,
                    p.date_of_birth, p.age, p.gender, p.permanent_address,
                    p.contact_no, p.hospital_no, p.bht_no, p.nationality,
                    p.ethnicity, p.is_minor, p.created_at, p.updated_at,
                    l.current_condition, l.consent_status, l.guardian_name,
                    l.guardian_contact, d.date_of_death, d.time_of_death,
                    d.place_of_death, d.occupation, d.identification_status,
                    d.body_received_datetime
                FROM patient_victim p
                LEFT JOIN living_patient_details l ON l.patient_id = p.patient_id
                LEFT JOIN deceased_person_details d ON d.patient_id = p.patient_id
                LEFT JOIN forensic_case fc ON fc.patient_id = p.patient_id
                WHERE fc.jmo_office_id = %s
                   OR %s = ANY(%s)
                ORDER BY p.created_at DESC
                """,
                (g.current_user["officeId"], "System Administrator", g.current_user["roles"]),
            )
            keys = [
                "id", "personStatus", "fullName", "nicPassportNo", "dateOfBirth",
                "age", "gender", "permanentAddress", "contactNo", "hospitalNo",
                "bhtNo", "nationality", "ethnicity", "isMinor", "createdAt",
                "updatedAt", "currentCondition", "consentStatus", "guardianName",
                "guardianContact", "dateOfDeath", "timeOfDeath", "placeOfDeath",
                "occupation", "identificationStatus", "bodyReceivedDateTime",
            ]
            rows = []
            for row in cursor.fetchall():
                item = dict(zip(keys, row))
                for key in ("dateOfBirth", "dateOfDeath", "timeOfDeath", "createdAt",
                            "updatedAt", "bodyReceivedDateTime"):
                    if item[key] is not None:
                        item[key] = item[key].isoformat()
                item["personStatus"] = item["personStatus"].lower()
                item["living"] = {
                    "currentCondition": item.get("currentCondition"),
                    "consentStatus": item.get("consentStatus"),
                }
                item["deceased"] = {
                    "dateOfDeath": item.get("dateOfDeath"),
                    "timeOfDeath": item.get("timeOfDeath"),
                    "placeOfDeath": item.get("placeOfDeath"),
                    "occupation": item.get("occupation"),
                    "bodyReceivedDateTime": item.get("bodyReceivedDateTime"),
                }
                item["nextOfKin"] = {
                    "name": item.get("guardianName"),
                    "contactNo": item.get("guardianContact"),
                }
                rows.append(item)
            return jsonify(rows)
    finally:
        connection.close()


@records_api.route("/patients", methods=["POST"])
@require_auth(*CLINICAL_WRITE_ROLES)
def save_patient():
    data = _body()
    missing = _required(data, "id", "fullName", "personStatus")
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400
    status = str(data["personStatus"]).capitalize()
    if status not in {"Living", "Deceased", "Unknown"}:
        return jsonify({"message": "Invalid personStatus."}), 400

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO patient_victim (
                    patient_id, full_name, nic_passport_no, date_of_birth, age,
                    gender, permanent_address, contact_no, hospital_no, bht_no,
                    nationality, ethnicity, person_status, is_minor
                ) VALUES (
                    %(id)s, %(fullName)s, %(nicPassportNo)s, %(dateOfBirth)s,
                    %(age)s, %(gender)s, %(permanentAddress)s, %(contactNo)s,
                    %(hospitalNo)s, %(bhtNo)s, %(nationality)s, %(ethnicity)s,
                    %(personStatusDb)s, %(isMinor)s
                )
                ON CONFLICT (patient_id) DO UPDATE SET
                    full_name = EXCLUDED.full_name,
                    nic_passport_no = EXCLUDED.nic_passport_no,
                    date_of_birth = EXCLUDED.date_of_birth,
                    age = EXCLUDED.age,
                    gender = EXCLUDED.gender,
                    permanent_address = EXCLUDED.permanent_address,
                    contact_no = EXCLUDED.contact_no,
                    hospital_no = EXCLUDED.hospital_no,
                    bht_no = EXCLUDED.bht_no,
                    nationality = EXCLUDED.nationality,
                    ethnicity = EXCLUDED.ethnicity,
                    person_status = EXCLUDED.person_status,
                    is_minor = EXCLUDED.is_minor
                """,
                {
                    **data,
                    "personStatusDb": status,
                    "nicPassportNo": data.get("nicPassportNo") or None,
                    "dateOfBirth": data.get("dateOfBirth") or None,
                    "age": data.get("age") or None,
                    "gender": data.get("gender") or None,
                    "permanentAddress": data.get("permanentAddress") or data.get("address") or None,
                    "contactNo": data.get("contactNo") or None,
                    "hospitalNo": data.get("hospitalNo") or None,
                    "bhtNo": data.get("bhtNo") or None,
                    "nationality": data.get("nationality") or None,
                    "ethnicity": data.get("ethnicity") or None,
                    "isMinor": bool(data.get("isMinor")),
                },
            )
            if status == "Living":
                living = data.get("living") or data
                cursor.execute(
                    """
                    INSERT INTO living_patient_details (
                        patient_id, current_condition, consent_status,
                        guardian_name, guardian_contact
                    ) VALUES (%s, %s, %s, %s, %s)
                    ON CONFLICT (patient_id) DO UPDATE SET
                        current_condition = EXCLUDED.current_condition,
                        consent_status = EXCLUDED.consent_status,
                        guardian_name = EXCLUDED.guardian_name,
                        guardian_contact = EXCLUDED.guardian_contact
                    """,
                    (
                        data["id"], living.get("currentCondition"),
                        living.get("consentStatus"),
                        (data.get("nextOfKin") or {}).get("name"),
                        (data.get("nextOfKin") or {}).get("contactNo"),
                    ),
                )
            elif status == "Deceased":
                deceased = data.get("deceased") or data
                cursor.execute(
                    """
                    INSERT INTO deceased_person_details (
                        patient_id, date_of_death, time_of_death, place_of_death,
                        occupation, identification_status, body_received_datetime
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                    ON CONFLICT (patient_id) DO UPDATE SET
                        date_of_death = EXCLUDED.date_of_death,
                        time_of_death = EXCLUDED.time_of_death,
                        place_of_death = EXCLUDED.place_of_death,
                        occupation = EXCLUDED.occupation,
                        identification_status = EXCLUDED.identification_status,
                        body_received_datetime = EXCLUDED.body_received_datetime
                    """,
                    (
                        data["id"], deceased.get("dateOfDeath") or None,
                        deceased.get("timeOfDeath") or None,
                        deceased.get("placeOfDeath"), deceased.get("occupation"),
                        data.get("identificationStatus"),
                        deceased.get("bodyReceivedDateTime") or None,
                    ),
                )
            kin = data.get("nextOfKin") or {}
            if kin.get("name"):
                cursor.execute("DELETE FROM next_of_kin WHERE patient_id = %s", (data["id"],))
                cursor.execute(
                    """
                    INSERT INTO next_of_kin
                        (patient_id, full_name, relationship, contact_no, address)
                    VALUES (%s, %s, %s, %s, %s)
                    """,
                    (data["id"], kin["name"], kin.get("relationship") or "Unknown",
                     kin.get("contactNo"), kin.get("address")),
                )
        connection.commit()
        return jsonify({"id": data["id"], "message": "Patient saved."}), 201
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


@records_api.route("/cases", methods=["GET"])
@require_auth(*READ_ROLES)
def list_cases():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT fc.case_id, fc.patient_id, p.full_name, fc.case_type,
                       fc.case_category, fc.case_status, fc.registered_datetime,
                       fc.confidentiality_level, fc.is_sexual_assault_case,
                       c.mlef_no, c.reason_for_examination, a.pm_registry_no,
                       a.inquest_no, a.court_order_no
                FROM forensic_case fc
                JOIN patient_victim p ON p.patient_id = fc.patient_id
                LEFT JOIN clinical_case_details c ON c.case_id = fc.case_id
                LEFT JOIN autopsy_case_details a ON a.case_id = fc.case_id
                WHERE fc.jmo_office_id = %s
                   OR %s = ANY(%s)
                ORDER BY fc.registered_datetime DESC
                """,
                (g.current_user["officeId"], "System Administrator", g.current_user["roles"]),
            )
            keys = [
                "id", "patientId", "patientName", "caseType", "category", "status",
                "registeredDateTime", "confidentiality", "sexualAssault",
                "mlefNo", "clinicalReason", "pmRegistryNo", "inquestNo", "courtOrderNo",
            ]
            result = []
            for row in cursor.fetchall():
                item = dict(zip(keys, row))
                item["type"] = item["caseType"].lower()
                item["registeredDateTime"] = item["registeredDateTime"].isoformat()
                result.append(item)
            return jsonify(result)
    finally:
        connection.close()


@records_api.route("/cases", methods=["POST"])
@require_auth(*CLINICAL_WRITE_ROLES)
def save_case():
    data = _body()
    missing = _required(data, "id", "patientId", "type")
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400
    case_type = "Autopsy" if str(data["type"]).lower() == "autopsy" else "Clinical"
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO forensic_case (
                    case_id, case_type, case_category, case_status,
                    registered_datetime, patient_id, registered_by_user_id,
                    jmo_office_id, confidentiality_level, is_sexual_assault_case
                ) VALUES (%s, %s, %s, %s, COALESCE(%s, CURRENT_TIMESTAMP),
                          %s, %s, %s, %s, %s)
                ON CONFLICT (case_id) DO UPDATE SET
                    case_category = EXCLUDED.case_category,
                    case_status = EXCLUDED.case_status,
                    confidentiality_level = EXCLUDED.confidentiality_level,
                    is_sexual_assault_case = EXCLUDED.is_sexual_assault_case
                """,
                (
                    data["id"], case_type, data.get("category"),
                    data.get("status") or "Registered",
                    data.get("registeredDateTime") or None, data["patientId"],
                    g.current_user["id"], g.current_user["officeId"],
                    data.get("confidentiality") or "Standard",
                    bool(data.get("sexualAssault")),
                ),
            )
            if case_type == "Clinical":
                cursor.execute(
                    """
                    INSERT INTO clinical_case_details (
                        case_id, mlef_no, mlef_issued_date, reason_for_examination,
                        patient_history, nature_of_harm, nature_of_weapon, hurt_category
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
                    ON CONFLICT (case_id) DO UPDATE SET
                        mlef_no=EXCLUDED.mlef_no,
                        mlef_issued_date=EXCLUDED.mlef_issued_date,
                        reason_for_examination=EXCLUDED.reason_for_examination,
                        patient_history=EXCLUDED.patient_history,
                        nature_of_harm=EXCLUDED.nature_of_harm,
                        nature_of_weapon=EXCLUDED.nature_of_weapon,
                        hurt_category=EXCLUDED.hurt_category
                    """,
                    (
                        data["id"], data.get("mlefNo"), data.get("mlefDate") or None,
                        data.get("clinicalReason"), data.get("patientHistory"),
                        data.get("natureOfHarm"), data.get("natureOfWeapon"),
                        data.get("hurtCategory"),
                    ),
                )
            else:
                cursor.execute(
                    """
                    INSERT INTO autopsy_case_details (
                        case_id, pm_registry_no, inquest_no, court_order_no,
                        death_report_no, date_of_inquest, place_of_pm,
                        cause_of_death_summary, manner_of_death
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    ON CONFLICT (case_id) DO UPDATE SET
                        pm_registry_no=EXCLUDED.pm_registry_no,
                        inquest_no=EXCLUDED.inquest_no,
                        court_order_no=EXCLUDED.court_order_no,
                        death_report_no=EXCLUDED.death_report_no,
                        date_of_inquest=EXCLUDED.date_of_inquest,
                        place_of_pm=EXCLUDED.place_of_pm,
                        cause_of_death_summary=EXCLUDED.cause_of_death_summary,
                        manner_of_death=EXCLUDED.manner_of_death
                    """,
                    (
                        data["id"], data.get("pmRegistryNo"), data.get("inquestNo"),
                        data.get("courtOrderNo"), data.get("deathReportNo"),
                        data.get("dateOfInquest") or None, data.get("placeOfPM"),
                        data.get("causeSummary"), data.get("mannerOfDeath"),
                    ),
                )
        connection.commit()
        return jsonify({"id": data["id"], "message": "Case saved."}), 201
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()
