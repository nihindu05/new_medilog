import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import Blueprint, g, jsonify, request

from database import get_connection
from security import require_auth


admin = Blueprint("admin", __name__)

ROLE_MAP = {
    "ADMIN": "System Administrator",
    "JMO": "Consultant JMO",
    "DOCTOR": "Medical Officer Medico-Legal",
    "ASSISTANT_JMO": "Assistant JMO",
    "CLERK": "Administrative Clerk",
    "LAB": "Laboratory Staff",
    "POLICE": "Police Liaison",
}


def _supabase_admin_request(path, method="POST", payload=None):
    base_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not base_url or not service_key:
        raise RuntimeError(
            "SUPABASE_SERVICE_ROLE_KEY must be configured on the backend."
        )
    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {
        "apikey": service_key,
        "Content-Type": "application/json",
    }
    if service_key.startswith("eyJ"):
        headers["Authorization"] = f"Bearer {service_key}"
    req = Request(
        f"{base_url}{path}",
        data=body,
        headers=headers,
        method=method,
    )
    try:
        with urlopen(req, timeout=15) as response:
            raw = response.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except HTTPError as error:
        try:
            details = json.loads(error.read().decode("utf-8"))
            message = details.get("msg") or details.get("message")
        except (ValueError, AttributeError):
            message = None
        raise ValueError(message or "Supabase user operation failed.") from error
    except URLError as error:
        raise ConnectionError("Supabase Auth is currently unavailable.") from error


@admin.route("/admin/users", methods=["GET"])
@require_auth("System Administrator")
def get_users():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    ua.user_id,
                    ua.full_name,
                    ua.username,
                    ua.email,
                    ua.account_status,
                    COALESCE(string_agg(r.role_name, ', ' ORDER BY r.role_name), '')
                FROM user_account ua
                LEFT JOIN user_role ur ON ur.user_id = ua.user_id
                LEFT JOIN roles r ON r.role_id = ur.role_id
                GROUP BY ua.user_id
                ORDER BY ua.user_id
                """
            )
            return jsonify([
                {
                    "id": row[0],
                    "name": row[1],
                    "username": row[2],
                    "email": row[3],
                    "status": row[4],
                    "role": row[5],
                }
                for row in cursor.fetchall()
            ])
    finally:
        connection.close()


@admin.route("/admin/stats", methods=["GET"])
@require_auth("System Administrator")
def get_stats():
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    (SELECT COUNT(*) FROM user_account),
                    (SELECT COUNT(*) FROM user_account
                     WHERE account_status = 'Active'),
                    (SELECT COUNT(*) FROM forensic_case),
                    (SELECT COUNT(*) FROM forensic_case
                     WHERE lower(case_status) NOT IN ('completed', 'closed'))
                """
            )
            total_users, active_staff, total_cases, pending_cases = cursor.fetchone()
            return jsonify({
                "totalUsers": total_users,
                "activeStaff": active_staff,
                "totalCases": total_cases,
                "pendingReviews": pending_cases,
            })
    finally:
        connection.close()


@admin.route("/admin/users", methods=["POST"])
@require_auth("System Administrator")
def create_user():
    data = request.get_json(silent=True) or {}
    required = ("username", "fullName", "email", "password", "role")
    missing = [field for field in required if not str(data.get(field, "")).strip()]
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    role_name = ROLE_MAP.get(str(data["role"]).strip().upper())
    if not role_name:
        return jsonify({"message": "Invalid role."}), 400
    if len(str(data["password"])) < 8:
        return jsonify({"message": "Password must contain at least 8 characters."}), 400

    auth_user = None
    try:
        auth_user = _supabase_admin_request(
            "/auth/v1/admin/users",
            payload={
                "email": str(data["email"]).strip().lower(),
                "password": str(data["password"]),
                "email_confirm": True,
                "user_metadata": {"full_name": str(data["fullName"]).strip()},
            },
        )
        auth_user_id = auth_user.get("id")
        if not auth_user_id:
            raise ValueError("Supabase did not return a user ID.")
    except (ValueError, ConnectionError, RuntimeError) as error:
        status = 503 if isinstance(error, (ConnectionError, RuntimeError)) else 400
        return jsonify({"message": str(error)}), status

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT role_id FROM roles WHERE role_name = %s",
                (role_name,),
            )
            role_row = cursor.fetchone()
            if not role_row:
                raise ValueError(f"Database role is missing: {role_name}")

            doctor_id = None
            if role_name in {
                "Consultant JMO", "Medical Officer Medico-Legal",
                "Assistant JMO",
            }:
                cursor.execute(
                    """
                    INSERT INTO doctor (
                        full_name, designation, slmc_reg_no,
                        current_office_id, employment_status
                    ) VALUES (%s, %s, %s, %s, %s)
                    RETURNING doctor_id
                    """,
                    (
                        str(data["fullName"]).strip(),
                        role_name,
                        str(data.get("licenseNumber") or "").strip() or None,
                        g.current_user["officeId"],
                        str(data.get("status") or "Active"),
                    ),
                )
                doctor_id = cursor.fetchone()[0]

            cursor.execute(
                """
                INSERT INTO user_account (
                    auth_user_id, username, full_name, email, account_status,
                    doctor_id, jmo_office_id
                ) VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING user_id
                """,
                (
                    auth_user_id,
                    str(data["username"]).strip(),
                    str(data["fullName"]).strip(),
                    str(data["email"]).strip().lower(),
                    str(data.get("status") or "Active"),
                    doctor_id,
                    g.current_user["officeId"],
                ),
            )
            user_id = cursor.fetchone()[0]
            cursor.execute(
                "INSERT INTO user_role (user_id, role_id) VALUES (%s, %s)",
                (user_id, role_row[0]),
            )
        connection.commit()
        return jsonify({
            "success": True,
            "message": "User account created successfully.",
            "user": {
                "id": user_id,
                "username": str(data["username"]).strip(),
                "email": str(data["email"]).strip().lower(),
                "role": role_name,
            },
        }), 201
    except Exception as error:
        connection.rollback()
        try:
            _supabase_admin_request(
                f"/auth/v1/admin/users/{auth_user['id']}",
                method="DELETE",
            )
        except Exception:
            pass
        if getattr(error, "pgcode", None) == "23505":
            return jsonify({"message": "Username, email, or license number already exists."}), 409
        return jsonify({"message": str(error)}), 400
    finally:
        connection.close()
