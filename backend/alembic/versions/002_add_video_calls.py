"""Add video calls table

Revision ID: 002
Revises: 001
Create Date: 2024-01-16 18:30:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'video_calls',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('appointment_id', sa.String(), nullable=True),
        sa.Column('patient_id', sa.String(), nullable=False),
        sa.Column('patient_name', sa.String(), nullable=False),
        sa.Column('patient_phone', sa.String(), nullable=False),
        sa.Column('patient_email', sa.String(), nullable=True),
        sa.Column('call_type', sa.String(), nullable=False),
        sa.Column('duration_minutes', sa.Integer(), nullable=False),
        sa.Column('scheduled_start_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('actual_start_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('actual_end_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('actual_duration_seconds', sa.Integer(), nullable=True),
        sa.Column('call_status', sa.String(), nullable=False),
        sa.Column('consultation_fee', sa.Float(), nullable=False),
        sa.Column('payment_status', sa.String(), nullable=False),
        sa.Column('payment_method', sa.String(), nullable=True),
        sa.Column('payment_transaction_id', sa.String(), nullable=True),
        sa.Column('razorpay_order_id', sa.String(), nullable=True),
        sa.Column('razorpay_payment_id', sa.String(), nullable=True),
        sa.Column('agora_channel_name', sa.String(), nullable=True),
        sa.Column('agora_token', sa.String(), nullable=True),
        sa.Column('agora_app_id', sa.String(), nullable=True),
        sa.Column('calendar_event_id', sa.String(), nullable=True),
        sa.Column('meeting_link', sa.String(), nullable=True),
        sa.Column('call_metadata', postgresql.JSON(astext_type=sa.Text()), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('created_by', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_video_calls_appointment_id'), 'video_calls', ['appointment_id'], unique=False)
    op.create_index(op.f('ix_video_calls_patient_id'), 'video_calls', ['patient_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_video_calls_patient_id'), table_name='video_calls')
    op.drop_index(op.f('ix_video_calls_appointment_id'), table_name='video_calls')
    op.drop_table('video_calls')
