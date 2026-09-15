/* ==========================================
   SHAE CLEANERS
   CUCI KARPET
   Rp13.000 / m²
   TANPA FIREBASE
========================================== */


const PRICE_PER_M2 = 13000;


let carpetArea = 0;

let carpetTotal = 0;


/* ================= ELEMENT ================= */

const lengthInput =
  document.getElementById(
    "length"
  );

const widthInput =
  document.getElementById(
    "width"
  );

const areaResult =
  document.getElementById(
    "areaResult"
  );

const priceResult =
  document.getElementById(
    "priceResult"
  );

const selectedArea =
  document.getElementById(
    "selectedArea"
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


/* ================= HITUNG ================= */

function calculateCarpet() {

  const length =
    parseFloat(
      lengthInput.value
    ) || 0;


  const width =
    parseFloat(
      widthInput.value
    ) || 0;


  carpetArea =
    length * width;


  /*
    Dibulatkan 2 angka desimal.
  */

  carpetArea =
    Math.round(
      carpetArea * 100
    ) / 100;


  carpetTotal =
    Math.round(
      carpetArea * PRICE_PER_M2
    );


  areaResult.textContent =
    carpetArea + " m²";


  selectedArea.textContent =
    carpetArea + " m²";


  priceResult.textContent =
    formatRupiah(
      carpetTotal
    );


  selectedPrice.textContent =
    formatRupiah(
      carpetTotal
    );


  orderButton.disabled =
    carpetArea <= 0;


}


/* ================= ORDER ================= */

function orderCarpet() {

  if (
    carpetArea <= 0 ||
    carpetTotal <= 0
  ) {

    alert(
      "Silakan masukkan panjang dan lebar karpet terlebih dahulu."
    );

    return;

  }


  const length =
    parseFloat(
      lengthInput.value
    );


  const width =
    parseFloat(
      widthInput.value
    );


  const orderData = {

    layanan:
      "Cuci Karpet",

    item:
      `Karpet ${carpetArea} m²`,

    ukuran:
      `${length} m × ${width} m`,

    harga:
      PRICE_PER_M2,

    qty:
      carpetArea,

    total:
      carpetTotal,

    serviceId:
      "karpet",

    createdAt:
      new Date().toISOString()

  };


  /*
    Data dipakai order.html
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

async function shareCarpet() {

  const shareData = {

    title:
      "Cuci Karpet - Shae Cleaners",

    text:
      "Pesan layanan cuci karpet profesional dari Shae Cleaners.",

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

      // User membatalkan share

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


/* ================= INPUT ================= */

lengthInput.addEventListener(
  "input",
  calculateCarpet
);


widthInput.addEventListener(
  "input",
  calculateCarpet
);


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    calculateCarpet();

  }
);