// ===== YAPILANDIRMA =====
const TOTAL_PAGES = 20;                     // ← PNG sayfa sayısı
const IMG_DIR = "img";                      // görsellerin klasörü
const NAME = (i) => `p-${String(i).padStart(2,"0")}.png`; // p-01.png
// ========================

const pageImg  = document.getElementById("pageImg");
const turnImg  = document.getElementById("turnImg");
const prevBtn  = document.getElementById("prevBtn");
const nextBtn  = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let current = 1; // 1-based

init();

async function init(){
  setPageHeight();                // ilk hesap
  await renderPage();
  updateNav();
  // Klavye okları
  window.addEventListener("keydown",(e)=>{
    if(e.key==="ArrowRight") next();
    if(e.key==="ArrowLeft")  prev();
  },{passive:true});
  // Boyut değişince yükseklik tekrar hesapla
  window.addEventListener("resize", setPageHeight);
  window.addEventListener("load", setPageHeight);
}

// --- Topbar yüksekliğini hesapla ve CSS değişkenine kaydet ---
function setPageHeight() {
  const topbar = document.querySelector('.topbar');
  const topbarH = topbar ? topbar.offsetHeight : 45;

  // Topbar yüksekliğini CSS değişkenine kaydet
  document.documentElement.style.setProperty('--topbar-height', `${topbarH}px`);
}

function srcFor(n){ return `${IMG_DIR}/${NAME(n)}`; }

function preload(src){
  return new Promise((resolve)=>{
    const im = new Image();
    im.onload = ()=>resolve(true);
    im.onerror = ()=>resolve(false);
    im.src = src;
  });
}

async function renderPage(){
  const src = srcFor(current);
  await preload(src);
  pageImg.src = src;
  pageImg.alt = `Sayfa ${current}`;
  pageInfo.textContent = `Sayfalar: ${current} / ${TOTAL_PAGES}`;

  // Sonraki sayfayı ısıt
  if(current < TOTAL_PAGES) preload(srcFor(current+1));
}

function updateNav(){
  prevBtn.disabled = current <= 1;
  nextBtn.disabled = current >= TOTAL_PAGES;
}

async function next(){
  if(current >= TOTAL_PAGES) return;

  const page = document.querySelector('.page');

  // Fade-out animasyonu başlat
  page.classList.add("fade-out");

  // Animasyonun bitmesini bekle
  await wait(600);

  // Sayfayı değiştir
  current++;
  await renderPage();

  // Fade-out'u temizle, fade-in başlat
  page.classList.remove("fade-out");
  page.classList.add("fade-in");

  // Fade-in tamamlanınca class'ı temizle
  await wait(600);
  page.classList.remove("fade-in");

  updateNav();
}

async function prev(){
  if(current <= 1) return;

  const page = document.querySelector('.page');

  // Fade-out animasyonu başlat (ters yönde)
  page.classList.add("fade-out");

  // Animasyonun bitmesini bekle
  await wait(600);

  // Önceki sayfayı yükle
  current--;
  await renderPage();

  // Fade-out'u temizle, fade-in başlat
  page.classList.remove("fade-out");
  page.classList.add("fade-in");

  // Fade-in tamamlanınca class'ı temizle
  await wait(600);
  page.classList.remove("fade-in");

  updateNav();
}

prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);

function wait(ms){ return new Promise(r=>setTimeout(r,ms)); }
