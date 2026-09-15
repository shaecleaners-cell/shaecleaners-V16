/* ==========================================
   SHAE CLEANERS
   ORDER SYSTEM
   TANPA FIREBASE
========================================== */


/* ================= STATE ================= */

let selectedService = null;


/* ================= ELEMENT ================= */

const serviceBox =
  document.getElementById(
    "serviceBox"
  );


const customerName =
  document.getElementById(
    "customerName"
  );


const customerPhone =
  document.getElementById(
    "customerPhone"
  );


const customerAddress =
  document.getElementById(
    "customerAddress"
  );


const orderDate =
  document.getElementById(
    "orderDate"
  );


const orderTime =
  document.getElementById(
    "orderTime"
  );


const orderNote =
  document.getElementById(
    "orderNote"
  );


const summaryPrice =
  document.getElementById(
    "summaryPrice"
  );


const serviceFee =
  document.getElementById(
    "serviceFee"
  );


const summaryTotal =
  document.getElementById(
    "summaryTotal"
  );


const bottomTotal =
  document.getElementById(
    "bottomTotal"
  );


/* ================= CONFIG ================= */

/*
   Biaya layanan bisa diubah di sini.

   Untuk sementara Rp0 agar
   customer hanya membayar harga layanan.
*/

const SERVICE_FEE = 0;


/* ================= RUPIAH ================= */

function formatRupiah(value) {

  return "Rp" +
    Number(value || 0)
      .toLocaleString("id-ID");

}


/* ================= LOAD ORDER ================= */

function loadSelectedService() {

  const saved =
    localStorage.getItem(
      "shaeSelectedService"
    );


  if (!saved) {

    serviceBox.innerHTML = `

      <div class="loading">

        Pesanan belum dipilih.

        <br><br>

        <button
          onclick="goHome()"
          style="
            border:none;
            background:#00a86b;
            color:white;
            padding:9px 14px;
            border-radius:7px;
            font-size:9px;
          "
        >

          Pilih Layanan

        </button>

      </div>

    `;

    return;

  }


  try {

    selectedService =
      JSON.parse(saved);

  } catch {

    selectedService = null;

  }


  if (!selectedService) {

    return;

  }


  renderService();

  updateSummary();

}


/* ================= RENDER SERVICE ================= */

function renderService() {

  const data =
    selectedService;


  let detail = "";


  if (
    data.ukuran
  ) {

    detail +=
      `<span>
        Ukuran: ${data.ukuran}
      </span>`;

  }


  if (
    data.luas
  ) {

    detail +=
      `<span>
        Luas: ${data.luas} m²
      </span>`;

  }


  detail +=
    `<span>
      Jumlah: ${data.qty || 1}
    </span>`;


  if (
    data.catatan
  ) {

    detail +=
      `<span>
        Catatan: ${data.catatan}
      </span>`;

  }


  serviceBox.innerHTML = `

    <div class="service-content">

      <div class="service-icon">

        <i class="fa-solid fa-broom"></i>

      </div>


      <div class="service-detail">

        <strong>
          ${data.layanan || "Layanan Cleaning"}
        </strong>

        <span>
          ${data.item || "-"}
        </span>

        ${detail}

      </div>

    </div>


    <div class="service-total">

      <span>
        Total layanan
      </span>

      <strong>
        ${formatRupiah(data.total)}
      </strong>

    </div>

  `;

}


/* ================= SUMMARY ================= */

function updateSummary() {

  if (!selectedService) {

    return;

  }


  const price =
    Number(
      selectedService.total || 0
    );


  const total =
    price +
    SERVICE_FEE;


  summaryPrice.textContent =
    formatRupiah(price);


  serviceFee.textContent =
    formatRupiah(
      SERVICE_FEE
    );


  summaryTotal.textContent =
    formatRupiah(total);


  bottomTotal.textContent =
    formatRupiah(total);

}


/* ================= DATE ================= */

function setMinimumDate() {

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


  const dateString =
    `${year}-${month}-${day}`;


  orderDate.min =
    dateString;


  /*
    Default tanggal hari ini.
  */

  orderDate.value =
    dateString;

}


/* ================= SAVED CUSTOMER ================= */

function loadCustomer() {

  const saved =
    localStorage.getItem(
      "shaeCustomer"
    );


  if (!saved) {

    return;

  }


  try {

    const customer =
      JSON.parse(saved);


    if (
      customer.name
    ) {

      customerName.value =
        customer.name;

    }


    if (
      customer.phone
    ) {

      customerPhone.value =
        customer.phone;

    }


    if (
      customer.address
    ) {

      customerAddress.value =
        customer.address;

    }

  } catch {

    console.log(
      "Data customer tidak valid."
    );

  }

}


/* ================= VALIDATION ================= */

function validateOrder() {

  let valid = true;


  document
    .querySelectorAll(
      ".error"
    )
    .forEach(
      el => el.textContent = ""
    );


  if (
    !customerName.value.trim()
  ) {

    document.getElementById(
      "nameError"
    ).textContent =
      "Nama wajib diisi.";

    valid = false;

  }


  const phone =
    customerPhone.value
      .replace(/\D/g, "");


  if (
    phone.length < 10
  ) {

    document.getElementById(
      "phoneError"
    ).textContent =
      "Nomor WhatsApp tidak valid.";

    valid = false;

  }


  if (
    customerAddress.value.trim().length < 10
  ) {

    document.getElementById(
      "addressError"
    ).textContent =
      "Masukkan alamat lengkap.";

    valid = false;

  }


  if (
    !orderDate.value ||
    !orderTime.value
  ) {

    document.getElementById(
      "scheduleError"
    ).textContent =
      "Tanggal dan jam wajib dipilih.";

    valid = false;

  }


  return valid;

}


/* ================= CHECKOUT ================= */

function continueCheckout() {

  if (!selectedService) {

    alert(
      "Silakan pilih layanan terlebih dahulu."
    );

    return;

  }


  if (
    !validateOrder()
  ) {

    return;

  }


  const customer = {

    name:
      customerName.value.trim(),

    phone:
      customerPhone.value
        .replace(/\D/g, ""),

    address:
      customerAddress.value.trim()

  };


  const order = {

    ...selectedService,

    customer:

      customer,

    tanggal:

      orderDate.value,

    jam:

      orderTime.value,

    catatan:

      orderNote.value.trim(),

    serviceFee:

      SERVICE_FEE,

    grandTotal:

      Number(
        selectedService.total || 0
      ) +
      SERVICE_FEE,

    updatedAt:
      new Date().toISOString()

  };


  /*
    Simpan customer
  */

  localStorage.setItem(

    "shaeCustomer",

    JSON.stringify(
      customer
    )

  );


  /*
    Simpan order aktif
  */

  localStorage.setItem(

    "shaeCurrentOrder",

    JSON.stringify(
      order
    )

  );


  /*
    Untuk halaman checkout
  */

  window.location.href =
    "checkout.html";

}


/* ================= LOCATION ================= */

function useCurrentLocation() {

  if (
    !navigator.geolocation
  ) {

    alert(
      "Browser tidak mendukung lokasi."
    );

    return;

  }


  navigator.geolocation.getCurrentPosition(

    position => {

      const lat =
        position.coords.latitude;


      const lng =
        position.coords.longitude;


      const mapLink =
        `https://maps.google.com/?q=${lat},${lng}`;


      customerAddress.value +=
        customerAddress.value
          ? `\nLokasi: ${mapLink}`
          : `Lokasi: ${mapLink}`;

    },


    () => {

      alert(
        "Lokasi tidak dapat diakses. Pastikan izin lokasi diberikan."
      );

    },

    {
      enableHighAccuracy: true,

      timeout: 10000,

      maximumAge: 0

    }

  );

}


/* ================= NOTE ================= */

orderNote.addEventListener(
  "input",
  () => {

    document.getElementById(
      "noteCount"
    ).textContent =
      `${orderNote.value.length}/300`;

  }
);


/* ================= HELP ================= */

function showHelp() {

  alert(
    "Silakan isi data customer, alamat, tanggal dan jam cleaning. Setelah itu tekan Lanjut untuk menuju checkout."
  );

}


/* ================= BACK ================= */

function goBack() {

  history.back();

}


/* ================= HOME ================= */

function goHome() {

  window.location.href =
    "index.html";

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadSelectedService();

    loadCustomer();

    setMinimumDate();

  }
);
/* ==========================================
   CEK LOGIN CUSTOMER
========================================== */

function checkLoginBeforeOrder() {

  const currentUser =
    localStorage.getItem(
      "shaeCurrentUser"
    );


  /*
    Jika belum login,
    simpan halaman tujuan.
  */

  if (!currentUser) {

    localStorage.setItem(
      "shaeLoginRedirect",
      "order.html"
    );


    window.location.href =
      "login.html";

    return false;

  }


  return true;

}


/* ==========================================
   ISI DATA CUSTOMER
========================================== */

function loadCustomerData() {

  const savedUser =
    localStorage.getItem(
      "shaeCurrentUser"
    );


  if (!savedUser) {

    return;

  }


  try {

    const user =
      JSON.parse(
        savedUser
      );


    /*
      Sesuaikan ID input
      dengan order.html Anda.
    */

    const nameInput =
  document.getElementById("customerName");

const phoneInput =
  document.getElementById("customerPhone");


    if (
      nameInput &&
      !nameInput.value
    ) {

      nameInput.value =
        user.name || "";

    }


    if (
      phoneInput &&
      !phoneInput.value
    ) {

      phoneInput.value =
        user.phone || "";

    }


  } catch (error) {

    console.error(
      "Data user tidak valid:",
      error
    );

  }

}


/* ==========================================
   START ORDER
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Jangan langsung memblokir
      halaman order.

      Customer tetap bisa melihat
      form terlebih dahulu.
    */

    loadCustomerData();

  }
);
/* ==========================================
   ALAMAT ORDER
   TANPA FIREBASE
========================================== */


/* ================= USER ================= */

function getOrderUser() {

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

function getOrderAddresses() {

  const user =
    getOrderUser();


  if (!user) {

    return [];

  }


  const key =
    "shaeAddresses_" +
    user.id;


  try {

    return JSON.parse(
      localStorage.getItem(key)
    ) || [];

  } catch {

    return [];

  }

}


/* ================= MAIN ADDRESS ================= */

function getMainAddress() {

  const addresses =
    getOrderAddresses();


  return (
    addresses.find(
      address =>
        address.isMain
    ) ||
    addresses[0] ||
    null
  );

}


/* ================= LOAD ADDRESS ================= */

function loadOrderAddress() {

  const container =
    document.getElementById(
      "selectedAddress"
    );


  if (!container) {

    return;

  }


  const address =
    getMainAddress();


  if (!address) {

    container.innerHTML = `

      <div class="address-content-row">

        <div class="address-location-icon">

          <i class="fa-solid fa-location-dot"></i>

        </div>


        <div class="address-information">

          <strong>
            Belum ada alamat
          </strong>

          <div class="full-address">

            Silakan tambahkan alamat
            pengerjaan terlebih dahulu.

          </div>

        </div>

      </div>

    `;

    return;

  }


  container.innerHTML = `

    <div class="address-content-row">

      <div class="address-location-icon">

        <i class="fa-solid fa-location-dot"></i>

      </div>


      <div class="address-information">

        <strong>
          ${escapeOrderHTML(address.label)}
        </strong>


        <div class="receiver">

          ${escapeOrderHTML(address.recipient)}
          ·
          ${escapeOrderHTML(address.phone)}

        </div>


        <div class="full-address">

          ${escapeOrderHTML(address.address)}

          <br>

          ${escapeOrderHTML(address.district)},
          ${escapeOrderHTML(address.city)}

        </div>


        ${
          address.note
            ? `
              <div class="note">

                Catatan:
                ${escapeOrderHTML(address.note)}

              </div>
            `
            : ""
        }

      </div>

    </div>

  `;


  /*
    Simpan alamat terpilih
    untuk proses checkout.
  */

  localStorage.setItem(

    "shaeSelectedAddress",

    JSON.stringify(address)

  );

}


/* ================= CHOOSE ================= */

function chooseAddress() {

  const addresses =
    getOrderAddresses();


  if (!addresses.length) {

    const create =
      confirm(
        "Anda belum memiliki alamat. Tambahkan alamat sekarang?"
      );


    if (create) {

      openAddressPage();

    }

    return;

  }


  /*
    Untuk versi awal,
    tampilkan pilihan sederhana.
  */

  let message =
    "Pilih alamat:\n\n";


  addresses.forEach(
    (address, index) => {

      message +=
        `${index + 1}. ${address.label}`;

      if (address.isMain) {

        message +=
          " (UTAMA)";

      }

      message +=
        `\n${address.address}\n\n`;

    }
  );


  const choice =
    prompt(
      message +
      "\nMasukkan nomor alamat:"
    );


  if (!choice) {

    return;

  }


  const index =
    parseInt(choice, 10) - 1;


  if (
    index < 0 ||
    index >= addresses.length
  ) {

    alert(
      "Pilihan alamat tidak valid."
    );

    return;

  }


  const selected =
    addresses[index];


  localStorage.setItem(

    "shaeSelectedAddress",

    JSON.stringify(selected)

  );


  renderSelectedAddress(
    selected
  );

}


/* ================= RENDER SELECTED ================= */

function renderSelectedAddress(
  address
) {

  const container =
    document.getElementById(
      "selectedAddress"
    );


  if (!container) {

    return;

  }


  container.innerHTML = `

    <div class="address-content-row">

      <div class="address-location-icon">

        <i class="fa-solid fa-location-dot"></i>

      </div>


      <div class="address-information">

        <strong>
          ${escapeOrderHTML(address.label)}
        </strong>


        <div class="receiver">

          ${escapeOrderHTML(address.recipient)}
          ·
          ${escapeOrderHTML(address.phone)}

        </div>


        <div class="full-address">

          ${escapeOrderHTML(address.address)}

          <br>

          ${escapeOrderHTML(address.district)},
          ${escapeOrderHTML(address.city)}

        </div>


        ${
          address.note
            ? `
              <div class="note">
                Catatan:
                ${escapeOrderHTML(address.note)}
              </div>
            `
            : ""
        }

      </div>

    </div>

  `;

}


/* ================= ESCAPE ================= */

function escapeOrderHTML(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* ================= OPEN ADDRESS ================= */

function openAddressPage() {

  localStorage.setItem(
    "shaeAddressRedirect",
    "order.html"
  );


  window.location.href =
    "alamat.html";

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadOrderAddress();

  }
);