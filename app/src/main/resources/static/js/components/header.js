/*
  Step-by-Step Explanation of Header Section Rendering

  This code dynamically renders the header section of the page based on the user's role, session status, and available actions (such as login, logout, or role-switching).

  1. Define the `renderHeader` Function

     * The `renderHeader` function is responsible for rendering the entire header based on the user's session, role, and whether they are logged in.

  2. Select the Header Div

     * The `headerDiv` variable retrieves the HTML element with the ID `header`, where the header content will be inserted.
       ```javascript
       const headerDiv = document.getElementById("header");
       ```

  3. Check if the Current Page is the Root Page

     * The `window.location.pathname` is checked to see if the current page is the root (`/`). If true, the user's session data (role) is removed from `localStorage`, and the header is rendered without any user-specific elements (just the logo and site title).
       ```javascript
       if (window.location.pathname.endsWith("/")) {
         localStorage.removeItem("userRole");
         headerDiv.innerHTML = `
           <header class="header">
             <div class="logo-section">
               <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
               <span class="logo-title">Hospital CMS</span>
             </div>
           </header>`;
         return;
       }
       ```

  4. Retrieve the User's Role and Token from LocalStorage

     * The `role` (user role like admin, patient, doctor) and `token` (authentication token) are retrieved from `localStorage` to determine the user's current session.
       ```javascript
       const role = localStorage.getItem("userRole");
       const token = localStorage.getItem("token");
       ```

  5. Initialize Header Content

     * The `headerContent` variable is initialized with basic header HTML (logo section), to which additional elements will be added based on the user's role.
       ```javascript
       let headerContent = `<header class="header">
         <div class="logo-section">
           <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
           <span class="logo-title">Hospital CMS</span>
         </div>
         <nav>`;
       ```

  6. Handle Session Expiry or Invalid Login

     * If a user with a role like `loggedPatient`, `admin`, or `doctor` does not have a valid `token`, the session is considered expired or invalid. The user is logged out, and a message is shown.
       ```javascript
       if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
         localStorage.removeItem("userRole");
         alert("Session expired or invalid login. Please log in again.");
         window.location.href = "/";   or a specific login page
         return;
       }
       ```

  7. Add Role-Specific Header Content

     * Depending on the user's role, different actions or buttons are rendered in the header:
       - **Admin**: Can add a doctor and log out.
       - **Doctor**: Has a home button and log out.
       - **Patient**: Shows login and signup buttons.
       - **LoggedPatient**: Has home, appointments, and logout options.
       ```javascript
       else if (role === "admin") {
         headerContent += `
           <button id="addDocBtn" class="adminBtn" onclick="openModal('addDoctor')">Add Doctor</button>
           <a href="#" onclick="logout()">Logout</a>`;
       } else if (role === "doctor") {
         headerContent += `
           <button class="adminBtn"  onclick="selectRole('doctor')">Home</button>
           <a href="#" onclick="logout()">Logout</a>`;
       } else if (role === "patient") {
         headerContent += `
           <button id="patientLogin" class="adminBtn">Login</button>
           <button id="patientSignup" class="adminBtn">Sign Up</button>`;
       } else if (role === "loggedPatient") {
         headerContent += `
           <button id="home" class="adminBtn" onclick="window.location.href='/pages/loggedPatientDashboard.html'">Home</button>
           <button id="patientAppointments" class="adminBtn" onclick="window.location.href='/pages/patientAppointments.html'">Appointments</button>
           <a href="#" onclick="logoutPatient()">Logout</a>`;
       }
       ```



  9. Close the Header Section



  10. Render the Header Content

     * Insert the dynamically generated `headerContent` into the `headerDiv` element.
       ```javascript
       headerDiv.innerHTML = headerContent;
       ```

  11. Attach Event Listeners to Header Buttons

     * Call `attachHeaderButtonListeners` to add event listeners to any dynamically created buttons in the header (e.g., login, logout, home).
       ```javascript
       attachHeaderButtonListeners();
       ```


  ### Helper Functions

  13. **attachHeaderButtonListeners**: Adds event listeners to login buttons for "Doctor" and "Admin" roles. If clicked, it opens the respective login modal.

  14. **logout**: Removes user session data and redirects the user to the root page.

  15. **logoutPatient**: Removes the patient's session token and redirects to the patient dashboard.

  16. **Render the Header**: Finally, the `renderHeader()` function is called to initialize the header rendering process when the page loads.
*/
   import { openModal } from "./util.js";

/*
  Step-by-Step Explanation of Header Section Rendering

  This code dynamically renders the header section of the page based on the user's role,
  session status, and available actions such as login, logout, or role-switching.
*/

/*
  Define the renderHeader function
  This function is responsible for rendering the entire header based on the user's session and role
*/
export function renderHeader() {
    const headerDiv = document.getElementById("header");

    if (!headerDiv) return;

    /*
      Check if the current page is the root page
      If true, clear role/session and render a simple header
    */
    const currentPath = window.location.pathname;

    if (currentPath.endsWith("/") || currentPath.endsWith("index.html")) {
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

    /*
      Retrieve the user's role and token from localStorage
    */
    const role = localStorage.getItem("userRole") || localStorage.getItem("role");
    const token = localStorage.getItem("token");

    /*
      Handle session expiry or invalid login
    */
    if ((role === "loggedPatient" || role === "admin" || role === "doctor") && !token) {
        localStorage.removeItem("userRole");
        localStorage.removeItem("role");
        alert("Session expired or invalid login. Please log in again.");
        window.location.href = "index.html";
        return;
    }

    /*
      Initialize header content
    */
    let headerContent = `
        <header class="header">
            <div class="logo-section">
                <img src="../assets/images/logo/logo.png" alt="Hospital CRM Logo" class="logo-img">
                <span class="logo-title">Hospital CMS</span>
            </div>
            <nav class="header-nav">
    `;

    /*
      Add role-specific header content
    */
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

    /*
      Close the header section
    */
    headerContent += `
            </nav>
        </header>
    `;

    /*
      Render the header content
    */
    headerDiv.innerHTML = headerContent;

    /*
      Attach event listeners to dynamically created buttons
    */
    attachHeaderButtonListeners();
}

/*
  Helper Function: attachHeaderButtonListeners
  Adds event listeners to buttons rendered inside the header
*/
function attachHeaderButtonListeners() {
    const addDocBtn = document.getElementById("addDocBtn");
    const doctorHomeBtn = document.getElementById("doctorHomeBtn");
    const patientLoginBtn = document.getElementById("patientLogin");
    const patientSignupBtn = document.getElementById("patientSignup");
    const homeBtn = document.getElementById("home");
    const patientAppointmentsBtn = document.getElementById("patientAppointments");
    const logoutLink = document.getElementById("logoutLink");
    const logoutPatientLink = document.getElementById("logoutPatientLink");

    if (addDocBtn) {
        addDocBtn.addEventListener("click", () => {
            openModal("addDoctor");
        });
    }

    if (doctorHomeBtn) {
        doctorHomeBtn.addEventListener("click", () => {
            window.location.href = "doctorDashboard.html";
        });
    }

    if (patientLoginBtn) {
        patientLoginBtn.addEventListener("click", () => {
            openModal("patientLogin");
        });
    }

    if (patientSignupBtn) {
        patientSignupBtn.addEventListener("click", () => {
            openModal("patientSignup");
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

/*
  Helper Function: logout
  Removes user session data and redirects the user to the root page
*/
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

/*
  Helper Function: logoutPatient
  Removes the patient's session token and redirects to the patient dashboard/root page
*/
function logoutPatient() {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("role");
    window.location.href = "index.html";
}

/*
  Expose logout helpers globally if needed by other scripts
*/
window.logout = logout;
window.logoutPatient = logoutPatient;

/*
  Render the header when the page loads
*/
document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
});
