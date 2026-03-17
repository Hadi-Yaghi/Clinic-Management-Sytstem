# 🏥 Application Architecture

## 📌 Section 1: Architecture Summary

This Spring Boot application follows a layered architecture that combines both *MVC (Model-View-Controller)* and *RESTful services*.

- The application uses *Thymeleaf templates* to render dynamic web pages for the *Admin Dashboard* and *Doctor Dashboard*.
- Other modules such as *Appointments*, *Patient Dashboard*, and *Patient Records* are handled through *REST APIs* using JSON.

All incoming requests are processed by their respective controllers and routed through a centralized *Service Layer*, which contains the core business logic.

The system integrates two different databases:

- *MySQL*: Stores structured relational data such as Patients, Doctors, Appointments, and Admins using *JPA Entities*.
- *MongoDB*: Stores unstructured data such as Prescriptions using *Document Models*.

The *Service Layer* communicates with repositories, which handle database interactions, ensuring a clean separation of concerns.

---

## 🔄 Section 2: Numbered Flow of Data and Control

1. *User Interaction*  
   The user accesses the system through either:
   - Thymeleaf dashboards (*AdminDashboard*, *DoctorDashboard*), or  
   - REST modules (*Appointments*, *PatientDashboard*, *PatientRecord*).

2. *Controller Routing*  
   - Requests from dashboards are handled by *Thymeleaf Controllers*.  
   - API requests are handled by *REST Controllers*.

3. *Service Layer Processing*  
   Both controller types forward requests to the *Service Layer*, where business logic is executed.

4. *Repository Access*  
   The Service Layer decides which repository to use:
   - *MySQL Repositories* for relational data  
   - *MongoDB Repository* for document-based data

5. *Database Interaction*  
   - MySQL repositories access the *MySQL Database*  
   - MongoDB repository accesses the *MongoDB Database*

6. *Model Handling*  
   - MySQL uses *JPA Entities* (*Patient*, *Doctor*, *Appointment*, *Admin*)  
   - MongoDB uses *Document Models* (*Prescription*)

7. *Response to Client*  
   Data flows back from the database → Service Layer → Controllers →  
   - Rendered as HTML (Thymeleaf), or  
   - Returned as JSON (REST API)

---

## ✅ Key Design Highlights

- Clean *layered architecture*
- Combination of *MVC + REST*
- Integration of *relational (MySQL)* and *NoSQL (MongoDB)* databases
- Centralized *Service Layer* for business logic
- Scalable and maintainable design
