/* ==========================================
   SHAE CLEANERS
   CUCI GORDEN
   Rp20.000 / m²
   TANPA FIREBASE
========================================== */


const PRICE_PER_M2 = 20000;


let curtainArea = 0;

let curtainTotal = 0;

let curtainQty = 1;


/* ELEMENT */

const widthInput =
  document.getElementById("width");

const heightInput =
  document.getElementById("height");

const areaResult =
  document.getElementById("areaResult");

const priceResult =
  document.getElementById("priceResult");

const selectedArea =
  document.getElementById("selectedArea");

const selectedPrice =
  document.getElementById("selectedPrice");

const orderButton =
  document.getElementById("orderButton");

const qtyElement =
  document.getElementById("qty");


/* RUPIAH */

function formatRupiah(value) {

  return "Rp" +
    Number(value)
      .toLocaleString("id-ID");

}


/* HITUNG */

function calculateCurtain() {

  const width =
    parseFloat(
      widthInput.value
    ) || 0;


  const height =
    parseFloat(
      heightInput.value
    ) || 0;


  const areaPerCurtain =
    width * height;


  curtainArea =
    Math.round(
      areaPerCurtain * 100
    ) / 100;


  /*
    Total luas seluruh gorden.
  */

  const totalArea =
    Math.round(
      curtainArea *
      curtainQty *
      100
    ) / 100;


  curtainTotal =
    Math.round(
      totalArea *
      PRICE_PER_M2
    );


  areaResult.textContent =
    totalArea + " m²";


  selectedArea.textContent =
    totalArea + " m²";


  priceResult.textContent =
    formatRupiah(
      curtainTotal
    );


  selectedPrice.textContent =
    formatRupiah(
      curtainTotal
    );


  orderButton.disabled =
    curtainArea <= 0;

}


/* JUMLAH */

function changeQty(change) {

  curtainQty += change;


  if (curtainQty < 1) {

    curtainQty = 1;

  }


  if (curtainQty > 50) {

    curtainQty = 50;

  }


  qtyElement.textContent =
    curtainQty;


  calculateCurtain();

}


/* ORDER */

function orderCurtain() {

  if (
    curtainArea <= 0 ||
    curtainTotal <= 0
  ) {

    alert(
      "Silakan masukkan ukuran gorden terlebih dahulu."
    );

    return;

  }


  const width =
    parseFloat(
      widthInput.value
    );


  const height =
    parseFloat(
      heightInput.value
    );


  const totalArea =
    Math.round(
      curtainArea *
      curtainQty *
      100
    ) / 100;


  const orderData = {

    layanan:
      "Cuci Gorden",

    item:
      `Gorden ${totalArea} m²`,

    ukuran:
      `${width} m × ${height} m`,

    harga:
      PRICE_PER_M2,

    qty:
      curtainQty,

    luas:
      totalArea,

    total:
      curtainTotal,

    serviceId:
      "gorden",

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


/* BACK */

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


/* SHARE */

async function shareCurtain() {

  const shareData = {

    title:
      "Cuci Gorden - Shae Cleaners",

    text:
      "Pesan layanan cuci gorden profesional dari Shae Cleaners.",

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


/* INPUT */

widthInput.addEventListener(
  "input",
  calculateCurtain
);


heightInput.addEventListener(
  "input",
  calculateCurtain
);


/* START */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    calculateCurtain();

  }
);