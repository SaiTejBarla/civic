import uuid

from firebase_admin import firestore
def get_db():
    return firestore.client()

def current_timestamp():
    from datetime import datetime

    return (
        datetime.utcnow()
        .replace(microsecond=0)
        .isoformat() + "Z"
    )


def create_notification(
    user_id,
    report_id,
    title,
    message,
    notification_type
):
    notification_id = str(uuid.uuid4())

    notification = {

        "notificationId": notification_id,

        "userId": user_id,

        "reportId": report_id,

        "title": title,

        "message": message,

        "type": notification_type,

        "isRead": False,

        "createdAt": current_timestamp()

    }

    get_db().collection("notifications").document(notification_id).set(notification)

    return notification


def get_notifications(user_id):

    docs = (
        get_db().collection("notifications")
        .where("userId", "==", user_id)
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .stream()
    )

    notifications = []

    for doc in docs:
        notifications.append(doc.to_dict())

    return notifications


def get_unread_notifications(user_id):

    docs = (
        get_db().collection("notifications")
        .where("userId", "==", user_id)
        .where("isRead", "==", False)
        .stream()
    )

    notifications = []

    for doc in docs:
        notifications.append(doc.to_dict())

    return notifications


def mark_notification_read(notification_id):

    get_db().collection("notifications").document(notification_id).update({

        "isRead": True

    })


def delete_notification(notification_id):

    get_db().collection("notifications").document(notification_id).delete()


def unread_count(user_id):

    docs = (
        get_db().collection("notifications")
        .where("userId", "==", user_id)
        .where("isRead", "==", False)
        .stream()
    )

    count = 0

    for _ in docs:
        count += 1

    return count