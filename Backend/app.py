import os

from flask import Flask, jsonify
from database import get_connection
from routes.auth import auth
from routes.admin import admin
from routes.police_court import police_court
from routes.records import records_api
from flask_cors import CORS

app = Flask(__name__)
CORS(
    app,
    resources={r"/api/*": {
        "origins": [
            origin.strip()
            for origin in os.getenv(
                "CORS_ORIGINS",
                "http://127.0.0.1:5500,http://localhost:5500"
            ).split(",")
            if origin.strip()
        ]
    }},
)
app.register_blueprint(
    auth,
    url_prefix="/api"
)
app.register_blueprint(
    admin,
    url_prefix="/api"
)
app.register_blueprint(
    police_court,
    url_prefix="/api"
)
app.register_blueprint(
    records_api,
    url_prefix="/api"
)

@app.route("/")
def home():
    return "MedLogs Backend Running"


@app.route("/api/test")
def test():

    return jsonify({
        "status": "success",
        "message": "API is working"
    })


@app.errorhandler(404)
def not_found(_error):
    return jsonify({"message": "Resource not found."}), 404


@app.errorhandler(500)
def internal_error(error):
    app.logger.exception("Unhandled API error", exc_info=error)
    return jsonify({"message": "An internal server error occurred."}), 500

@app.route("/api/database-test")
def database_test():

    try:

        connection = get_connection()

        cursor = connection.cursor()

        cursor.execute(
            "SELECT CURRENT_TIMESTAMP;"
        )

        result = cursor.fetchone()


        cursor.close()

        connection.close()


        return jsonify({

            "status": "success",

            "database_time": str(result[0])

        })


    except Exception as error:


        return jsonify({

            "status": "error",

            "message": str(error)

        })
if __name__ == "__main__":
    app.run(
        debug=os.getenv("FLASK_DEBUG", "false").lower() == "true",
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "5000"))
    )
