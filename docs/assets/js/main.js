// Mobile menu behaviour - robust and safe (verifica existencia)
(function(){
  const hamb = document.getElementById('hambBtn');
  const mobileWrap = document.getElementById('mobileWrap');
  const mobileNav = document.getElementById('mobileNav');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  if(!hamb || !mobileWrap || !mobileNav || !mobileOverlay || !mobileClose){
    // elementos no encontrados -> no hacemos nada
    return;
  }

  function setAriaExpanded(state){
    hamb.setAttribute('aria-expanded', state ? 'true' : 'false');
  }

  function openMobile(){
    mobileWrap.classList.add('open');
    mobileWrap.setAttribute('aria-hidden','false');
    setAriaExpanded(true);
    hamb.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    // lock scroll
    document.body.style.overflow = 'hidden';
    // focus first link for accessibility
    const firstLink = mobileNav.querySelector('a, button');
    if(firstLink) firstLink.focus();
  }

  function closeMobile(){
    mobileWrap.classList.remove('open');
    mobileWrap.setAttribute('aria-hidden','true');
    setAriaExpanded(false);
    hamb.innerHTML = '<i class="fas fa-bars" aria-hidden="true"></i>';
    document.body.style.overflow = '';
    hamb.focus();
  }

  hamb.addEventListener('click', ()=> {
    if(mobileWrap.classList.contains('open')) closeMobile();
    else openMobile();
  });

  mobileOverlay.addEventListener('click', closeMobile);
  mobileClose.addEventListener('click', closeMobile);

  // close on ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && mobileWrap.classList.contains('open')) closeMobile();
  });

  // close when clicking a nav link (mobile)
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      setTimeout(closeMobile, 120);
    });
  });

  // Optional: close when resizing to desktop to avoid stuck states
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    if(w > 900 && lastW <= 900 && mobileWrap.classList.contains('open')){
      // if moving to desktop, close mobile menu
      closeMobile();
    }
    lastW = w;
  });
})();


/* -----------------------
       IntersectionObserver reveal
       ----------------------- */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('show');
      else entry.target.classList.remove('show');
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* -----------------------
       Hero parallax
       ----------------------- */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  const y = window.scrollY / 1200;
  if (heroBg) heroBg.style.transform = `scale(${1 + y * 0.03}) translateY(${y * 28}px)`;
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobile();
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Tab') document.body.classList.add('show-focus');
});

/* =======================
       Small accessibility / focus improvements
       ======================= */
// Allow focusing cards via keyboard
document.querySelectorAll('.catalog-card, .card .cta').forEach((el) => el.setAttribute('tabindex', '0'));
