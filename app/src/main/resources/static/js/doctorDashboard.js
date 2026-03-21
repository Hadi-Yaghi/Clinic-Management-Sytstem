import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";

function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const patientTableBody = document.getElementById("patientTableBody");
  const searchBar = document.getElementById("searchBar");
  const todayButton = document.getElementById("todayButton");
  const datePicker = document.getElementById("datePicker");

  let selectedDate = getTodayDate();
  const token = localStorage.getItem("token");
  let patientName = "null";

  if (!patientTableBody) {
    return;
  }

  async function loadAppointments() {
    if (!token) {
      patientTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="noPatientRecord">Session expired. Please log in again.</td>
        </tr>
      `;
      return;
    }

    try {
      const appointments = await getAllAppointments(selectedDate, patientName, token);
      patientTableBody.innerHTML = "";

      if (!appointments || appointments.length === 0) {
        patientTableBody.innerHTML = `
          <tr>
            <td colspan="5" class="noPatientRecord">No Appointments found for today.</td>
          </tr>
        `;
        return;
      }

      appointments.forEach((appointment) => {
        const patient = {
          id: appointment.patientId,
          name: appointment.patientName,
          phone: appointment.patientPhone,
          email: appointment.patientEmail
        };

        const row = createPatientRow(patient, appointment.id, appointment.doctorId);
        patientTableBody.appendChild(row);
      });
    } catch (error) {
      console.error("Error loading appointments:", error);
      patientTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="noPatientRecord">Error loading appointments. Try again later.</td>
        </tr>
      `;
    }
  }

  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const value = searchBar.value.trim();
      patientName = value !== "" ? value : "null";
      loadAppointments();
    });
  }

  if (datePicker) {
    datePicker.value = selectedDate;
    datePicker.addEventListener("change", () => {
      selectedDate = datePicker.value || getTodayDate();
      loadAppointments();
    });
  }

  if (todayButton) {
    todayButton.addEventListener("click", () => {
      selectedDate = getTodayDate();
      if (datePicker) {
        datePicker.value = selectedDate;
      }
      loadAppointments();
    });
  }

  if (typeof window.renderContent === "function") {
    window.renderContent();
  }

  loadAppointments();
});
