/* ==========================================
   SHAE CLEANERS
   SOFA SERVICE
   TANPA FIREBASE
========================================== */


/* ================= DATA SOFA ================= */

const sofaData = [

  {
    id: "sofa-standard",
    layanan: "Cuci Sofa",
    item: "Sofa Standard 1 Seater",
    harga: 60000,
    total: 60000,
    qty: 1
  },

  {
    id: "sofa-lepasan",
    layanan: "Cuci Sofa",
    item: "Sofa Lepasan 1 Seater",
    harga: 75000,
    total: 75000,
    qty: 1
  },

  {
    id: "sofa-besar",
    layanan: "Cuci Sofa",
    item: "Sofa Besar 1 Seater",
    harga: 75000,
    total: 75000,
    qty: 1
  },

  {
    id: "sofa-stool",
    layanan: "Cuci Sofa",
    item: "Sofa Stool",
    harga: 50000,
    total: 50000,
    qty: 1
  },

  {
    id: "sofa-l-standard",
    layanan: "Cuci Sofa",
    item: "Sofa L Standard",
    harga: 250000,
    total: 250000,
    qty: 1
  },

  {
    id: "sofa-l-big",
    layanan: "Cuci Sofa",
    item: "Sofa L BIG",
    harga: 300000,
    total: 300000,
    qty: 1
  },

  {
    id: "sofa-u",
    layanan: "Cuci Sofa",
    item: "Sofa U",
    harga: 350000,
    total: 350000,
    qty: 1
  }

];


/* ================= STATE ================= */

let selectedSofa = null;


/* ================= RUPIAH ================= */

function formatRupiah(value) {

  return "Rp" +
    Number(value || 0)
      .toLocaleString("id-ID");

}


/* ================= LOAD SOFA ================= */

function loadSofa() {

  const list =
    document.getElementById("sofaList");

  if (!list) return;


  list.innerHTML = "";


  sofaData.forEach(function(sofa) {

    const card =
      document.createElement("button");


    card.type = "button";

    card.className = "sofa-card";

    card.dataset.id = sofa.id;


    card.innerHTML = `

      <div class="sofa-card-icon">

        <i class="fa-solid fa-couch"></i>

      </div>


      <div class="sofa-card-content">

        <strong>
          ${sofa.item}
        </strong>

        <span>
          ${getDescription(sofa)}
        </span>

        <b>
          ${formatRupiah(sofa.harga)}
        </b>

      </div>


      <div class="sofa-card-arrow">

        <i class="fa-solid fa-chevron-right"></i>

      </div>

    `;


    card.onclick = function() {

      selectSofa(sofa);

    };


    list.appendChild(card);

  });

}


/* ================= DESCRIPTION ================= */

function getDescription(sofa) {

  switch (sofa.id) {

    case "sofa-standard":
      return "Harga per 1 seat";

    case "sofa-lepasan":
      return "Cover sofa dapat dilepas";

    case "sofa-besar":
      return "Untuk sofa ukuran besar";

    case "sofa-stool":
      return "Harga per 1 seat";

    case "sofa-l-standard":
      return "Harga per SET";

    case "sofa-l-big":
      return "Harga per SET ukuran besar";

    case "sofa-u":
      return "Harga per SET";

    default:
      return "Cleaning sofa profesional";

  }

}


/* ================= PILIH SOFA ================= */

function selectSofa(sofa) {

  selectedSofa = sofa;


  /* Tandai pilihan */

  const cards =
    document.querySelectorAll(
      ".sofa-card"
    );


  cards.forEach(function(card) {

    card.classList.remove(
      "selected"
    );

  });


  const selectedCard =
    document.querySelector(
      '[data-id="' +
      sofa.id +
      '"]'
    );


  if (selectedCard) {

    selectedCard.classList.add(
      "selected"
    );

  }


  /* Update pilihan */

  const name =
    document.getElementById(
      "selectedName"
    );


  const price =
    document.getElementById(
      "selectedPrice"
    );


  const button =
    document.getElementById(
      "orderButton"
    );


  if (name) {

    name.textContent =
      sofa.item;

  }


  if (price) {

    price.textContent =
      formatRupiah(
        sofa.harga
      );

  }


  if (button) {

    button.disabled = false;

  }


  /*
    SIMPAN LANGSUNG
    begitu layanan dipilih
  */

  saveSelectedService(sofa);

}


/* ================= SIMPAN ================= */

function saveSelectedService(sofa) {

  const data = {

    id: sofa.id,

    layanan: "Cuci Sofa",

    item: sofa.item,

    harga: Number(sofa.harga),

    qty: 1,

    total: Number(sofa.harga)

  };


  try {

    /*
      Key utama untuk order.js
    */

    localStorage.setItem(
      "shaeSelectedService",
      JSON.stringify(data)
    );


    /*
      Key cadangan
    */

    localStorage.setItem(
      "shaeOrderData",
      JSON.stringify(data)
    );


    console.log(
      "SERVICE TERSIMPAN:",
      data
    );


  } catch (error) {

    console.error(
      "Gagal menyimpan layanan:",
      error
    );


    alert(
      "Data layanan tidak dapat disimpan. Silakan coba lagi."
    );

  }

}


/* ================= PESAN ================= */

function orderSofa() {

  if (!selectedSofa) {

    /*
      Coba ambil data yang sudah tersimpan
    */

    try {

      const saved =
        localStorage.getItem(
          "shaeSelectedService"
        );


      if (saved) {

        selectedSofa =
          JSON.parse(saved);

      }

    } catch (error) {

      console.error(error);

    }

  }


  if (!selectedSofa) {

    alert(
      "Silakan pilih jenis sofa terlebih dahulu."
    );

    return;

  }


  /*
    Simpan sekali lagi
    sebelum pindah halaman
  */

  saveSelectedService(
    selectedSofa
  );


  /*
    Pindah ke ORDER
  */

  window.location.href =
    "order.html";

}


/* ================= SHARE ================= */

function shareSofa() {

  const shareData = {

    title:
      "Cuci Sofa - Shae Cleaners",

    text:
      "Pesan Cuci Sofa di Shae Cleaners",

    url:
      window.location.href

  };


  if (
    navigator.share
  ) {

    navigator.share(
      shareData
    ).catch(function() {});

    return;

  }


  if (
    navigator.clipboard
  ) {

    navigator.clipboard
      .writeText(
        window.location.href
      )
      .then(function() {

        alert(
          "Link berhasil disalin."
        );

      });

    return;

  }


  alert(
    "Fitur share tidak tersedia."
  );

}


/* ================= BACK ================= */

function goBack() {

  window.location.href =
    "index.html";

}


/* ================= RESTORE ================= */

function restoreSelectedSofa() {

  try {

    let saved =
      localStorage.getItem(
        "shaeSelectedService"
      );


    /*
      Kalau key utama kosong,
      gunakan key cadangan.
    */

    if (!saved) {

      saved =
        localStorage.getItem(
          "shaeOrderData"
        );

    }


    if (!saved) {

      return;

    }


    const data =
      JSON.parse(saved);


    const sofa =
      sofaData.find(function(item) {

        return item.id === data.id;

      });


    if (sofa) {

      selectSofa(sofa);

    }

  } catch (error) {

    console.error(
      "Gagal restore sofa:",
      error
    );

  }

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadSofa();

    restoreSelectedSofa();

  }
);