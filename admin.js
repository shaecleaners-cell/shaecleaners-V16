import {
  auth,
  db,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc
} from "./firebase.js";


/* ================= ELEMENT ================= */

const loginBox = document.getElementById("loginBox");
const adminDashboard = document.getElementById("adminDashboard");

const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginError = document.getElementById("loginError");

const ordersBox = document.getElementById("orders");

const totalOrders = document.getElementById("totalOrders");
const waitingOrders = document.getElementById("waitingOrders");
const confirmedOrders = document.getElementById("confirmedOrders");
const doneOrders = document.getElementById("doneOrders");

const filterStatus = document.getElementById("filterStatus");


/* ================= LOGIN ================= */

loginBtn.addEventListener("click", async () => {

  const email = adminEmail.value.trim();
  const password = adminPassword.value;

  loginError.textContent = "";

  if (!email || !password) {
    loginError.textContent =
      "Email dan password wajib diisi.";
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "LOGIN...";

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  } catch (error) {

    console.error(error);

    loginError.textContent =
      "Login gagal. Periksa email dan password.";

    loginBtn.disabled = false;
    loginBtn.textContent = "LOGIN ADMIN";
  }

});


/* ================= AUTH ================= */

onAuthStateChanged(auth, user => {

  if (user) {

    loginBox.style.display = "none";
    adminDashboard.style.display = "block";

    loadOrders();

  } else {

    loginBox.style.display = "block";
    adminDashboard.style.display = "none";

  }

});


/* ================= LOGOUT ================= */

logoutBtn.addEventListener("click", async () => {

  await signOut(auth);

});


/* ================= PESANAN ================= */

let allOrders = [];


function loadOrders() {

  ordersBox.innerHTML =
    `<div class="loading">
      Memuat pesanan...
    </div>`;

  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, snapshot => {

    allOrders = [];

    snapshot.forEach(item => {

      allOrders.push({
        id: item.id,
        ...item.data()
      });

    });

    renderOrders();

  }, error => {

    console.error(error);

    ordersBox.innerHTML =
      `<div class="error">
        Gagal mengambil data pesanan.
        <br>
        Periksa Firestore Rules.
      </div>`;

  });

}


/* ================= RENDER ================= */

function renderOrders() {

  const filter = filterStatus.value;

  let data = allOrders;

  if (filter !== "semua") {

    data = allOrders.filter(
      order => order.status === filter
    );

  }

  updateStats();

  if (!data.length) {

    ordersBox.innerHTML =
      `<div class="empty">
        Belum ada pesanan.
      </div>`;

    return;
  }


  ordersBox.innerHTML = data.map(order => {

    const status = order.status ||
      "Menunggu Konfirmasi";

    return `

      <div class="order-card">

        <div class="order-header">

          <strong>
            ${escapeHTML(order.invoice || "-")}
          </strong>

          <span class="status">
            ${escapeHTML(status)}
          </span>

        </div>


        <div class="order-info">

          <p>
            <b>Nama:</b>
            ${escapeHTML(order.customerName || "-")}
          </p>

          <p>
            <b>WhatsApp:</b>
            ${escapeHTML(order.customerPhone || "-")}
          </p>

          <p>
            <b>Layanan:</b>
            ${escapeHTML(order.service || "-")}
          </p>

          <p>
            <b>Paket:</b>
            ${escapeHTML(order.package || "-")}
          </p>

          <p>
            <b>Jumlah:</b>
            ${order.qty || 1}
          </p>

          <p>
            <b>Tanggal:</b>
            ${escapeHTML(order.date || "-")}
          </p>

          <p>
            <b>Jam:</b>
            ${escapeHTML(order.time || "-")}
          </p>

          <p>
            <b>Alamat:</b>
            ${escapeHTML(order.address || "-")}
          </p>

          <p>
            <b>Total:</b>
            Rp${Number(order.total || 0)
              .toLocaleString("id-ID")}
          </p>

          <p>
            <b>Catatan:</b>
            ${escapeHTML(order.note || "-")}
          </p>

        </div>


        <div class="order-actions">

          ${
            status === "Menunggu Konfirmasi"
            ? `
              <button
                class="confirm-btn"
                onclick="ubahStatus('${order.id}',
                'Pesanan Dikonfirmasi')">
                ✓ KONFIRMASI
              </button>
            `
            : ""
          }


          ${
            status === "Pesanan Dikonfirmasi"
            ? `
              <button
                class="process-btn"
                onclick="ubahStatus('${order.id}',
                'Diproses')">
                ⚙ DIPROSES
              </button>
            `
            : ""
          }


          ${
            status === "Diproses"
            ? `
              <button
                class="done-btn"
                onclick="ubahStatus('${order.id}',
                'Selesai')">
                ✓ SELESAI
              </button>
            `
            : ""
          }


          <a
            class="wa-btn"
            href="https://wa.me/${order.customerPhone}"
            target="_blank">
            WhatsApp
          </a>

        </div>

      </div>

    `;

  }).join("");

}


/* ================= UPDATE STATUS ================= */

window.ubahStatus = async function(id, status) {

  try {

    await updateDoc(
      doc(db, "orders", id),
      {
        status: status
      }
    );

  } catch (error) {

    console.error(error);

    alert(
      "Status gagal diubah.\n" +
      error.message
    );

  }

};


/* ================= STATISTIK ================= */

function updateStats() {

  totalOrders.textContent =
    allOrders.length;

  waitingOrders.textContent =
    allOrders.filter(
      x => x.status === "Menunggu Konfirmasi"
    ).length;

  confirmedOrders.textContent =
    allOrders.filter(
      x =>
        x.status === "Pesanan Dikonfirmasi" ||
        x.status === "Diproses"
    ).length;

  doneOrders.textContent =
    allOrders.filter(
      x => x.status === "Selesai"
    ).length;

}


/* ================= FILTER ================= */

filterStatus.addEventListener(
  "change",
  renderOrders
);


/* ================= SECURITY HTML ================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}