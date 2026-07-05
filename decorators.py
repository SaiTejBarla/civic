"""
=========================================================
CivicEye AI - Route Decorators
=========================================================

This module provides decorators for:

1. Authentication
2. Role-Based Access Control (RBAC)

These decorators protect Flask routes using
Firebase Authentication and Firestore user roles.
"""

from functools import wraps
from flask import jsonify

from auth import (
    AuthenticationError,
    get_current_role,
    get_current_user,
)

# --------------------------------------------------------
# Login Required
# --------------------------------------------------------

def login_required(func):
    """
    Ensures the user is authenticated.
    """

    @wraps(func)
    def wrapper(*args, **kwargs):

        try:

            # Verify token & user
            get_current_user()

            return func(*args, **kwargs)

        except AuthenticationError as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 401

        except Exception as e:

            return jsonify({
                "success": False,
                "message": str(e)
            }), 500

    return wrapper


# --------------------------------------------------------
# Role Required
# --------------------------------------------------------

def roles_required(*allowed_roles):
    """
    Restrict route access to specific roles.

    Example:

    @roles_required(CITIZEN, ADMIN)
    """

    def decorator(func):

        @wraps(func)
        def wrapper(*args, **kwargs):

            try:

                role = get_current_role()

                if role not in allowed_roles:

                    return jsonify({

                        "success": False,

                        "message": "You do not have permission to perform this action."

                    }), 403

                return func(*args, **kwargs)

            except AuthenticationError as e:

                return jsonify({

                    "success": False,

                    "message": str(e)

                }), 401

            except Exception as e:

                return jsonify({

                    "success": False,

                    "message": str(e)

                }), 500

        return wrapper

    return decorator