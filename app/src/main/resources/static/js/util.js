// util.js
  function setRole(role) {
    localStorage.setItem("userRole", role);
  }
  
  function getRole() {
    return localStorage.getItem("userRole");
  }
  
  function clearRole() {
    localStorage.removeItem("userRole");
  }

  const IDLE_TIMEOUT_MS = 2 * 60 * 1000;
  const LAST_ACTIVITY_KEY = "lastActivityAt";

  function getLoginRedirectByRole(role) {
    if (role === "admin") {
      return "/index.html?login=admin";
    }
    if (role === "doctor") {
      return "/index.html?login=doctor";
    }
    return "/pages/patientDashboard.html?login=patient";
  }

  function clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }

  function isProtectedRole(role) {
    return role === "admin" || role === "doctor" || role === "loggedPatient";
  }

  function touchActivity() {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  }

  function enforceIdleSession() {
    const role = localStorage.getItem("userRole") || localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (!isProtectedRole(role) || !token) {
      return;
    }

    const now = Date.now();
    const lastActivityAt = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);

    if (lastActivityAt > 0 && now - lastActivityAt > IDLE_TIMEOUT_MS) {
      const redirectUrl = getLoginRedirectByRole(role);
      clearSession();
      window.location.href = redirectUrl;
      return;
    }

    touchActivity();
  }

  document.addEventListener("DOMContentLoaded", () => {
    enforceIdleSession();

    const role = localStorage.getItem("userRole") || localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (!isProtectedRole(role) || !token) {
      return;
    }

    const activityEvents = ["click", "keydown", "mousemove", "scroll", "touchstart"];
    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, touchActivity, { passive: true });
    });

    setInterval(() => {
      const lastActivityAt = Number(localStorage.getItem(LAST_ACTIVITY_KEY) || 0);
      if (lastActivityAt > 0 && Date.now() - lastActivityAt > IDLE_TIMEOUT_MS) {
        const redirectUrl = getLoginRedirectByRole(role);
        clearSession();
        window.location.href = redirectUrl;
      }
    }, 5000);
  });
  
