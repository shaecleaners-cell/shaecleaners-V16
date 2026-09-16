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


const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

const emailInput = document.getElementById("adminEmail");
const passwordInput = document.getElementById("adminPassword");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginError = document.getElementById("loginError");
const ordersList = document.getElementById("ordersList");


/* ===============================
   LOGIN
================================ */

loginBtn.addEventListener("click", async () => {

  const email = emailInput.value.trim();
  const password = passwordInput.value;

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
      "Login gagal: " + error.message;

    loginBtn.disabled = false;
    loginBtn.textContent = "LOGIN ADMIN";
  }

});


/* ===============================
   LOGOUT
================================ */

logoutBtn.addEventListener("click", async () => {

  try {

    await signOut(auth);

  } catch (error) {

    console.error(error);

  }

});


/* ===============================
   AUTH STATUS
================================ */

onAuthStateChanged(auth, (user) => {

  if (user) {

    loginBox.style.display = "none";
    adminPanel.style.display = "block";

    loadOrders();

  } else {

    loginBox.style.display = "block";
    adminPanel.style.display = "none";

  }

});


/* ===============================
   LOAD ORDERS
================================ */

function loadOrders() {

  const q = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(q, (snapshot) => {

    if (snapshot.empty) {

      ordersList.innerHTML =
        "<p>Belum ada pesanan.</p>";

      return;
    }


    ordersList.innerHTML = "";


    snapshot.forEach((item) => {

      const order = item.data();

      const card =
        document.createElement("div");

      card.className = "order-card";


      card.innerHTML = `
        <b>Invoice:</b>
        ${order.invoice || "-"}
        <br><br>

        <b>Nama:</b>
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

        <b>Total:</b>
        Rp${Number(order.total || 0)
          .toLocaleString("id-ID")}
        <br><br>

        <b>Alamat:</b>
        ${getAddress(order.address)}
        <br><br>

        <b>Tanggal:</b>
        ${order.date || "-"}
        <br>

        <b>Jam:</b>
        ${order.time || "-"}
        <br><br>

        <b>Status:</b>
        <span>${order.status || "-"}</span>

        <div class="action"></div>
      `;


      const action =
        card.querySelector(".action");


      if (
        order.status ===
        "Menunggu Konfirmasi"
      ) {

        const button =
          document.createElement("button");

        button.className = "confirm";

        button.textContent =
          "KONFIRMASI PESANAN";

        button.addEventListener(
          "click",
          () => confirmOrder(item.id)
        );

        action.appendChild(button);

      } else {

        const info =
          document.createElement("p");

        info.innerHTML =
          "✅ Pesanan sudah dikonfirmasi.";

        action.appendChild(info);

      }


      ordersList.appendChild(card);

    });

  }, (error) => {

    console.error(error);

    ordersList.innerHTML =
      `<p class="error">
        Gagal mengambil pesanan:<br>
        ${error.message}
      </p>`;

  });

}


/* ===============================
   CONFIRM ORDER
================================ */

async function confirmOrder(orderId) {

  try {

    await updateDoc(
      doc(db, "orders", orderId),
      {
        status: "Pesanan Dikonfirmasi"
      }
    );

    alert("Pesanan berhasil dikonfirmasi.");

  } catch (error) {

    console.error(error);

    alert(
      "Gagal mengkonfirmasi pesanan:\n" +
      error.message
    );

  }

}


/* ===============================
   ADDRESS
================================ */

function getAddress(address) {

  if (!address) return "-";

  if (typeof address === "string") {
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