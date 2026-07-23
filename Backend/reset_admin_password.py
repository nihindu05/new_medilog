import getpass
import json
import os
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from dotenv import load_dotenv

from database import get_connection


def main():
    load_dotenv()
    base_url = os.getenv("SUPABASE_URL", "").rstrip("/")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    if not base_url or not service_key:
        print(
            "Set SUPABASE_SERVICE_ROLE_KEY in Backend/.env before running this command.",
            file=sys.stderr,
        )
        return 1

    password = getpass.getpass("New admin password: ")
    confirmation = getpass.getpass("Confirm new admin password: ")
    if password != confirmation:
        print("Passwords do not match.", file=sys.stderr)
        return 1
    if len(password) < 8:
        print("Password must contain at least 8 characters.", file=sys.stderr)
        return 1

    connection = get_connection()
    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT auth_user_id, email
                FROM user_account
                WHERE lower(username) = 'admin'
                  AND account_status = 'Active'
                LIMIT 1
                """
            )
            row = cursor.fetchone()
    finally:
        connection.close()

    if not row or not row[0]:
        print("No active admin Auth user is linked in user_account.", file=sys.stderr)
        return 1

    headers = {
        "apikey": service_key,
        "Content-Type": "application/json",
    }
    if service_key.startswith("eyJ"):
        headers["Authorization"] = f"Bearer {service_key}"
    request = Request(
        f"{base_url}/auth/v1/admin/users/{row[0]}",
        data=json.dumps({"password": password}).encode("utf-8"),
        headers=headers,
        method="PUT",
    )
    try:
        with urlopen(request, timeout=15):
            pass
    except HTTPError as error:
        details = error.read().decode("utf-8")
        print(f"Supabase rejected the update: {details}", file=sys.stderr)
        return 1
    except URLError as error:
        print(f"Could not reach Supabase: {error.reason}", file=sys.stderr)
        return 1

    print(f"Admin password updated successfully for {row[1]}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
