/* ==========================================
   SHAE CLEANERS
   TRACKING PESANAN
   TANPA FIREBASE
========================================== */


let order = null;


/* ================= RUPIAH ================= */

function formatRupiah(value) {

  return "Rp" +
    Number(value || 0)
      .toLocaleString("id-ID");

}


/* ================= LOAD ================= */

function loadTracking() {

  const saved =
    localStorage.getItem(
      "shaeLastOrder"
    );


  if (!saved) {

    showNoOrder();

    return;

  }


  try {

    order =
      JSON.parse(saved);

  } catch {

    order = null;

  }


  if (!order) {

    showNoOrder();

    return;

  }


  renderTracking();

}


/* ================= RENDER ================= */

function renderTracking() {

  document.getElementById(
    "invoiceNumber"
  ).textContent =
    order.invoice || "-";


  document.getElementById(
    "currentStatus"
  ).textContent =
    order.status ||
    "Menunggu Konfirmasi";


  document.getElementById(
    "serviceName"
  ).textContent =
    order.layanan ||
    "Cleaning Service";


  document.getElementById(
    "serviceItem"
  ).textContent =
    order.item || "-";


  document.getElementById(
    "serviceQty"
  ).textContent =
    "Qty: " +
    (order.qty || 1);


  document.getElementById(
    "serviceTotal"
  ).textContent =
    formatRupiah(
      order.grandTotal
    );


  document.getElementById(
    "orderDate"
  ).textContent =
    formatDate(
      order.tanggal
    );


  document.getElementById(
    "orderTime"
  ).textContent =
    order.jam || "-";


  document.getElementById(
    "customerAddress"
  ).textContent =
    order.customer?.address || "-";


  document.getElementById(
    "grandTotal"
  ).textContent =
    formatRupiah(
      order.grandTotal
    );


  updateTimeline();

}


/* ================= STATUS ================= */

function getStatusStep(status) {

  switch (status) {

    case "Menunggu Konfirmasi":

      return 1;


    case "Dikonfirmasi":

      return 2;


    case "Teknisi Berangkat":

      return 3;


    case "Sedang Cleaning":

      return 4;


    case "Selesai":

      return 5;


    default:

      return 1;

  }

}


/* ================= TIMELINE ================= */

function updateTimeline() {

  const currentStep =
    getStatusStep(
      order.status
    );


  document
    .querySelectorAll(
      ".timeline-item"
    )
    .forEach(
      item => {

        const step =
          Number(
            item.dataset.step
          );


        item.classList.remove(
          "active"
        );


        if (
          step <= currentStep
        ) {

          item.classList.add(
            "active"
          );

        }

      }
    );


  /*
    Waktu sementara.
    Nanti dapat diganti dengan
    timestamp dari admin.
  */

  if (order.createdAt) {

    document.getElementById(
      "timeStep1"
    ).textContent =
      formatTime(
        order.createdAt
      );

  }

}


/* ================= DATE ================= */

function formatDate(value) {

  if (!value) {

    return "-";

  }


  const date =
    new Date(
      value + "T00:00:00"
    );


  return date.toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}


/* ================= TIME ================= */

function formatTime(value) {

  const date =
    new Date(value);


  return date.toLocaleTimeString(
    "id-ID",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  ) + " WIB";

}


/* ================= REFRESH ================= */

function refreshTracking() {

  loadTracking();

}


/* ================= BACK ================= */

function goBack() {

  history.back();

}


/* ================= INVOICE ================= */

function viewInvoice() {

  window.location.href =
    "invoice.html";

}


/* ================= WHATSAPP ================= */

function contactWhatsApp() {

  const ADMIN_NUMBER =
    "";


  const message =

`Halo Shae Cleaners.

Saya ingin menanyakan pesanan:

Invoice:
${order?.invoice || "-"}

Nama:
${order?.customer?.name || "-"}

Layanan:
${order?.layanan || "-"}

Status:
${order?.status || "-"}`;


  const url =
    ADMIN_NUMBER

      ? `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(message)}`

      : `https://wa.me/?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank"
  );

}


/* ================= EMPTY ================= */

function showNoOrder() {

  const container =
    document.querySelector(
      ".tracking-container"
    );


  container.innerHTML = `

    <div
      style="
        margin:20px 13px;
        padding:40px 20px;
        text-align:center;
        border-radius:14px;
        background:white;
      "
    >

      <div
        style="
          width:55px;
          height:55px;
          margin:auto auto 15px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:50%;
          background:#eafff5;
          color:#00a86b;
          font-size:20px;
        "
      >

        <i class="fa-solid fa-box-open"></i>

      </div>


      <strong
        style="
          display:block;
          margin-bottom:7px;
          font-size:12px;
        "
      >

        Belum Ada Pesanan

      </strong>


      <span
        style="
          color:#999;
          font-size:8px;
        "
      >

        Anda belum memiliki pesanan.

      </span>


      <br><br>


      <button
        onclick="window.location.href='index.html'"
        style="
          border:none;
          border-radius:8px;
          padding:10px 16px;
          background:#00a86b;
          color:white;
          font-size:9px;
          font-weight:bold;
        "
      >

        Pesan Sekarang

      </button>

    </div>

  `;

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadTracking();

  }
);