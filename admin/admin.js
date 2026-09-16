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

import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
/* ==========================================
   KONFIGURASI ADMIN
========================================== */

/*
   GANTI dengan email akun admin Firebase Anda.
*/

const ADMIN_EMAIL =
  "admin@shaecleaners.store";


let unsubscribeOrders = null;


/* ==========================================
   ELEMENT
========================================== */

const loginBox =
  document.getElementById(
    "loginBox"
  );


const dashboard =
  document.getElementById(
    "adminDashboard"
  );


const orderList =
  document.getElementById(
    "orderList"
  );


/* ==========================================
   LOGIN
========================================== */

window.loginAdmin =
  async function () {

    const email =
      document.getElementById(
        "adminEmail"
      ).value.trim();


    const password =
      document.getElementById(
        "adminPassword"
      ).value;


    const errorBox =
      document.getElementById(
        "loginError"
      );


    errorBox.textContent = "";


    if (!email || !password) {

      errorBox.textContent =
        "Email dan password wajib diisi.";

      return;

    }


    if (
      email.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {

      errorBox.textContent =
        "Akun ini bukan akun admin.";

      return;

    }


    try {

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    } catch (error) {

      console.error(error);

      errorBox.textContent =
        "Login gagal. Periksa email dan password.";

    }

  };


/* ==========================================
   LOGOUT
========================================== */

window.logoutAdmin =
  async function () {

    if (
      confirm(
        "Keluar dari Admin?"
      )
    ) {

      await signOut(auth);

    }

  };


/* ==========================================
   AUTH
========================================== */

onAuthStateChanged(
  auth,
  user => {

    if (!user) {

      loginBox.style.display =
        "block";

      dashboard.style.display =
        "none";

      if (unsubscribeOrders) {

        unsubscribeOrders();

        unsubscribeOrders =
          null;

      }

      return;

    }


    if (
      user.email.toLowerCase() !==
      ADMIN_EMAIL.toLowerCase()
    ) {

      alert(
        "Akun ini bukan akun admin."
      );

      signOut(auth);

      return;

    }


    loginBox.style.display =
      "none";

    dashboard.style.display =
      "block";


    loadOrders();

  }
);


/* ==========================================
   LOAD ORDERS
========================================== */

window.loadOrders =
  function () {

    if (unsubscribeOrders) {

      unsubscribeOrders();

    }


    const ordersQuery =
      query(

        collection(
          db,
          "orders"
        ),

        orderBy(
          "createdAt",
          "desc"
        )

      );


    unsubscribeOrders =
      onSnapshot(

        ordersQuery,

        snapshot => {

          const orders =
            snapshot.docs.map(
              item => ({

                id:
                  item.id,

                ...item.data()

              })
            );


          renderOrders(
            orders
          );

        },

        error => {

          console.error(
            error
          );

          orderList.innerHTML = `

            <div class="empty">

              Gagal memuat pesanan.

              <br><br>

              Periksa Firestore Rules.

            </div>

          `;

        }

      );

  };


/* ==========================================
   RENDER
========================================== */

function renderOrders(
  orders
) {

  let newCount = 0;

  let confirmedCount = 0;

  let doneCount = 0;


  orders.forEach(
    order => {

      if (
        order.status ===
        "Menunggu Konfirmasi"
      ) {

        newCount++;

      }


      if (
        order.status ===
        "Dikonfirmasi"
      ) {

        confirmedCount++;

      }


      if (
        order.status ===
        "Pesanan Selesai"
      ) {

        doneCount++;

      }

    }
  );


  document.getElementById(
    "newCount"
  ).textContent =
    newCount;


  document.getElementById(
    "confirmedCount"
  ).textContent =
    confirmedCount;


  document.getElementById(
    "doneCount"
  ).textContent =
    doneCount;


  if (!orders.length) {

    orderList.innerHTML = `

      <div class="empty">

        <i class="fa-solid fa-inbox"></i>

        <br><br>

        Belum ada pesanan.

      </div>

    `;

    return;

  }


  orderList.innerHTML =
    orders.map(
      order =>
        createOrderCard(
          order
        )
    ).join("");

}


/* ==========================================
   ORDER CARD
========================================== */

function createOrderCard(
  order
) {

  const phone =
    String(
      order.customerPhone ||
      ""
    ).replace(
      /\D/g,
      ""
    );


  const whatsapp =
    phone
      ? `https://wa.me/${phone}`
      : "#";


  return `

    <div class="order-card">

      <div class="order-top">

        <div>

          <div class="invoice">

            ${escapeHTML(
              order.invoice
            )}

          </div>

        </div>


        <div class="status">

          ${escapeHTML(
            order.status ||
            "Menunggu Konfirmasi"
          )}

        </div>

      </div>


      <div class="service">

        ${escapeHTML(
          order.layanan ||
          "Layanan Cleaning"
        )}

      </div>


      <div class="item">

        ${escapeHTML(
          order.item || "-"
        )}

        · Qty:

        ${Number(
          order.qty || 1
        )}

      </div>


      <div class="order-info">


        <div class="info">

          <small>
            CUSTOMER
          </small>

          <strong>

            ${escapeHTML(
              order.customerName ||
              "-"
            )}

          </strong>

        </div>


        <div class="info">

          <small>
            WHATSAPP
          </small>

          <strong>

            ${escapeHTML(
              order.customerPhone ||
              "-"
            )}

          </strong>

        </div>


        <div class="info">

          <small>
            TANGGAL
          </small>

          <strong>

            ${escapeHTML(
              order.tanggal ||
              "-"
            )}

          </strong>

        </div>


        <div class="info">

          <small>
            JAM
          </small>

          <strong>

            ${escapeHTML(
              order.jam ||
              "-"
            )}

          </strong>

        </div>


        <div class="info">

          <small>
            ALAMAT
          </small>

          <strong>

            ${formatAddress(
              order.address
            )}

          </strong>

        </div>


        <div class="info">

          <small>
            PEMBAYARAN
          </small>

          <strong>

            ${escapeHTML(
              order.payment ||
              "-"
            )}

          </strong>

        </div>

      </div>


      <div class="total">

        <span>
          Total
        </span>

        <strong>

          ${rupiah(
            order.total
          )}

        </strong>

      </div>


      <div class="order-actions">


        ${
          order.status ===
          "Menunggu Konfirmasi"

          ? `

            <button
              class="confirm-button"
              onclick="confirmOrder('${order.id}')"
            >

              <i class="fa-solid fa-check"></i>

              Konfirmasi

            </button>

          `

          : ""

        }


        ${
          phone

          ? `

            <a
              href="${whatsapp}"
              target="_blank"
              class="whatsapp-button"
              style="
                text-decoration:none;
                text-align:center;
              "
            >

              <i class="fa-brands fa-whatsapp"></i>

              WhatsApp

            </a>

          `

          : ""

        }


        ${
          order.status !==
          "Pesanan Selesai"

          ? `

            <button
              class="status-button"
              onclick="nextStatus('${order.id}', '${escapeAttribute(order.status || "")}')"
            >

              <i class="fa-solid fa-arrow-right"></i>

              Status Berikutnya

            </button>

          `

          : ""

        }

      </div>

    </div>

  `;

}


/* ==========================================
   KONFIRMASI
========================================== */

window.confirmOrder =
  async function (
    orderId
  ) {

    if (
      !confirm(
        "Konfirmasi pesanan ini?"
      )
    ) {

      return;

    }


    try {

      await updateDoc(

        doc(
          db,
          "orders",
          orderId
        ),

        {

          status:
            "Dikonfirmasi",

          confirmedAt:
            new Date().toISOString()

        }

      );


    } catch (error) {

      console.error(error);

      alert(
        "Gagal mengkonfirmasi pesanan."
      );

    }

  };


/* ==========================================
   STATUS BERIKUTNYA
========================================== */

window.nextStatus =
  async function (
    orderId,
    currentStatus
  ) {

    const statuses = [

      "Menunggu Konfirmasi",

      "Dikonfirmasi",

      "Teknisi Berangkat",

      "Sedang Cleaning",

      "Pesanan Selesai"

    ];


    const current =
      statuses.indexOf(
        currentStatus
      );


    const next =
      statuses[
        current + 1
      ];


    if (!next) {

      return;

    }


    try {

      await updateDoc(

        doc(
          db,
          "orders",
          orderId
        ),

        {

          status:
            next,

          updatedAt:
            new Date().toISOString()

        }

      );

    } catch (error) {

      console.error(error);

      alert(
        "Gagal mengubah status."
      );

    }

  };


/* ==========================================
   ADDRESS
========================================== */

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

    return escapeHTML(
      address
    );

  }


  return escapeHTML(

    [
      address.address,
      address.district,
      address.city

    ]

      .filter(Boolean)

      .join(", ")

  );

}


/* ==========================================
   RUPIAH
========================================== */

function rupiah(
  number
) {

  return "Rp" +
    Number(
      number || 0
    ).toLocaleString(
      "id-ID"
    );

}


/* ==========================================
   ESCAPE
========================================== */

function escapeHTML(
  value
) {

  return String(
    value || ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


function escapeAttribute(
  value
) {

  return String(
    value || ""
  )
    .replace(
      /'/g,
      "\\'"
    );

}