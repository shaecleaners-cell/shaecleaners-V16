/* ==========================================
   SHAE CLEANERS
   CUCI AC
   TANPA FIREBASE
========================================== */


/* ================= DATA ================= */

const acServices = [

  {
    id: "ac-05-1pk",

    name: "AC 0,5 - 1 PK",

    price: 75000,

    description:
      "Cuci AC rumah ukuran 0,5 sampai 1 PK"
  },


  {
    id: "ac-15-2pk",

    name: "AC 1,5 - 2 PK",

    price: 100000,

    description:
      "Cuci AC ukuran 1,5 sampai 2 PK"
  },


  {
    id: "ac-25-3pk",

    name: "AC 2,5 - 3 PK",

    price: 125000,

    description:
      "Cuci AC kapasitas besar 2,5 sampai 3 PK"
  }

];


/* ================= STATE ================= */

let selectedAC = null;

let quantity = 1;


/* ================= ELEMENT ================= */

const acList =
  document.getElementById(
    "acList"
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


/* ================= RUPIAH ================= */

function formatRupiah(value) {

  return "Rp" +
    Number(value)
      .toLocaleString("id-ID");

}


/* ================= RENDER ================= */

function renderAC() {

  acList.innerHTML = "";


  acServices.forEach(
    ac => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "ac-item";


      item.dataset.id =
        ac.id;


      item.innerHTML = `

        <div class="ac-icon">

          <i class="fa-solid fa-snowflake"></i>

        </div>


        <div class="ac-info">

          <h3>
            ${ac.name}
          </h3>

          <p>
            ${ac.description}
          </p>

          <div class="ac-price">

            ${formatRupiah(
              ac.price
            )}

            / unit

          </div>

        </div>


        <div class="ac-check">

          <i class="fa-solid fa-check"></i>

        </div>

      `;


      item.addEventListener(
        "click",
        () => {

          selectAC(
            ac.id
          );

        }
      );


      acList.appendChild(
        item
      );

    }
  );

}


/* ================= SELECT ================= */

function selectAC(id) {

  selectedAC =
    acServices.find(
      ac =>
        ac.id === id
    );


  if (!selectedAC) {
    return;
  }


  document
    .querySelectorAll(
      ".ac-item"
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

  if (!selectedAC) {

    selectedName.textContent =
      "Belum dipilih";

    selectedPrice.textContent =
      "Rp0";

    orderButton.disabled =
      true;

    return;

  }


  const total =
    selectedAC.price *
    quantity;


  selectedName.textContent =
    `${selectedAC.name} × ${quantity}`;


  selectedPrice.textContent =
    formatRupiah(
      total
    );


  orderButton.disabled =
    false;

}


/* ================= ORDER ================= */

function orderAC() {

  if (!selectedAC) {

    alert(
      "Silakan pilih kapasitas AC terlebih dahulu."
    );

    return;

  }


  const total =
    selectedAC.price *
    quantity;


  const orderData = {

    layanan:
      "Cuci AC",

    item:
      selectedAC.name,

    harga:
      selectedAC.price,

    qty:
      quantity,

    total:
      total,

    serviceId:
      selectedAC.id,

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

async function shareAC() {

  const shareData = {

    title:
      "Cuci AC - Shae Cleaners",

    text:
      "Pesan layanan cuci AC profesional dari Shae Cleaners.",

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

      // customer membatalkan

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

    renderAC();

    updateTotal();

  }
);