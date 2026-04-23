from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from bson import ObjectId
from pymongo.collection import Collection

from .mongo import get_database


def utcnow() -> datetime:
    return datetime.now(tz=timezone.utc)


def parse_object_id(value: str) -> ObjectId | None:
    try:
        return ObjectId(value)
    except Exception:
        return None


def normalize_role(role: str | None) -> str:
    return "user" if role in {None, "", "mentee"} else role


@dataclass
class UserPayload:
    first_name: str
    last_name: str
    email: str
    password_hash: str
    signup_goal: str = "mentee"
    role: str = "user"
    bio: str = ""
    expertise: str = ""
    is_active: bool = True
    mentor_application_status: str = "not_requested"


def _normalize_id(document: dict[str, Any] | None):
    if not document:
        return document
    document["id"] = str(document.pop("_id"))
    return document


def _normalize_user(document: dict[str, Any] | None):
    document = _normalize_id(document)
    if not document:
        return document
    document["role"] = normalize_role(document.get("role"))
    document["signup_goal"] = document.get("signup_goal", "mentee")
    document["mentor_application_status"] = document.get(
        "mentor_application_status", "not_requested"
    )
    return document


def _normalize_session(document: dict[str, Any] | None):
    return _normalize_id(document)


def _normalize_review(document: dict[str, Any] | None):
    document = _normalize_id(document)
    if not document:
        return document
    document["is_visible"] = bool(document.get("is_visible", True))
    document["rating"] = int(document.get("rating", 0))
    return document


class UsersRepository:
    @property
    def collection(self) -> Collection:
        return get_database()["users"]

    def ensure_indexes(self) -> None:
        self.collection.create_index("email", unique=True)
        self.collection.create_index([("role", 1), ("mentor_application_status", 1)])

    def create(self, payload: UserPayload) -> dict[str, Any]:
        data = asdict(payload)
        data["email"] = data["email"].lower().strip()
        data["role"] = normalize_role(data["role"])
        data["created_at"] = utcnow()
        data["updated_at"] = utcnow()
        result = self.collection.insert_one(data)
        return self.get_by_id(str(result.inserted_id))

    def get_by_email(self, email: str) -> dict[str, Any] | None:
        return _normalize_user(
            self.collection.find_one({"email": email.lower().strip()})
        )

    def get_by_id(self, user_id: str) -> dict[str, Any] | None:
        object_id = parse_object_id(user_id)
        if not object_id:
            return None
        return _normalize_user(self.collection.find_one({"_id": object_id}))

    def count_all(self) -> int:
        return self.collection.count_documents({})

    def list_mentors(self) -> list[dict[str, Any]]:
        docs = self.collection.find({"role": "mentor", "is_active": True}).sort(
            "created_at", -1
        )
        return [_normalize_user(doc) for doc in docs]

    def list_all(self) -> list[dict[str, Any]]:
        docs = self.collection.find({}).sort("created_at", -1)
        return [_normalize_user(doc) for doc in docs]

    def list_pending_mentor_applicants(self) -> list[dict[str, Any]]:
        docs = self.collection.find(
            {"mentor_application_status": "pending", "role": "user"}
        ).sort("created_at", -1)
        return [_normalize_user(doc) for doc in docs]

    def promote_to_mentor(
        self, user_id: str, bio: str, expertise: str
    ) -> dict[str, Any] | None:
        object_id = parse_object_id(user_id)
        if not object_id:
            return None
        self.collection.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "role": "mentor",
                    "bio": bio,
                    "expertise": expertise,
                    "mentor_application_status": "approved",
                    "updated_at": utcnow(),
                }
            },
        )
        return self.get_by_id(user_id)


class SessionsRepository:
    @property
    def collection(self) -> Collection:
        return get_database()["sessions"]

    def ensure_indexes(self) -> None:
        self.collection.create_index("mentor_id")
        self.collection.create_index("mentee_id")

    def create(
        self, mentee_id: str, mentor_id: str, agenda: str, message: str
    ) -> dict[str, Any]:
        data = {
            "request_id": str(uuid4()),
            "mentee_id": mentee_id,
            "mentor_id": mentor_id,
            "agenda": agenda,
            "message": message,
            "status": "pending",
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        result = self.collection.insert_one(data)
        return self.get_by_id(str(result.inserted_id))

    def get_by_id(self, session_id: str) -> dict[str, Any] | None:
        object_id = parse_object_id(session_id)
        if not object_id:
            return None
        return _normalize_session(self.collection.find_one({"_id": object_id}))

    def list_for_user(self, user_id: str, role: str) -> list[dict[str, Any]]:
        effective_role = normalize_role(role)
        query = {"mentor_id": user_id} if effective_role == "mentor" else {"mentee_id": user_id}
        docs = self.collection.find(query).sort("created_at", -1)
        return [_normalize_session(doc) for doc in docs]

    def update_status(self, session_id: str, status: str) -> dict[str, Any] | None:
        object_id = parse_object_id(session_id)
        if not object_id:
            return None
        self.collection.update_one(
            {"_id": object_id},
            {"$set": {"status": status, "updated_at": utcnow()}},
        )
        return self.get_by_id(session_id)


class ReviewsRepository:
    @property
    def collection(self) -> Collection:
        return get_database()["reviews"]

    def ensure_indexes(self) -> None:
        self.collection.create_index("mentor_id")
        self.collection.create_index([("session_id", 1)], unique=True)

    def create(
        self,
        session_id: str,
        mentor_id: str,
        mentee_id: str,
        rating: int,
        comment: str,
    ) -> dict[str, Any]:
        data = {
            "session_id": session_id,
            "mentor_id": mentor_id,
            "mentee_id": mentee_id,
            "rating": rating,
            "comment": comment,
            "is_visible": True,
            "created_at": utcnow(),
            "updated_at": utcnow(),
        }
        result = self.collection.insert_one(data)
        return self.get_by_id(str(result.inserted_id))

    def get_by_id(self, review_id: str) -> dict[str, Any] | None:
        object_id = parse_object_id(review_id)
        if not object_id:
            return None
        return _normalize_review(self.collection.find_one({"_id": object_id}))

    def get_by_session(self, session_id: str) -> dict[str, Any] | None:
        return _normalize_review(self.collection.find_one({"session_id": session_id}))

    def list_for_mentor(self, mentor_id: str) -> list[dict[str, Any]]:
        docs = self.collection.find(
            {"mentor_id": mentor_id, "is_visible": True}
        ).sort("created_at", -1)
        return [_normalize_review(doc) for doc in docs]

    def list_all(self) -> list[dict[str, Any]]:
        docs = self.collection.find({}).sort("created_at", -1)
        return [_normalize_review(doc) for doc in docs]

    def hide(self, review_id: str) -> dict[str, Any] | None:
        object_id = parse_object_id(review_id)
        if not object_id:
            return None
        self.collection.update_one(
            {"_id": object_id},
            {"$set": {"is_visible": False, "updated_at": utcnow()}},
        )
        return self.get_by_id(review_id)


users_repository = UsersRepository()
sessions_repository = SessionsRepository()
reviews_repository = ReviewsRepository()
