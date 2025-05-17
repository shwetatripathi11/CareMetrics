-- Drop existing tables and triggers
DROP TRIGGER IF EXISTS update_prescriptions_updated_at ON prescriptions;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create doctors table
CREATE TABLE doctors (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    doctor_code TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    specialty TEXT,
    working_hospital TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    gender TEXT,
    date_of_birth DATE,
    sa TEXT,
    working_hospital TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create prescriptions table
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    prescribing_institution TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    prescription_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_prescriptions_updated_at
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 