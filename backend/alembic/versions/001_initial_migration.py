"""Initial migration

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('role', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('last_login_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_username'), 'users', ['username'], unique=True)
    
    # Create patients table
    op.create_table(
        'patients',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('date_of_birth', sa.Date(), nullable=True),
        sa.Column('gender', sa.String(), nullable=True),
        sa.Column('blood_group', sa.String(), nullable=True),
        sa.Column('address', sa.String(), nullable=True),
        sa.Column('city', sa.String(), nullable=True),
        sa.Column('state', sa.String(), nullable=True),
        sa.Column('pincode', sa.String(), nullable=True),
        sa.Column('emergency_contact', sa.String(), nullable=True),
        sa.Column('emergency_phone', sa.String(), nullable=True),
        sa.Column('relationship', sa.String(), nullable=True),
        sa.Column('allergies', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('medical_conditions', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('current_medications', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('occupation', sa.String(), nullable=True),
        sa.Column('marital_status', sa.String(), nullable=True),
        sa.Column('insurance_provider', sa.String(), nullable=True),
        sa.Column('insurance_number', sa.String(), nullable=True),
        sa.Column('first_visit_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('last_visit_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('total_visits', sa.Integer(), nullable=False),
        sa.Column('active', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('medical_history', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_patients_email'), 'patients', ['email'], unique=True)
    op.create_index(op.f('ix_patients_phone'), 'patients', ['phone'], unique=True)
    
    # Create appointments table
    op.create_table(
        'appointments',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('patient_id', sa.String(), nullable=False),
        sa.Column('patient_name', sa.String(), nullable=False),
        sa.Column('patient_phone', sa.String(), nullable=False),
        sa.Column('patient_email', sa.String(), nullable=True),
        sa.Column('consultation_type', sa.String(), nullable=True),
        sa.Column('consultation_plan', sa.String(), nullable=True),
        sa.Column('consultation_fee', sa.Float(), nullable=True),
        sa.Column('original_fee', sa.Float(), nullable=True),
        sa.Column('discount_amount', sa.Float(), nullable=True),
        sa.Column('appointment_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('appointment_time', sa.String(), nullable=True),
        sa.Column('appointment_status', sa.String(), nullable=False),
        sa.Column('symptoms', sa.String(), nullable=True),
        sa.Column('diagnosis', sa.String(), nullable=True),
        sa.Column('prescription', sa.String(), nullable=True),
        sa.Column('notes', sa.String(), nullable=True),
        sa.Column('payment_details', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('notification_details', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('created_by', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_appointments_patient_id'), 'appointments', ['patient_id'], unique=False)
    
    # Create reviews table
    op.create_table(
        'reviews',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('appointment_id', sa.String(), nullable=False),
        sa.Column('patient_id', sa.String(), nullable=False),
        sa.Column('patient_name', sa.String(), nullable=False),
        sa.Column('patient_phone', sa.String(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('comment', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=False),
        sa.Column('anonymous', sa.Boolean(), nullable=False),
        sa.Column('verified', sa.Boolean(), nullable=False),
        sa.Column('helpful', sa.Boolean(), nullable=False),
        sa.Column('doctor_response', sa.String(), nullable=True),
        sa.Column('response_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reviews_appointment_id'), 'reviews', ['appointment_id'], unique=False)
    op.create_index(op.f('ix_reviews_patient_id'), 'reviews', ['patient_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_reviews_patient_id'), table_name='reviews')
    op.drop_index(op.f('ix_reviews_appointment_id'), table_name='reviews')
    op.drop_table('reviews')
    op.drop_index(op.f('ix_appointments_patient_id'), table_name='appointments')
    op.drop_table('appointments')
    op.drop_index(op.f('ix_patients_phone'), table_name='patients')
    op.drop_index(op.f('ix_patients_email'), table_name='patients')
    op.drop_table('patients')
    op.drop_index(op.f('ix_users_username'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
