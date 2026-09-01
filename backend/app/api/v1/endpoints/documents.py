from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.patient_document import PatientDocument
from app.models.user import User
from app.models.patient import Patient
from app.dependencies import get_current_user
import uuid
import os
from datetime import datetime

router = APIRouter()

# For development, store files locally. In production, use S3 or similar
UPLOAD_DIR = "uploads/patient_documents"

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_name: str = None,
    document_type: str = "OTHER",
    description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a patient document"""
    try:
        # Get or create patient
        patient = db.query(Patient).filter(
            (Patient.phone == current_user.phone) | (Patient.email == current_user.email)
        ).first()
        
        if not patient:
            # Create patient if doesn't exist
            from app.models.patient import Patient
            patient = Patient(
                id=str(uuid.uuid4()),
                phone=current_user.phone or "",
                email=current_user.email or "",
                name=current_user.name,
                first_visit_date=datetime.utcnow(),
                total_visits=0,
                active=True
            )
            db.add(patient)
            db.commit()
            db.refresh(patient)
        
        # Create upload directory if it doesn't exist
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        
        # Generate unique filename
        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        file_size = len(content)
        
        # Create document record
        document = PatientDocument(
            id=str(uuid.uuid4()),
            patient_id=patient.id,
            document_name=document_name or file.filename,
            document_type=document_type,
            file_url=f"/uploads/patient_documents/{unique_filename}",
            file_size=f"{file_size / 1024:.2f} KB",
            description=description,
            created_by=current_user.id
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return {
            "success": True,
            "message": "Document uploaded successfully",
            "document": {
                "id": document.id,
                "document_name": document.document_name,
                "document_type": document.document_type,
                "file_url": document.file_url,
                "uploaded_at": document.uploaded_at.isoformat() if document.uploaded_at else None
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to upload document: {str(e)}")

@router.get("/my-documents")
async def get_my_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all documents for the current user"""
    # Get patient
    patient = db.query(Patient).filter(
        (Patient.phone == current_user.phone) | (Patient.email == current_user.email)
    ).first()
    
    if not patient:
        return {"documents": []}
    
    documents = db.query(PatientDocument).filter(
        PatientDocument.patient_id == patient.id
    ).order_by(PatientDocument.uploaded_at.desc()).all()
    
    return {
        "documents": [
            {
                "id": doc.id,
                "document_name": doc.document_name,
                "document_type": doc.document_type,
                "file_url": doc.file_url,
                "file_size": doc.file_size,
                "description": doc.description,
                "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None
            }
            for doc in documents
        ]
    }

@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a document"""
    document = db.query(PatientDocument).filter(PatientDocument.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Verify ownership
    patient = db.query(Patient).filter(
        (Patient.phone == current_user.phone) | (Patient.email == current_user.email)
    ).first()
    
    if not patient or document.patient_id != patient.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this document")
    
    # Delete file
    if os.path.exists(document.file_url.replace("/uploads/", "uploads/")):
        os.remove(document.file_url.replace("/uploads/", "uploads/"))
    
    db.delete(document)
    db.commit()
    
    return {"success": True, "message": "Document deleted successfully"}
