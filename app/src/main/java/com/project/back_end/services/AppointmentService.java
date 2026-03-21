package com.project.back_end.services;

import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import com.project.back_end.repo.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.print.Doc;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
// 1. **Add @Service Annotation**:
//    - To indicate that this class is a service layer class for handling business logic.
//    - The `@Service` annotation should be added before the class declaration to mark it as a Spring service component.
//    - Instruction: Add `@Service` above the class definition.

    // 2. **Constructor Injection for Dependencies**:
//    - The `AppointmentService` class requires several dependencies like `AppointmentRepository`, `Service`, `TokenService`, `PatientRepository`, and `DoctorRepository`.
//    - These dependencies should be injected through the constructor.
//    - Instruction: Ensure constructor injection is used for proper dependency management in Spring.
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final TokenService tokenService;

    // Constructor Injection ✅
    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository,
                              TokenService tokenService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.tokenService = tokenService;
    }


// 3. **Add @Transactional Annotation for Methods that Modify Database**:
//    - The methods that modify or update the database should be annotated with `@Transactional` to ensure atomicity and consistency of the operations.
//    - Instruction: Add the `@Transactional` annotation above methods that interact with the database, especially those modifying data.

// 4. **Book Appointment Method**:
//    - Responsible for saving the new appointment to the database.
//    - If the save operation fails, it returns `0`; otherwise, it returns `1`.
//    - Instruction: Ensure that the method handles any exceptions and returns an appropriate result code.
public int BookAppointment(Appointment appointment) {
    try {
        if (appointment != null) {
            appointmentRepository.save(appointment);
            return 1;
        }
    } catch (Exception e) {
        return 0;
    }return 0;
}
// 5. **Update Appointment Method**:
//    - This method is used to update an existing appointment based on its ID.
//    - It validates whether the patient ID matches, checks if the appointment is available for updating, and ensures that the doctor is available at the specified time.
//    - If the update is successful, it saves the appointment; otherwise, it returns an appropriate error message.
//    - Instruction: Ensure proper validation and error handling is included for appointment updates.
public ResponseEntity<Map<String,String>> UpdateAppointment (Appointment appointment){
        Map<String ,String> response = new HashMap<>();
        try{
            Optional<Appointment> app= appointmentRepository.findById(appointment.getId());
            if(app.isEmpty()){
                response.put("message","Appointment not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            Appointment appointment1 = app.get();
            appointment1.setDoctor(appointment.getDoctor());
            appointment1.setPatient(appointment.getPatient());
            appointment1.setAppointmentTime(appointment.getAppointmentTime());
            appointment1.setStatus(appointment1.getStatus());

            appointmentRepository.save(appointment1);
            response.put("message","Appointment Updated Successfully");
        return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            response.put("message","Error Occured");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
}
// 6. **Cancel Appointment Method**:
//    - This method cancels an appointment by deleting it from the database.
//    - It ensures the patient who owns the appointment is trying to cancel it and handles possible errors.
//    - Instruction: Make sure that the method checks for the patient ID match before deleting the appointment.
public ResponseEntity<Map<String,String>> CancelAppointment (Long id,String token){
        Map<String ,String> response = new HashMap<>();
        try{
            Optional<Appointment > appointment =appointmentRepository.findById(id);

            if(appointment.isEmpty()){
                response.put("message","Appointment Not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
            Appointment appointment1 = appointment.get();
            String emailById = appointment1.getPatient().getEmail();
            String email = tokenService.extractIdentifier(token);
            if(!email.equalsIgnoreCase(emailById)){
                response.put("message","you cannot delete the appointment");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            appointmentRepository.delete(appointment1);
            response.put("message","Appointment deleted Successfully");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }catch (Exception e){
            response.put("message","Error Occured While Deleting Appointment");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
}

// 7. **Get Appointments Method**:
//    - This method retrieves a list of appointments for a specific doctor on a particular day, optionally filtered by the patient's name.
//    - It uses `@Transactional` to ensure that database operations are consistent and handled in a single transaction.
//    - Instruction: Ensure the correct use of transaction boundaries, especially when querying the database for appointments.
public Map<String,Object> getAppointment(String pname,LocalDate date,String token) {
    Map<String, Object> res = new HashMap<>();

        if (!tokenService.validateToken(token, "doctor")) {
            res.put("message", "Unauthorized");
            return res;
        }

        String doctorEmail = tokenService.extractIdentifier(token);
        Doctor doctor = doctorRepository.findByEmail(doctorEmail);
        if (doctor == null) {
            res.put("message", "Doctor not found");
            res.put("appointments", List.of());
            return res;
        }

        List<Appointment> appointments = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                doctor.getId(),
                date.atStartOfDay(),
                date.atTime(23, 59, 59)
        );

        if (pname != null && !pname.equalsIgnoreCase("null") && !pname.isBlank()) {
            appointments = appointments.stream()
                    .filter(a -> a.getPatient() != null
                            && a.getPatient().getName() != null
                            && a.getPatient().getName().toLowerCase().contains(pname.toLowerCase()))
                    .toList();
        }

        List<Map<String, Object>> payload = appointments.stream().map(a -> {
            Map<String, Object> item = new HashMap<>();
            item.put("id", a.getId());
            item.put("doctorId", a.getDoctor() != null ? a.getDoctor().getId() : null);
            item.put("patientId", a.getPatient() != null ? a.getPatient().getId() : null);
            item.put("patientName", a.getPatient() != null ? a.getPatient().getName() : null);
            item.put("patientPhone", a.getPatient() != null ? a.getPatient().getPhone() : null);
            item.put("patientEmail", a.getPatient() != null ? a.getPatient().getEmail() : null);
            item.put("appointmentTime", a.getAppointmentTime());
            item.put("appointmentDate", a.getAppointmentDate());
            item.put("status", a.getStatus());
            return item;
        }).toList();

        res.put("appointments", payload);
        return res;
}
    // 8. **Change Status Method**:
//    - This method updates the status of an appointment by changing its value in the database.
//    - It should be annotated with `@Transactional` to ensure the operation is executed in a single transaction.
//    - Instruction: Add `@Transactional`


}

