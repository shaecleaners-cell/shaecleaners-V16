/* ==========================================
   SHAE CLEANERS
   CUCI KASUR
   TANPA FIREBASE
========================================== */


/* ================= DATA ================= */

const kasurServices = [

  {
    id: "kasur-mini-single",
    name: "Kasur Mini Single",
    price: 150000,
    description: "Ukuran mini single"
  },

  {
    id: "kasur-single",
    name: "Kasur Single",
    price: 180000,
    description: "Ukuran single"
  },

  {
    id: "kasur-queen",
    name: "Kasur Queen",
    price: 270000,
    description: "Ukuran queen"
  },

  {
    id: "kasur-king",
    name: "Kasur King",
    price: 290000,
    description: "Ukuran king"
  },

  {
    id: "kasur-super-king",
    name: "Kasur Super King",
    price: 310000,
    description: "Ukuran super king"
  }

];


/* ================= STATE ================= */

let selectedKasur = null;


/* ================= ELEMENT ================= */

const kasurList =
  document.getElementById(
    "kasurList"
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

function renderKasur() {

  kasurList.innerHTML = "";


  kasurServices.forEach(
    kasur => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "kasur-item";


      item.dataset.id =
        kasur.id;


      item.innerHTML = `

        <div class="kasur-icon">

          <i class="fa-solid fa-bed"></i>

        </div>


        <div class="kasur-info">

          <h3>
            ${kasur.name}
          </h3>

          <p>
            ${kasur.description}
          </p>

          <div class="kasur-price">
            ${formatRupiah(
              kasur.price
            )}
          </div>

        </div>


        <div class="kasur-check">

          <i class="fa-solid fa-check"></i>

        </div>

      `;


      item.addEventListener(
        "click",
        () => {

          selectKasur(
            kasur.id
          );

        }
      );


      kasurList.appendChild(
        item
      );

    }
  );

}


/* ================= SELECT ================= */

function selectKasur(id) {

  selectedKasur =
    kasurServices.find(
      kasur =>
        kasur.id === id
    );


  if (!selectedKasur) {
    return;
  }


  document
    .querySelectorAll(
      ".kasur-item"
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
    selectedKasur.name;


  selectedPrice.textContent =
    formatRupiah(
      selectedKasur.price
    );


  orderButton.disabled =
    false;

}


/* ================= ORDER ================= */

function orderKasur() {

  if (!selectedKasur) {

    alert(
      "Silakan pilih ukuran kasur terlebih dahulu."
    );

    return;

  }


  const orderData = {

    layanan:
      "Cuci Kasur",

    item:
      selectedKasur.name,

    harga:
      selectedKasur.price,

    qty: 1,

    total:
      selectedKasur.price,

    serviceId:
      selectedKasur.id,

    createdAt:
      new Date().toISOString()

  };


  /*
    Data sementara untuk order.html
  */

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

async function shareKasur() {

  const shareData = {

    title:
      "Cuci Kasur - Shae Cleaners",

    text:
      "Pesan layanan cuci kasur profesional dari Shae Cleaners.",

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

      // dibatalkan customer

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

    renderKasur();

  }
);