/* ==========================================
   SHAE CLEANERS
   CUCI JOK MOBIL
   TANPA FIREBASE
========================================== */


/* ================= DATA ================= */

const carServices = [

  {
    id: "jok-2baris",
    name: "Jok Mobil Saja 2 Baris",
    price: 250000,
    description: "Pembersihan jok mobil 2 baris"
  },

  {
    id: "jok-interior-2baris",
    name: "Jok Mobil + Interior 2 Baris",
    price: 400000,
    description: "Jok + interior mobil 2 baris"
  },

  {
    id: "jok-3baris",
    name: "Jok Mobil Saja 3 Baris",
    price: 350000,
    description: "Pembersihan jok mobil 3 baris"
  },

  {
    id: "jok-interior-3baris",
    name: "Jok Mobil + Interior 3 Baris",
    price: 500000,
    description: "Jok + interior mobil 3 baris"
  }

];


/* ================= STATE ================= */

let selectedCar = null;


/* ================= ELEMENT ================= */

const carList =
  document.getElementById(
    "carList"
  );

const selectedName =
  document.getElementById(
    "selectedName"
  );

const selectedPrice =
  document.getElementById(
    "selectedPrice"
  );

const orderButton =
  document.getElementById(
    "orderButton"
  );


/* ================= RUPIAH ================= */

function formatRupiah(value) {

  return "Rp" +
    Number(value)
      .toLocaleString("id-ID");

}


/* ================= RENDER ================= */

function renderCarServices() {

  carList.innerHTML = "";


  carServices.forEach(
    service => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "car-item";


      item.dataset.id =
        service.id;


      item.innerHTML = `

        <div class="car-icon">

          <i class="fa-solid fa-car-side"></i>

        </div>


        <div class="car-info">

          <h3>
            ${service.name}
          </h3>

          <p>
            ${service.description}
          </p>

          <div class="car-price">
            ${formatRupiah(
              service.price
            )}
          </div>

        </div>


        <div class="car-check">

          <i class="fa-solid fa-check"></i>

        </div>

      `;


      item.addEventListener(
        "click",
        () => {

          selectCarService(
            service.id
          );

        }
      );


      carList.appendChild(
        item
      );

    }
  );

}


/* ================= SELECT ================= */

function selectCarService(id) {

  selectedCar =
    carServices.find(
      service =>
        service.id === id
    );


  if (!selectedCar) {
    return;
  }


  document
    .querySelectorAll(
      ".car-item"
    )
    .forEach(
      item => {

        item.classList.toggle(
          "selected",
          item.dataset.id === id
        );

      }
    );


  selectedName.textContent =
    selectedCar.name;


  selectedPrice.textContent =
    formatRupiah(
      selectedCar.price
    );


  orderButton.disabled =
    false;

}


/* ================= ORDER ================= */

function orderCar() {

  if (!selectedCar) {

    alert(
      "Silakan pilih paket jok mobil terlebih dahulu."
    );

    return;

  }


  /*
    Format dibuat sama dengan
    sofa.js dan kasur.js.
  */

  const orderData = {

    layanan:
      "Cuci Jok Mobil",

    item:
      selectedCar.name,

    harga:
      selectedCar.price,

    qty: 1,

    total:
      selectedCar.price,

    serviceId:
      selectedCar.id,

    createdAt:
      new Date().toISOString()

  };


  /*
    Simpan layanan terpilih.
  */

  localStorage.setItem(
    "shaeSelectedService",
    JSON.stringify(
      orderData
    )
  );


  /*
    Masuk ke halaman pemesanan.
  */

  window.location.href =
    "order.html";

}


/* ================= BACK ================= */

function goBack() {

  if (
    document.referrer
  ) {

    history.back();

  } else {

    window.location.href =
      "index.html";

  }

}


/* ================= SHARE ================= */

async function shareCar() {

  const shareData = {

    title:
      "Cuci Jok Mobil - Shae Cleaners",

    text:
      "Pesan layanan cuci jok mobil profesional dari Shae Cleaners.",

    url:
      window.location.href

  };


  if (
    navigator.share
  ) {

    try {

      await navigator.share(
        shareData
      );

    } catch {

      // Customer membatalkan share

    }

    return;

  }


  try {

    await navigator.clipboard.writeText(
      window.location.href
    );


    alert(
      "Link layanan berhasil disalin."
    );

  } catch {

    alert(
      "Link tidak dapat disalin."
    );

  }

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderCarServices();

  }
);