import json

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
EVIDENCE_WRITE_ROLES = (
    "System Administrator", "Consultant JMO",
    "Medical Officer Medico-Legal", "Assistant JMO", "Laboratory Staff",
)


def _body():
    return request.get_json(silent=True) or {}


def _required(data, *names):
    missing = [name for name in names if not str(data.get(name, "")).strip()]
    return missing


def _visible_case(cursor, case_id):
    cursor.execute(
        """
        SELECT 1
        FROM forensic_case
        WHERE case_id = %s
          AND (jmo_office_id = %s OR %s = ANY(%s))
        """,
        (
            case_id,
            g.current_user["officeId"],
            "System Administrator",
            g.current_user["roles"],
        ),
    )
    return cursor.fetchone() is not None


@records_api.route("/examinations", methods=["GET"])
@require_auth(*READ_ROLES)
def list_examinations():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT e.examination_id, e.case_id, e.exam_type, e.exam_datetime,
                       e.exam_place, e.examination_status, e.notes
                FROM examination e
                JOIN forensic_case fc ON fc.case_id = e.case_id
                WHERE fc.jmo_office_id = %s OR %s = ANY(%s)
                ORDER BY e.exam_datetime DESC
                """,
                (
                    g.current_user["officeId"],
                    "System Administrator",
                    g.current_user["roles"],
                ),
            )
            examinations = []
            for row in cursor.fetchall():
                try:
                    item = json.loads(row[6]) if row[6] else {}
                except (TypeError, ValueError):
                    item = {"generalNotes": row[6] or ""}
                item.update({
                    "databaseId": row[0],
                    "id": item.get("id") or f"EXAM-{row[0]:06d}",
                    "caseId": row[1],
                    "examType": row[2],
                    "examDateTime": row[3].isoformat(),
                    "examPlace": row[4] or "",
                    "status": row[5],
                })

                cursor.execute(
                    """
                    SELECT injury_id, injury_type, body_location, side, length,
                           width, depth, description, injury_age, severity,
                           weapon_opinion, is_fatal
                    FROM injury
                    WHERE examination_id = %s
                    ORDER BY injury_id
                    """,
                    (row[0],),
                )
                injury_rows = cursor.fetchall()
                injury_ids = {}
                item["injuries"] = []
                for injury_row in injury_rows:
                    client_id = f"INJ-{injury_row[0]:06d}"
                    injury_ids[injury_row[0]] = client_id
                    item["injuries"].append({
                        "id": client_id,
                        "markerId": "",
                        "type": injury_row[1],
                        "bodyLocation": injury_row[2],
                        "side": injury_row[3] or "",
                        "length": str(injury_row[4]) if injury_row[4] is not None else "",
                        "width": str(injury_row[5]) if injury_row[5] is not None else "",
                        "depth": str(injury_row[6]) if injury_row[6] is not None else "",
                        "description": injury_row[7] or "",
                        "injuryAge": injury_row[8] or "",
                        "severity": injury_row[9] or "",
                        "weaponOpinion": injury_row[10] or "",
                        "isFatal": "Yes" if injury_row[11] else "No",
                    })

                cursor.execute(
                    """
                    SELECT marking_id, injury_id, body_region, x_coordinate,
                           y_coordinate, marking_description
                    FROM body_diagram_marking
                    WHERE examination_id = %s
                    ORDER BY marking_id
                    """,
                    (row[0],),
                )
                item["diagramMarkers"] = []
                for marker in cursor.fetchall():
                    marker_id = f"M{marker[0]}"
                    linked_injury = injury_ids.get(marker[1], "")
                    item["diagramMarkers"].append({
                        "id": marker_id,
                        "injuryId": linked_injury,
                        "view": marker[5] or "front",
                        "bodyRegion": marker[2],
                        "x": float(marker[3]) if marker[3] is not None else 0,
                        "y": float(marker[4]) if marker[4] is not None else 0,
                    })
                    if linked_injury:
                        for injury in item["injuries"]:
                            if injury["id"] == linked_injury:
                                injury["markerId"] = marker_id

                cursor.execute(
                    """
                    SELECT internal_finding_id, organ_name, finding_description,
                           pathological_condition
                    FROM internal_finding
                    WHERE examination_id = %s
                    ORDER BY internal_finding_id
                    """,
                    (row[0],),
                )
                item["organFindings"] = [
                    {
                        "id": f"ORG-{finding[0]:06d}",
                        "organName": finding[1],
                        "findingDescription": finding[2],
                        "pathologicalCondition": finding[3] or "",
                    }
                    for finding in cursor.fetchall()
                ]
                examinations.append(item)
            return jsonify(examinations)
    finally:
        connection.close()


@records_api.route("/examinations", methods=["POST"])
@require_auth(*EXAM_WRITE_ROLES)
def save_examination():
    data = _body()
    missing = _required(data, "caseId", "examType", "examDateTime")
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            if not _visible_case(cursor, data["caseId"]):
                return jsonify({"message": "Case not found or access denied."}), 404

            database_id = data.get("databaseId")
            notes = json.dumps(data)
            if database_id:
                cursor.execute(
                    """
                    UPDATE examination
                    SET case_id=%s, exam_type=%s, exam_datetime=%s, exam_place=%s,
                        examination_status=%s, notes=%s
                    WHERE examination_id=%s
                    RETURNING examination_id
                    """,
                    (
                        data["caseId"], data["examType"], data["examDateTime"],
                        data.get("examPlace"), data.get("status") or "Draft",
                        notes, database_id,
                    ),
                )
                updated = cursor.fetchone()
                if not updated:
                    return jsonify({"message": "Examination not found."}), 404
                examination_id = updated[0]
            else:
                cursor.execute(
                    """
                    INSERT INTO examination (
                        case_id, exam_type, exam_datetime, exam_place,
                        examination_status, notes, created_by_user_id
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s)
                    RETURNING examination_id
                    """,
                    (
                        data["caseId"], data["examType"], data["examDateTime"],
                        data.get("examPlace"), data.get("status") or "Draft",
                        notes, g.current_user["id"],
                    ),
                )
                examination_id = cursor.fetchone()[0]

            cursor.execute(
                "DELETE FROM body_diagram_marking WHERE examination_id=%s",
                (examination_id,),
            )
            cursor.execute(
                "DELETE FROM injury WHERE examination_id=%s",
                (examination_id,),
            )
            cursor.execute(
                "DELETE FROM internal_finding WHERE examination_id=%s",
                (examination_id,),
            )

            injury_id_map = {}
            for injury in data.get("injuries") or []:
                cursor.execute(
                    """
                    INSERT INTO injury (
                        examination_id, injury_type, body_location, side,
                        length, width, depth, description, injury_age, severity,
                        weapon_opinion, is_fatal
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    RETURNING injury_id
                    """,
                    (
                        examination_id,
                        injury.get("type") or "Not recorded",
                        injury.get("bodyLocation") or "Not recorded",
                        injury.get("side") or None,
                        injury.get("length") or None,
                        injury.get("width") or None,
                        injury.get("depth") or None,
                        injury.get("description") or None,
                        injury.get("injuryAge") or None,
                        injury.get("severity") or None,
                        injury.get("weaponOpinion") or None,
                        str(injury.get("isFatal") or "").lower() in {"yes", "true", "1"},
                    ),
                )
                injury_id_map[str(injury.get("id"))] = cursor.fetchone()[0]

            for marker in data.get("diagramMarkers") or []:
                cursor.execute(
                    """
                    INSERT INTO body_diagram_marking (
                        examination_id, injury_id, body_region, x_coordinate,
                        y_coordinate, marking_description
                    ) VALUES (%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        examination_id,
                        injury_id_map.get(str(marker.get("injuryId"))),
                        marker.get("bodyRegion") or "Not recorded",
                        marker.get("x"),
                        marker.get("y"),
                        marker.get("view") or "front",
                    ),
                )

            for finding in data.get("organFindings") or []:
                cursor.execute(
                    """
                    INSERT INTO internal_finding (
                        examination_id, organ_name, finding_description,
                        pathological_condition
                    ) VALUES (%s,%s,%s,%s)
                    """,
                    (
                        examination_id,
                        finding.get("organName") or "Not recorded",
                        finding.get("findingDescription") or "Not recorded",
                        finding.get("pathologicalCondition") or None,
                    ),
                )
        connection.commit()
        return jsonify({
            "databaseId": examination_id,
            "id": data.get("id") or f"EXAM-{examination_id:06d}",
            "message": "Examination and injury records saved.",
        }), 201
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


@records_api.route("/evidence", methods=["GET"])
@require_auth(*READ_ROLES)
def list_evidence():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT s.sample_id, s.sample_reference, s.case_id,
                       s.examination_id, s.sample_type, s.collected_datetime,
                       s.seal_no, s.storage_condition, s.sample_status, s.metadata
                FROM sample_evidence s
                JOIN forensic_case fc ON fc.case_id = s.case_id
                WHERE fc.jmo_office_id = %s OR %s = ANY(%s)
                ORDER BY s.collected_datetime DESC
                """,
                (
                    g.current_user["officeId"],
                    "System Administrator",
                    g.current_user["roles"],
                ),
            )
            result = []
            for row in cursor.fetchall():
                item = dict(row[9] or {})
                item.update({
                    "databaseId": row[0],
                    "id": row[1] or item.get("id") or f"SMP-{row[0]:06d}",
                    "caseId": row[2],
                    "examDatabaseId": row[3],
                    "sampleType": row[4],
                    "collectedDateTime": row[5].isoformat(),
                    "sealNo": row[6] or "",
                    "storageCondition": row[7] or "",
                    "sampleStatus": row[8],
                })
                cursor.execute(
                    """
                    SELECT custody_id, transfer_datetime, action_type,
                           seal_status, remarks
                    FROM chain_of_custody
                    WHERE sample_id = %s
                    ORDER BY transfer_datetime, custody_id
                    """,
                    (row[0],),
                )
                item["custodyEvents"] = []
                for custody in cursor.fetchall():
                    try:
                        details = json.loads(custody[4]) if custody[4] else {}
                    except (TypeError, ValueError):
                        details = {"remarks": custody[4] or ""}
                    details.update({
                        "databaseId": custody[0],
                        "id": details.get("id") or f"COC-{custody[0]:06d}",
                        "transferDateTime": custody[1].isoformat(),
                        "actionType": custody[2],
                        "sealStatus": custody[3] or "",
                    })
                    item["custodyEvents"].append(details)
                result.append(item)
            return jsonify(result)
    finally:
        connection.close()


@records_api.route("/evidence", methods=["POST"])
@require_auth(*EVIDENCE_WRITE_ROLES)
def save_evidence():
    data = _body()
    missing = _required(
        data, "caseId", "examDatabaseId", "sampleType", "collectedDateTime"
    )
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            if not _visible_case(cursor, data["caseId"]):
                return jsonify({"message": "Case not found or access denied."}), 404
            cursor.execute(
                """
                SELECT 1 FROM examination
                WHERE examination_id=%s AND case_id=%s
                """,
                (data["examDatabaseId"], data["caseId"]),
            )
            if not cursor.fetchone():
                return jsonify({"message": "The selected examination does not belong to this case."}), 400

            cursor.execute(
                "SELECT doctor_id FROM user_account WHERE user_id=%s",
                (g.current_user["id"],),
            )
            doctor_row = cursor.fetchone()
            doctor_id = doctor_row[0] if doctor_row else None
            metadata = dict(data)
            metadata.pop("custodyEvents", None)

            database_id = data.get("databaseId")
            if database_id:
                cursor.execute(
                    """
                    UPDATE sample_evidence
                    SET sample_reference=%s, case_id=%s, examination_id=%s,
                        sample_type=%s, collected_datetime=%s,
                        collected_by_doctor_id=%s, seal_no=%s,
                        storage_condition=%s, sample_status=%s, metadata=%s::jsonb
                    WHERE sample_id=%s
                    RETURNING sample_id
                    """,
                    (
                        data.get("id"), data["caseId"], data["examDatabaseId"],
                        data["sampleType"], data["collectedDateTime"], doctor_id,
                        data.get("sealNo") or None,
                        data.get("storageCondition") or None,
                        data.get("sampleStatus") or "Collected",
                        json.dumps(metadata), database_id,
                    ),
                )
                saved = cursor.fetchone()
                if not saved:
                    return jsonify({"message": "Evidence record not found."}), 404
                sample_id = saved[0]
            else:
                cursor.execute(
                    """
                    INSERT INTO sample_evidence (
                        sample_reference, case_id, examination_id, sample_type,
                        collected_datetime, collected_by_doctor_id, seal_no,
                        storage_condition, sample_status, metadata
                    ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s::jsonb)
                    RETURNING sample_id
                    """,
                    (
                        data.get("id"), data["caseId"], data["examDatabaseId"],
                        data["sampleType"], data["collectedDateTime"], doctor_id,
                        data.get("sealNo") or None,
                        data.get("storageCondition") or None,
                        data.get("sampleStatus") or "Collected",
                        json.dumps(metadata),
                    ),
                )
                sample_id = cursor.fetchone()[0]

            cursor.execute(
                "DELETE FROM chain_of_custody WHERE sample_id=%s",
                (sample_id,),
            )
            for event in data.get("custodyEvents") or []:
                cursor.execute(
                    """
                    INSERT INTO chain_of_custody (
                        sample_id, transfer_datetime, action_type,
                        seal_status, remarks
                    ) VALUES (%s,%s,%s,%s,%s)
                    """,
                    (
                        sample_id,
                        event.get("transferDateTime"),
                        event.get("actionType") or "Recorded",
                        event.get("sealStatus") or None,
                        json.dumps(event),
                    ),
                )
        connection.commit()
        return jsonify({
            "databaseId": sample_id,
            "id": data.get("id") or f"SMP-{sample_id:06d}",
            "message": "Evidence and chain-of-custody records saved.",
        }), 201
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


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
