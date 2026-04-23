from __future__ import annotations

from django.contrib.auth.hashers import make_password

from .repositories import reviews_repository, sessions_repository, users_repository, UserPayload


def seed_users():
    users_repository.ensure_indexes()
    sessions_repository.ensure_indexes()
    reviews_repository.ensure_indexes()

    if not users_repository.get_by_email("admin@freementors.dev"):
        users_repository.create(
            UserPayload(
                first_name="Admin",
                last_name="User",
                email="admin@freementors.dev",
                password_hash=make_password("Admin123!"),
                role="admin",
                signup_goal="mentor",
                mentor_application_status="approved",
            )
        )

    if not users_repository.get_by_email("mentor@freementors.dev"):
        users_repository.create(
            UserPayload(
                first_name="Amina",
                last_name="Khumalo",
                email="mentor@freementors.dev",
                password_hash=make_password("Mentor123!"),
                role="mentor",
                signup_goal="mentor",
                mentor_application_status="approved",
                bio="Frontend engineer helping early-career developers grow with confidence.",
                expertise="React, UX, career coaching",
            )
        )

    if not users_repository.get_by_email("mentee@freementors.dev"):
        users_repository.create(
            UserPayload(
                first_name="Neo",
                last_name="Dlamini",
                email="mentee@freementors.dev",
                password_hash=make_password("Mentee123!"),
                role="user",
                signup_goal="mentee",
                mentor_application_status="not_requested",
            )
        )
