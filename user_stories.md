# 📝 User Stories – Smart Clinic Portal

This document contains user stories for the Smart Clinic Portal system, covering Admin, Patient, and Doctor roles. These stories define system functionality and guide development based on Agile principles.

---

## 📌 User Story Template

**Title:**  
_As a [user role], I want [feature/goal], so that [reason]._  

**Acceptance Criteria:**  
1. [Criteria 1]  
2. [Criteria 2]  
3. [Criteria 3]  

**Priority:** [High/Medium/Low]  
**Story Points:** [Estimated Effort in Points]  

**Notes:**  
- [Additional information or edge cases]  

---

# 👨‍💼 Admin User Stories

## 1. Admin Login
**Title:**  
_As an admin, I want to log into the portal, so that I can manage the platform securely._  

**Acceptance Criteria:**  
1. Admin enters valid username and password  
2. System validates credentials  
3. Admin is redirected to the dashboard  

**Priority:** High  
**Story Points:** 3  

**Notes:**  
- Display error message for invalid credentials  

---

## 2. Admin Logout
**Title:**  
_As an admin, I want to log out, so that I can protect system access._  

**Acceptance Criteria:**  
1. Admin clicks logout button  
2. System terminates session  
3. User is redirected to login page  

**Priority:** High  
**Story Points:** 2  

---

## 3. Add Doctor
**Title:**  
_As an admin, I want to add doctors, so that they can be available on the platform._  

**Acceptance Criteria:**  
1. Admin inputs doctor details  
2. System validates required fields  
3. Doctor is saved in the database  

**Priority:** High  
**Story Points:** 4  

---

## 4. Delete Doctor
**Title:**  
_As an admin, I want to delete a doctor, so that I can manage platform users._  

**Acceptance Criteria:**  
1. Admin selects a doctor profile  
2. System asks for confirmation  
3. Doctor is removed from the database  

**Priority:** Medium  
**Story Points:** 3  

---

## 5. View Appointment Statistics
**Title:**  
_As an admin, I want to view appointment statistics, so that I can track system usage._  

**Acceptance Criteria:**  
1. System executes stored procedure in MySQL  
2. Monthly appointment data is retrieved  
3. Results are displayed clearly  

**Priority:** Medium  
**Story Points:** 5  

---

# 🧑‍⚕️ Patient User Stories

## 6. View Doctors
**Title:**  
_As a patient, I want to view available doctors without logging in, so that I can explore options._  

**Acceptance Criteria:**  
1. Doctor list is publicly accessible  
2. Basic doctor information is displayed  
3. No login is required to view  

**Priority:** High  
**Story Points:** 2  

---

## 7. Patient Signup
**Title:**  
_As a patient, I want to create an account, so that I can book appointments._  

**Acceptance Criteria:**  
1. Patient enters email and password  
2. System validates input data  
3. Account is created successfully  

**Priority:** High  
**Story Points:** 4  

---

## 8. Patient Login
**Title:**  
_As a patient, I want to log into the portal, so that I can manage my appointments._  

**Acceptance Criteria:**  
1. Patient enters valid credentials  
2. System validates login  
3. Patient is redirected to dashboard  

**Priority:** High  
**Story Points:** 3  

---

## 9. Patient Logout
**Title:**  
_As a patient, I want to log out, so that I can secure my account._  

**Acceptance Criteria:**  
1. Patient clicks logout button  
2. System terminates session  
3. User is redirected to login page  

**Priority:** High  
**Story Points:** 2  

---

## 10. Book Appointment
**Title:**  
_As a patient, I want to book an appointment, so that I can consult a doctor._  

**Acceptance Criteria:**  
1. Patient selects a doctor  
2. Patient chooses an available time slot  
3. Appointment is successfully saved  

**Priority:** High  
**Story Points:** 5  

---

## 11. View Upcoming Appointments
**Title:**  
_As a patient, I want to view my upcoming appointments, so that I can prepare in advance._  

**Acceptance Criteria:**  
1. System displays list of upcoming appointments  
2. Each appointment includes date, time, and doctor  
3. Only authenticated users can access this data  

**Priority:** Medium  
**Story Points:** 3  

---

# 👨‍⚕️ Doctor User Stories

## 12. Doctor Login
**Title:**  
_As a doctor, I want to log into the portal, so that I can manage my appointments._  

**Acceptance Criteria:**  
1. Doctor enters valid credentials  
2. System validates login  
3. Doctor is redirected to dashboard  

**Priority:** High  
**Story Points:** 3  

---

## 13. Doctor Logout
**Title:**  
_As a doctor, I want to log out, so that I can protect my data._  

**Acceptance Criteria:**  
1. Doctor clicks logout button  
2. System terminates session  
3. Redirect to login page  

**Priority:** High  
**Story Points:** 2  

---

## 14. View Appointment Calendar
**Title:**  
_As a doctor, I want to view my appointment calendar, so that I stay organized._  

**Acceptance Criteria:**  
1. System displays scheduled appointments  
2. Appointments include patient and time details  
3. Data is accurate and up to date  

**Priority:** High  
**Story Points:** 4  

---

## 15. Set Availability
**Title:**  
_As a doctor, I want to manage my availability, so that patients can only book open slots._  

**Acceptance Criteria:**  
1. Doctor marks unavailable time slots  
2. System updates availability schedule  
3. Patients see only available slots  

**Priority:** Medium  
**Story Points:** 4  

---

## 16. Update Profile
**Title:**  
_As a doctor, I want to update my profile information, so that patients have accurate details._  

**Acceptance Criteria:**  
1. Doctor edits profile fields  
2. System validates updated data  
3. Changes are saved successfully  

**Priority:** Medium  
**Story Points:** 3  

---

## 17. View Patient Details
**Title:**  
_As a doctor, I want to view patient details for upcoming appointments, so that I can prepare in advance._  

**Acceptance Criteria:**  
1. Doctor selects an appointment  
2. Patient information is displayed  
3. Data is complete and accurate  

**Priority:** Medium  
**Story Points:** 3  

---

## ✅ Summary

- Covers all required roles: *Admin, Patient, Doctor*  
- Includes more than the minimum required user stories  
- Uses consistent structure and professional wording  
- Ready for GitHub submission or project documentation  
