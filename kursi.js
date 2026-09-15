/* ==========================================
   SHAE CLEANERS
   CUCI KURSI
   TANPA FIREBASE
========================================== */


/* ================= DATA ================= */

const chairServices = [

  {
    id: "kursi-makan-small",

    name: "Kursi Makan Small",

    price: 30000,

    description:
      "Kursi makan ukuran kecil"
  },


  {
    id: "kursi-makan-standard",

    name: "Kursi Makan Standar",

    price: 35000,

    description:
      "Kursi makan ukuran standar"
  },


  {
    id: "kursi-kantor-small",

    name: "Kursi Kantor Small",

    price: 30000,

    description:
      "Kursi kantor ukuran kecil"
  },


  {
    id: "kursi-kantor-big",

    name: "Kursi Kantor BIG",

    price: 40000,

    description:
      "Kursi kantor ukuran besar"
  }

];


/* ================= STATE ================= */

let selectedChair = null;


/* ================= ELEMENT ================= */

const chairList =
  document.getElementById(
    "chairList"
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

function renderChairServices() {

  chairList.innerHTML = "";


  chairServices.forEach(
    chair => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "chair-item";


      item.dataset.id =
        chair.id;


      item.innerHTML = `

        <div class="chair-icon">

          <i class="fa-solid fa-chair"></i>

        </div>


        <div class="chair-info">

          <h3>
            ${chair.name}
          </h3>

          <p>
            ${chair.description}
          </p>

          <div class="chair-price">

            ${formatRupiah(
              chair.price
            )}

          </div>

        </div>


        <div class="chair-check">

          <i class="fa-solid fa-check"></i>

        </div>

      `;


      item.addEventListener(
        "click",
        () => {

          selectChair(
            chair.id
          );

        }
      );


      chairList.appendChild(
        item
      );

    }
  );

}


/* ================= SELECT ================= */

function selectChair(id) {

  selectedChair =
    chairServices.find(
      chair =>
        chair.id === id
    );


  if (!selectedChair) {
    return;
  }


  document
    .querySelectorAll(
      ".chair-item"
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
    selectedChair.name;


  selectedPrice.textContent =
    formatRupiah(
      selectedChair.price
    );


  orderButton.disabled =
    false;

}


/* ================= ORDER ================= */

function orderChair() {

  if (!selectedChair) {

    alert(
      "Silakan pilih jenis kursi terlebih dahulu."
    );

    return;

  }


  const orderData = {

    layanan:
      "Cuci Kursi",

    item:
      selectedChair.name,

    harga:
      selectedChair.price,

    qty:
      1,

    total:
      selectedChair.price,

    serviceId:
      selectedChair.id,

    createdAt:
      new Date().toISOString()

  };


  /*
    Simpan layanan yang dipilih.
  */

  localStorage.setItem(

    "shaeSelectedService",

    JSON.stringify(
      orderData
    )

  );


  /*
    Masuk ke alur pemesanan.
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

async function shareChair() {

  const shareData = {

    title:
      "Cuci Kursi - Shae Cleaners",

    text:
      "Pesan layanan cuci kursi profesional dari Shae Cleaners.",

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

    renderChairServices();

  }
);