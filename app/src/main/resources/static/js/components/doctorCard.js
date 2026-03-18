/*
Import the overlay function for booking appointments from loggedPatient.js

  Import the deleteDoctor API function to remove doctors (admin role) from docotrServices.js

  Import function to fetch patient details (used during booking) from patientServices.js

  Function to create and return a DOM element for a single doctor card
    Create the main container for the doctor card
    Retrieve the current user role from localStorage
    Create a div to hold doctor information
    Create and set the doctor’s name
    Create and set the doctor's specialization
    Create and set the doctor's email
    Create and list available appointment times
    Append all info elements to the doctor info container
    Create a container for card action buttons
    === ADMIN ROLE ACTIONS ===
      Create a delete button
      Add click handler for delete button
     Get the admin token from localStorage
        Call API to delete the doctor
        Show result and remove card if successful
      Add delete button to actions container
   
    === PATIENT (NOT LOGGED-IN) ROLE ACTIONS ===
      Create a book now button
      Alert patient to log in before booking
      Add button to actions container
  
    === LOGGED-IN PATIENT ROLE ACTIONS === 
      Create a book now button
      Handle booking logic for logged-in patient   
        Redirect if token not available
        Fetch patient data with token
        Show booking overlay UI with doctor and patient info
      Add button to actions container
   
  Append doctor info and action buttons to the car
  Return the complete doctor card element
*/
import { overlay } from "./loggedPatient.js";
import { deleteDoctor } from "./services/doctorServices.js";
import { getPatientDetails } from "./services/patientServices.js";

/*
  Function to create and return a DOM element for a single doctor card
    Create the main container for the doctor card
    Retrieve the current user role from localStorage
    Create a div to hold doctor information
    Create and set the doctor’s name
    Create and set the doctor's specialization
    Create and set the doctor's email
    Create and list available appointment times
    Append all info elements to the doctor info container
    Create a container for card action buttons
    === ADMIN ROLE ACTIONS ===
      Create a delete button
      Add click handler for delete button
      Get the admin token from localStorage
      Call API to delete the doctor
      Show result and remove card if successful
      Add delete button to actions container

    === PATIENT (NOT LOGGED-IN) ROLE ACTIONS ===
      Create a book now button
      Alert patient to log in before booking
      Add button to actions container

    === LOGGED-IN PATIENT ROLE ACTIONS ===
      Create a book now button
      Handle booking logic for logged-in patient
        Redirect if token not available
        Fetch patient data with token
        Show booking overlay UI with doctor and patient info
      Add button to actions container

  Append doctor info and action buttons to the card
  Return the complete doctor card element
*/
export function createDoctorCard(doctor) {
    const card = document.createElement("div");
    card.className = "doctor-card";

    const role = localStorage.getItem("userRole") || localStorage.getItem("role");

    const doctorInfo = document.createElement("div");
    doctorInfo.className = "doctor-info";

    const doctorName = document.createElement("h3");
    doctorName.className = "doctor-name";
    doctorName.textContent = doctor.name || "Unknown Doctor";

    const doctorSpecialization = document.createElement("p");
    doctorSpecialization.className = "doctor-specialization";
    doctorSpecialization.innerHTML = `<strong>Specialization:</strong> ${doctor.specialty || doctor.specialization || "N/A"}`;

    const doctorEmail = document.createElement("p");
    doctorEmail.className = "doctor-email";
    doctorEmail.innerHTML = `<strong>Email:</strong> ${doctor.email || "N/A"}`;

    const doctorTimes = document.createElement("p");
    doctorTimes.className = "doctor-times";

    const availableTimes = doctor.availableTimes || doctor.availableTime || [];
    const formattedTimes = Array.isArray(availableTimes)
        ? availableTimes.join(", ")
        : availableTimes || "N/A";

    doctorTimes.innerHTML = `<strong>Available Times:</strong> ${formattedTimes}`;

    doctorInfo.appendChild(doctorName);
    doctorInfo.appendChild(doctorSpecialization);
    doctorInfo.appendChild(doctorEmail);
    doctorInfo.appendChild(doctorTimes);

    const actionsContainer = document.createElement("div");
    actionsContainer.className = "doctor-card-actions";

    /*
      === ADMIN ROLE ACTIONS ===
    */
    if (role === "admin") {
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-doctor-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Admin session expired. Please log in again.");
                window.location.href = "index.html";
                return;
            }

            const confirmed = window.confirm(`Are you sure you want to delete Dr. ${doctor.name}?`);
            if (!confirmed) return;

            try {
                await deleteDoctor(doctor.id, token);
                alert("Doctor deleted successfully.");
                card.remove();
            } catch (error) {
                console.error("Error deleting doctor:", error);
                alert("Failed to delete doctor. Please try again.");
            }
        });

        actionsContainer.appendChild(deleteBtn);
    }

    /*
      === PATIENT (NOT LOGGED-IN) ROLE ACTIONS ===
    */
    else if (role === "patient" || !role) {
        const bookBtn = document.createElement("button");
        bookBtn.className = "book-now-btn";
        bookBtn.textContent = "Book Now";

        bookBtn.addEventListener("click", () => {
            alert("Please log in before booking an appointment.");
        });

        actionsContainer.appendChild(bookBtn);
    }

    /*
      === LOGGED-IN PATIENT ROLE ACTIONS ===
    */
    else if (role === "loggedPatient") {
        const bookBtn = document.createElement("button");
        bookBtn.className = "book-now-btn";
        bookBtn.textContent = "Book Now";

        bookBtn.addEventListener("click", async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Session expired. Please log in again.");
                window.location.href = "index.html";
                return;
            }

            try {
                const patient = await getPatientDetails(token);

                if (!patient) {
                    alert("Unable to fetch patient details.");
                    return;
                }

                overlay(doctor, patient);
            } catch (error) {
                console.error("Error preparing booking:", error);
                alert("Failed to open booking form. Please try again.");
            }
        });

        actionsContainer.appendChild(bookBtn);
    }

    card.appendChild(doctorInfo);
    card.appendChild(actionsContainer);

    return card;
}
