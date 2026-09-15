/* ==========================================
   SHAЕ CLEANERS MARKETPLACE
   HOME APP
========================================== */


/* ================= SWIPER ================= */

const heroSwiper = new Swiper(".heroSwiper", {

  loop: true,

  autoplay: {
    delay: 3500,
    disableOnInteraction: false
  },

  speed: 600,

  pagination: {
    el: ".swiper-pagination",
    clickable: true
  }

});


/* ================= NAVIGATION ================= */

function goHome() {
  window.location.href = "index.html";
}


function goOrder(service = "") {

  if (service) {
    localStorage.setItem(
      "selectedService",
      service
    );
  }

  window.location.href = "order.html";
}


function goPromo() {
  window.location.href = "promo.html";
}


function goAccount() {
  window.location.href = "akun.html";
}


function openChat() {
  window.location.href = "chat.html";
}


function openNotifications() {
  window.location.href = "notifikasi.html";
}


function goAllServices() {
  window.location.href = "layanan.html";
}


function goSearch() {
  window.location.href = "search.html";
}


/* ================= USER SESSION ================= */

function getCurrentUser() {

  const user = localStorage.getItem(
    "shaeCurrentUser"
  );

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    return null;
  }

}


/* ================= CHECK LOGIN ================= */

function requireLogin(targetPage = "order.html") {

  const user = getCurrentUser();

  if (!user) {

    localStorage.setItem(
      "afterLogin",
      targetPage
    );

    window.location.href = "login.html";

    return false;
  }

  return true;
}


/* ================= PAGE LOAD ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const user = getCurrentUser();

    console.log(
      user
        ? `User aktif: ${user.name}`
        : "User belum login"
    );

  }
);