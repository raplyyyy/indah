/* ==================================================
   BIRTHDAY WEBSITE — script.js
   For: Indah Fatyka Sari 💜
================================================== */

/* ---- INTRO OVERLAY + MUSIC AUTOPLAY (IFrame API) ---- */
let ytPlayer     = null;
let playerReady  = false;
let musicStarted = false;
let isMuted      = false;

const introOverlay = document.getElementById('introOverlay');
const enterBtn     = document.getElementById('enterBtn');
const muteBtn      = document.getElementById('muteBtn');

// The NEW Video ID provided by the user: GZ4vaTRn0HU
const NEW_VIDEO_ID = 'GZ4vaTRn0HU';

// Load YouTube IFrame API
(function loadYTApi() {
  const tag = document.createElement('script');
  tag.src   = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
})();

// YouTube IFrame API callback
window.onYouTubeIframeAPIReady = function() {
  const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
  ytPlayer = new YT.Player('ytPlayer', {
    host: 'https://www.youtube.com',
    playerVars: {
      'autoplay': 0,
      'mute': 0,
      'enablejsapi': 1,
      'origin': origin,
      'playlist': NEW_VIDEO_ID,
      'loop': 1,
      'rel': 0
    },
    events: {
      'onReady': (e) => { 
        playerReady = true; 
        e.target.setVolume(95);
        enterBtn.innerHTML = '<span class="enter-icon">▶</span><span>Open your gift</span>';
        enterBtn.disabled = false;
      },
      'onError': (e) => {
        console.error('YT Player Error:', e.data);
      }
    }
  });
};

// Disable button until player is ready
enterBtn.disabled = true;
enterBtn.innerHTML = '<span class="loading-spinner"></span><span>Loading magic...</span>';

enterBtn.addEventListener('click', function () {
  if (musicStarted) return;
  musicStarted = true;

  // Force play inside click
  if (playerReady && ytPlayer) {
    try {
      ytPlayer.unMute();
      ytPlayer.playVideo();
      console.log('Music started via API ✅');
    } catch(err) {
      console.error('Play failed:', err);
    }
  } else {
    // Fallback: force src change if API is slow
    const ytFrame = document.getElementById('ytPlayer');
    const origin = window.location.origin;
    ytFrame.src = `https://www.youtube.com/embed/${NEW_VIDEO_ID}?autoplay=1&mute=0&enablejsapi=1&origin=${origin}`;
  }

  // Fade out
  introOverlay.classList.add('fade-out');
  setTimeout(() => { introOverlay.style.display = 'none'; }, 1000);
});

muteBtn.addEventListener('click', function () {
  if (!playerReady || !ytPlayer) return;
  if (isMuted) {
    ytPlayer.unMute();
    isMuted = false;
    muteBtn.textContent = '🔊 Now playing';
    muteBtn.classList.remove('muted');
  } else {
    ytPlayer.mute();
    isMuted = true;
    muteBtn.textContent = '🔇 Muted';
    muteBtn.classList.add('muted');
  }
});


/* ---- INTRO CANVAS (star particles on overlay) ---- */
const introCanvas = document.getElementById('introCanvas');
const ictx        = introCanvas.getContext('2d');

function resizeIntroCanvas () {
  introCanvas.width  = window.innerWidth;
  introCanvas.height = window.innerHeight;
}
resizeIntroCanvas();
window.addEventListener('resize', resizeIntroCanvas);

const introStars = Array.from({ length: 180 }, () => ({
  x:   Math.random() * introCanvas.width,
  y:   Math.random() * introCanvas.height,
  r:   Math.random() * 1.3 + 0.2,
  op:  Math.random(),
  spd: Math.random() * 0.015 + 0.004,
  dir: Math.random() > 0.5 ? 1 : -1,
}));

function drawIntroStars() {
  if (!introCanvas.isConnected) return;
  ictx.clearRect(0, 0, introCanvas.width, introCanvas.height);
  for (const s of introStars) {
    s.op += s.spd * s.dir;
    if (s.op >= 1 || s.op <= 0.05) s.dir *= -1;
    ictx.beginPath();
    ictx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ictx.fillStyle = `rgba(255,255,255,${s.op})`;
    ictx.fill();
  }
  requestAnimationFrame(drawIntroStars);
}
drawIntroStars();


/* ---- STAR / PARTICLE CANVAS (main bg) ---- */
const canvas = document.getElementById('starCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const stars = Array.from({ length: 220 }, () => ({
  x:   Math.random() * canvas.width,
  y:   Math.random() * canvas.height,
  r:   Math.random() * 1.4 + 0.2,
  op:  Math.random(),
  spd: Math.random() * 0.018 + 0.004,
  dir: Math.random() > 0.5 ? 1 : -1,
  dx:  (Math.random() - 0.5) * 0.08,
  dy:  (Math.random() - 0.5) * 0.03,
}));

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const s of stars) {
    s.op += s.spd * s.dir;
    if (s.op >= 1 || s.op <= 0.05) s.dir *= -1;
    s.x = (s.x + s.dx + canvas.width)  % canvas.width;
    s.y = (s.y + s.dy + canvas.height) % canvas.height;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${s.op})`;
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}
drawStars();


/* ---- CUSTOM CURSOR ---- */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mousedown', () => {
  cursor.style.transform = 'translate(-50%,-50%) scale(0.7)';
});
document.addEventListener('mouseup', () => {
  cursor.style.transform = 'translate(-50%,-50%) scale(1)';
});


/* ---- FLOATING HEARTS ---- */
const heartsEl = document.getElementById('floatingHearts');
const SYMBOLS  = ['💜', '💙', '🩷', '✨', '💫', '⭐', '🌸'];

function spawnHeart() {
  const el = document.createElement('div');
  el.className   = 'heart';
  el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  el.style.left     = Math.random() * 100 + 'vw';
  el.style.fontSize = (Math.random() * 1.4 + 0.7) + 'rem';
  const dur = Math.random() * 9 + 6;
  el.style.animationDuration = dur + 's';
  el.style.animationDelay    = Math.random() * 2 + 's';
  heartsEl.appendChild(el);
  setTimeout(() => el.remove(), (dur + 3) * 1000);
}

for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 250);
setInterval(spawnHeart, 900);


/* ---- COUNTDOWN TIMER ---- */
const BIRTHDAY = new Date('2026-03-21T00:00:00+08:00');

const elDays    = document.getElementById('days');
const elHours   = document.getElementById('hours');
const elMinutes = document.getElementById('minutes');
const elSeconds = document.getElementById('seconds');
const elCont    = document.getElementById('countdownContainer');
const elMsg     = document.getElementById('birthdayMsg');

function setVal(el, val) {
  const str = String(val).padStart(2, '0');
  if (el.textContent !== str) {
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
    el.textContent = str;
  }
}

function tick() {
  const now  = new Date();
  const diff = BIRTHDAY - now;

  if (diff <= 0) {
    elCont.classList.add('hidden');
    elMsg.classList.remove('hidden');
    launchConfetti();
    return;
  }

  setVal(elDays,    Math.floor(diff / 86400000));
  setVal(elHours,   Math.floor((diff % 86400000) / 3600000));
  setVal(elMinutes, Math.floor((diff % 3600000)  / 60000));
  setVal(elSeconds, Math.floor((diff % 60000)    / 1000));
  setTimeout(tick, 1000);
}
tick();

function launchConfetti() {
  const colors = ['#f472b6','#a78bfa','#60a5fa','#fb7185','#fbbf24'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const div = document.createElement('div');
      div.style.cssText = `
        position:fixed; left:${Math.random()*100}vw; top:-10px;
        width:${Math.random()*8+4}px; height:${Math.random()*8+4}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        border-radius:${Math.random()>0.5?'50%':'2px'};
        z-index:9998; pointer-events:none;
        animation:confettiFall ${Math.random()*3+2}s ease-in forwards;
      `;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 5000);
    }, i * 60);
  }
}

const styleTag = document.createElement('style');
styleTag.textContent = `
  @keyframes confettiFall {
    from { transform: translateY(-10px) rotate(0); opacity:1; }
    to   { transform: translateY(105vh) rotate(720deg); opacity:0; }
  }
`;
document.head.appendChild(styleTag);


/* ---- NAV DOTS ---- */
const dots     = document.querySelectorAll('.dot');
const sections = document.querySelectorAll('.section');

const secObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const i = [...sections].indexOf(entry.target);
      dots.forEach((d, di) => d.classList.toggle('active', di === i));
    }
  }
}, { threshold: 0.45 });

sections.forEach(s => secObserver.observe(s));

dots.forEach((dot, i) => {
  dot.addEventListener('click', () =>
    sections[i]?.scrollIntoView({ behavior: 'smooth' })
  );
});


/* ---- SCROLL FADE-IN ---- */
const fadeEls = document.querySelectorAll('.fade-in');

const fadeObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || '0');
      setTimeout(() => entry.target.classList.add('visible'), delay);
      fadeObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.15 });

fadeEls.forEach(el => fadeObserver.observe(el));


/* ---- CLICK SPARKLE ---- */
const SPARKLE_COLORS = ['#f472b6','#a78bfa','#60a5fa','#fb7185','#fbbf24','#34d399'];

document.addEventListener('click', (e) => {
  if (e.target.closest('#introOverlay')) return; // no sparkle on intro
  for (let i = 0; i < 8; i++) createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
  const el    = document.createElement('div');
  const angle = Math.random() * Math.PI * 2;
  const dist  = Math.random() * 70 + 20;
  const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
  const size  = Math.random() * 6 + 3;
  el.style.cssText = `
    position:fixed; left:${x}px; top:${y}px;
    width:${size}px; height:${size}px;
    border-radius:50%; background:${color};
    pointer-events:none; z-index:9997;
    --dx:${Math.cos(angle)*dist}px; --dy:${Math.sin(angle)*dist}px;
    animation:sparkle-out 0.65s ease forwards;
    box-shadow:0 0 6px ${color};
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 700);
}

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  @keyframes sparkle-out {
    0%   { transform:translate(-50%,-50%) scale(1); opacity:1; }
    100% { transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(0); opacity:0; }
  }
`;
document.head.appendChild(sparkleStyle);
