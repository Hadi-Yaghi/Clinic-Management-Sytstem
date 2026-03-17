# 🗄️ Database Schema Design – Smart Clinic Management System

This document outlines the database design for the Smart Clinic Management System. The system uses a hybrid approach combining *MySQL* for structured relational data and *MongoDB* for flexible, document-based storage.

---

# 🧩 MySQL Database Design

Structured and relational data such as patients, doctors, and appointments are stored in MySQL using well-defined tables and relationships.

---

## 📋 Table: patients

- id: INT, Primary Key, Auto Increment  
- full_name: VARCHAR(100), Not Null  
- email: VARCHAR(100), Unique, Not Null  
- phone: VARCHAR(20), Not Null  
- date_of_birth: DATE  
- gender: VARCHAR(10)  
- address: VARCHAR(255)  
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP  

---

## 📋 Table: doctors

- id: INT, Primary Key, Auto Increment  
- full_name: VARCHAR(100), Not Null  
- email: VARCHAR(100), Unique, Not Null  
- phone: VARCHAR(20), Not Null  
- specialization: VARCHAR(100), Not Null  
- availability_status: BOOLEAN, Default TRUE  
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP  

---

## 📋 Table: admins

- id: INT, Primary Key, Auto Increment  
- username: VARCHAR(50), Unique, Not Null  
- password: VARCHAR(255), Not Null  
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP  

---

## 📋 Table: appointments

- id: INT, Primary Key, Auto Increment  
- patient_id: INT, Foreign Key → patients(id), Not Null  
- doctor_id: INT, Foreign Key → doctors(id), Not Null  
- appointment_time: DATETIME, Not Null  
- status: INT, Default 0 *(0 = Scheduled, 1 = Completed, 2 = Cancelled)*  
- notes: TEXT  
- created_at: TIMESTAMP, Default CURRENT_TIMESTAMP  

---

## 🔗 Relationships & Constraints

- A *patient* can have multiple appointments (One-to-Many).  
- A *doctor* can have multiple appointments (One-to-Many).  
- Each appointment is linked to exactly one patient and one doctor.  
- Emails are unique for both patients and doctors.  
- Deleting a patient or doctor should be restricted or handled carefully to avoid orphan records.  

---

## 💡 Design Considerations

- Appointment history is retained for tracking and analytics.  
- Validation of email/phone formats will be handled in application logic.  
- Overlapping doctor appointments should be prevented at the application level.  

---

# 🍃 MongoDB Collection Design

Flexible and semi-structured data such as prescriptions are stored in MongoDB to allow scalability and schema flexibility.

---

## 📦 Collection: prescriptions

### Example Document:

```json
{
  "_id": "ObjectId('65abc123456')",
  "appointmentId": 101,
  "patientId": 12,
  "doctorId": 5,
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Every 6 hours"
    },
    {
      "name": "Ibuprofen",
      "dosage": "200mg",
      "frequency": "Twice daily"
    }
  ],
  "doctorNotes": "Patient should rest and stay hydrated.",
  "refillCount": 1,
  "createdAt": "2026-03-17T10:00:00Z",
  "pharmacy": {
    "name": "City Pharmacy",
    "location": "Downtown"
  },
  "tags": ["fever", "pain relief"]
}
