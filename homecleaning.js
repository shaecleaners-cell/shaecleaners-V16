/* ==========================================
   SHAE CLEANERS
   HOME CLEANING
   TANPA FIREBASE
========================================== */


/* ================= DATA ================= */

const cleaningServices = [

  {
    id: "home-basic",

    name: "Home Cleaning Basic",

    price: 100000,

    description:
      "Pembersihan area dasar rumah"
  },


  {
    id: "home-standard",

    name: "Home Cleaning Standard",

    price: 150000,

    description:
      "Pembersihan rumah lebih menyeluruh"
  },


  {
    id: "home-premium",

    name: "Home Cleaning Premium",

    price: 250000,

    description:
      "Pembersihan lebih detail dan menyeluruh"
  }

];


/* ================= STATE ================= */

let selectedCleaning = null;

let quantity = 1;


/* ================= ELEMENT ================= */

const cleaningList =
  document.getElementById(
    "cleaningList"
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


const qtyElement =
  document.getElementById(
    "qty"
  );


const noteInput =
  document.getElementById(
    "note"
  );


const noteCount =
  document.getElementById(
    "noteCount"
  );


/* ================= RUPIAH ================= */

function formatRupiah(value) {

  return "Rp" +
    Number(value)
      .toLocaleString("id-ID");

}


/* ================= RENDER ================= */

function renderCleaning() {

  cleaningList.innerHTML = "";


  cleaningServices.forEach(
    service => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "cleaning-item";


      item.dataset.id =
        service.id;


      item.innerHTML = `

        <div class="cleaning-icon">

          <i class="fa-solid fa-house-chimney"></i>

        </div>


        <div class="cleaning-info">

          <h3>
            ${service.name}
          </h3>

          <p>
            ${service.description}
          </p>

          <div class="cleaning-price">

            ${formatRupiah(
              service.price
            )}

            / paket

          </div>

        </div>


        <div class="cleaning-check">

          <i class="fa-solid fa-check"></i>

        </div>

      `;


      item.addEventListener(
        "click",
        () => {

          selectCleaning(
            service.id
          );

        }
      );


      cleaningList.appendChild(
        item
      );

    }
  );

}


/* ================= SELECT ================= */

function selectCleaning(id) {

  selectedCleaning =
    cleaningServices.find(
      service =>
        service.id === id
    );


  if (!selectedCleaning) {
    return;
  }


  document
    .querySelectorAll(
      ".cleaning-item"
    )
    .forEach(
      item => {

        item.classList.toggle(

          "selected",

          item.dataset.id === id

        );

      }
    );


  updateTotal();

}


/* ================= QUANTITY ================= */

function changeQty(change) {

  quantity += change;


  if (quantity < 1) {

    quantity = 1;

  }


  if (quantity > 20) {

    quantity = 20;

  }


  qtyElement.textContent =
    quantity;


  updateTotal();

}


/* ================= TOTAL ================= */

function updateTotal() {

  if (!selectedCleaning) {

    selectedName.textContent =
      "Belum dipilih";

    selectedPrice.textContent =
      "Rp0";

    orderButton.disabled =
      true;

    return;

  }


  const total =
    selectedCleaning.price *
    quantity;


  selectedName.textContent =
    `${selectedCleaning.name} × ${quantity}`;


  selectedPrice.textContent =
    formatRupiah(
      total
    );


  orderButton.disabled =
    false;

}


/* ================= NOTE ================= */

noteInput.addEventListener(
  "input",
  () => {

    noteCount.textContent =
      `${noteInput.value.length}/300`;

  }
);


/* ================= ORDER ================= */

function orderCleaning() {

  if (!selectedCleaning) {

    alert(
      "Silakan pilih paket Home Cleaning terlebih dahulu."
    );

    return;

  }


  const total =
    selectedCleaning.price *
    quantity;


  const orderData = {

    layanan:
      "Home Cleaning",

    item:
      selectedCleaning.name,

    harga:
      selectedCleaning.price,

    qty:
      quantity,

    total:
      total,

    catatan:
      noteInput.value.trim(),

    serviceId:
      selectedCleaning.id,

    createdAt:
      new Date().toISOString()

  };


  localStorage.setItem(

    "shaeSelectedService",

    JSON.stringify(
      orderData
    )

  );


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

async function shareCleaning() {

  const shareData = {

    title:
      "Home Cleaning - Shae Cleaners",

    text:
      "Pesan layanan Home Cleaning profesional dari Shae Cleaners.",

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

    renderCleaning();

    updateTotal();

  }
);