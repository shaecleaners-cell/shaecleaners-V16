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
} from "firebase.js";


/* =========================================
   ELEMENT SESUAI ADMIN.HTML
========================================= */

const loginBox =
  document.getElementById("loginBox");

const adminPanel =
  document.getElementById("adminPanel");

const loginBtn =
  document.getElementById("loginBtn");

const logoutBtn =
  document.getElementById("logoutBtn");

const adminEmail =
  document.getElementById("adminEmail");

const adminPassword =
  document.getElementById("adminPassword");

const loginError =
  document.getElementById("loginError");

const ordersList =
  document.getElementById("ordersList");


let unsubscribeOrders = null;


/* =========================================
   CEK ELEMENT
========================================= */

console.log("SHAE ADMIN JS AKTIF");

console.log({
  loginBox,
  adminPanel,
  loginBtn,
  logoutBtn,
  adminEmail,
  adminPassword,
  loginError,
  ordersList
});


/* =========================================
   LOGIN
========================================= */

loginBtn.addEventListener("click", async function () {

  console.log("TOMBOL LOGIN DIKLIK");

  const email =
    adminEmail.value.trim();

  const password =
    adminPassword.value;


  loginError.textContent = "";


  if (!email) {

    loginError.textContent =
      "Email admin wajib diisi.";

    adminEmail.focus();

    return;
  }


  if (!password) {

    loginError.textContent =
      "Password wajib diisi.";

    adminPassword.focus();

    return;
  }


  loginBtn.disabled = true;

  loginBtn.textContent =
    "LOGIN...";


  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );


    console.log(
      "LOGIN BERHASIL"
    );


  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );


    if (
      error.code ===
      "auth/invalid-credential"
    ) {

      loginError.textContent =
        "Email atau password salah.";

    } else if (
      error.code ===
      "auth/user-not-found"
    ) {

      loginError.textContent =
        "Akun admin tidak ditemukan.";

    } else if (
      error.code ===
      "auth/wrong-password"
    ) {

      loginError.textContent =
        "Password salah.";

    } else if (
      error.code ===
      "auth/invalid-email"
    ) {

      loginError.textContent =
        "Format email tidak valid.";

    } else {

      loginError.textContent =
        error.message;

    }


    loginBtn.disabled = false;

    loginBtn.textContent =
      "LOGIN ADMIN";

  }

});


/* =========================================
   LOGOUT
========================================= */

logoutBtn.addEventListener(
  "click",
  async function () {

    try {

      await signOut(auth);

    } catch (error) {

      console.error(
        "LOGOUT ERROR:",
        error
      );

    }

  }
);


/* =========================================
   AUTH STATE
========================================= */

onAuthStateChanged(
  auth,
  function (user) {

    console.log(
      "AUTH:",
      user
    );


    if (user) {

      loginBox.style.display =
        "none";

      adminPanel.style.display =
        "block";

      loadOrders();

    } else {

      loginBox.style.display =
        "block";

      adminPanel.style.display =
        "none";


      if (unsubscribeOrders) {

        unsubscribeOrders();

        unsubscribeOrders =
          null;

      }

    }

  }
);


/* =========================================
   LOAD PESANAN
========================================= */

function loadOrders() {

  if (!auth.currentUser) {

    return;

  }


  if (unsubscribeOrders) {

    unsubscribeOrders();

  }


  ordersList.innerHTML =
    `
    <div class="empty">
      Memuat pesanan...
    </div>
    `;


  const ordersQuery =
    query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );


  unsubscribeOrders =
    onSnapshot(
      ordersQuery,

      function (snapshot) {

        if (snapshot.empty) {

          ordersList.innerHTML =
            `
            <div class="empty">
              Belum ada pesanan.
            </div>
            `;

          return;

        }


        ordersList.innerHTML = "";


        snapshot.forEach(
          function (item) {

            renderOrder(
              item.id,
              item.data()
            );

          }
        );

      },

      function (error) {

        console.error(
          "FIRESTORE ERROR:",
          error
        );


        ordersList.innerHTML =
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
   TAMPILKAN PESANAN
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


  card.innerHTML =
    `
    <div>

      <strong>
        ${order.invoice || "Pesanan"}
      </strong>

    </div>

    <br>

    <div>

      <b>Customer:</b>
      ${order.customerName || "-"}

      <br>

      <b>WhatsApp:</b>
      ${order.customerPhone || "-"}

      <br><br>

      <b>Layanan:</b>
      ${order.service || "-"}

      <br>

      <b>Paket:</b>
      ${order.package || "-"}

      <br>

      <b>Jumlah:</b>
      ${order.qty || 1}

      <br><br>

      <b>Tanggal:</b>
      ${order.date || "-"}

      <br>

      <b>Jam:</b>
      ${order.time || "-"}

      <br><br>

      <b>Pembayaran:</b>
      ${order.payment || "-"}

      <br><br>

      <b>Alamat:</b>
      ${formatAddress(order.address)}

      <br><br>

      <b>Total:</b>
      Rp${total}

      <br><br>

      <b>Status:</b>
      ${status}

    </div>

    <div class="order-action"></div>
    `;


  const action =
    card.querySelector(
      ".order-action"
    );


  /* ================================
     TOMBOL KONFIRMASI
  ================================= */

  if (
    status ===
    "Menunggu Konfirmasi"
  ) {

    const button =
      document.createElement("button");

    button.className =
      "confirm";

    button.type =
      "button";

    button.textContent =
      "KONFIRMASI PESANAN";


    button.addEventListener(
      "click",
      function () {

        confirmOrder(orderId);

      }
    );


    action.appendChild(button);

  }


  /* ================================
     TOMBOL SELESAI
  ================================= */

  if (
    status ===
    "Pesanan Dikonfirmasi"
  ) {

    const button =
      document.createElement("button");

    button.type =
      "button";

    button.textContent =
      "PESANAN SELESAI";


    button.addEventListener(
      "click",
      function () {

        finishOrder(orderId);

      }
    );


    action.appendChild(button);

  }


  ordersList.appendChild(
    card
  );

}


/* =========================================
   KONFIRMASI PESANAN
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


    alert(
      "Pesanan berhasil dikonfirmasi."
    );


  } catch (error) {

    console.error(error);

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


    alert(
      "Pesanan ditandai selesai."
    );


  } catch (error) {

    console.error(error);

    alert(
      "Gagal mengubah status:\n" +
      error.message
    );

  }

}


/* =========================================
   ALAMAT
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
   REFRESH DARI HTML
========================================= */

window.loadOrders =
  loadOrders;