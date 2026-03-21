import { openModal } from "./components/modals.js";
import { createDoctorCard } from "./components/doctorCard.js";
import { filterDoctors, getDoctors, saveDoctor } from "./services/doctorServices.js";

const contentDiv = document.getElementById("content");
const searchBar = document.getElementById("searchBar");
const timeFilter = document.getElementById("timeFilter");
const specialtyFilter = document.getElementById("specialtyFilter");

function renderDoctorCards(doctors) {
  if (!contentDiv) {
    return;
  }

  contentDiv.innerHTML = "";

  doctors.forEach((doctor) => {
    const card = createDoctorCard(doctor);
    contentDiv.appendChild(card);
  });
}

async function loadDoctorCards() {
  if (!contentDiv) {
    return;
  }

  try {
    const doctors = await getDoctors();

    if (!doctors || doctors.length === 0) {
      contentDiv.innerHTML = `<p class="noPatientRecord">No doctors found.</p>`;
      return;
    }

    renderDoctorCards(doctors);
  } catch (error) {
    console.error("Error loading doctors:", error);
    contentDiv.innerHTML = `<p class="noPatientRecord">Error loading doctors. Try again later.</p>`;
  }
}

async function filterDoctorsOnChange() {
  if (!contentDiv) {
    return;
  }

  try {
    const name = searchBar?.value.trim() || "null";
    const time = timeFilter?.value || "null";
    const specialty = specialtyFilter?.value || "null";

    const filterResponse = await filterDoctors(name, time, specialty);
    const doctors = filterResponse?.doctors || [];

    if (doctors && doctors.length > 0) {
      renderDoctorCards(doctors);
    } else {
      contentDiv.innerHTML = `<p class="noPatientRecord">No doctors found with the given filters.</p>`;
    }
  } catch (error) {
    console.error("Error filtering doctors:", error);
    alert("An error occurred while filtering doctors.");
  }
}

window.adminAddDoctor = async function () {
  const name = document.getElementById("doctorName")?.value.trim();
  const specialty = document.getElementById("specialization")?.value.trim();
  const email = document.getElementById("doctorEmail")?.value.trim();
  const password = document.getElementById("doctorPassword")?.value.trim();
  const phone = document.getElementById("doctorPhone")?.value.trim();
  const availability = Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(
    (input) => input.value
  );

  if (!name) {
    alert("Doctor name is required.");
    return;
  }

  if (name.length < 3 || name.length > 100) {
    alert("Doctor name must be between 3 and 100 characters.");
    return;
  }

  if (!specialty) {
    alert("Please select a specialization.");
    return;
  }

  if (!email) {
    alert("Doctor email is required.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid doctor email address.");
    return;
  }

  if (!password) {
    alert("Doctor password is required.");
    return;
  }

  if (password.length < 6) {
    alert("Doctor password must be at least 6 characters.");
    return;
  }

  if (!phone) {
    alert("Doctor phone number is required.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Doctor phone must be exactly 10 digits.");
    return;
  }

  if (availability.length === 0) {
    alert("Please select at least one availability slot.");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Authentication token not found. Please log in again.");
    return;
  }

  const doctor = {
    name,
    specialty,
    email,
    password,
    phone,
    availableTimes: availability
  };

  try {
    const result = await saveDoctor(doctor, token);

    if (result?.success) {
      alert(result.message || "Doctor added successfully.");
      const modal = document.getElementById("modal");
      if (modal) {
        modal.style.display = "none";
      }
      await loadDoctorCards();
      return;
    }

    alert(result?.message || "Failed to add doctor.");
  } catch (error) {
    console.error("Error saving doctor:", error);
    alert("Failed to add doctor. Please try again.");
  }
};

if (searchBar) {
  searchBar.addEventListener("input", filterDoctorsOnChange);
}

if (timeFilter) {
  timeFilter.addEventListener("change", filterDoctorsOnChange);
}

if (specialtyFilter) {
  specialtyFilter.addEventListener("change", filterDoctorsOnChange);
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (target && target.id === "addDocBtn") {
    openModal("addDoctor");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});
