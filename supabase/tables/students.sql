CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    father_job VARCHAR(255),
    mother_job VARCHAR(255),
    national_id VARCHAR(20) UNIQUE NOT NULL,
    home_address TEXT,
    special_illness TEXT,
    father_phone VARCHAR(20),
    mother_phone VARCHAR(20),
    student_phone VARCHAR(20),
    class_name VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);