// Theme toggle
function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute('data-theme');
  body.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
}

// Qibla Compass
function calculateQibla(lat, lon) {
  const kaabaLat = 21.4225;
  const kaabaLon = 39.8262;

  const φ1 = lat * (Math.PI / 180);
  const φ2 = kaabaLat * (Math.PI / 180);
  const Δλ = (kaabaLon - lon) * (Math.PI / 180);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1)*Math.sin(φ2) - Math.sin(φ1)*Math.cos(φ2)*Math.cos(Δλ);
  let θ = Math.atan2(y, x) * (180 / Math.PI);
  θ = (θ + 360) % 360;
  return θ;
}

function drawCompass(angle) {
  const canvas = document.getElementById('qibla-compass');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const center = canvas.width / 2;
  const radius = center - 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2*Math.PI);
  ctx.strokeStyle = 'var(--border-color)';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate((angle - 90) * Math.PI / 180);
  ctx.beginPath();
  ctx.moveTo(0, -radius+10);
  ctx.lineTo(5,0);
  ctx.lineTo(-5,0);
  ctx.closePath();
  ctx.fillStyle = 'var(--gold-color)';
  ctx.fill();
  ctx.restore();
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const angle = calculateQibla(lat, lon);
    drawCompass(angle);
    document.getElementById('qibla-angle').innerText = `Qibla: ${Math.round(angle)}° from North`;
  }, () => {
    document.getElementById('qibla-angle').innerText = 'Location denied.';
  });
} else {
  document.getElementById('qibla-angle').innerText = 'Geolocation not supported.';
}

// Daily Quote
const quotes = [
  "Indeed, Allah is with the patient. — Quran 2:153",
  "And We have not sent you, [O Muhammad], except as a mercy to the worlds. — Quran 21:107",
  "The best among you are those who learn the Quran and teach it. — Prophet Muhammad ﷺ",
  "Do good deeds properly, sincerely and moderately. — Prophet Muhammad ﷺ"
];
document.getElementById('quote-container').innerText = quotes[Math.floor(Math.random()*quotes.length)];
