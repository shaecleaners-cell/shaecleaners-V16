/* ==========================================
   SHAE CLEANERS
   AKUN
   TANPA FIREBASE
========================================== */


/* ================= LOAD USER ================= */

function loadAccount() {

  const saved =
    localStorage.getItem(
      "shaeCurrentUser"
    );


  if (!saved) {

    showGuest();

    return;

  }


  try {

    const user =
      JSON.parse(saved);


    showUser(user);

  } catch {

    showGuest();

  }

}


/* ================= USER ================= */

function showUser(user) {

  const name =
    user.name ||
    "Customer";


  const phone =
    user.phone ||
    "-";


  document.getElementById(
    "userName"
  ).textContent =
    name;


  document.getElementById(
    "userPhone"
  ).textContent =
    phone;


  document.getElementById(
    "avatarLetter"
  ).textContent =
    name
      .charAt(0)
      .toUpperCase();


  document.getElementById(
    "profileAction"
  ).textContent =
    "Profil";


  document.getElementById(
    "logoutButton"
  ).style.display =
    "block";

}


/* ================= GUEST ================= */

function showGuest() {

  document.getElementById(
    "userName"
  ).textContent =
    "Tamu";


  document.getElementById(
    "userPhone"
  ).textContent =
    "Silakan login untuk menggunakan akun";


  document.getElementById(
    "avatarLetter"
  ).textContent =
    "S";


  document.getElementById(
    "profileAction"
  ).textContent =
    "Login";


  document.getElementById(
    "logoutButton"
  ).style.display =
    "none";

}


/* ================= PROFILE ================= */

function profileAction() {

  const user =
    localStorage.getItem(
      "shaeCurrentUser"
    );


  if (user) {

    editProfile();

  } else {

    localStorage.setItem(
      "shaeLoginRedirect",
      "akun.html"
    );


    window.location.href =
      "login.html";

  }

}


/* ================= EDIT ================= */

function editProfile() {

  alert(
    "Menu edit profil akan kita buat berikutnya."
  );

}


/* ================= ORDERS ================= */

function openOrders() {

  const user =
    localStorage.getItem(
      "shaeCurrentUser"
    );


  if (!user) {

    requireLogin(
      "akun.html"
    );

    return;

  }


  window.location.href =
    "invoice.html";

}


/* ================= TRACKING ================= */

function openTracking() {

  window.location.href =
    "tracking.html";

}


/* ================= ADDRESS ================= */

function openAddress() {

  const user =
    localStorage.getItem(
      "shaeCurrentUser"
    );


  if (!user) {

    requireLogin(
      "akun.html"
    );

    return;

  }


  alert(
    "Menu Alamat akan kita buat berikutnya."
  );

}


/* ================= FAVORITE ================= */

function openFavorite() {

  alert(
    "Menu Favorit akan kita buat berikutnya."
  );

}


/* ================= NOTIFICATION ================= */

function openNotifications() {

  alert(
    "Menu Notifikasi akan kita buat berikutnya."
  );

}


/* ================= SETTINGS ================= */

function openSettings() {

  alert(
    "Menu Pengaturan akan kita buat berikutnya."
  );

}


/* ================= HELP ================= */

function contactHelp() {

  const ADMIN_NUMBER =
    "";


  const message =
    "Halo Shae Cleaners, saya membutuhkan bantuan.";


  const url =
    ADMIN_NUMBER

      ? `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(message)}`

      : `https://wa.me/?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank"
  );

}


/* ================= LOGIN ================= */

function requireLogin(redirect) {

  localStorage.setItem(
    "shaeLoginRedirect",
    redirect
  );


  window.location.href =
    "login.html";

}


/* ================= LOGOUT ================= */

function logoutUser() {

  const yakin =
    confirm(
      "Apakah Anda yakin ingin keluar?"
    );


  if (!yakin) {

    return;

  }


  localStorage.removeItem(
    "shaeCurrentUser"
  );


  alert(
    "Anda telah keluar dari akun."
  );


  loadAccount();

}


/* ================= HOME ================= */

function goHome() {

  window.location.href =
    "index.html";

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadAccount();

  }
);