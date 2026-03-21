/*
  Import the base API URL from the config file
  Define a constant DOCTOR_API to hold the full endpoint for doctor-related actions


  Function: getDoctors
  Purpose: Fetch the list of all doctors from the API

   Use fetch() to send a GET request to the DOCTOR_API endpoint
   Convert the response to JSON
   Return the 'doctors' array from the response
   If there's an error (e.g., network issue), log it and return an empty array


  Function: deleteDoctor
  Purpose: Delete a specific doctor using their ID and an authentication token

   Use fetch() with the DELETE method
    - The URL includes the doctor ID and token as path parameters
   Convert the response to JSON
   Return an object with:
    - success: true if deletion was successful
    - message: message from the server
   If an error occurs, log it and return a default failure response


  Function: saveDoctor
  Purpose: Save (create) a new doctor using a POST request

   Use fetch() with the POST method
    - URL includes the token in the path
    - Set headers to specify JSON content type
    - Convert the doctor object to JSON in the request body

   Parse the JSON response and return:
    - success: whether the request succeeded
    - message: from the server

   Catch and log errors
    - Return a failure response if an error occurs


  Function: filterDoctors
  Purpose: Fetch doctors based on filtering criteria (name, time, and specialty)

   Use fetch() with the GET method
    - Include the name, time, and specialty as URL path parameters
   Check if the response is OK
    - If yes, parse and return the doctor data
    - If no, log the error and return an object with an empty 'doctors' array

   Catch any other errors, alert the user, and return a default empty result
*/
import { API_BASE_URL } from "../config/config.js";

const DOCTOR_API = `${API_BASE_URL}/doctor`;

function normalizeDoctor(doctor = {}) {
  return {
    ...doctor,
    speciality: doctor.speciality || doctor.specialty || doctor.specialization || "",
    specialty: doctor.speciality || doctor.specialty || doctor.specialization || "",
    availableTime: doctor.availableTime || doctor.availableTimes || [],
    availableTimes: doctor.availableTimes || doctor.availableTime || []
  };
}

function matchesAmPm(doctor, period) {
  if (!period || period === "null") return true;
  const slots = Array.isArray(doctor.availableTimes)
    ? doctor.availableTimes
    : Array.isArray(doctor.availableTime)
      ? doctor.availableTime
      : [];

  return slots.some((slot) => {
    const start = String(slot).split("-")[0]?.trim();
    if (!start || !start.includes(":")) return false;
    const hour = Number(start.split(":")[0]);
    if (Number.isNaN(hour)) return false;
    if (period.toUpperCase() === "AM") return hour < 12;
    if (period.toUpperCase() === "PM") return hour >= 12;
    return false;
  });
}

function filterDoctorsLocally(doctors, name, time, specialty) {
  const normalizedName = !name || name === "null" ? "" : name.toLowerCase();
  const normalizedSpecialty = !specialty || specialty === "null" ? "" : specialty.toLowerCase();
  const normalizedTime = !time || time === "null" ? null : time;

  return doctors.filter((doctor) => {
    const doctorName = String(doctor.name || "").toLowerCase();
    const doctorSpecialty = String(doctor.speciality || doctor.specialty || doctor.specialization || "").toLowerCase();

    const nameMatch = !normalizedName || doctorName.includes(normalizedName);
    const specialtyMatch = !normalizedSpecialty || doctorSpecialty.includes(normalizedSpecialty);
    const timeMatch = matchesAmPm(doctor, normalizedTime);

    return nameMatch && specialtyMatch && timeMatch;
  });
}

export async function getDoctors() {
  try {
    const response = await fetch(DOCTOR_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch doctors:", response.statusText);
      return [];
    }

    const data = await response.json();
    const doctors = data.doctors || data.Doctors || data.Doctor || [];
    return doctors.map(normalizeDoctor);
  } catch (error) {
    console.error("Error while fetching doctors:", error);
    return [];
  }
}

export async function deleteDoctor(id, token) {
  try {
    const response = await fetch(`${DOCTOR_API}/${id}/${token}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Something went wrong"
    };
  } catch (error) {
    console.error("Error while deleting doctor:", error);
    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}

export async function saveDoctor(doctor, token) {
  try {
    const payload = {
      name: doctor.name,
      speciality: doctor.speciality || doctor.specialty,
      email: doctor.email,
      password: doctor.password,
      phone: doctor.phone,
      availableTime: doctor.availableTime || doctor.availableTimes || []
    };

    const response = await fetch(`${DOCTOR_API}/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    const message = data.message || `Request failed with status ${response.status}`;

    return {
      success: response.ok,
      message
    };
  } catch (error) {
    console.error("Error while saving doctor:", error);
    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}

export async function filterDoctors(name, time, specialty) {
  const parsedName = !name || name === "null" ? "null" : name;
  const parsedTime = !time || time === "null" ? "null" : time;
  const parsedSpecialty = !specialty || specialty === "null" ? "null" : specialty;

  try {
    const response = await fetch(
      `${DOCTOR_API}/filter/${encodeURIComponent(parsedName)}/${encodeURIComponent(parsedTime)}/${encodeURIComponent(parsedSpecialty)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.ok) {
      console.error("Failed to filter doctors:", response.statusText);
      return { doctors: [] };
    }

    const data = await response.json();
    const doctors = (data.doctors || data.Doctors || data.Doctor || []).map(normalizeDoctor);

    if (doctors.length > 0 || (parsedName === "null" && parsedTime === "null" && parsedSpecialty === "null")) {
      return { doctors };
    }

    const allDoctors = await getDoctors();
    return { doctors: filterDoctorsLocally(allDoctors, parsedName, parsedTime, parsedSpecialty) };
  } catch (error) {
    console.error("Error while filtering doctors:", error);
    const allDoctors = await getDoctors();
    return { doctors: filterDoctorsLocally(allDoctors, parsedName, parsedTime, parsedSpecialty) };
  }
}
