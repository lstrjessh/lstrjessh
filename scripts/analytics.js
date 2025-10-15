// Lightweight visit analytics using CountAPI (no account required).
// It increments a global counter and a per-day counter, then renders a 7-day sparkline.
(async function () {
  const namespace = "lstrjessh_portfolio"; // change if you want a different namespace
  const keyGlobal = "visits";
  const root = document.getElementById("analytics-root");
  const totalEl = document.getElementById("visits-total");
  const sparkEl = document.getElementById("sparkline");

  function countApiHit(key) {
    return fetch(`https://api.countapi.xyz/hit/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`)
      .then(r => r.json())
      .catch(() => ({ value: null }));
  }
  function countApiGet(key) {
    return fetch(`https://api.countapi.xyz/get/${encodeURIComponent(namespace)}/${encodeURIComponent(key)}`)
      .then(r => r.json())
      .catch(() => ({ value: null }));
  }

  // increment global and today's counter
  const today = new Date();
  const pad = n => (n < 10 ? "0"+n : n);
  const yyyy = today.getFullYear();
  const mm = pad(today.getMonth()+1);
  const dd = pad(today.getDate());
  const todayKey = `visits-${yyyy}-${mm}-${dd}`;

  try {
    await countApiHit(keyGlobal);
    await countApiHit(todayKey);
  } catch (e) {
    // ignore any network errors
  }

  // fetch total and last 7 days
  const total = await countApiGet(keyGlobal);
  totalEl.textContent = total && total.value != null ? total.value.toLocaleString() : "—";

  // gather last 7 days
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const ky = `visits-${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    days.push({ key: ky, label: `${d.getMonth()+1}/${d.getDate()}` });
  }

  const values = await Promise.all(days.map(d => countApiGet(d.key)));
  const nums = values.map(v => (v && v.value) ? v.value : 0);

  // render simple sparkline as inline SVG
  const w = Math.max(180, nums.length * 24);
  const h = 40;
  const padX = 4;
  const max = Math.max(1, ...nums);
  const points = nums.map((n, i) => {
    const x = padX + (i * ((w - padX*2)/(nums.length-1 || 1)));
    const y = h - ((n / max) * (h - 6));
    return `${x},${y}`;
  }).join(" ");
  const bars = nums.map((n, i) => {
    const x = padX + (i * ((w - padX*2)/(nums.length-1 || 1))) - 6;
    const barH = ((n / max) * (h - 10));
    return `<rect x="${x}" y="${h-6-barH}" width="12" height="${barH}" rx="3" fill="rgba(110,231,183,0.9)"></rect>`;
  }).join("");
  sparkEl.innerHTML = `
    <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y1="1">
        <stop offset="0%" stop-color="rgba(110,231,183,0.15)"/><stop offset="100%" stop-color="rgba(110,231,183,0)"/>
      </linearGradient></defs>
      <rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="transparent"></rect>
      ${bars}
      <polyline fill="none" stroke="rgba(110,231,183,0.9)" stroke-width="2.2" points="${points}" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>
  `;

})();