import {
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc
} from "./firebase.js";


/* =====================================
   ELEMENT
===================================== */

const loginBox =
  document.getElementById("loginBox");

const adminDashboard =
  document.getElementById("adminDashboard");

const loginBtn =
  document.getElementById("loginBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const emailInput =
  document.getElementById("adminEmail");

const passwordInput =
  document.getElementById("adminPassword");

const loginError =
  document.getElementById("loginError");

const orders =
  document.getElementById("orders");

const filterStatus =
  document.getElementById("filterStatus");

const totalOrders =
  document.getElementById("totalOrders");

const waitingOrders =
  document.getElementById("waitingOrders");

const confirmedOrders =
  document.getElementById("confirmedOrders");

const doneOrders =
  document.getElementById("doneOrders");


let allOrders = [];

let unsubscribeOrders = null;


/* =====================================
   LOGIN
===================================== */

loginBtn.addEventListener(
  "click",
  async () => {

    const email =
      emailInput.value.trim();

    const password =
      passwordInput.value;


    loginError.textContent = "";


    if (!email) {

      loginError.textContent =
        "Email wajib diisi.";

      return;
    }


    if (!password) {

      loginError.textContent =
        "Password wajib diisi.";

      return;
    }


    loginBtn.disabled = true;

    loginBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> LOGIN...';


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    }

    catch (error) {

      console.error(error);

      loginError.textContent =
        firebaseError(error.code);

      loginBtn.disabled = false;

      loginBtn.innerHTML =
        '<i class="fa-solid fa-right-to-bracket"></i> LOGIN ADMIN';

    }

  }
);


/* =====================================
   ERROR FIREBASE
===================================== */

function firebaseError(code) {

  switch (code) {

    case "auth/invalid-credential":
      return "Email atau password salah.";

    case "auth/user-not-found":
      return "Akun admin tidak ditemukan.";

    case "auth/wrong-password":
      return "Password salah.";

    case "auth/invalid-email":
      return "Format email tidak valid.";

    case "auth/too-many-requests":
      return "Terlalu banyak percobaan. Coba lagi nanti.";

    default:
      return "Login gagal: " + code;

  }

}


/* =====================================
   AUTH
===================================== */

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      loginBox.style.display =
        "none";

      adminDashboard.style.display =
        "block";

      loadOrders();

    }

    else {

      loginBox.style.display =
        "block";

      adminDashboard.style.display =
        "none";

    }

  }
);


/* =====================================
   LOGOUT
===================================== */

logoutBtn.addEventListener(
  "click",
  async () => {

    await signOut(auth);

  }
);


/* =====================================
   LOAD FIRESTORE
===================================== */

function loadOrders() {

  if (unsubscribeOrders) {

    unsubscribeOrders();

  }


  const q =
    query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );


  unsubscribeOrders =
    onSnapshot(
      q,
      (snapshot) => {

        allOrders = [];


        snapshot.forEach(
          (item) => {

            allOrders.push({

              id: item.id,

              ...item.data()

            });

          }
        );


        updateStats();

        renderOrders();

      },

      (error) => {

        console.error(error);

        orders.innerHTML =
          `
          <div class="loading">

            Gagal mengambil pesanan.

            <br><br>

            ${error.message}

          </div>
          `;

      }
    );

}


/* =====================================
   STATISTIK
===================================== */

function updateStats() {

  totalOrders.textContent =
    allOrders.length;


  waitingOrders.textContent =
    allOrders.filter(
      x =>
        x.status ===
        "Menunggu Konfirmasi"
    ).length;


  confirmedOrders.textContent =
    allOrders.filter(
      x =>
        x.status ===
        "Pesanan Dikonfirmasi"
    ).length;


  doneOrders.textContent =
    allOrders.filter(
      x =>
        x.status ===
        "Selesai"
    ).length;

}


/* =====================================
   FILTER
===================================== */

filterStatus.addEventListener(
  "change",
  renderOrders
);


/* =====================================
   RENDER
===================================== */

function renderOrders() {

  const filter =
    filterStatus.value;


  let data =
    allOrders;


  if (filter) {

    data =
      allOrders.filter(
        x =>
          x.status === filter
      );

  }


  if (!data.length) {

    orders.innerHTML =
      `
      <div class="loading">
        Belum ada pesanan.
      </div>
      `;

    return;

  }


  orders.innerHTML = "";


  data.forEach(
    renderOrder
  );

}


/* =====================================
   ORDER CARD
===================================== */

function renderOrder(order) {

  const card =
    document.createElement("div");

  card.className =
    "order-card";


  const total =
    Number(
      order.total || 0
    ).toLocaleString("id-ID");


  card.innerHTML = `

    <div class="order-title">

      <strong>
        ${order.invoice || "Pesanan"}
      </strong>

      <span>
        ${order.status || "Menunggu Konfirmasi"}
      </span>

    </div>


    <p>
      <b>Customer:</b>
      ${order.customerName || "-"}
    </p>


    <p>
      <b>WhatsApp:</b>
      ${order.customerPhone || "-"}
    </p>


    <p>
      <b>Layanan:</b>
      ${order.service || "-"}
    </p>


    <p>
      <b>Paket:</b>
      ${order.package || "-"}
    </p>


    <p>
      <b>Jumlah:</b>
      ${order.qty || 1}
    </p>


    <p>
      <b>Tanggal:</b>
      ${order.date || "-"}
    </p>


    <p>
      <b>Jam:</b>
      ${order.time || "-"}
    </p>


    <p>
      <b>Alamat:</b>
      ${formatAddress(order.address)}
    </p>


    <p>
      <b>Total:</b>
      Rp${total}
    </p>


    <div class="order-buttons"></div>

  `;


  const buttons =
    card.querySelector(
      ".order-buttons"
    );


  const status =
    order.status ||
    "Menunggu Konfirmasi";


  if (
    status ===
    "Menunggu Konfirmasi"
  ) {

    const button =
      document.createElement("button");

    button.type =
      "button";

    button.className =
      "confirm";

    button.innerHTML =
      '<i class="fa-solid fa-check"></i> KONFIRMASI PESANAN';


    button.onclick =
      () => confirmOrder(order.id);


    buttons.appendChild(
      button
    );

  }


  if (
    status ===
    "Pesanan Dikonfirmasi"
  ) {

    const button =
      document.createElement("button");

    button.type =
      "button";

    button.className =
      "confirm";

    button.innerHTML =
      '<i class="fa-solid fa-check-double"></i> PESANAN SELESAI';


    button.onclick =
      () => finishOrder(order.id);


    buttons.appendChild(
      button
    );

  }


  orders.appendChild(
    card
  );

}


/* =====================================
   KONFIRMASI
===================================== */

async function confirmOrder(id) {

  try {

    await updateDoc(
      doc(
        db,
        "orders",
        id
      ),
      {
        status:
          "Pesanan Dikonfirmasi"
      }
    );

  }

  catch (error) {

    alert(
      "Gagal konfirmasi:\n" +
      error.message
    );

  }

}


/* =====================================
   SELESAI
===================================== */

async function finishOrder(id) {

  try {

    await updateDoc(
      doc(
        db,
        "orders",
        id
      ),
      {
        status:
          "Selesai"
      }
    );

  }

  catch (error) {

    alert(
      "Gagal mengubah status:\n" +
      error.message
    );

  }

}


/* =====================================
   ALAMAT
===================================== */

function formatAddress(address) {

  if (!address) {

    return "-";

  }


  if (
    typeof address ===
    "string"
  ) {

    return address;

  }


  return [
    address.label,
    address.address,
    address.detail
  ]
    .filter(Boolean)
    .join(", ") || "-";

}