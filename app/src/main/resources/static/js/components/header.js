function openModalSafe(type) {
  if (typeof window.openModal === "function") {
    window.openModal(type);
    return;
  }
  alert("Modal is not available on this page.");
}

function renderHeader() {
  const headerDiv = document.getElementById("header");

  if (!headerDiv) return;

  const currentPath = window.location.pathname;

  if (currentPath === "/" || currentPath === "/index.html") {
    localStorage.removeItem("userRole");

    headerDiv.innerHTML = `
      <header class="header">
        <div class="logo-section">
          <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
          <span class="logo-title">Hospital CMS</span>
        </div>
      </header>
    `;
    return;
  }

  const role = localStorage.getItem("userRole") || localStorage.getItem("role");
  const token = localStorage.getItem("token");

  if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    alert("Session expired or invalid login. Please log in again.");
    window.location.href = "/index.html";
    return;
  }

  let headerContent = `
    <header class="header">
      <div class="logo-section">
        <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
        <span class="logo-title">Hospital CMS</span>
      </div>
      <nav class="header-nav">
  `;

  if (role === "admin") {
    headerContent += `
      <button id="addDocBtn" class="adminBtn" type="button">Add Doctor</button>
      <a href="#" id="logoutLink">Logout</a>
    `;
  } else if (role === "doctor") {
    headerContent += `
      <button id="doctorHomeBtn" class="adminBtn" type="button">Home</button>
      <a href="#" id="logoutLink">Logout</a>
    `;
  } else if (role === "patient") {
    headerContent += `
      <button id="patientLogin" class="adminBtn" type="button">Login</button>
      <button id="patientSignup" class="adminBtn" type="button">Sign Up</button>
    `;
  } else if (role === "loggedPatient") {
    headerContent += `
      <button id="home" class="adminBtn" type="button">Home</button>
      <button id="patientAppointments" class="adminBtn" type="button">Appointments</button>
      <a href="#" id="logoutPatientLink">Logout</a>
    `;
  }

  headerContent += `
      </nav>
    </header>
  `;

  headerDiv.innerHTML = headerContent;
  attachHeaderButtonListeners();
}

function attachHeaderButtonListeners() {
  const doctorHomeBtn = document.getElementById("doctorHomeBtn");
  const patientLoginBtn = document.getElementById("patientLogin");
  const patientSignupBtn = document.getElementById("patientSignup");
  const homeBtn = document.getElementById("home");
  const patientAppointmentsBtn = document.getElementById("patientAppointments");
  const logoutLink = document.getElementById("logoutLink");
  const logoutPatientLink = document.getElementById("logoutPatientLink");

  if (doctorHomeBtn) {
    doctorHomeBtn.addEventListener("click", () => {
      const token = localStorage.getItem("token");
      if (token) {
        window.location.href = `/doctorDashboard/${token}`;
      }
    });
  }

  if (patientLoginBtn) {
    patientLoginBtn.addEventListener("click", () => {
      openModalSafe("patientLogin");
    });
  }

  if (patientSignupBtn) {
    patientSignupBtn.addEventListener("click", () => {
      openModalSafe("patientSignup");
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      window.location.href = "/pages/loggedPatientDashboard.html";
    });
  }

  if (patientAppointmentsBtn) {
    patientAppointmentsBtn.addEventListener("click", () => {
      window.location.href = "/pages/patientAppointments.html";
    });
  }

  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      logout();
    });
  }

  if (logoutPatientLink) {
    logoutPatientLink.addEventListener("click", (event) => {
      event.preventDefault();
      logoutPatient();
    });
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("role");
  window.location.href = "/index.html";
}

function logoutPatient() {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("role");
  window.location.href = "/index.html";
}

window.renderHeader = renderHeader;
window.logout = logout;
window.logoutPatient = logoutPatient;

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("header")) {
    renderHeader();
  }
});
   
