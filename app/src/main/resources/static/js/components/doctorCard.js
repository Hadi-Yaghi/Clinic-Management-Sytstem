import { showBookingOverlay } from "../loggedPatient.js";
import { deleteDoctor } from "../services/doctorServices.js";
import { getPatientData } from "../services/patientServices.js";

function getRole() {
  return localStorage.getItem("userRole") || localStorage.getItem("role") || "patient";
}

function getAvailableTimes(doctor) {
  const availableTimes = doctor.availableTimes || doctor.availableTime || [];
  if (Array.isArray(availableTimes)) {
    return availableTimes.join(", ") || "N/A";
  }
  return availableTimes || "N/A";
}

function getDoctorSpecialization(doctor) {
  return doctor.speciality || doctor.specialty || doctor.specialization || "N/A";
}

export function createDoctorCard(doctor) {
  const card = document.createElement("div");
  card.className = "doctor-card";

  const doctorInfo = document.createElement("div");
  doctorInfo.className = "doctor-info";

  const doctorName = document.createElement("h3");
  doctorName.textContent = doctor.name || "Unknown Doctor";

  const doctorSpecialization = document.createElement("p");
  doctorSpecialization.innerHTML = `<strong>Specialization:</strong> ${getDoctorSpecialization(doctor)}`;

  const doctorEmail = document.createElement("p");
  doctorEmail.innerHTML = `<strong>Email:</strong> ${doctor.email || "N/A"}`;

  const doctorTimes = document.createElement("p");
  doctorTimes.innerHTML = `<strong>Available Times:</strong> ${getAvailableTimes(doctor)}`;

  doctorInfo.appendChild(doctorName);
  doctorInfo.appendChild(doctorSpecialization);
  doctorInfo.appendChild(doctorEmail);
  doctorInfo.appendChild(doctorTimes);

  const cardActions = document.createElement("div");
  cardActions.className = "card-actions";

  const role = getRole();

  if (role === "admin") {
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";

    deleteBtn.addEventListener("click", async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Admin session expired. Please log in again.");
        window.location.href = "/";
        return;
      }

      try {
        const result = await deleteDoctor(doctor.id, token);
        if (result?.success) {
          alert(result.message || "Doctor deleted successfully.");
          card.remove();
        } else {
          alert(result?.message || "Failed to delete doctor.");
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("Failed to delete doctor. Please try again.");
      }
    });

    cardActions.appendChild(deleteBtn);
  } else if (role === "loggedPatient") {
    const bookBtn = document.createElement("button");
    bookBtn.type = "button";
    bookBtn.textContent = "Book Now";

    bookBtn.addEventListener("click", async (event) => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please log in again.");
        window.location.href = "/";
        return;
      }

      try {
        const patient = await getPatientData(token);
        if (!patient) {
          alert("Unable to fetch patient details.");
          return;
        }
        showBookingOverlay(event, doctor, patient);
      } catch (error) {
        console.error("Error preparing booking:", error);
        alert("Failed to open booking form. Please try again.");
      }
    });

    cardActions.appendChild(bookBtn);
  } else {
    const bookBtn = document.createElement("button");
    bookBtn.type = "button";
    bookBtn.textContent = "Book Now";

    bookBtn.addEventListener("click", () => {
      alert("Please log in before booking an appointment.");
    });

    cardActions.appendChild(bookBtn);
  }

  card.appendChild(doctorInfo);
  card.appendChild(cardActions);

  return card;
}
