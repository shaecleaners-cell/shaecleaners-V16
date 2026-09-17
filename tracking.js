/* =====================================================
   SHAE CLEANERS
   TRACKING PESANAN
   FIRESTORE REALTIME
===================================================== */


/* ================= KONFIGURASI ================= */

const WA_NUMBER = "6283813138221";

let currentOrder = null;
let unsubscribeOrder = null;


/* ================= FORMAT RUPIAH ================= */

function formatRupiah(value) {

  return "Rp" +
    Number(value || 0)
      .toLocaleString("id-ID");

}


/* ================= LOAD ================= */

async function loadTracking() {

  try {

    const saved =
      localStorage.getItem("shaeLastOrder");

    if (!saved) {

      showEmptyOrder(
        "Belum ada pesanan yang dapat dilacak."
      );

      return;
    }


    const order = JSON.parse(saved);

    currentOrder = order;


    /* Tampilkan data lokal terlebih dahulu */

    showOrder(order);


    /* ================= FIREBASE ================= */

    const firebase =
      await import("./firebase.js");


    const {
      db,
      doc,
      onSnapshot
    } = firebase;


    /*
      firestoreId disimpan saat checkout
    */

    if (!order.firestoreId) {

      console.warn(
        "firestoreId belum tersedia."
      );

      return;
    }


    const orderRef =
      doc(
        db,
        "orders",
        order.firestoreId
      );


    /* ================= REALTIME ================= */

    unsubscribeOrder =
      onSnapshot(
        orderRef,

        snapshot => {

          if (!snapshot.exists()) {

            showEmptyOrder(
              "Pesanan tidak ditemukan."
            );

            return;
          }


          const firestoreOrder = {

            ...snapshot.data(),

            firestoreId: snapshot.id

          };


          currentOrder = {
            ...currentOrder,
            ...firestoreOrder
          };


          /* Simpan status terbaru */

          localStorage.setItem(
            "shaeLastOrder",
            JSON.stringify(currentOrder)
          );


          /* Update tampilan */

          showOrder(currentOrder);

        },

        error => {

          console.error(
            "Tracking Firestore:",
            error
          );

        }
      );


  } catch (error) {

    console.error(
      "Tracking error:",
      error
    );

    showEmptyOrder(
      "Gagal memuat pesanan."
    );

  }

}


/* ================= TAMPILKAN ORDER ================= */

function showOrder(order) {


  /* Invoice */

  const invoice =
    document.getElementById(
      "invoiceNumber"
    );

  if (invoice) {

    invoice.textContent =
      order.invoice || "-";

  }


  /* Status */

  const status =
    order.status ||
    "Menunggu Konfirmasi";


  const currentStatus =
    document.getElementById(
      "currentStatus"
    );

  if (currentStatus) {

    currentStatus.textContent =
      status;

  }


  /* Service */

  const serviceName =
    document.getElementById(
      "serviceName"
    );

  if (serviceName) {

    serviceName.textContent =
      order.service ||
      "Cleaning Service";

  }


  /* Paket */

  const serviceItem =
    document.getElementById(
      "serviceItem"
    );

  if (serviceItem) {

    serviceItem.textContent =
      order.package || "-";

  }


  /* Qty */

  const serviceQty =
    document.getElementById(
      "serviceQty"
    );

  if (serviceQty) {

    serviceQty.textContent =
      "Qty: " +
      (order.qty || 1);

  }


  /* Total service */

  const serviceTotal =
    document.getElementById(
      "serviceTotal"
    );

  if (serviceTotal) {

    serviceTotal.textContent =
      formatRupiah(order.total);

  }


  /* Total */

  const grandTotal =
    document.getElementById(
      "grandTotal"
    );

  if (grandTotal) {

    grandTotal.textContent =
      formatRupiah(order.total);

  }


  /* Tanggal */

  const orderDate =
    document.getElementById(
      "orderDate"
    );

  if (orderDate) {

    orderDate.textContent =
      order.date || "-";

  }


  /* Jam */

  const orderTime =
    document.getElementById(
      "orderTime"
    );

  if (orderTime) {

    orderTime.textContent =
      order.time || "-";

  }


  /* Alamat */

  const address =
    document.getElementById(
      "customerAddress"
    );

  if (address) {

    address.textContent =
      order.address || "-";

  }


  /* Timeline */

  updateTimeline(status);

}


/* =====================================================
   TIMELINE
===================================================== */

function updateTimeline(status) {

  const items =
    document.querySelectorAll(
      ".timeline-item"
    );


  items.forEach(item => {

    item.classList.remove(
      "active",
      "completed"
    );

  });


  let step = 1;


  /*
    Menunggu Konfirmasi
    = Pesanan dibuat
  */

  if (
    status ===
    "Menunggu Konfirmasi"
  ) {

    step = 1;

  }


  /*
    Pesanan Dikonfirmasi
  */

  else if (
    status ===
    "Pesanan Dikonfirmasi"
  ) {

    step = 2;

  }


  /*
    Diproses
    = Teknisi berangkat
      dan cleaning berlangsung
  */

  else if (
    status === "Diproses"
  ) {

    step = 4;

  }


  /*
    Selesai
  */

  else if (
    status === "Selesai"
  ) {

    step = 5;

  }


  items.forEach(item => {

    const itemStep =
      Number(
        item.dataset.step
      );


    if (
      itemStep < step
    ) {

      item.classList.add(
        "completed"
      );

    }


    if (
      itemStep === step
    ) {

      item.classList.add(
        "active"
      );

    }

  });

}


/* =====================================================
   REFRESH
===================================================== */

window.refreshTracking =
  function () {

    loadTracking();

  };


/* =====================================================
   BACK
===================================================== */

window.goBack =
  function () {

    if (
      document.referrer
    ) {

      history.back();

    } else {

      window.location.href =
        "index.html";

    }

  };


/* =====================================================
   WHATSAPP
===================================================== */

window.contactWhatsApp =
  function () {

    let message =
      "Halo Shae Cleaners,%0A%0A" +
      "Saya ingin menanyakan pesanan saya.";

    if (
      currentOrder &&
      currentOrder.invoice
    ) {

      message =
        "Halo Shae Cleaners,%0A%0A" +
        "Saya ingin menanyakan pesanan:%0A" +
        "Invoice: " +
        encodeURIComponent(
          currentOrder.invoice
        );

    }


    window.open(
      "https://wa.me/" +
      WA_NUMBER +
      "?text=" +
      message,
      "_blank"
    );

  };


/* =====================================================
   INVOICE
===================================================== */

window.viewInvoice =
  function () {

    if (
      currentOrder &&
      currentOrder.invoice
    ) {

      window.location.href =
        "invoice.html";

    } else {

      alert(
        "Data invoice belum tersedia."
      );

    }

  };


/* =====================================================
   EMPTY
===================================================== */

function showEmptyOrder(message) {

  const invoice =
    document.getElementById(
      "invoiceNumber"
    );

  const status =
    document.getElementById(
      "currentStatus"
    );

  if (invoice) {

    invoice.textContent = "-";

  }

  if (status) {

    status.textContent =
      message;

  }

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  loadTracking
);