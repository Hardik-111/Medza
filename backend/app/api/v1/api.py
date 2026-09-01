from fastapi import APIRouter
from app.api.v1.endpoints import auth, appointments, reviews, users, video_calls, payments, documents

api_router = APIRouter()

# Auth endpoints without /auth prefix to match frontend
api_router.include_router(auth.router, tags=["authentication"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(video_calls.router, prefix="/video-calls", tags=["video-calls"])
api_router.include_router(payments.router, prefix="/payments", tags=["payments"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])

# Add direct /profile route for frontend compatibility (maps to /api/profile)
from app.api.v1.endpoints.users import get_profile, update_profile, change_password

api_router.add_api_route("/profile", get_profile, methods=["GET"], tags=["users"])
api_router.add_api_route("/profile", update_profile, methods=["PUT"], tags=["users"])
api_router.add_api_route("/change-password", change_password, methods=["POST"], tags=["users"])
