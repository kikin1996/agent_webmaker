const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const layoutFilter = document.querySelector("#layout-filter");
const floorFilter = document.querySelector("#floor-filter");
const sortFilter = document.querySelector("#sort-filter");
const availabilityFilter = document.querySelector("#availability-filter");
const unitList = document.querySelector("#unit-list");
const unitCount = document.querySelector("#unit-count");
const unitEmpty = document.querySelector("#unit-empty");
const unitDetail = document.querySelector("#unit-detail");
const unitSpecs = document.querySelector("#unit-specs");
const unitInquiry = document.querySelector("#unit-inquiry");

const apartmentPhotos = {
  "1+kk": "https://apartmany-marianska.cz/wp-content/uploads/2024/03/1kk_n1-min-scaled.jpg",
  "2+kk": "https://apartmany-marianska.cz/wp-content/uploads/2024/03/2kk_n1-min-scaled.jpg",
  "3+kk": "https://apartmany-marianska.cz/wp-content/uploads/2024/03/3kk_n1-min-scaled.jpg"
};

const apartments = [
  { id: "A1", floor: "1NP", layout: "2+kk", layoutLabel: "2+kk · bezbariérový", area: 65.8, garden: 50, terrace: 29, cellarParking: "7,2; S1", price: 10221000, planPdf: "A001-Marianska-pdf-2.pdf", available: true },
  { id: "A2", floor: "1NP", layout: "1+kk", layoutLabel: "1+kk", area: 32, garden: 26, terrace: 10, cellarParking: "5,0; P2", price: 4938500, planPdf: "A002-Marianska-PDF-1.pdf", available: true },
  { id: "A3", floor: "1NP", layout: "1+kk", layoutLabel: "1+kk", area: 34.3, garden: 26, terrace: 10, cellarParking: "5,6; P9", price: 4968500, planPdf: "A003-Marianska-PDF.pdf", available: true },
  { id: "A4", floor: "1NP", layout: "2+kk", layoutLabel: "2+kk", area: 69.1, garden: 50, terrace: 29, cellarParking: "8,0; S2", price: 10261000, planPdf: "A004-Marianska-PDF.pdf", available: true },
  { id: "A5", floor: "2NP", layout: "3+kk", layoutLabel: "3+kk", area: 73.4, garden: null, terrace: 25.7, cellarParking: "11,5; P4", price: 11197000, planPdf: "A005-Marianska-PDF.pdf", available: true },
  { id: "A6", floor: "2NP", layout: "2+kk", layoutLabel: "2+kk", area: 55.2, garden: null, terrace: 14, cellarParking: "7,5; P3", price: 7523000, planPdf: "A006-Marianska-PDF.pdf", available: true },
  { id: "A7", floor: "2NP", layout: "2+kk", layoutLabel: "2+kk", area: 49.8, garden: null, terrace: 14, cellarParking: "5,75; P8", price: 7435500, planPdf: "A007-Marianska-PDF.pdf", available: true },
  { id: "A8", floor: "2NP", layout: "3+kk", layoutLabel: "3+kk", area: 73.4, garden: null, terrace: 25.7, cellarParking: "7,5; P7", price: 10997000, planPdf: "A008-Marianska-PDF.pdf", available: true },
  { id: "A9", floor: "3NP - podkroví", layout: "3+kk", layoutLabel: "3+kk", area: 83.6, garden: null, terrace: 5.2, cellarParking: "11,5; P1", price: 11103500, planPdf: "A009-Marianska-PDF.pdf", available: true },
  { id: "A10", floor: "3NP - podkroví", layout: "2+kk", layoutLabel: "2+kk", area: 55.3, garden: null, terrace: 15, cellarParking: "7,2; P5", price: null, planPdf: "A0010-Marianska-PDF.pdf", available: true },
  { id: "A11", floor: "3NP - podkroví", layout: "2+kk", layoutLabel: "2+kk", area: 55.3, garden: null, terrace: 15, cellarParking: "5,6; P6", price: 7478000, planPdf: "A0011-Marianska-PDF.pdf", available: true },
  { id: "A12", floor: "3NP - podkroví", layout: "3+kk", layoutLabel: "3+kk", area: 83.6, garden: null, terrace: 5.2, cellarParking: "10,0; P10", price: 11028500, planPdf: "A0012-Marianska-PDF.pdf", available: true }
];

const floorLabels = {
  "1NP": "1. NP",
  "2NP": "2. NP",
  "3NP - podkroví": "3. NP · podkroví"
};

const formatArea = (value) => `${new Intl.NumberFormat("cs-CZ", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2
}).format(value)} m²`;

const formatPrice = (value) => value === null
  ? "Cena na dotaz"
  : `${new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(value)} Kč`;

let selectedUnitId = null;
let onlyAvailable = false;

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

function syncFloorButtons() {
  document.querySelectorAll("[data-floor-choice]").forEach((button) => {
    button.setAttribute("aria-pressed", String(floorFilter.value === button.dataset.floorChoice));
  });
}

function getVisibleApartments() {
  const visible = apartments.filter((apartment) => {
    const matchesLayout = !layoutFilter.value || apartment.layout === layoutFilter.value;
    const matchesFloor = !floorFilter.value || apartment.floor === floorFilter.value;
    const matchesAvailability = !onlyAvailable || apartment.available;
    return matchesLayout && matchesFloor && matchesAvailability;
  });

  const sortBy = sortFilter.value;
  visible.sort((a, b) => {
    if (sortBy === "area-asc") return a.area - b.area || a.id.localeCompare(b.id, "cs");
    if (sortBy === "area-desc") return b.area - a.area || a.id.localeCompare(b.id, "cs");
    if (sortBy === "price-asc" || sortBy === "price-desc") {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return sortBy === "price-asc" ? a.price - b.price : b.price - a.price;
    }
    return a.id.localeCompare(b.id, "cs", { numeric: true });
  });
  return visible;
}

function renderApartments() {
  const visible = getVisibleApartments();
  unitCount.textContent = `Zobrazeno ${visible.length} z ${apartments.length} apartmánů`;
  unitEmpty.hidden = visible.length > 0;
  unitList.innerHTML = visible.map((apartment) => `
    <button class="unit-card" type="button" data-unit-card="${apartment.id}" aria-pressed="${selectedUnitId === apartment.id}">
      <span class="unit-card__topline"><span>${apartment.id}</span><span class="unit-card__status"><i></i>${apartment.available ? "Volný" : "Rezervovaný"}</span></span>
      <span class="unit-card__layout">${apartment.layoutLabel}</span>
      <span class="unit-card__meta">${floorLabels[apartment.floor]} <span>·</span> ${formatArea(apartment.area)}</span>
      <span class="unit-card__price">${formatPrice(apartment.price)}</span>
      <span class="unit-card__open">Zobrazit detail <span aria-hidden="true">↗</span></span>
    </button>
  `).join("");

  if (selectedUnitId && !visible.some((apartment) => apartment.id === selectedUnitId)) {
    closeUnitDetail();
  }
}

function showUnitDetail(apartment) {
  selectedUnitId = apartment.id;
  renderApartments();

  const photo = document.querySelector("#unit-detail-photo");
  photo.src = apartmentPhotos[apartment.layout];
  photo.alt = `Orientační vizualizace interiéru apartmánu ${apartment.id}, dispozice ${apartment.layout}`;
  document.querySelector("#unit-detail-photo-caption").textContent = `Orientační vizualizace · ${apartment.layout}`;
  document.querySelector("#unit-detail-title").textContent = `Apartmán ${apartment.id} · ${apartment.layoutLabel}`;
  document.querySelector("#unit-detail-status").textContent = apartment.available ? "Volný dle zveřejněného ceníku" : "Rezervovaný";
  document.querySelector("#unit-detail-price").textContent = formatPrice(apartment.price);
  document.querySelector("#unit-detail-note").textContent = apartment.price === null
    ? "Cena je v online ceníku zapsaná nejednoznačně. Ověřte ji prosím u prodejce."
    : "Plocha je převzatá z detailní karty apartmánu; online ceník u některých jednotek uvádí jinou výměru. Cenu a dostupnost vám potvrdí prodejce.";
  document.querySelector("#unit-plan").href = `https://apartmany-marianska.cz/wp-content/uploads/2026/06/${apartment.planPdf}`;

  const specs = [
    ["Podlaží", floorLabels[apartment.floor]],
    ["Podlahová plocha", formatArea(apartment.area)],
    ["Předzahrádka", apartment.garden === null ? "—" : formatArea(apartment.garden)],
    ["Terasa", formatArea(apartment.terrace)],
    ["Sklep / parkovací stání dle ceníku", apartment.cellarParking]
  ];
  unitSpecs.innerHTML = specs.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");

  const subject = encodeURIComponent(`Nezávazný dotaz – apartmán ${apartment.id}`);
  const body = encodeURIComponent(`Dobrý den,\n\nmám zájem o více informací k apartmánu ${apartment.id} (${apartment.layoutLabel}, ${formatArea(apartment.area)}), ${floorLabels[apartment.floor]}.\n\nProsím o potvrzení aktuální ceny a dostupnosti.\n\nDěkuji.`);
  unitInquiry.href = `mailto:marketa.francova@bcas.cz?subject=${subject}&body=${body}`;
  unitDetail.hidden = false;
  unitDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeUnitDetail() {
  selectedUnitId = null;
  unitDetail.hidden = true;
  document.querySelectorAll("[data-unit-card]").forEach((button) => button.setAttribute("aria-pressed", "false"));
}

layoutFilter.addEventListener("change", renderApartments);
floorFilter.addEventListener("change", () => {
  syncFloorButtons();
  renderApartments();
});
sortFilter.addEventListener("change", renderApartments);
availabilityFilter.addEventListener("click", () => {
  onlyAvailable = !onlyAvailable;
  availabilityFilter.setAttribute("aria-pressed", String(onlyAvailable));
  renderApartments();
});

document.querySelectorAll("[data-floor-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    floorFilter.value = button.dataset.floorChoice;
    syncFloorButtons();
    renderApartments();
  });
});

document.querySelector(".building-stack").addEventListener("click", (event) => {
  const marker = event.target.closest("[data-unit-id]");
  if (!marker) return;
  const apartment = apartments.find((unit) => unit.id === marker.dataset.unitId);
  if (!apartment) return;
  floorFilter.value = apartment.floor;
  layoutFilter.value = "";
  syncFloorButtons();
  renderApartments();
  showUnitDetail(apartment);
});

unitList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-unit-card]");
  if (!card) return;
  const apartment = apartments.find((unit) => unit.id === card.dataset.unitCard);
  if (apartment) showUnitDetail(apartment);
});

document.querySelector("#close-unit-detail").addEventListener("click", closeUnitDetail);

document.querySelectorAll("[data-layout-filter]").forEach((card) => {
  card.addEventListener("click", () => {
    layoutFilter.value = card.dataset.layoutFilter;
    floorFilter.value = "";
    syncFloorButtons();
    renderApartments();
  });
});

renderApartments();
syncFloorButtons();
