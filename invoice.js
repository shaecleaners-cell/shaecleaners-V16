/* ==========================================
   SHAE CLEANERS
   INVOICE
   TANPA FIREBASE
========================================== */


/* ================= FORMAT ================= */

function rupiah(number) {

  return "Rp" +
    Number(number || 0)
      .toLocaleString("id-ID");

}


/* ================= GET LAST ORDER ================= */

function getLastOrder() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "shaeLastOrder"
      )
    );

  } catch {

    return null;

  }

}


/* ================= PAYMENT ================= */

function paymentName(payment) {

  const names = {

    cash:
      "Bayar di Tempat",

    qris:
      "QRIS",

    transfer:
      "Transfer Bank"

  };


  return (
    names[payment] ||
    payment ||
    "-"
  );

}


/* ================= DATE ================= */

function formatDate(date) {

  if (!date) {

    return "-";

  }


  const parts =
    date.split("-");


  if (parts.length !== 3) {

    return date;

  }


  return (
    parts[2] +
    "/" +
    parts[1] +
    "/" +
    parts[0]
  );

}


/* ================= LOAD ================= */

function loadInvoice() {

  const order =
    getLastOrder();


  if (!order) {

    alert(
      "Data invoice tidak ditemukan."
    );


    window.location.href =
      "order.html";

    return;

  }


  document.getElementById(
    "invoiceNumber"
  ).textContent =
    order.invoice || "-";


  document.getElementById(
    "invoiceStatus"
  ).textContent =
    order.status ||
    "Menunggu Konfirmasi";


  document.getElementById(
    "customerName"
  ).textContent =
    order.customerName ||
    "-";


  document.getElementById(
    "customerPhone"
  ).textContent =
    order.customerPhone ||
    "-";


  document.getElementById(
    "serviceName"
  ).textContent =
    order.layanan ||
    "-";


  document.getElementById(
    "serviceItem"
  ).textContent =
    order.item ||
    "Layanan cleaning";


  document.getElementById(
    "serviceQty"
  ).textContent =
    order.qty ||
    1;


  document.getElementById(
    "serviceTotal"
  ).textContent =
    rupiah(
      order.subtotal ||
      order.total
    );


  /* ADDRESS */

  const address =
    order.address;


  if (address) {

    document.getElementById(
      "invoiceAddress"
    ).innerHTML = `

      <strong>
        ${escapeHTML(address.label)}
      </strong>

      <br>

      ${escapeHTML(address.recipient)}
      ·
      ${escapeHTML(address.phone)}

      <br>

      ${escapeHTML(address.address)}

      <br>

      ${escapeHTML(address.district)},
      ${escapeHTML(address.city)}

      ${
        address.note
          ? `
            <br>
            <small>
              Catatan:
              ${escapeHTML(address.note)}
            </small>
          `
          : ""
      }

    `;

  }


  /* SCHEDULE */

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


  /* PAYMENT */

  document.getElementById(
    "paymentMethod"
  ).textContent =
    paymentName(
      order.payment
    );


  /* TOTAL */

  document.getElementById(
    "subtotal"
  ).textContent =
    rupiah(
      order.subtotal
    );


  document.getElementById(
    "discount"
  ).textContent =
    "- " +
    rupiah(
      order.discount
    );


  document.getElementById(
    "grandTotal"
  ).textContent =
    rupiah(
      order.total
    );

}


/* ================= WHATSAPP ================= */

function sendWhatsApp() {

  const order =
    getLastOrder();


  if (!order) {

    return;

  }


  const address =
    order.address || {};


  const message =

`🧾 *INVOICE SHAE CLEANERS*

No. Invoice:
${order.invoice || "-"}

👤 Customer:
${order.customerName || "-"}

📱 WhatsApp:
${order.customerPhone || "-"}

🧹 Layanan:
${order.layanan || "-"}

📦 Item:
${order.item || "-"}

🔢 Qty:
${order.qty || 1}

📅 Jadwal:
${formatDate(order.tanggal)}
⏰ ${order.jam || "-"}

📍 Alamat:
${address.address || "-"}
${address.district || ""}
${address.city || ""}

💳 Pembayaran:
${paymentName(order.payment)}

💰 Subtotal:
${rupiah(order.subtotal)}

🎁 Diskon:
- ${rupiah(order.discount)}

💵 *TOTAL:
${rupiah(order.total)}*

Status:
${order.status || "Menunggu Konfirmasi"}

Terima kasih telah menggunakan
*Shae Cleaners* 🙏`;


  /*
    Isi nomor admin Shae Cleaners
    di bawah ini.
    
    Contoh:
    const adminNumber = "6283813138221";
  */

  const adminNumber = "";


  const url = adminNumber

    ? `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`

    : `https://wa.me/?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank"
  );

}


/* ================= TRACKING ================= */

function openTracking() {

  window.location.href =
    "tracking.html";

}


/* ================= HOME ================= */

function goHome() {

  window.location.href =
    "index.html";

}


/* ================= PRINT ================= */

function printInvoice() {

  window.print();

}


/* ================= ESCAPE ================= */

function escapeHTML(value) {

  return String(value || "")

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


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadInvoice();

  }
);