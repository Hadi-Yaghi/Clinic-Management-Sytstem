package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Admin;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.models.Patient;
import com.project.back_end.repo.AdminRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import io.jsonwebtoken.security.Password;
import jakarta.websocket.OnClose;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;

import javax.print.Doc;
import javax.swing.text.html.Option;
import java.time.format.DateTimeFormatter;
import java.util.*;

@org.springframework.stereotype.Service
public class Service {
// 1. **@Service Annotation**
// The @Service annotation marks this class as a service component in Spring. This allows Spring to automatically detect it through component scanning
// and manage its lifecycle, enabling it to be injected into controllers or other services using @Autowired or constructor injection.

// 2. **Constructor Injection for Dependencies**
// The constructor injects all required dependencies (TokenService, Repositories, and other Services). This approach promotes loose coupling, improves testability,

    private final TokenService tokenService;

    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final AppointmentService appointmentService;

    public Service(TokenService tokenService, AdminRepository adminRepository, DoctorRepository doctorRepository, PatientRepository patientRepository, DoctorService doctorService, PatientService patientService, AppointmentService appointmentService) {
        this.tokenService = tokenService;
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorService = doctorService;
        this.patientService = patientService;
        this.appointmentService = appointmentService;
    }
    // 3. **validateToken Method**
// This method checks if the provided JWT token is valid for a specific user. It uses the TokenService to perform the validation.
// If the token is invalid or expired, it returns a 401 Unauthorized response with an appropriate error message. This ensures security by preventing
// unauthorized access to protected resources.
public ResponseEntity<Map<String,String>> validateToken(String token,String user){
        Map<String,String> response = new HashMap<>();
    try {
        if(tokenService.validateToken(token,user)){
            response.put("message","The token is valid");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }
        else {
            response.put("message","Unauthorized token");
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
// 4. **validateAdmin Method**
// This method validates the login credentials for an admin user.
// - It first searches the admin repository using the provided username.
// - If an admin is found, it checks if the password matches.
// - If the password is correct, it generates and returns a JWT token (using the admin’s username) with a 200 OK status.
// - If the password is incorrect, it returns a 401 Unauthorized status with an error message.
// - If no admin is found, it also returns a 401 Unauthorized.
// - If any unexpected error occurs during the process, a 500 Internal Server Error response is returned.
// This method ensures that only valid admin users can access secured parts of the system.
public ResponseEntity<Map<String,String>> validateAdmin(Admin recievedAdmin){
        Map<String,String> response = new HashMap<>();
        try {
            Admin admin = adminRepository.findAdminByUsername(recievedAdmin.getUsername());
            if (admin == null) {
                response.put("message", "invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            if (!admin.getPassword().equals(recievedAdmin.getPassword())) {
                response.put("message", "invalid username or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            String token = tokenService.generateToken(admin.getUsername());
            response.put("message", "Verified user");
            response.put("token", token);
            return ResponseEntity.status(HttpStatus.OK).body(response);


        } catch (Exception e) {
            e.printStackTrace(); // <--- ADD THIS LINE
            response.put("message", "Internal Server error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
}
// 5. **filterDoctor Method**
// This method provides filtering functionality for doctors based on name, specialty, and available time slots.
// - It supports various combinations of the three filters.
// - If none of the filters are provided, it returns all available doctors.
// This flexible filtering mechanism allows the frontend or consumers of the API to search and narrow down doctors based on user criteria.
public Map<String, Object> filterDoctor(String name, String speciality, String time) {
    String normalizedName = (name == null || name.isBlank()) ? null : name.trim();
    String normalizedSpeciality = (speciality == null || speciality.isBlank()) ? null : speciality.trim();
    String normalizedTime = (time == null || time.isBlank()) ? null : time.trim();
    return doctorService.filterDoctors(normalizedName, normalizedSpeciality, normalizedTime);
}

// 6. **validateAppointment Method**
// This method validates if the requested appointment time for a doctor is available.
// - It first checks if the doctor exists in the repository.
// - Then, it retrieves the list of available time slots for the doctor on the specified date.
// - It compares the requested appointment time with the start times of these slots.
// - If a match is found, it returns 1 (valid appointment time).
// - If no matching time slot is found, it returns 0 (invalid).
// - If the doctor doesn’t exist, it returns -1.
// This logic prevents overlapping or invalid appointment bookings.
public int validateAppointment(@NonNull Appointment appointment){
        Optional<Doctor> doctorOptional = doctorRepository.findById(appointment.getDoctor().getId());
        if(!doctorOptional.isPresent()){
            return  -1;
        }
        List<String > available = doctorService.getDoctorAvailability(appointment.getDoctor().getId(),appointment.getAppointmentDate());
        String time = appointment.getAppointmentTime()
                .toLocalTime()
                .withSecond(0)
                .withNano(0)
                .format(DateTimeFormatter.ofPattern("HH:mm"));
        if(available.contains(time)){
            return 1;

        }
        return 0;
}
// 7. **validatePatient Method**
// This method checks whether a patient with the same email or phone number already exists in the system.
// - If a match is found, it returns false (indicating the patient is not valid for new registration).
// - If no match is found, it returns true.
// This helps enforce uniqueness constraints on patient records and prevent duplicate entries.
    public boolean validatePatientLogin (Patient patient){
        if(patientRepository.findByEmailOrPhone(patient.getEmail(), patient.getPhone()) == null)
            return false;
        return true;
    }
// 8. **validatePatientLogin Method**
// This method handles login validation for patient users.
// - It looks up the patient by email.
// - If found, it checks whether the provided password matches the stored one.
// - On successful validation, it generates a JWT token and returns it with a 200 OK status.
// - If the password is incorrect or the patient doesn't exist, it returns a 401 Unauthorized with a relevant error.
// - If an exception occurs, it returns a 500 Internal Server Error.
// This method ensures only legitimate patients can log in and access their data securely.

    public ResponseEntity<Map<String,String>> VaidatePatientLogin(Login login){
        Map<String,String> res = new HashMap<>();
        try {
            if(patientRepository.findByEmail(login.getEmail()) == null ){
                res.put("message","invalid email address");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
            }
            Patient p = patientRepository.findByEmail(login.getEmail());
            if(!p.getPassword().equals(login.getPassword())){
                res.put("message","invalid password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(res);
            }

            String token = tokenService.generateToken(p.getEmail());
            res.put("message","Authorized access");
            res.put("token", token);
            return ResponseEntity.status(HttpStatus.OK).body(res);
        }catch (Exception e){
            res.put("message","An error occured");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(res);
        }
    }
// 9. **filterPatient Method**
// This method filters a patient's appointment history based on condition and doctor name.
// - It extracts the email from the JWT token to identify the patient.
// - Depending on which filters (condition, doctor name) are provided, it delegates the filtering logic to PatientService.
// - If no filters are provided, it retrieves all appointments for the patient.
// This flexible method supports patient-specific querying and enhances user experience on the client side.
public ResponseEntity<Map<String,Object>> filterPatient(String condition,String name,String token) {
    Map<String, Object> response = new HashMap<>();
    try {
        String email = tokenService.extractIdentifier(token);
        Patient p = patientRepository.findByEmail(email);
        Long id = p.getId();
        if (name == null && condition != null) {
            return patientService.filterByCondition(condition, id);
        }
        if (name != null && condition == null) {
            return patientService.filterByDoctor(name, id);
        }
        if (name != null && condition!=null) {
            return patientService.filterByDoctorAndCondition(condition,name,id);
        }
        return patientService.getPatientAppointment(id, token);

    } catch (Exception e) {
        response.put("message", "error occurred");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

    }
}
}
