-- ============================================================================
-- CAMPUS FACILITY MAINTENANCE & GRIEVANCE REDRESSAL SYSTEM
-- Comprehensive PostgreSQL Relational Schema
-- ============================================================================

-- 1. EXTENSIONS & CUSTOM ENUMS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('REPORTER', 'MAINTENANCE_STAFF', 'ADMIN');
CREATE TYPE user_type AS ENUM ('STUDENT', 'FACULTY', 'STAFF');
CREATE TYPE complaint_status AS ENUM ('SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REOPENED');
CREATE TYPE complaint_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY');
CREATE TYPE media_type AS ENUM ('IMAGE', 'VIDEO');

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    contact_email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS (Reporters, Technicians, Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    role user_role NOT NULL DEFAULT 'REPORTER',
    sub_type user_type,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_on_duty BOOLEAN DEFAULT TRUE,
    active_ticket_count INT DEFAULT 0,
    assigned_zones TEXT[] DEFAULT '{}',
    fcm_device_token TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. LOCATIONS (Campus Taxonomy)
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone VARCHAR(100) NOT NULL,
    building VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    room_or_area VARCHAR(100) NOT NULL,
    qr_code_hash VARCHAR(64) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. COMPLAINTS (Core Entity)
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) NOT NULL UNIQUE,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status complaint_status NOT NULL DEFAULT 'SUBMITTED',
    priority complaint_priority NOT NULL DEFAULT 'MEDIUM',
    otp_code VARCHAR(6),
    sla_deadline TIMESTAMPTZ,
    escalation_level INT DEFAULT 0,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. MEDIA ATTACHMENTS (Before & After photos)
CREATE TABLE IF NOT EXISTS complaint_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    file_url TEXT NOT NULL,
    media_type media_type DEFAULT 'IMAGE',
    is_resolution_proof BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. AUDIT TRAIL / TIMELINE (Immutable Lifecycle Record)
CREATE TABLE IF NOT EXISTS complaint_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    from_status complaint_status,
    to_status complaint_status NOT NULL,
    comment TEXT,
    actor_type VARCHAR(50) DEFAULT 'USER',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. FEEDBACK & CSAT
CREATE TABLE IF NOT EXISTS feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    complaint_id UUID NOT NULL UNIQUE REFERENCES complaints(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_issue_resolved BOOLEAN NOT NULL,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    feedback_tags TEXT[] DEFAULT '{}',
    comments TEXT,
    reopen_reason VARCHAR(100),
    reopen_evidence_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. STAFF PERFORMANCE METRICS
CREATE TABLE IF NOT EXISTS staff_performance_metrics (
    staff_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_resolved INT DEFAULT 0,
    total_reopened INT DEFAULT 0,
    total_ratings_count INT DEFAULT 0,
    total_stars_sum INT DEFAULT 0,
    average_csat NUMERIC(3, 2) DEFAULT 5.00,
    first_time_fix_rate NUMERIC(5, 2) DEFAULT 100.00,
    last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_complaints_reporter ON complaints(reporter_id);
CREATE INDEX IF NOT EXISTS idx_complaints_assigned_staff ON complaints(assigned_staff_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status_priority ON complaints(status, priority);
CREATE INDEX IF NOT EXISTS idx_complaints_location ON complaints(location_id);
CREATE INDEX IF NOT EXISTS idx_locations_qr_code ON locations(qr_code_hash);
CREATE INDEX IF NOT EXISTS idx_timeline_complaint ON complaint_timeline(complaint_id);
