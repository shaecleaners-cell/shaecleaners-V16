/* ==========================================
   SHAE CLEANERS
   LOGIN
   TANPA FIREBASE
========================================== */


/* ================= LOGIN ================= */

function loginUser(event) {

  event.preventDefault();


  const phone =
    document
      .getElementById("phone")
      .value
      .trim();


  const password =
    document
      .getElementById("password")
      .value;


  const error =
    document.getElementById(
      "loginError"
    );


  error.textContent = "";


  if (!phone || !password) {

    error.textContent =
      "Nomor WhatsApp dan password wajib diisi.";

    return;

  }


  const users =
    getUsers();


  const user =
    users.find(
      item =>
        item.phone ===
          normalizePhone(phone) &&
        item.password ===
          password
    );


  if (!user) {

    error.textContent =
      "Nomor WhatsApp atau password salah.";

    return;

  }


  /*
    Simpan sesi login
  */

  localStorage.setItem(

    "shaeCurrentUser",

    JSON.stringify(user)

  );


  /*
    Cek halaman tujuan
  */

  const redirect =
    localStorage.getItem(
      "shaeLoginRedirect"
    );


  localStorage.removeItem(
    "shaeLoginRedirect"
  );


  window.location.href =
    redirect ||
    "index.html";

}


/* ================= USERS ================= */

function getUsers() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "shaeUsers"
      )
    ) || [];

  } catch {

    return [];

  }

}


/* ================= PHONE ================= */

function normalizePhone(phone) {

  let value =
    phone.replace(
      /\D/g,
      ""
    );


  if (
    value.startsWith("62")
  ) {

    return "0" +
      value.substring(2);

  }


  if (
    value.startsWith("8")
  ) {

    return "0" +
      value;

  }


  return value;

}


/* ================= PASSWORD ================= */

function togglePassword() {

  const input =
    document.getElementById(
      "password"
    );


  const icon =
    document.getElementById(
      "eyeIcon"
    );


  if (
    input.type ===
    "password"
  ) {

    input.type =
      "text";

    icon.className =
      "fa-solid fa-eye-slash";

  } else {

    input.type =
      "password";

    icon.className =
      "fa-solid fa-eye";

  }

}


/* ================= REGISTER ================= */

function goRegister() {

  window.location.href =
    "register.html";

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

    const current =
      localStorage.getItem(
        "shaeCurrentUser"
      );


    /*
      Jika sudah login,
      jangan kembali ke login.
    */

    if (current) {

      const redirect =
        localStorage.getItem(
          "shaeLoginRedirect"
        );


      if (redirect) {

        localStorage.removeItem(
          "shaeLoginRedirect"
        );

        window.location.href =
          redirect;

      }

    }

  }
);