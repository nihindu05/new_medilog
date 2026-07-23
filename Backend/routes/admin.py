from flask import Blueprint, jsonify

from database import get_connection
from security import require_auth


admin = Blueprint("admin", __name__)


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
