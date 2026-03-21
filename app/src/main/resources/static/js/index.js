import { openModal } from "./components/modals.js";
import { API_BASE_URL } from "./config/config.js";

const ADMIN_API = `${API_BASE_URL}/admin/login`;
const DOCTOR_API = `${API_BASE_URL}/doctor/login`;

document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("adminBtn");
  const patientBtn = document.getElementById("patientBtn");
  const doctorBtn = document.getElementById("doctorBtn");
  const loginType = new URLSearchParams(window.location.search).get("login");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => openModal("adminLogin"));
  }

  if (patientBtn) {
    patientBtn.addEventListener("click", () => {
      if (typeof selectRole === "function") {
        selectRole("patient");
      } else {
        window.location.href = "/pages/patientDashboard.html";
      }
    });
  }

  if (doctorBtn) {
    doctorBtn.addEventListener("click", () => openModal("doctorLogin"));
  }

  if (loginType === "admin") {
    openModal("adminLogin");
  } else if (loginType === "doctor") {
    openModal("doctorLogin");
  }
});

function resolveToken(payload) {
  return payload?.token || payload?.jwt || payload?.accessToken || null;
}

window.adminLoginHandler = async function () {
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  try {
    const response = await fetch(ADMIN_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      alert("Invalid admin credentials. Please try again.");
      return;
    }

    const data = await response.json();
    const token = resolveToken(data);

    if (!token) {
      alert("Login succeeded but no token was returned.");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "admin");

    if (typeof selectRole === "function") {
      selectRole("admin");
    } else {
      window.location.href = `/adminDashboard/${token}`;
    }
  } catch (error) {
    console.error("Admin login error:", error);
    alert("Something went wrong during admin login. Please try again later.");
  }
};

window.doctorLoginHandler = async function () {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch(DOCTOR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      alert("Invalid doctor credentials. Please try again.");
      return;
    }

    const data = await response.json();
    const token = resolveToken(data);

    if (!token) {
      alert("Login succeeded but no token was returned.");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "doctor");

    if (typeof selectRole === "function") {
      selectRole("doctor");
    } else {
      window.location.href = `/doctorDashboard/${token}`;
    }
  } catch (error) {
    console.error("Doctor login error:", error);
    alert("Something went wrong during doctor login. Please try again later.");
  }
};

