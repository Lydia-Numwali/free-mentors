from django.test import SimpleTestCase, override_settings
import jwt

from .auth import create_token
from .schema import schema


class AuthHelpersTests(SimpleTestCase):
    @override_settings(JWT_SECRET="test-secret")
    def test_create_token_encodes_subject(self):
        token = create_token("mentor-1")
        payload = jwt.decode(token, "test-secret", algorithms=["HS256"])
        self.assertEqual(payload["sub"], "mentor-1")


class SchemaContractTests(SimpleTestCase):
    def test_user_type_exposes_camelcase_signup_fields(self):
        fields = schema.graphql_schema.get_type("UserType").fields

        self.assertIn("signupGoal", fields)
        self.assertIn("mentorApplicationStatus", fields)
        self.assertIn("firstName", fields)
        self.assertIn("lastName", fields)
