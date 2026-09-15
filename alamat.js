/* ==========================================
   SHAE CLEANERS
   ALAMAT
   TANPA FIREBASE
========================================== */


/* ================= USER ================= */

function getCurrentUser() {

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


/* ================= ADDRESS KEY ================= */

function getAddressKey() {

  const user =
    getCurrentUser();


  if (!user) {

    return null;

  }


  return "shaeAddresses_" + user.id;

}


/* ================= GET ================= */

function getAddresses() {

  const key =
    getAddressKey();


  if (!key) {

    return [];

  }


  try {

    return JSON.parse(
      localStorage.getItem(key)
    ) || [];

  } catch {

    return [];

  }

}


/* ================= SAVE ================= */

function saveAddresses(addresses) {

  const key =
    getAddressKey();


  if (!key) {

    return;

  }


  localStorage.setItem(

    key,

    JSON.stringify(addresses)

  );

}


/* ================= RENDER ================= */

function renderAddresses() {

  const list =
    document.getElementById(
      "addressList"
    );


  const empty =
    document.getElementById(
      "emptyAddress"
    );


  const addresses =
    getAddresses();


  list.innerHTML = "";


  if (!addresses.length) {

    empty.style.display =
      "flex";

    return;

  }


  empty.style.display =
    "none";


  addresses.forEach(
    address => {

      const card =
        document.createElement(
          "div"
        );


      card.className =
        "address-card";


      card.innerHTML = `

        <div class="address-top">

          <div class="address-icon">

            <i class="fa-solid fa-location-dot"></i>

          </div>


          <div class="address-name">

            <strong>
              ${escapeHTML(address.label)}
            </strong>

            <span>
              ${escapeHTML(address.recipient)}
              ·
              ${escapeHTML(address.phone)}
            </span>

          </div>


          ${
            address.isMain
              ? `
                <span class="main-badge">
                  UTAMA
                </span>
              `
              : ""
          }

        </div>


        <div class="address-detail">

          <p>
            ${escapeHTML(address.address)}
          </p>

          <p>
            ${escapeHTML(address.district)},
            ${escapeHTML(address.city)}
          </p>


          ${
            address.note
              ? `
                <p class="address-note">
                  Catatan: ${escapeHTML(address.note)}
                </p>
              `
              : ""
          }

        </div>


        <div class="address-actions">

          ${
            !address.isMain
              ? `
                <button
                  class="main-action"
                  onclick="setMainAddress('${address.id}')"
                >
                  <i class="fa-solid fa-star"></i>
                  Jadikan Utama
                </button>
              `
              : `
                <button
                  disabled
                >
                  <i class="fa-solid fa-check"></i>
                  Alamat Utama
                </button>
              `
          }


          <button
            onclick="editAddress('${address.id}')"
          >
            <i class="fa-solid fa-pen"></i>
            Edit
          </button>


          <button
            class="delete-action"
            onclick="deleteAddress('${address.id}')"
          >
            <i class="fa-solid fa-trash"></i>
            Hapus
          </button>

        </div>

      `;


      list.appendChild(card);

    }
  );

}


/* ================= FORM ================= */

function openAddressForm() {

  const form =
    document.getElementById(
      "addressForm"
    );


  document.getElementById(
    "formTitle"
  ).textContent =
    "Tambah Alamat";


  document.getElementById(
    "editId"
  ).value =
    "";


  document.querySelector(
    "#addressForm form"
  ).reset();


  const user =
    getCurrentUser();


  if (user) {

    document.getElementById(
      "recipient"
    ).value =
      user.name || "";


    document.getElementById(
      "addressPhone"
    ).value =
      user.phone || "";

  }


  form.style.display =
    "block";


  form.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


function closeAddressForm() {

  document.getElementById(
    "addressForm"
  ).style.display =
    "none";

}


/* ================= SAVE FORM ================= */

function saveAddress(event) {

  event.preventDefault();


  const addresses =
    getAddresses();


  const editId =
    document.getElementById(
      "editId"
    ).value;


  const data = {

    label:
      document.getElementById(
        "label"
      ).value.trim(),

    recipient:
      document.getElementById(
        "recipient"
      ).value.trim(),

    phone:
      normalizePhone(
        document.getElementById(
          "addressPhone"
        ).value
      ),

    address:
      document.getElementById(
        "address"
      ).value.trim(),

    district:
      document.getElementById(
        "district"
      ).value.trim(),

    city:
      document.getElementById(
        "city"
      ).value.trim(),

    note:
      document.getElementById(
        "note"
      ).value.trim(),

    isMain:
      document.getElementById(
        "isMain"
      ).checked

  };


  if (!data.label) {

    alert(
      "Label alamat wajib diisi."
    );

    return;

  }


  if (!data.phone) {

    alert(
      "Nomor WhatsApp wajib diisi."
    );

    return;

  }


  if (editId) {

    const index =
      addresses.findIndex(
        item =>
          item.id === editId
      );


    if (index !== -1) {

      addresses[index] = {

        ...addresses[index],

        ...data

      };

    }

  } else {

    addresses.push({

      id:
        "ADDR-" +
        Date.now(),

      ...data,

      createdAt:
        new Date().toISOString()

    });

  }


  /*
    Jika dijadikan utama,
    alamat lain tidak utama.
  */

  if (data.isMain) {

    addresses.forEach(
      item => {

        if (
          editId &&
          item.id === editId
        ) {

          item.isMain = true;

        } else if (
          !editId ||
          item.id !== editId
        ) {

          item.isMain = false;

        }

      }
    );

  }


  /*
    Jika baru pertama kali
    membuat alamat, otomatis utama.
  */

  if (addresses.length === 1) {

    addresses[0].isMain =
      true;

  }


  saveAddresses(
    addresses
  );


  closeAddressForm();

  renderAddresses();


  alert(
    "Alamat berhasil disimpan."
  );

}


/* ================= EDIT ================= */

function editAddress(id) {

  const addresses =
    getAddresses();


  const address =
    addresses.find(
      item =>
        item.id === id
    );


  if (!address) {

    return;

  }


  document.getElementById(
    "formTitle"
  ).textContent =
    "Edit Alamat";


  document.getElementById(
    "editId"
  ).value =
    address.id;


  document.getElementById(
    "label"
  ).value =
    address.label;


  document.getElementById(
    "recipient"
  ).value =
    address.recipient;


  document.getElementById(
    "addressPhone"
  ).value =
    address.phone;


  document.getElementById(
    "address"
  ).value =
    address.address;


  document.getElementById(
    "district"
  ).value =
    address.district;


  document.getElementById(
    "city"
  ).value =
    address.city;


  document.getElementById(
    "note"
  ).value =
    address.note || "";


  document.getElementById(
    "isMain"
  ).checked =
    address.isMain;


  document.getElementById(
    "addressForm"
  ).style.display =
    "block";


  document.getElementById(
    "addressForm"
  ).scrollIntoView({
    behavior: "smooth"
  });

}


/* ================= MAIN ================= */

function setMainAddress(id) {

  const addresses =
    getAddresses();


  addresses.forEach(
    item => {

      item.isMain =
        item.id === id;

    }
  );


  saveAddresses(
    addresses
  );


  renderAddresses();

}


/* ================= DELETE ================= */

function deleteAddress(id) {

  const addresses =
    getAddresses();


  const target =
    addresses.find(
      item =>
        item.id === id
    );


  if (!target) {

    return;

  }


  const yakin =
    confirm(
      `Hapus alamat "${target.label}"?`
    );


  if (!yakin) {

    return;

  }


  let newAddresses =
    addresses.filter(
      item =>
        item.id !== id
    );


  /*
    Jika alamat utama dihapus,
    jadikan alamat pertama
    sebagai utama.
  */

  if (
    target.isMain &&
    newAddresses.length
  ) {

    newAddresses[0].isMain =
      true;

  }


  saveAddresses(
    newAddresses
  );


  renderAddresses();

}


/* ================= PHONE ================= */

function normalizePhone(phone) {

  let value =
    phone.replace(
      /\D/g,
      ""
    );


  if (
    value.startsWith("62")
  ) {

    value =
      "0" +
      value.substring(2);

  }


  if (
    value.startsWith("8")
  ) {

    value =
      "0" +
      value;

  }


  return value;

}


/* ================= SECURITY ================= */

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


/* ================= BACK ================= */

function goBack() {

  history.back();

}


/* ================= LOGIN CHECK ================= */

function checkLogin() {

  const user =
    getCurrentUser();


  if (!user) {

    localStorage.setItem(
      "shaeLoginRedirect",
      "alamat.html"
    );


    window.location.href =
      "login.html";

    return false;

  }


  return true;

}


/* ================= START ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (
      !checkLogin()
    ) {

      return;

    }


    renderAddresses();

  }
);