import os
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
os.environ.setdefault("CORS_ORIGINS", "http://localhost:5500")

from app import app


class SecurityBoundaryTests(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_health_is_public(self):
        self.assertEqual(self.client.get("/api/test").status_code, 200)

    def test_patient_records_require_authentication(self):
        self.assertEqual(self.client.get("/api/patients").status_code, 401)

    def test_admin_records_require_authentication(self):
        self.assertEqual(self.client.get("/api/admin/users").status_code, 401)

    def test_police_records_require_authentication(self):
        self.assertEqual(self.client.get("/api/police-court").status_code, 401)


if __name__ == "__main__":
    unittest.main()
