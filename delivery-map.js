/* Two fictitious delivery radii around Celje; no real company base or service area. */
(() => {
  "use strict";
  const el = document.getElementById("delivery-map");
  if (!el) return;
  const center = [46.2361, 15.2675]; // Celje city, example center only
  const title = document.getElementById("zone-result-title");
  const description = document.getElementById("zone-result-text");
  const link = document.getElementById("zone-calc-link");
  function fallback() {
    el.innerHTML = '<iframe title="Zemljevid Slovenije – prikaz Celja (DEMO)" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=14.43%2C45.74%2C16.09%2C46.72&amp;layer=mapnik" style="width:100%;height:100%;border:0"></iframe>';
    title.textContent = "Prikaz zemljevida";
    description.textContent = "Označevanje con ni na voljo. Primer con: do 25 km (25 €), od 25 do 50 km (49 €), izven po dogovoru. Razdalje so zračne.";
  }
  if (!window.L) { fallback(); return; }
  try {
    const map = L.map(el, {scrollWheelZoom: false, zoomControl: true});
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      minZoom: 7, maxZoom: 17,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    const outer = L.circle(center, {radius: 50000, color: "#c78b61", fillColor: "#f8c49b", fillOpacity: 0.22, weight: 2}).addTo(map);
    L.circle(center, {radius: 25000, color: "#20553e", fillColor: "#3c9064", fillOpacity: 0.24, weight: 2}).addTo(map);
    L.circleMarker(center, {radius: 6, color: "#ffffff", weight: 2, fillColor: "#153e2a", fillOpacity: 1}).addTo(map).bindPopup("Celje – samo središče DEMO con, ne naslov podjetja.");
    map.fitBounds(outer.getBounds(), {padding: [18, 18]});
    let selected;
    map.on("click", e => {
      const km = L.latLng(center).distanceTo(e.latlng) / 1000;
      const zone = km <= 25 ? "zone1" : km <= 50 ? "zone2" : "outside";
      const label = zone === "zone1" ? "Cona A · do 25 km" : zone === "zone2" ? "Cona B · 25–50 km" : "Izven vzorčnega območja";
      const price = zone === "zone1" ? "25 €" : zone === "zone2" ? "49 €" : "po dogovoru";
      if (selected) map.removeLayer(selected);
      selected = L.circleMarker(e.latlng, {radius: 8, color: "#fff", weight: 2, fillColor: "#cc7954", fillOpacity: 1}).addTo(map);
      title.textContent = label;
      description.textContent = "Zračna razdalja od izhodišča Celje: " + new Intl.NumberFormat("sl-SI", {maximumFractionDigits: 1}).format(km) + " km. DEMO strošek: " + price + ".";
      link.href = "ponudba.html?dostava=" + zone + "#kalkulator";
    });
    window.addEventListener("resize", () => map.invalidateSize(), {passive:true});
  } catch (error) { fallback(); }
})();
