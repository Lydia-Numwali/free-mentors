from __future__ import annotations

from datetime import datetime, timedelta, timezone
from functools import wraps

import jwt
from django.conf import settings
from graphql import GraphQLError

from .repositories import users_repository


def create_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=settings.JWT_EXPIRY_HOURS),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")


def get_request_user(info):
    auth_header = info.context.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.replace("Bearer ", "", 1).strip()
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
    except jwt.PyJWTError as error:
        raise GraphQLError("Invalid or expired token.") from error

    return users_repository.get_by_id(payload["sub"])


def require_auth(role: str | None = None):
    def decorator(func):
        @wraps(func)
        def wrapper(self, info, *args, **kwargs):
            user = get_request_user(info)
            if not user:
                raise GraphQLError("Authentication required.")
            if role and user["role"] != role:
                raise GraphQLError(f"{role.title()} access required.")
            return func(self, info, current_user=user, *args, **kwargs)

        return wrapper

    return decorator
