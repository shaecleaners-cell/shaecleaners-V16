/* ==========================================
   SHAE CLEANERS
   REGISTER
   TANPA FIREBASE
========================================== */


/* ================= REGISTER ================= */

function registerUser(event) {

  event.preventDefault();


  const name =
    document
      .getElementById("name")
      .value
      .trim();


  const phone =
    document
      .getElementById("phone")
      .value
      .trim();


  const password =
    document
      .getElementById("password")
      .value;


  const confirmPassword =
    document
      .getElementById("confirmPassword")
      .value;


  const error =
    document.getElementById(
      "registerError"
    );


  error.textContent = "";


  /* NAMA */

  if (name.length < 3) {

    error.textContent =
      "Nama lengkap minimal 3 karakter.";

    return;

  }


  /* NOMOR */

  const cleanPhone =
    normalizePhone(phone);


  if (
    !/^08[0-9]{8,12}$/.test(
      cleanPhone
    )
  ) {

    error.textContent =
      "Nomor WhatsApp tidak valid.";

    return;

  }


  /* PASSWORD */

  if (
    password.length < 6
  ) {

    error.textContent =
      "Password minimal 6 karakter.";

    return;

  }


  /* KONFIRMASI */

  if (
    password !==
    confirmPassword
  ) {

    error.textContent =
      "Konfirmasi password tidak sama.";

    return;

  }


  /* AMBIL USER */

  const users =
    getUsers();


  /* CEK NOMOR */

  const existingUser =
    users.find(
      user =>
        user.phone ===
        cleanPhone
    );


  if (existingUser) {

    error.textContent =
      "Nomor WhatsApp sudah terdaftar.";

    return;

  }


  /* BUAT USER */

  const newUser = {

    id:
      "USR-" +
      Date.now(),

    name:
      name,

    phone:
      cleanPhone,

    password:
      password,

    createdAt:
      new Date().toISOString()

  };


  users.push(
    newUser
  );


  /* SIMPAN */

  localStorage.setItem(

    "shaeUsers",

    JSON.stringify(users)

  );


  /* LOGIN OTOMATIS */

  localStorage.setItem(

    "shaeCurrentUser",

    JSON.stringify(newUser)

  );


  /* PESAN */

  alert(
    "Pendaftaran berhasil! Selamat datang di Shae Cleaners."
  );


  /* KEMBALI KE TUJUAN */

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

    value =
      "0" +
      value.substring(2);

  }


  if (
    value.startsWith("8")
  ) {

    value =
      "0" +
      value;

  }


  return value;

}


/* ================= PASSWORD ================= */

function togglePassword(
  inputId,
  iconId
) {

  const input =
    document.getElementById(
      inputId
    );


  const icon =
    document.getElementById(
      iconId
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


/* ================= LOGIN ================= */

function goLogin() {

  window.location.href =
    "login.html";

}


/* ================= BACK ================= */

function goBack() {

  history.back();

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Jika sudah login,
      arahkan ke halaman utama.
    */

    const currentUser =
      localStorage.getItem(
        "shaeCurrentUser"
      );


    if (currentUser) {

      window.location.href =
        "index.html";

    }

  }
);