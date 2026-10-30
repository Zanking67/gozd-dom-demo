/* Gozd & Dom demo calculator: all prices are fictional examples. */
(() => {
  "use strict";
  const form = document.getElementById("wood-calculator");
  if (!form) return;
  const prices = Object.freeze({
    bukev: {label: "Bukova drva", price: 110},
    hrast: {label: "Hrastova drva", price: 125},
    mesana: {label: "Mešana drva", price: 90}
  });
  const deliveries = Object.freeze({
    pickup: {label: "Brez dostave", price: 0},
    zone1: {label: "Cona A (do 25 km)", price: 25},
    zone2: {label: "Cona B (25–50 km)", price: 49},
    outside: {label: "Več kot 50 km – po dogovoru", price: null}
  });
  const amount = document.getElementById("calc-amount");
  const slider = document.getElementById("calc-slider");
  const wood = document.getElementById("calc-wood");
  const delivery = document.getElementById("calc-delivery");
  const euro = n => new Intl.NumberFormat("sl-SI", {style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 2}).format(n);
  const number = n => new Intl.NumberFormat("sl-SI", {maximumFractionDigits: 1}).format(n);
  const param = new URLSearchParams(location.search).get("dostava");
  if (param && Object.prototype.hasOwnProperty.call(deliveries, param)) delivery.value = param;
  function recalculate() {
    const quantity = Number(amount.value);
    const valid = amount.value.trim() !== "" && Number.isFinite(quantity) && quantity >= 1 && quantity <= 20 && Math.abs(quantity * 2 - Math.round(quantity * 2)) < 1e-8;
    const item = prices[wood.value];
    const shipping = deliveries[delivery.value];
    const request = document.getElementById("calc-request");
    if (!valid || !item || !shipping) {
      document.getElementById("calc-summary").textContent = "Preverite vneseno količino";
      document.getElementById("calc-total").textContent = "—";
      document.getElementById("calc-total-label").textContent = "Vnesite od 1 do 20 prm, v korakih po 0,5";
      document.getElementById("calc-wood-price").textContent = "—";
      document.getElementById("calc-shipping").textContent = "—";
      document.getElementById("calc-unit").textContent = "—";
      request.removeAttribute("href");
      request.setAttribute("aria-disabled", "true");
      return;
    }
    slider.value = String(quantity);
    const woodPrice = quantity * item.price;
    document.getElementById("calc-summary").textContent = item.label + " · " + number(quantity) + " prm";
    document.getElementById("calc-unit").textContent = euro(item.price) + " / prm";
    document.getElementById("calc-wood-price").textContent = euro(woodPrice);
    document.getElementById("calc-shipping").textContent = shipping.price === null ? "Po dogovoru" : euro(shipping.price);
    document.getElementById("calc-total").textContent = shipping.price === null ? "Po dogovoru" : euro(woodPrice + shipping.price);
    document.getElementById("calc-total-label").textContent = shipping.price === null ? "Cena prevoza ni določena" : "Skupaj – demonstracijski izračun";
    document.getElementById("calc-note").textContent = "Samo demo: " + shipping.label + ". Cene niso resnične in ne vključujejo določene davčne obravnave.";
    const query = new URLSearchParams({vrsta: item.label, kolicina: String(quantity), dostava: shipping.label});
    request.href = "kontakt.html?" + query.toString();
    request.removeAttribute("aria-disabled");
  }
  amount.addEventListener("input", recalculate);
  slider.addEventListener("input", () => { amount.value = slider.value; recalculate(); });
  wood.addEventListener("change", recalculate);
  delivery.addEventListener("change", recalculate);
  form.addEventListener("submit", e => e.preventDefault());
  recalculate();
})();
