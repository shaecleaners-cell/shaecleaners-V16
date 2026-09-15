/* ==========================================
   SHAE CLEANERS
   CHECKOUT
   TANPA FIREBASE
========================================== */


/* ================= FORMAT RUPIAH ================= */

function rupiah(number) {

  return "Rp" +
    Number(number || 0)
      .toLocaleString("id-ID");

}


/* ================= USER ================= */

function getUser() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "shaeCurrentUser"
      )
    );

  } catch {

    return null;

  }

}


/* ================= ADDRESS ================= */

function getSelectedAddress() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "shaeSelectedAddress"
      )
    );

  } catch {

    return null;

  }

}


/* ================= ORDER DATA ================= */

function getOrderData() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "shaeOrderData"
      )
    );

  } catch {

    return null;

  }

}


/* ================= ADDRESS ================= */

function loadAddress() {

  const box =
    document.getElementById(
      "checkoutAddress"
    );


  const address =
    getSelectedAddress();


  if (!address) {

    box.innerHTML = `

      <strong>
        Belum ada alamat
      </strong>

      Silakan pilih alamat pengerjaan.

    `;

    return;

  }


  box.innerHTML = `

    <strong>
      ${escapeHTML(address.label)}
    </strong>

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
            Catatan: ${escapeHTML(address.note)}
          </small>
        `
        : ""
    }

  `;

}


/* ================= SERVICE ================= */

function loadService() {

  const box =
    document.getElementById(
      "serviceDetail"
    );


  const order =
    getOrderData();


  if (!order) {

    box.innerHTML = `

      <div class="service-icon">

        <i class="fa-solid fa-broom"></i>

      </div>

      <div class="service-info">

        <strong>
          Belum ada layanan
        </strong>

        <span>
          Silakan kembali ke halaman order.
        </span>

      </div>

    `;

    return;

  }


  const service =
    order.layanan ||
    order.service ||
    "Layanan Cleaning";


  const item =
    order.item ||
    order.size ||
    "";


  const qty =
    Number(order.qty || 1);


  const total =
    Number(
      order.total ||
      order.harga ||
      0
    );


  box.innerHTML = `

    <div class="service-icon">

      <i class="fa-solid fa-broom"></i>

    </div>


    <div class="service-info">

      <strong>
        ${escapeHTML(service)}
      </strong>

      <span>

        ${escapeHTML(item)}

        ${item ? " · " : ""}

        Qty ${qty}

        ·

        ${rupiah(total)}

      </span>

    </div>

  `;


  calculateTotal();

}


/* ================= TOTAL ================= */

function calculateTotal() {

  const order =
    getOrderData();


  if (!order) {

    return;

  }


  const subtotal =
    Number(
      order.total ||
      order.harga ||
      0
    );


  /*
    Diskon sementara.
    Nanti bisa kita sambungkan
    dengan sistem promo.
  */

  const discount =
    Number(
      order.discount || 0
    );


  const total =
    Math.max(
      0,
      subtotal - discount
    );


  document.getElementById(
    "subtotal"
  ).textContent =
    rupiah(subtotal);


  document.getElementById(
    "discount"
  ).textContent =
    "- " +
    rupiah(discount);


  document.getElementById(
    "grandTotal"
  ).textContent =
    rupiah(total);


  document.getElementById(
    "bottomTotal"
  ).textContent =
    rupiah(total);

}


/* ================= DATE ================= */

function setMinDate() {

  const date =
    document.getElementById(
      "checkoutDate"
    );


  if (!date) {

    return;

  }


  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      today.getDate()
    ).padStart(2, "0");


  date.min =
    `${year}-${month}-${day}`;


  /*
    Default besok.
  */

  const tomorrow =
    new Date(today);


  tomorrow.setDate(
    today.getDate() + 1
  );


  const ty =
    tomorrow.getFullYear();


  const tm =
    String(
      tomorrow.getMonth() + 1
    ).padStart(2, "0");


  const td =
    String(
      tomorrow.getDate()
    ).padStart(2, "0");


  date.value =
    `${ty}-${tm}-${td}`;

}


/* ================= CREATE ORDER ================= */

function createOrder() {

  const user =
    getUser();


  if (!user) {

    localStorage.setItem(
      "shaeLoginRedirect",
      "checkout.html"
    );


    window.location.href =
      "login.html";

    return;

  }


  const address =
    getSelectedAddress();


  if (!address) {

    alert(
      "Silakan pilih alamat pengerjaan terlebih dahulu."
    );

    return;

  }


  const order =
    getOrderData();


  if (!order) {

    alert(
      "Detail layanan belum tersedia."
    );

    window.location.href =
      "order.html";

    return;

  }


  const date =
    document.getElementById(
      "checkoutDate"
    ).value;


  const time =
    document.getElementById(
      "checkoutTime"
    ).value;


  if (!date) {

    alert(
      "Silakan pilih tanggal cleaning."
    );

    return;

  }


  if (!time) {

    alert(
      "Silakan pilih jam cleaning."
    );

    return;

  }


  const payment =
    document.querySelector(
      'input[name="payment"]:checked'
    )?.value;


  if (!payment) {

    alert(
      "Silakan pilih metode pembayaran."
    );

    return;

  }


  const subtotal =
    Number(
      order.total ||
      order.harga ||
      0
    );


  const discount =
    Number(
      order.discount || 0
    );


  const grandTotal =
    Math.max(
      0,
      subtotal - discount
    );


  /*
    Generate nomor invoice.
  */

  const now =
    new Date();


  const invoice =
    "INV-" +
    now.getFullYear() +
    String(
      now.getMonth() + 1
    ).padStart(2, "0") +
    String(
      now.getDate()
    ).padStart(2, "0") +
    "-" +
    String(
      now.getTime()
    ).slice(-5);


  const newOrder = {

    invoice:

      invoice,

    userId:

      user.id,

    customerName:

      user.name || "",

    customerPhone:

      user.phone || "",

    layanan:

      order.layanan ||
      order.service ||
      "",

    item:

      order.item ||
      order.size ||
      "",

    qty:

      Number(order.qty || 1),

    subtotal:

      subtotal,

    discount:

      discount,

    total:

      grandTotal,

    address:

      address,

    tanggal:

      date,

    jam:

      time,

    payment:

      payment,

    status:

      "Menunggu Konfirmasi",

    createdAt:

      now.toISOString()

  };


  /*
    Simpan semua pesanan
    customer di localStorage.
  */

  const key =
    "shaeOrders_" +
    user.id;


  let orders = [];


  try {

    orders =
      JSON.parse(
        localStorage.getItem(key)
      ) || [];

  } catch {

    orders = [];

  }


  orders.unshift(
    newOrder
  );


  localStorage.setItem(

    key,

    JSON.stringify(orders)

  );


  /*
    Simpan pesanan terakhir.
  */

  localStorage.setItem(

    "shaeLastOrder",

    JSON.stringify(newOrder)

  );


  /*
    Bersihkan data sementara.
  */

  localStorage.removeItem(
    "shaeOrderData"
  );


  /*
    Lanjut invoice.
  */

  window.location.href =
    "invoice.html";

}


/* ================= CHANGE ADDRESS ================= */

function changeAddress() {

  localStorage.setItem(
    "shaeAddressRedirect",
    "checkout.html"
  );


  window.location.href =
    "alamat.html";

}


/* ================= BACK ================= */

function goBack() {

  history.back();

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

    const user =
      getUser();


    if (!user) {

      localStorage.setItem(
        "shaeLoginRedirect",
        "checkout.html"
      );


      window.location.href =
        "login.html";

      return;

    }


    loadAddress();

    loadService();

    setMinDate();

  }
);