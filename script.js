const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const modes = {
  coach: {
    label: 'COACH MODE', title: 'Il tuo business.<br />Una marcia in più.',
    text: 'Gestisci più clienti, meglio. Automatizza il lavoro ripetitivo e dedica il tuo tempo a ciò che nessuna AI può sostituire: la relazione.',
    items: ['Dashboard clienti e check-in','Programmi e diete riutilizzabili','Report, progressi e messaggistica','Branding e gestione team'],
    cta: 'Scopri Coach Mode'
  },
  self: {
    label: 'SELF COACH', title: 'La tua performance.<br />Senza compromessi.',
    text: 'Pianifica e monitora ogni dettaglio del tuo percorso in autonomia, con strumenti professionali e un copilota AI sempre al tuo fianco.',
    items: ['Schede e progressioni avanzate','Diete, pasti e monitoraggio macro','Mappa 3D dei muscoli allenati','Analisi e suggerimenti AI personali'],
    cta: 'Scopri Self Coach'
  }
};

document.querySelectorAll('.mode-tabs button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode-tabs button').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    const mode = modes[button.dataset.mode];
    const panel = document.querySelector('.mode-copy');
    panel.animate([{opacity:.2, transform:'translateY(8px)'},{opacity:1, transform:'none'}], {duration:320});
    panel.querySelector('.mode-label').textContent = mode.label;
    panel.querySelector('h3').innerHTML = mode.title;
    panel.querySelector('p').textContent = mode.text;
    panel.querySelector('ul').innerHTML = mode.items.map(i => `<li><i>✓</i>${i}</li>`).join('');
    panel.querySelector('.button').innerHTML = `${mode.cta} <span>↗</span>`;
  });
});

document.querySelectorAll('.accordion article button').forEach(button => {
  button.addEventListener('click', () => {
    const current = button.closest('article');
    document.querySelectorAll('.accordion article').forEach(a => { if(a !== current) a.classList.remove('open'); });
    current.classList.toggle('open');
  });
});

document.getElementById('waitlistForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  const button = form.querySelector('button[type="submit"]');
  const message = document.getElementById('formMessage');
  const originalButton = button.innerHTML;

  form.classList.add('is-sending');
  button.textContent = 'Invio in corso…';
  message.textContent = 'Stiamo inviando la tua candidatura in modo sicuro.';
  message.className = '';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) throw new Error('Invio non riuscito');

    form.reset();
    form.classList.remove('is-sending');
    form.classList.add('is-success');
    message.textContent = 'Candidatura inviata correttamente. Grazie per l’interesse in LEVELBODY!';
    message.className = 'form-success';
  } catch (error) {
    form.classList.remove('is-sending');
    button.innerHTML = originalButton;
    message.textContent = 'Non è stato possibile inviare la candidatura. Riprova tra poco.';
    message.className = 'form-error';
  }
});

// Consent manager: optional categories remain disabled until explicit consent.
const consentKey = 'levelbody_cookie_consent';
const banner = document.getElementById('cookieBanner');
const backdrop = document.getElementById('cookieBackdrop');
const options = document.getElementById('cookieOptions');
const customize = document.getElementById('cookieCustomize');
const save = document.getElementById('cookieSave');
const analytics = document.getElementById('analyticsConsent');
const marketing = document.getElementById('marketingConsent');

function readConsent() {
  try { return JSON.parse(localStorage.getItem(consentKey)); } catch { return null; }
}
function openConsent(settings = false) {
  const current = readConsent();
  analytics.checked = Boolean(current?.analytics);
  marketing.checked = Boolean(current?.marketing);
  banner.hidden = false;
  backdrop.hidden = false;
  options.hidden = !settings;
  save.hidden = !settings;
  customize.hidden = settings;
  document.body.style.overflow = 'hidden';
}
function closeConsent(choice) {
  localStorage.setItem(consentKey, JSON.stringify({ ...choice, necessary: true, updatedAt: new Date().toISOString(), version: 1 }));
  banner.hidden = true;
  backdrop.hidden = true;
  document.body.style.overflow = '';
  // Optional scripts may be loaded here only after checking the stored choice.
}
if (location.hash === '#cookie-settings') {
  setTimeout(() => openConsent(true), 250);
} else if (!readConsent()) {
  setTimeout(() => openConsent(false), 550);
}
customize.addEventListener('click', () => openConsent(true));
document.getElementById('cookieEssential').addEventListener('click', () => closeConsent({ analytics: false, marketing: false }));
document.getElementById('cookieAccept').addEventListener('click', () => closeConsent({ analytics: true, marketing: true }));
save.addEventListener('click', () => closeConsent({ analytics: analytics.checked, marketing: marketing.checked }));
document.querySelectorAll('[data-cookie-settings]').forEach(button => button.addEventListener('click', () => openConsent(true)));
