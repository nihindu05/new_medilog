import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import Blueprint, jsonify, request

from database import get_connection
from security import require_auth


auth = Blueprint("auth", __name__)


def _supabase_request(path, method="GET", payload=None, token=None):
    base_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    api_key = os.getenv("SUPABASE_ANON_KEY", "")
    if not base_url or not api_key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_ANON_KEY must be configured.")

    headers = {"apikey": api_key, "Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    body = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = Request(f"{base_url}{path}", data=body, headers=headers, method=method)
    try:
        with urlopen(req, timeout=15) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        try:
            message = json.loads(error.read().decode("utf-8")).get(
                "msg", "Authentication failed."
            )
        except (ValueError, AttributeError):
            message = "Authentication failed."
        raise ValueError(message) from error
    except URLError as error:
        raise ConnectionError("Supabase Auth is currently unavailable.") from error


def _profile_by_identifier(identifier):
    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT email
                FROM user_account
                WHERE lower(username) = lower(%s)
                   OR lower(email) = lower(%s)
                LIMIT 1
                """,
                (identifier, identifier),
            )
            row = cursor.fetchone()
            return row[0] if row else None
    finally:
        connection.close()


@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    identifier = str(data.get("username") or data.get("email") or "").strip()
    password = str(data.get("password") or "")

    if not identifier or not password:
        return jsonify({"success": False, "message": "Username and password are required."}), 400

    email = identifier if "@" in identifier else _profile_by_identifier(identifier)
    if not email:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401

    try:
        session = _supabase_request(
            "/auth/v1/token?grant_type=password",
            method="POST",
            payload={"email": email, "password": password},
        )
    except ValueError:
        return jsonify({"success": False, "message": "Invalid username or password."}), 401
    except (ConnectionError, RuntimeError) as error:
        return jsonify({"success": False, "message": str(error)}), 503

    access_token = session.get("access_token")
    if not access_token:
        return jsonify({"success": False, "message": "Authentication failed."}), 401

    # Reuse the same trusted-token/profile loader used by protected routes.
    from security import load_profile_for_auth_user

    profile = load_profile_for_auth_user(session["user"]["id"])
    if not profile:
        return jsonify({
            "success": False,
            "message": "This account has no active MedLogs profile.",
        }), 403

    return jsonify({
        "success": True,
        "message": "Login successful",
        "accessToken": access_token,
        "refreshToken": session.get("refresh_token"),
        "expiresIn": session.get("expires_in"),
        "user": profile,
    })


@auth.route("/me", methods=["GET"])
@require_auth()
def me():
    from flask import g
    return jsonify({"user": g.current_user})


@auth.route("/refresh", methods=["POST"])
def refresh():
    data = request.get_json(silent=True) or {}
    refresh_token = data.get("refreshToken")
    if not refresh_token:
        return jsonify({"message": "Refresh token is required."}), 400
    try:
        session = _supabase_request(
            "/auth/v1/token?grant_type=refresh_token",
            method="POST",
            payload={"refresh_token": refresh_token},
        )
        return jsonify({
            "accessToken": session.get("access_token"),
            "refreshToken": session.get("refresh_token"),
            "expiresIn": session.get("expires_in"),
        })
    except ValueError:
        return jsonify({"message": "Session refresh failed."}), 401
    except (ConnectionError, RuntimeError) as error:
        return jsonify({"message": str(error)}), 503


@auth.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    access_token = str(data.get("accessToken") or "").strip()
    password = str(data.get("password") or "")

    if not access_token or len(password) < 8:
        return jsonify({
            "message": "A valid recovery link and a password of at least 8 characters are required."
        }), 400

    try:
        _supabase_request(
            "/auth/v1/user",
            method="PUT",
            payload={"password": password},
            token=access_token,
        )
        return jsonify({"success": True, "message": "Password updated successfully."})
    except ValueError:
        return jsonify({
            "message": "This recovery link is invalid or has expired. Request a new recovery email."
        }), 401
    except (ConnectionError, RuntimeError) as error:
        return jsonify({"message": str(error)}), 503
