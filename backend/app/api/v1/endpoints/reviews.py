from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.core.database import get_db
from app.models.review import Review
from app.schemas.review import ReviewRequest, ReviewResponse
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/submit", response_model=ReviewResponse)
async def submit_review(request: ReviewRequest, db: Session = Depends(get_db)):
    """Submit a new review"""
    # Generate IDs if not provided
    appointment_id = request.appointment_id or f"appt_{uuid.uuid4().hex[:8]}"
    patient_id = request.patient_id or f"patient_{uuid.uuid4().hex[:8]}"
    
    review = Review(
        id=str(uuid.uuid4()),
        appointment_id=appointment_id,
        patient_id=patient_id,
        patient_name=request.patient_name,
        patient_phone=request.patient_phone,
        rating=request.rating,
        title=request.title,
        comment=request.comment,
        category=request.category,
        anonymous=request.anonymous,
        verified=False,
        helpful=False
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    return ReviewResponse(
        id=review.id,
        appointment_id=review.appointment_id,
        patient_id=review.patient_id,
        patient_name=review.patient_name,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        category=review.category,
        verified=review.verified,
        helpful=review.helpful,
        doctor_response=review.doctor_response,
        created_at=review.created_at
    )

@router.get("", response_model=List[ReviewResponse])
async def get_all_reviews(db: Session = Depends(get_db)):
    """Get all reviews"""
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    return [
        ReviewResponse(
            id=r.id,
            appointment_id=r.appointment_id,
            patient_id=r.patient_id,
            patient_name=r.patient_name,
            rating=r.rating,
            title=r.title,
            comment=r.comment,
            category=r.category,
            verified=r.verified,
            helpful=r.helpful,
            doctor_response=r.doctor_response,
            created_at=r.created_at
        )
        for r in reviews
    ]

@router.get("/positive", response_model=List[ReviewResponse])
async def get_positive_reviews(db: Session = Depends(get_db)):
    """Get positive reviews (rating >= 4)"""
    reviews = db.query(Review).filter(Review.rating >= 4).order_by(Review.created_at.desc()).all()
    return [
        ReviewResponse(
            id=r.id,
            appointment_id=r.appointment_id,
            patient_id=r.patient_id,
            patient_name=r.patient_name,
            rating=r.rating,
            title=r.title,
            comment=r.comment,
            category=r.category,
            verified=r.verified,
            helpful=r.helpful,
            doctor_response=r.doctor_response,
            created_at=r.created_at
        )
        for r in reviews
    ]

@router.get("/stats")
async def get_review_stats(db: Session = Depends(get_db)):
    """Get review statistics"""
    reviews = db.query(Review).all()
    
    if not reviews:
        return {
            "average_rating": 0,
            "total_reviews": 0,
            "positive_reviews": 0
        }
    
    total_rating = sum(r.rating for r in reviews)
    average_rating = total_rating / len(reviews)
    positive_reviews = len([r for r in reviews if r.rating >= 4])
    
    return {
        "average_rating": round(average_rating, 2),
        "total_reviews": len(reviews),
        "positive_reviews": positive_reviews
    }

@router.post("/{review_id}/response")
async def add_doctor_response(review_id: str, response: Dict[str, str], db: Session = Depends(get_db)):
    """Add doctor response to a review"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.doctor_response = response.get("response")
    review.response_date = datetime.utcnow()
    db.commit()
    db.refresh(review)
    
    return ReviewResponse(
        id=review.id,
        appointment_id=review.appointment_id,
        patient_id=review.patient_id,
        patient_name=review.patient_name,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        category=review.category,
        verified=review.verified,
        helpful=review.helpful,
        doctor_response=review.doctor_response,
        created_at=review.created_at
    )

@router.post("/{review_id}/verify")
async def verify_review(review_id: str, db: Session = Depends(get_db)):
    """Verify a review"""
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    review.verified = True
    db.commit()
    db.refresh(review)
    
    return ReviewResponse(
        id=review.id,
        appointment_id=review.appointment_id,
        patient_id=review.patient_id,
        patient_name=review.patient_name,
        rating=review.rating,
        title=review.title,
        comment=review.comment,
        category=review.category,
        verified=review.verified,
        helpful=review.helpful,
        doctor_response=review.doctor_response,
        created_at=review.created_at
    )
