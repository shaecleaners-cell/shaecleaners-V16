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


/* =========================================
   ELEMENT
========================================= */

const loginBox =
  document.getElementById("loginBox");

const adminDashboard =
  document.getElementById("adminDashboard");

const emailInput =
  document.getElementById("adminEmail");

const passwordInput =
  document.getElementById("adminPassword");

const loginError =
  document.getElementById("loginError");

const orderList =
  document.getElementById("orderList");

const newCount =
  document.getElementById("newCount");

const confirmedCount =
  document.getElementById("confirmedCount");

const doneCount =
  document.getElementById("doneCount");


let unsubscribeOrders = null;


/* =========================================
   LOGIN ADMIN
========================================= */

async function loginAdmin() {

  const email =
    emailInput.value.trim();

  const password =
    passwordInput.value.trim();

  loginError.textContent = "";


  if (!email) {

    loginError.textContent =
      "Email admin wajib diisi.";

    emailInput.focus();

    return;
  }


  if (!password) {

    loginError.textContent =
      "Password wajib diisi.";

    passwordInput.focus();

    return;
  }


  const button =
    document.querySelector(".primary-button");

  button.disabled = true;

  button.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Login...';


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );


    let message =
      "Login gagal.";


    if (
      error.code ===
      "auth/invalid-credential"
    ) {

      message =
        "Email atau password salah.";

    } else if (
      error.code ===
      "auth/user-not-found"
    ) {

      message =
        "Akun admin tidak ditemukan.";

    } else if (
      error.code ===
      "auth/wrong-password"
    ) {

      message =
        "Password salah.";

    } else if (
      error.code ===
      "auth/invalid-email"
    ) {

      message =
        "Format email tidak valid.";

    } else {

      message =
        error.message;
    }


    loginError.textContent = message;


    button.disabled = false;

    button.innerHTML =
      '<i class="fa-solid fa-right-to-bracket"></i> Login Admin';

  }

}


/* =========================================
   LOGOUT
========================================= */

async function logoutAdmin() {

  try {

    await signOut(auth);

  } catch (error) {

    console.error(
      "LOGOUT ERROR:",
      error
    );

  }

}


/* =========================================
   AUTH CHECK
========================================= */

onAuthStateChanged(
  auth,
  (user) => {

    if (user) {

      console.log(
        "Admin login:",
        user.email
      );


      loginBox.style.display =
        "none";

      adminDashboard.style.display =
        "block";


      loadOrders();

    } else {

      loginBox.style.display =
        "block";

      adminDashboard.style.display =
        "none";


      if (unsubscribeOrders) {

        unsubscribeOrders();

        unsubscribeOrders = null;

      }

    }

  }
);


/* =========================================
   LOAD ORDERS
========================================= */

function loadOrders() {

  if (!auth.currentUser) {

    return;
  }


  if (unsubscribeOrders) {

    unsubscribeOrders();

  }


  orderList.innerHTML =
    '<div class="empty">Memuat pesanan...</div>';


  const ordersQuery =
    query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );


  unsubscribeOrders =
    onSnapshot(
      ordersQuery,

      (snapshot) => {

        let newTotal = 0;
        let confirmedTotal = 0;
        let doneTotal = 0;


        if (snapshot.empty) {

          orderList.innerHTML =
            '<div class="empty">Belum ada pesanan.</div>';

          updateStats(
            0,
            0,
            0
          );

          return;
        }


        orderList.innerHTML = "";


        snapshot.forEach(
          (item) => {

            const order =
              item.data();


            if (
              order.status ===
              "Menunggu Konfirmasi"
            ) {

              newTotal++;

            }


            if (
              order.status ===
              "Pesanan Dikonfirmasi"
            ) {

              confirmedTotal++;

            }


            if (
              order.status ===
              "Selesai"
            ) {

              doneTotal++;

            }


            renderOrder(
              item.id,
              order
            );

          }
        );


        updateStats(
          newTotal,
          confirmedTotal,
          doneTotal
        );

      },

      (error) => {

        console.error(
          "FIRESTORE ERROR:",
          error
        );


        orderList.innerHTML =
          `
          <div class="empty">
            Gagal mengambil pesanan.<br><br>
            ${error.message}
          </div>
          `;

      }
    );

}


/* =========================================
   RENDER ORDER
========================================= */

function renderOrder(
  orderId,
  order
) {

  const card =
    document.createElement("div");

  card.className =
    "order-card";


  const total =
    Number(
      order.total || 0
    ).toLocaleString("id-ID");


  const status =
    order.status ||
    "Menunggu Konfirmasi";


  card.innerHTML = `

    <div class="order-header">

      <strong>
        ${order.invoice || "Pesanan"}
      </strong>

      <span>
        ${status}
      </span>

    </div>


    <div class="order-info">

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
        <b>Pembayaran:</b>
        ${order.payment || "-"}
      </p>

      <p>
        <b>Alamat:</b>
        ${formatAddress(order.address)}
      </p>

      <p>
        <b>Total:</b>
        Rp${total}
      </p>

      ${
        order.note
          ? `
          <p>
            <b>Catatan:</b>
            ${order.note}
          </p>
          `
          : ""
      }

    </div>

    <div class="order-actions"></div>

  `;


  const actions =
    card.querySelector(
      ".order-actions"
    );


  if (
    status ===
    "Menunggu Konfirmasi"
  ) {

    const confirmButton =
      document.createElement("button");


    confirmButton.className =
      "primary-button";


    confirmButton.innerHTML =
      '<i class="fa-solid fa-check"></i> Konfirmasi Pesanan';


    confirmButton.onclick =
      () => confirmOrder(orderId);


    actions.appendChild(
      confirmButton
    );

  }


  if (
    status ===
    "Pesanan Dikonfirmasi"
  ) {

    const doneButton =
      document.createElement("button");


    doneButton.className =
      "primary-button";


    doneButton.innerHTML =
      '<i class="fa-solid fa-check-double"></i> Tandai Selesai';


    doneButton.onclick =
      () => finishOrder(orderId);


    actions.appendChild(
      doneButton
    );

  }


  orderList.appendChild(
    card
  );

}


/* =========================================
   CONFIRM
========================================= */

async function confirmOrder(
  orderId
) {

  try {

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {
        status:
          "Pesanan Dikonfirmasi"
      }
    );

  } catch (error) {

    console.error(
      error
    );

    alert(
      "Gagal konfirmasi:\n" +
      error.message
    );

  }

}


/* =========================================
   SELESAI
========================================= */

async function finishOrder(
  orderId
) {

  try {

    await updateDoc(
      doc(
        db,
        "orders",
        orderId
      ),
      {
        status:
          "Selesai"
      }
    );

  } catch (error) {

    console.error(
      error
    );

    alert(
      "Gagal mengubah status:\n" +
      error.message
    );

  }

}


/* =========================================
   STAT
========================================= */

function updateStats(
  baru,
  confirmed,
  selesai
) {

  newCount.textContent =
    baru;

  confirmedCount.textContent =
    confirmed;

  doneCount.textContent =
    selesai;

}


/* =========================================
   ADDRESS
========================================= */

function formatAddress(
  address
) {

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


/* =========================================
   PENTING
   Karena HTML menggunakan onclick=""
========================================= */

window.loginAdmin =
  loginAdmin;

window.logoutAdmin =
  logoutAdmin;

window.loadOrders =
  loadOrders;