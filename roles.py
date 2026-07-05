"""
=========================================================
CivicEye AI - Role Based Access Control (RBAC)
=========================================================

This file contains all role, department, status, and
permission constants used throughout the project.

Keeping them here avoids hardcoding strings in multiple
files and makes the project easier to maintain.
"""

# =========================================================
# USER ROLES
# =========================================================

CITIZEN = "citizen"
OFFICER = "officer"
ADMIN = "admin"

ROLES = [
    CITIZEN,
    OFFICER,
    ADMIN,
]

# =========================================================
# OFFICER DEPARTMENTS
# =========================================================

ROADS = "Roads"
TRAFFIC = "Traffic"
ELECTRICAL = "Electrical"
WATER_SUPPLY = "Water Supply"
DRAINAGE = "Drainage"
SANITATION = "Sanitation"
PARKS = "Parks & Horticulture"
PUBLIC_WORKS = "Public Works"

DEPARTMENTS = [
    ROADS,
    TRAFFIC,
    ELECTRICAL,
    WATER_SUPPLY,
    DRAINAGE,
    SANITATION,
    PARKS,
    PUBLIC_WORKS,
]

# =========================================================
# REPORT STATUS
# =========================================================

PENDING = "Pending"
ASSIGNED = "Assigned"
IN_PROGRESS = "In Progress"
RESOLVED = "Resolved"
REJECTED = "Rejected"

REPORT_STATUS = [
    PENDING,
    ASSIGNED,
    IN_PROGRESS,
    RESOLVED,
    REJECTED,
]

# =========================================================
# USER ACCOUNT STATUS
# =========================================================

ACTIVE = True
INACTIVE = False

# =========================================================
# DEFAULT ROLE
# =========================================================

DEFAULT_ROLE = CITIZEN

# =========================================================
# DEFAULT DEPARTMENT
# =========================================================

DEFAULT_DEPARTMENT = None

# =========================================================
# ROLE PERMISSIONS
# =========================================================

ROLE_PERMISSIONS = {

    CITIZEN: [
        "submit_report",
        "view_own_reports",
        "view_profile",
        "edit_profile",
        "receive_notifications",
    ],

    OFFICER: [
        "view_assigned_reports",
        "update_report_status",
        "add_remarks",
        "upload_completion_images",
        "receive_notifications",
    ],

    ADMIN: [
        "view_all_reports",
        "manage_users",
        "assign_officers",
        "view_analytics",
        "change_roles",
        "manage_departments",
        "receive_notifications",
    ],
}