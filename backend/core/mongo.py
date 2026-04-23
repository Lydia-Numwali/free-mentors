from __future__ import annotations

from django.conf import settings
from pymongo import MongoClient

_client: MongoClient | None = None


def get_database():
    global _client
    if _client is None:
        _client = MongoClient(settings.MONGO_URI)
    return _client[settings.MONGO_DB_NAME]
