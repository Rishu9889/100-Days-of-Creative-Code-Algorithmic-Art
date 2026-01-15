const gallery = document.getElementById("gallery");

let page = 1;
let loading = false;

// Create one artwork card
function createArtwork(index) {
  const card = document.createElement("div");
  card.className = "art-card";

  const img = document.createElement("img");
  img.loading = "lazy";
  img.src = `https://picsum.photos/seed/gallery-${page}-${index}/700/900`;

  const info = document.createElement("div");
  info.className = "art-info";
  info.innerHTML = `
    <strong>Artwork ${page}-${index}</strong>
    <span>Digital Exhibition</span>
  `;

  card.appendChild(img);
  card.appendChild(info);
  gallery.appendChild(card);
}

// Load a batch of artworks
function loadArtworks(count = 12) {
  if (loading) return;
  loading = true;

  for (let i = 1; i <= count; i++) {
    createArtwork(i);
  }

  page++;
  loading = false;
}

// Infinite scroll handler
function handleScroll() {
  const scrollPos = window.innerHeight + window.scrollY;
  const threshold = document.body.offsetHeight - 600;

  if (scrollPos > threshold) {
    loadArtworks(8);
  }
}

// Initial load
loadArtworks(16);

// Listen for scroll
window.addEventListener("scroll", handleScroll);
