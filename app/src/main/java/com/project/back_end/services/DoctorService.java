package com.project.back_end.services;

import com.project.back_end.DTO.Login;
import com.project.back_end.models.Appointment;
import com.project.back_end.models.Doctor;
import com.project.back_end.repo.AppointmentRepository;
import com.project.back_end.repo.DoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.print.Doc;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

// 1. **Add @Service Annotation**
@Service
public class DoctorService {
// 1. **Add @Service Annotation**:
//    - This class should be annotated with `@Service` to indicate that it is a service layer class.
//    - The `@Service` annotation marks this class as a Spring-managed bean for business logic.
//    - Instruction: Add `@Service` above the class declaration.

// 2. **Constructor Injection for Dependencies**:
//    - The `DoctorService` class depends on `DoctorRepository`, `AppointmentRepository`, and `TokenService`.
//    - These dependencies should be injected via the constructor for proper dependency management.
//    - Instruction: Ensure constructor injection is used for injecting dependencies into the service.
private DoctorRepository doctorRepository;
private AppointmentRepository appointmentRepository;
private TokenService    tokenService;

public DoctorService(DoctorRepository doctorRepository,AppointmentRepository  appointmentRepository,TokenService tokenService) {
    this.appointmentRepository = appointmentRepository;
    this.tokenService = tokenService;
    this.doctorRepository = doctorRepository;
}
// 3. **Add @Transactional Annotation for Methods that Modify or Fetch Database Data**:
//    - Methods like `getDoctorAvailability`, `getDoctors`, `findDoctorByName`, `filterDoctorsBy*` should be annotated with `@Transactional`.
//    - The `@Transactional` annotation ensures that database operations are consistent and wrapped in a single transaction.
//    - Instruction: Add the `@Transactional` annotation above the methods that perform database operations or queries.

// 4. **getDoctorAvailability Method**:
//    - Retrieves the available time slots for a specific doctor on a particular date and filters out already booked slots.
//    - The method fetches all appointments for the doctor on the given date and calculates the availability by comparing against booked slots.
//    - Instruction: Ensure that the time slots are properly formatted and the available slots are correctly filtered.
@Transactional(readOnly = true)
public List<String> getDoctorAvailability(Long doctorId, LocalDate date) {
    List<String> allSlots = List.of(
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00"
    );

    List<Appointment> appointments = appointmentRepository
            .findByDoctorIdAndAppointmentTimeBetween(
                    doctorId,
                    date.atStartOfDay(),
                    date.atTime(23, 59, 59)
            );

    List<String> bookedSlots = appointments.stream()
            .map(appointment -> appointment.getAppointmentTime().toLocalTime().withSecond(0).withNano(0).toString())
            .toList();

    return allSlots.stream()
            .filter(slot -> !bookedSlots.contains(slot))
            .collect(Collectors.toList());
}
// 5. **saveDoctor Method**:
//    - Used to save a new doctor record in the database after checking if a doctor with the same email already exists.
//    - If a doctor with the same email is found, it returns `-1` to indicate conflict; `1` for success, and `0` for internal errors.
//    - Instruction: Ensure that the method correctly handles conflicts and exceptions when saving a doctor.
public int saveDoctor(Doctor doctor){
    try{
        Doctor doctor1 = doctorRepository.findByEmail(doctor.getEmail());
        if(doctor1 != null){
            return -1;
        }
        doctorRepository.save(doctor);
        return 1;
    }catch (Exception e){
        return 0;
    }
}
// 6. **updateDoctor Method**:
//    - Updates an existing doctor's details in the database. If the doctor doesn't exist, it returns `-1`.
//    - Instruction: Make sure that the doctor exists before attempting to save the updated record and handle any errors properly.
    @Transactional
public int updateDoctor (Doctor doctor){
    try {
        Optional<Doctor> doctor1 = doctorRepository.findById(doctor.getId());
        if(doctor1.isEmpty()) {
            return  -1;
        }
        Doctor existingdoctor = doctor1.get();
        existingdoctor.setName(doctor.getName());
        existingdoctor.setPassword(doctor.getPassword());
        existingdoctor.setSpeciality(doctor.getSpeciality());
        existingdoctor.setEmail(doctor.getEmail());
        existingdoctor.setPhone(doctor.getPhone());
        existingdoctor.setAvailableTime(doctor.getAvailableTime());

        doctorRepository.save(existingdoctor);
        return 1;

    }
    catch (Exception e){
        return  0;
    }
}
// 7. **getDoctors Method**:
//    - Fetches all doctors from the database. It is marked with `@Transactional` to ensure that the collection is properly loaded.
//    - Instruction: Ensure that the collection is eagerly loaded, especially if dealing with lazy-loaded relationships (e.g., available times).
@Transactional(readOnly = true)
public List<Doctor> getDoctors(){
    List<Doctor> doctors = doctorRepository.findAll();
    doctors.forEach(d -> {
        if (d.getAvailableTime() != null) {
            d.getAvailableTime().size();
        }
    });
    return doctors;
}
// 8. **deleteDoctor Method**:
//    - Deletes a doctor from the system along with all appointments associated with that doctor.
//    - It first checks if the doctor exists. If not, it returns `-1`; otherwise, it deletes the doctor and their appointments.
//    - Instruction: Ensure the doctor and their appointments are deleted properly, with error handling for internal issues.
public int deleteDoctor(Long id){
    Optional<Doctor> doctor = doctorRepository.findById(id);
    try{
        if(doctor.isEmpty()) {
            return -1;
        }
        doctorRepository.delete(doctor.get());
        return 1;
    }catch (Exception e){
        return 0;
    }
}
// 9. **validateDoctor Method**:
//    - Validates a doctor's login by checking if the email and password match an existing doctor record.
//    - It generates a token for the doctor if the login is successful, otherwise returns an error message.
//    - Instruction: Make sure to handle invalid login attempts and password mismatches properly with error responses.
public ResponseEntity<Map<String,Object>> validateDoctor(Login login){
    Map<String ,Object> response = new HashMap<>();
    try {
        Doctor doctor =doctorRepository.findByEmail(login.getEmail());
        if(doctor == null){
            response.put("message","inavlid email");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        if(!doctor.getPassword().equals(login.getPassword())){
            response.put("message","invalid password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        String token =tokenService.generateToken(doctor.getEmail());
        response.put("message","authorized access ");
        response.put("token",token);
        return ResponseEntity.status(HttpStatus.OK).body(response);

    }catch (Exception e){
        e.printStackTrace();
        response.put("message","Error occured ");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
// 10. **findDoctorByName Method**:
//    - Finds doctors based on partial name matching and returns the list of doctors with their available times.
//    - This method is annotated with `@Transactional` to ensure that the database query and data retrieval are properly managed within a transaction.
//    - Instruction: Ensure that available times are eagerly loaded for the doctors.
@Transactional
public Map<String,Object> findDoctorByName(String name){
    Map<String ,Object> response = new HashMap<>();

    // Add wildcards for partial matching
    List<Doctor> doctors = doctorRepository.findByNameLike("%" + name + "%");

    // Force eager loading of available times
    doctors.forEach(d -> d.getAvailableTime().size());

    response.put("Doctors", doctors);
    return response;
}

private boolean isSlotInPeriod(String slot, String amOrPm) {
    if (slot == null || slot.isBlank() || amOrPm == null || amOrPm.isBlank()) {
        return false;
    }

    String startToken = slot.split("-")[0].trim();
    LocalTime time;
    try {
        time = LocalTime.parse(startToken);
    } catch (Exception ex) {
        return false;
    }

    if ("AM".equalsIgnoreCase(amOrPm)) {
        return time.getHour() < 12;
    }
    if ("PM".equalsIgnoreCase(amOrPm)) {
        return time.getHour() >= 12;
    }
    return false;
}

// 11. **filterDoctorsByNameSpecilityandTime Method**:
//    - Filters doctors based on their name, specialty, and availability during a specific time (AM/PM).
//    - The method fetches doctors matching the name and specialty criteria, then filters them based on their availability during the specified time period.
//    - Instruction: Ensure proper filtering based on both the name and specialty as well as the specified time period.
public  Map<String,Object>filterDoctorsByNameSpecilityandTime(String name ,String Spcialty,String amOrPm){
    Map<String ,Object> respons = new HashMap<>();

    List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(name,Spcialty);
    List<Doctor> filteredDoctors = doctors.stream()
            .filter(d -> d.getAvailableTime() != null && d.getAvailableTime().stream().anyMatch(t -> isSlotInPeriod(t, amOrPm)))
            .toList();

    respons.put("Doctors",filteredDoctors);
    return respons;
    }
// 12. **filterDoctorByTime Method**:
//    - Filters a list of doctors based on whether their available times match the specified time period (AM/PM).
//    - This method processes a list of doctors and their available times to return those that fit the time criteria.
//    - Instruction: Ensure that the time filtering logic correctly handles both AM and PM time slots and edge cases.
public List<Doctor> filterDoctorByTime(List<Doctor> doctors,String amOrPm){
    List<Doctor> filteredDoctors;
    filteredDoctors= doctors.stream()
            .filter(d -> d.getAvailableTime() != null && d.getAvailableTime().stream().anyMatch(t -> isSlotInPeriod(t, amOrPm)))
            .toList();

    return filteredDoctors;
    }


// 13. **filterDoctorByNameAndTime Method**:
//    - Filters doctors based on their name and the specified time period (AM/PM).
//    - Fetches doctors based on partial name matching and filters the results to include only those available during the specified time period.
//    - Instruction: Ensure that the method correctly filters doctors based on the given name and time of day (AM/PM).
public Map<String ,Object> filterDoctorByNameAndTime (String name,String amOrPm){
    Map<String,Object> res = new HashMap<>();

    List<Doctor> filterByName = doctorRepository.findByNameLike(name);
    List<Doctor> filteredDoctorT = filterByName.stream()
            .filter(d -> d.getAvailableTime() != null && d.getAvailableTime().stream().anyMatch(t -> isSlotInPeriod(t, amOrPm)))
            .toList();
    res.put("Doctor",filteredDoctorT);return res;
}
// 14. **filterDoctorByNameAndSpecility Method**:
//    - Filters doctors by name and specialty.
//    - It ensures that the resulting list of doctors matches both the name (case-insensitive) and the specified specialty.
//    - Instruction: Ensure that both name and specialty are considered when filtering doctors.
public Map<String,Object> filterDoctorByNameAndSpecility(String name,String speciality){
    Map<String,Object> response = new HashMap<>();
    List<Doctor> dc = doctorRepository.findByNameContainingIgnoreCaseAndSpecialtyIgnoreCase(
            name,speciality
    );
    response.put("Doctor",dc);
    return response;
}

// 15. **filterDoctorByTimeAndSpecility Method**:
//    - Filters doctors based on their specialty and availability during a specific time period (AM/PM).
//    - Fetches doctors based on the specified specialty and filters them based on their available time slots for AM/PM.
//    - Instruction: Ensure the time filtering is accurately applied based on the given specialty and time period (AM/PM).
public Map<String,Object> filterDoctorByTimeAndSpecility(String Speciality ,String amOrPm){
    Map<String,Object> res  = new HashMap<>();
    List<Doctor> dc = doctorRepository.findBySpecialityIgnoreCase(Speciality);
    List<Doctor> filter = dc.stream()
            .filter(d -> d.getAvailableTime() != null && d.getAvailableTime().stream().anyMatch(t -> isSlotInPeriod(t, amOrPm)))
            .toList();
    res.put("Doctors",filter);
    return res;
}
// 16. **filterDoctorBySpecility Method**:
//    - Filters doctors based on their specialty.
//    - This method fetches all doctors matching the specified specialty and returns them.
//    - Instruction: Make sure the filtering logic works for case-insensitive specialty matching.
public Map<String,Object> filterDoctorBySpecility(String Specility){
    Map<String ,Object> res = new HashMap<>();
    List<Doctor> dc = doctorRepository.findBySpecialityIgnoreCase(Specility);
    res.put("Doctor",dc);
    return res;
}
// 17. **filterDoctorsByTime Method**:
//    - Filters all doctors based on their availability during a specific time period (AM/PM).
//    - The method checks all doctors' available times and returns those available during the specified time period.
//    - Instruction: Ensure proper filtering logic to handle AM/PM time periods.
public Map<String,Object> filterDoctorsByTime(String amOrPm){
    Map <String,Object> res = new HashMap<>();
    List<Doctor> dc = doctorRepository.findAll();
    List<Doctor> filter = dc.stream().
            filter(d -> d.getAvailableTime() != null && d.getAvailableTime().stream().anyMatch(t -> isSlotInPeriod(t, amOrPm)))
            .toList();
    res.put("Doctors",filter);
    return res;
}

@Transactional(readOnly = true)
public Map<String, Object> filterDoctors(String name, String speciality, String amOrPm) {
    Map<String, Object> response = new HashMap<>();
    List<Doctor> doctors = getDoctors();

    if (name != null && !name.isBlank()) {
        String normalizedName = name.toLowerCase();
        doctors = doctors.stream()
                .filter(d -> d.getName() != null && d.getName().toLowerCase().contains(normalizedName))
                .toList();
    }

    if (speciality != null && !speciality.isBlank()) {
        String normalizedSpeciality = speciality.toLowerCase();
        doctors = doctors.stream()
                .filter(d -> d.getSpeciality() != null && d.getSpeciality().toLowerCase().contains(normalizedSpeciality))
                .toList();
    }

    if (amOrPm != null && !amOrPm.isBlank()) {
        doctors = doctors.stream()
                .filter(d -> d.getAvailableTime() != null && d.getAvailableTime().stream().anyMatch(t -> isSlotInPeriod(t, amOrPm)))
                .toList();
    }

    response.put("Doctors", doctors);
    return response;
}
}