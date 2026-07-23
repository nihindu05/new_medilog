import json
import os
from functools import wraps
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import g, jsonify, request

from database import get_connection


def load_profile_for_auth_user(auth_user_id):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    ua.user_id,
                    ua.auth_user_id,
                    ua.username,
                    ua.full_name,
                    ua.email,
                    ua.jmo_office_id,
                    COALESCE(array_agg(r.role_name)
                        FILTER (WHERE r.role_name IS NOT NULL), '{}')
                FROM user_account ua
                LEFT JOIN user_role ur ON ur.user_id = ua.user_id
                LEFT JOIN roles r ON r.role_id = ur.role_id
                WHERE ua.auth_user_id = %s
                  AND ua.account_status = 'Active'
                GROUP BY ua.user_id
                """,
                (auth_user_id,),
            )
            row = cursor.fetchone()
            if not row:
                return None
            roles = list(row[6])
            return {
                "id": row[0],
                "authUserId": str(row[1]),
                "username": row[2],
                "name": row[3],
                "email": row[4],
                "officeId": row[5],
                "roles": roles,
                "role": roles[0] if roles else None,
            }
    finally:
        connection.close()


def _validate_access_token(token):
    base_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    api_key = os.getenv("SUPABASE_ANON_KEY", "")
    if not base_url or not api_key:
        raise RuntimeError("Supabase Auth is not configured.")
    req = Request(
        f"{base_url}/auth/v1/user",
        headers={"apikey": api_key, "Authorization": f"Bearer {token}"},
        method="GET",
    )
    try:
        with urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, ValueError) as error:
        raise ValueError("Invalid or expired access token.") from error


def require_auth(*allowed_roles):
    def decorator(view):
        @wraps(view)
        def wrapped(*args, **kwargs):
            header = request.headers.get("Authorization", "")
            if not header.startswith("Bearer "):
                return jsonify({"message": "Authentication required."}), 401
            try:
                auth_user = _validate_access_token(header[7:].strip())
            except RuntimeError as error:
                return jsonify({"message": str(error)}), 503
            except ValueError as error:
                return jsonify({"message": str(error)}), 401

            profile = load_profile_for_auth_user(auth_user.get("id"))
            if not profile:
                return jsonify({"message": "Active MedLogs profile required."}), 403
            if allowed_roles and not set(profile["roles"]).intersection(allowed_roles):
                return jsonify({"message": "You do not have permission for this action."}), 403
            g.current_user = profile
            return view(*args, **kwargs)
        return wrapped
    return decorator
