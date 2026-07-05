import uuid
from datetime import datetime

from firebase_admin import firestore


def get_db():
    return firestore.client()


def current_timestamp():
    return (
        datetime.utcnow()
        .replace(microsecond=0)
        .isoformat() + "Z"
    )


def add_timeline_event(
    report_id,
    title,
    description,
    performed_by,
    role
):

    event_id = str(uuid.uuid4())

    event = {
        "eventId": event_id,
        "reportId": report_id,
        "title": title,
        "description": description,
        "performedBy": performed_by,
        "role": role,
        "createdAt": current_timestamp()
    }

    get_db().collection("reportTimeline").document(event_id).set(event)

    return event


def get_timeline(report_id):

    docs = (
        get_db()
        .collection("reportTimeline")
        .where("reportId", "==", report_id)
        .order_by("createdAt")
        .stream()
    )

    timeline = []

    for doc in docs:
        timeline.append(doc.to_dict())

    return timeline


def delete_timeline(report_id):

    docs = (
        get_db()
        .collection("reportTimeline")
        .where("reportId", "==", report_id)
        .stream()
    )

    for doc in docs:
        doc.reference.delete()