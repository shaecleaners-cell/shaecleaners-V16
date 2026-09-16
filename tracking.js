/* ==========================================
   SHAE CLEANERS
   TRACKING PESANAN
   SIMPLE & STABIL
   TANPA FIREBASE
========================================== */

let order = null;


/* ================= RUPIAH ================= */

function formatRupiah(value) {

  const number = toNumber(value);

  return "Rp" + number.toLocaleString("id-ID");

}


/* ================= KONVERSI ANGKA ================= */

function toNumber(value) {

  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  /*
    Menangani:
    300000
    "300000"
    "Rp300.000"
    "300.000"
  */

  let text = String(value)
    .replace(/Rp/gi, "")
    .replace(/\s/g, "")
    .trim();

  /*
    Format Indonesia:
    300.000 -> 300000
    300,000 -> 300000
  */

  if (text.includes(".")) {
    text = text.replace(/\./g, "");
  }

  if (text.includes(",")) {
    text = text.replace(/,/g, "");
  }

  const number = Number(text);

  return Number.isFinite(number)
    ? number
    : 0;

}


/* ================= AMBIL QTY ================= */

function getQty() {

  const qty =
    toNumber(
      order?.qty
    );

  return qty > 0 ? qty : 1;

}


/* ================= AMBIL TOTAL ================= */

function getOrderTotal() {

  const qty = getQty();


  /*
    PRIORITAS 1
    grandTotal
  */

  let total =
    toNumber(
      order?.grandTotal
    );

  if (total > 0) {
    return total;
  }


  /*
    PRIORITAS 2
    total
  */

  total =
    toNumber(
      order?.total
    );

  if (total > 0) {
    return total;
  }


  /*
    PRIORITAS 3
    subtotal
  */

  total =
    toNumber(
      order?.subtotal
    );

  if (total > 0) {
    return total;
  }


  /*
    PRIORITAS 4
    amount
  */

  total =
    toNumber(
      order?.amount
    );

  if (total > 0) {
    return total;
  }


  /*
    PRIORITAS 5
    price x qty
  */

  const price =
    toNumber(
      order?.price
    );

  if (price > 0) {
    return price * qty;
  }


  /*
    PRIORITAS 6
    harga x qty
  */

  const harga =
    toNumber(
      order?.harga
    );

  if (harga > 0) {
    return harga * qty;
  }


  return 0;

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

  } catch (error) {

    console.error(
      "Data pesanan tidak valid:",
      error
    );

    order = null;

  }


  if (!order) {

    showNoOrder();

    return;

  }


  console.log(
    "DATA TRACKING:",
    order
  );


  renderTracking();

}


/* ================= RENDER ================= */

function renderTracking() {

  const total =
    getOrderTotal();


  const qty =
    getQty();


  /* INVOICE */

  document.getElementById(
    "invoiceNumber"
  ).textContent =
    order.invoice ||
    order.invoiceNumber ||
    "-";


  /* STATUS */

  document.getElementById(
    "currentStatus"
  ).textContent =
    order.status ||
    "Menunggu Konfirmasi";


  /* LAYANAN */

  document.getElementById(
    "serviceName"
  ).textContent =
    order.layanan ||
    order.service ||
    "Cleaning Service";


  /* ITEM / PAKET */

  document.getElementById(
    "serviceItem"
  ).textContent =
    order.item ||
    order.paket ||
    order.package ||
    "-";


  /* QTY */

  document.getElementById(
    "serviceQty"
  ).textContent =
    "Qty: " + qty;


  /* HARGA DETAIL */

  document.getElementById(
    "serviceTotal"
  ).textContent =
    formatRupiah(total);


  /* TANGGAL */

  document.getElementById(
    "orderDate"
  ).textContent =
    formatDate(
      order.tanggal ||
      order.date
    );


  /* JAM */

  document.getElementById(
    "orderTime"
  ).textContent =
    order.jam ||
    order.time ||
    "-";


  /* ALAMAT */

  document.getElementById(
    "customerAddress"
  ).textContent =
    order.customer?.address ||
    order.address ||
    "-";


  /* TOTAL PESANAN */

  document.getElementById(
    "grandTotal"
  ).textContent =
    formatRupiah(total);


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


  /* Waktu pesanan dibuat */

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


  if (isNaN(date.getTime())) {
    return value;
  }


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


  if (isNaN(date.getTime())) {
    return "-";
  }


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
    "6283813138221";


  const message =

`Halo Shae Cleaners.

Saya ingin menanyakan pesanan:

Invoice:
${order?.invoice || "-"}

Nama:
${order?.customer?.name || order?.name || "-"}

Layanan:
${order?.layanan || order?.service || "-"}

Paket:
${order?.item || order?.paket || order?.package || "-"}

Total:
${formatRupiah(getOrderTotal())}

Status:
${order?.status || "Menunggu Konfirmasi"}`;


  const url =
    `https://wa.me/${ADMIN_NUMBER}?text=${encodeURIComponent(message)}`;


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