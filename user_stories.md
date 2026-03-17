# 📝 User Stories

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
1. Admin can enter username and password  
2. System validates credentials  
3. Admin is redirected to dashboard on success  

**Priority:** High  
**Story Points:** 3  

**Notes:**  
- Invalid login should show error message  

---

## 2. Admin Logout
**Title:**  
_As an admin, I want to log out, so that I can protect system access._  

**Acceptance Criteria:**  
1. Admin can click logout  
2. Session is terminated  
3. Redirect to login page  

**Priority:** High  
**Story Points:** 2  

---

## 3. Add Doctor
**Title:**  
_As an admin, I want to add doctors, so that they can use the system._  

**Acceptance Criteria:**  
1. Admin can input doctor details  
2. Data is validated  
3. Doctor is saved in database  

**Priority:** High  
**Story Points:** 4  

---

## 4. Delete Doctor
**Title:**  
_As an admin, I want to delete a doctor, so that I can manage the platform._  

**Acceptance Criteria:**  
1. Admin selects doctor  
2. System confirms deletion  
3. Doctor is removed from database  

**Priority:** Medium  
**Story Points:** 3  

---

## 5. View Appointment Statistics
**Title:**  
_As an admin, I want to view appointment statistics, so that I can track usage._  

**Acceptance Criteria:**  
1. System runs stored procedure  
2. Monthly data is retrieved  
3. Results are displayed clearly  

**Priority:** Medium  
**Story Points:** 5  

---

# 🧑‍⚕️ Patient User Stories

## 6. View Doctors
**Title:**  
_As a patient, I want to view doctors without logging in, so that I can explore options._  

**Acceptance Criteria:**  
1. Doctor list is visible publicly  
2. Includes basic info  
3. Page loads without authentication  

**Priority:** High  
**Story Points:** 2  

---

## 7. Patient Signup
**Title:**  
_As a patient, I want to sign up, so that I can book appointments._  

**Acceptance Criteria:**  
1. Patient enters email and password  
2. Data is validated  
3. Account is created successfully  

**Priority:** High  
**Story Points:** 4  

---

## 8. Patient Login
**Title:**  
_As a patient, I want to log in, so that I can manage my bookings._  

**Acceptance Criteria:**  
1. Patient enters credentials  
2. System validates login  
3. Redirect to dashboard  

**Priority:** High  
**Story Points:** 3  

---

## 9. Book Appointment
**Title:**  
_As a patient, I want to book an appointment, so that I can consult a doctor._  

**Acceptance Criteria:**  
1. Patient selects doctor  
2. Chooses available time slot  
3. Appointment is saved  

**Priority:** High  
**Story Points:** 5  

---

## 10. View Appointments
**Title:**  
_As a patient, I want to view my appointments, so that I can prepare._  

**Acceptance Criteria:**  
1. List of appointments is displayed  
2. Includes date and doctor info  
3. Only logged-in users can access  

**Priority:** Medium  
**Story Points:** 3  

---

# 👨‍⚕️ Doctor User Stories

## 11. Doctor Login
**Title:**  
_As a doctor, I want to log in, so that I can manage my appointments._  

**Acceptance Criteria:**  
1. Doctor enters credentials  
2. System validates login  
3. Redirect to dashboard  

**Priority:** High  
**Story Points:** 3  

---

## 12. Doctor Logout
**Title:**  
_As a doctor, I want to log out, so that I can protect my data._  

**Acceptance Criteria:**  
1. Logout button is available  
2. Session is terminated  
3. Redirect to login page  

**Priority:** High  
**Story Points:** 2  

---

## 13. View Appointment Calendar
**Title:**  
_As a doctor, I want to view my appointments, so that I stay organized._  

**Acceptance Criteria:**  
1. Calendar view is displayed  
2. Shows upcoming appointments  
3. Data is accurate  

**Priority:** High  
**Story Points:** 4  

---

## 14. Set Availability
**Title:**  
_As a doctor, I want to mark my availability, so that patients can book slots._  

**Acceptance Criteria:**  
1. Doctor can mark unavailable times  
2. System updates schedule  
3. Patients see only available slots  

**Priority:** Medium  
**Story Points:** 4  

---

## 15. Update Profile
**Title:**  
_As a doctor, I want to update my profile, so that patients have accurate info._  

**Acceptance Criteria:**  
1. Doctor edits profile fields  
2. Changes are validated  
3. Data is saved successfully  

**Priority:** Medium  
**Story Points:** 3  

---

## 16. View Patient Details
**Title:**  
_As a doctor, I want to view patient details, so that I can prepare for appointments._  

**Acceptance Criteria:**  
1. Doctor selects appointment  
2. Patient info is displayed  
3. Data is accurate and complete  

**Priority:** Medium  
**Story Points:** 3  
