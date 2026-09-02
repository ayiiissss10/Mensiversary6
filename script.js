const SIZE = 6;
const TOTAL = SIZE * SIZE;
const BOARD = Math.min(window.innerWidth * 0.96, 650);
const CELL = BOARD / SIZE;
const PAD = CELL * 0.35;
const VB = CELL + 2 * PAD; // viewBox size per piece
const img = new Image();
img.src = 'img/foto.jpg';
// Ganti teks di bawah ini dengan surat aslimu.
// Baris baru (Enter) akan otomatis tampil sebagai paragraf baru.
const LETTER_TEXT = `Hai kesayanganku, selamat tanggal 3 yang ke-enam ya cantikk.

Udah enam bulan ya kita bareng bareng, sayang... kalo aku pikir pikir ternyata udah banyak hal yang kita lewatin bareng bareng. Mulai dari hal-hal kecil yang mungkin kelihatannya sederhana, sampai ada beberapa momen yang akhirnya buat kita belajar lebih banyak lagi tentang satu sama lain.

Aku sadar sayang, selama kita bareng aku belum bisa jadi pasangan yang terbaik, apalagi jadi pasangan sempurna buat kamu. Kadang aku masih salah, masih belum peka, masih bikin kamu kesel, sedih, bete, marah, ataupun kecewa sama aku. Tapi ada hal yang selalu harus kamu tau, sayang.... aku sayang banget sama kamu, aku selalu mau belajar jadi yang terbaik buat kamu dan buat kita.

Terima kasih udah jadi bagian dari diriku, hidupku dan hari hariku. Terima kasih kamu selalu mendengarkan cerita cerita aku, menerima diri aku dengan segala kurang dan lebihnya, mengadapi sifat aku yang nyebelin itu, dan terima kasih selalu nemenin aku disaat aku sedang sangat baik ataupun sedang ga baik baik aja.

Terima kasih kamu tetap bertahan meskipun hubungan kita ga selalu mudah untuk di lewatin ya sayang. Mungkin ada saatnya kita sama sama cape, ada salah paham, dan ada hari di mana semuanya terasa lebih berat dari yang biasanya. Tapi aku bersyukur sayang, sampai hari ini kita masih sama sama berusaha dan masih memilih satu sama lain.

Aku selalu suka cara kamu buat hari hari biasa terasa lebih bermakna, dan berarti. Bahkan cuma ngobrol, bercanda, atau sekedar mandangin kamu lewat layar, itu udah cukup buat aku senang. Sesederhana itu tapi buat aku merasa beruntung punya kamu di hidup akuu.

Aku ga cuma mau merayakan kita di hari ini. Aku mau terus merayakan kita di bulan bulan berikutnya, di tahun tahun yang akan datang. Aku mau mengenal kamu lebih jauh lagi, aku mau buat cerita sama kamu lebih lama lagi, aku mau terus belajar mencintai kamu dengan lebih baik.

Kalau nanti ada masa di mana kita cape, semoga kita ga memilih buat saling meninggalkan ya sayang. Kalau ada masalah, semoga kita memilih buat diobrolin baik baik. Kalau ada salah satu diantara kita lagi ga baik baik aja, semoga aku ataupun kamu bisa jadi tempat untuk pulang dan jadi tempat ternyaman satu sama lain.

Aku ga tau perjalanan kita kedepannya bakal seperti apa. Tapi kalo aku boleh berharap, aku mau tetap sama kamu selama mungkin. Aku mau liat lebih banyak senyum kamu, dengar lebih banyak cerita kamu, lewatin lebih banyak hari sama kamu, dan aku berharap suatu hari bisa liat kamu lebih dekat bukan lewat layar.

Selamat tanggal 3 yang ke-6 ya kecintaanku 🤍

Terima kasih udah jadi diri kamu sendiri sayang.
Terima kasih udah jadi rumah buat aku, tempat aku pulang sejauh apapun aku pergi.
Terima kasih udah membawa kebahagiaan buat aku sayang, bahkan lewat hal hal kecil yang mungkin ga kamu sadari.

aku sayang banget sama kamu anak kecilku.
I love you, i love u more than u know, i love u more than I know how to say 🤍`;
// ====================================

const boardWrap = document.getElementById('boardWrap');
const backdrop = document.getElementById('backdrop');
const piecesLayer = document.getElementById('piecesLayer');
const tray = document.getElementById('tray');
const correctCountEl = document.getElementById('correctCount');
const timerEl = document.getElementById('timer') || null;
const winEl = document.getElementById('win');

boardWrap.style.width = (BOARD + 2 * PAD) + 'px';
boardWrap.style.height = (BOARD + 2 * PAD) + 'px';
backdrop.style.left = PAD + 'px';
backdrop.style.top = PAD + 'px';
backdrop.style.width = BOARD + 'px';
backdrop.style.height = BOARD + 'px';
backdrop.style.backgroundSize = CELL + 'px ' + CELL + 'px';
piecesLayer.style.width = (BOARD + 2 * PAD) + 'px';
piecesLayer.style.height = (BOARD + 2 * PAD) + 'px';

let topSign = [], rightSign = [], bottomSign = [], leftSign = []; // [row][col]
let slots = [];
let trayOrder = [];
let selected = null; // index into trayOrder
let seconds = 0, timerInterval = null, started = false;

function rnd() { return Math.random() < 0.5 ? -1 : 1; }

function generateSigns() {
  // horizontal shared edges (between row r and r+1, same col c): SIZE-1 rows x SIZE cols
  const edgeH = [];
  for (let r = 0; r < SIZE - 1; r++) {
    const row = [];
    for (let c = 0; c < SIZE; c++) row.push(rnd());
    edgeH.push(row);
  }
  // vertical shared edges (between col c and c+1, same row r): SIZE rows x SIZE-1 cols
  const edgeV = [];
  for (let r = 0; r < SIZE; r++) {
    const row = [];
    for (let c = 0; c < SIZE - 1; c++) row.push(rnd());
    edgeV.push(row);
  }
  topSign = []; bottomSign = []; leftSign = []; rightSign = [];
  for (let r = 0; r < SIZE; r++) {
    topSign.push([]); bottomSign.push([]); leftSign.push([]); rightSign.push([]);
    for (let c = 0; c < SIZE; c++) {
      topSign[r][c]    = (r === 0) ? 0 : -edgeH[r-1][c];
      bottomSign[r][c] = (r === SIZE-1) ? 0 : edgeH[r][c];
      leftSign[r][c]   = (c === 0) ? 0 : -edgeV[r][c-1];
      rightSign[r][c]  = (c === SIZE-1) ? 0 : edgeV[r][c];
    }
  }
}

function edgePoint(lx, ly, orientation, rect) {
  const {x0,y0,x1,y1} = rect;
  switch (orientation) {
    case 'top':    return { x: x0 + lx, y: y0 + ly };
    case 'right':  return { x: x1 - ly, y: y0 + lx };
    case 'bottom': return { x: x1 - lx, y: y1 - ly };
    case 'left':   return { x: x0 + ly, y: y1 - lx };
  }
}

function edgeSegment(rect, orientation, sign) {
  const L = CELL;
  const neck1 = 0.35 * L, neck2 = 0.65 * L;
  const r = 0.15 * L;
  const pEnd = edgePoint(L, 0, orientation, rect);
  if (sign === 0) {
    return 'L' + pEnd.x.toFixed(2) + ',' + pEnd.y.toFixed(2) + ' ';
  }
  const p1 = edgePoint(neck1, 0, orientation, rect);
  const p2 = edgePoint(neck2, 0, orientation, rect);
  const sweep = sign > 0 ? 1 : 0;
  return 'L' + p1.x.toFixed(2) + ',' + p1.y.toFixed(2) +
         ' A' + r.toFixed(2) + ',' + r.toFixed(2) + ' 0 0,' + sweep + ' ' + p2.x.toFixed(2) + ',' + p2.y.toFixed(2) +
         ' L' + pEnd.x.toFixed(2) + ',' + pEnd.y.toFixed(2) + ' ';
}

function piecePathD(r, c) {
  const rect = { x0: PAD, y0: PAD, x1: PAD + CELL, y1: PAD + CELL };
  const start = edgePoint(0, 0, 'top', rect);
  let d = 'M' + start.x.toFixed(2) + ',' + start.y.toFixed(2) + ' ';
  d += edgeSegment(rect, 'top', topSign[r][c]);
  d += edgeSegment(rect, 'right', rightSign[r][c]);
  d += edgeSegment(rect, 'bottom', bottomSign[r][c]);
  d += edgeSegment(rect, 'left', leftSign[r][c]);
  d += 'Z';
  return d;
}

function makePieceSVG(value, sizePx) {
  const r = Math.floor(value / SIZE);
  const c = value % SIZE;
  const d = piecePathD(r, c);
  const clipId = 'clip-' + value + '-' + Math.random().toString(36).slice(2,7);
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 ' + VB + ' ' + VB);
  svg.setAttribute('width', sizePx);
  svg.setAttribute('height', sizePx);
  svg.dataset.value = value;

  const defs = document.createElementNS(svgNS, 'defs');
  const clip = document.createElementNS(svgNS, 'clipPath');
  clip.setAttribute('id', clipId);
  const clipPathEl = document.createElementNS(svgNS, 'path');
  clipPathEl.setAttribute('d', d);
  clip.appendChild(clipPathEl);
  defs.appendChild(clip);
  svg.appendChild(defs);

  const img = document.createElementNS(svgNS, 'image');
  img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', 'data:image/jpeg;base64,' + IMG_B64);
  img.setAttribute('href', 'data:image/jpeg;base64,' + IMG_B64);
  img.setAttribute('x', (PAD - c * CELL).toFixed(2));
  img.setAttribute('y', (PAD - r * CELL).toFixed(2));
  img.setAttribute('width', BOARD);
  img.setAttribute('height', BOARD);
  img.setAttribute('clip-path', 'url(#' + clipId + ')');
  img.setAttribute('preserveAspectRatio', 'none');
  svg.appendChild(img);

  const outline = document.createElementNS(svgNS, 'path');
  outline.setAttribute('d', d);
  outline.setAttribute('class', 'outline');
  svg.appendChild(outline);

  return svg;
}

function shuffle() {
  generateSigns();
  slots = new Array(TOTAL).fill(null);
  trayOrder = [];
  for (let i = 0; i < TOTAL; i++) trayOrder.push(i);
  for (let i = trayOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trayOrder[i], trayOrder[j]] = [trayOrder[j], trayOrder[i]];
  }
  selected = null;
  seconds = 0;
  if (timerEl) timerEl.textContent = '00:00';
  stopTimer();
  started = false;
  winEl.style.display = 'none';
  renderTray();
  renderBoard();
  updateStats();
}

function startTimer() {
  started = true;
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    seconds++;
    const m = String(Math.floor(seconds/60)).padStart(2,'0');
    const s = String(seconds%60).padStart(2,'0');
    if (timerEl) timerEl.textContent = m + ':' + s;
  }, 1000);
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

function renderTray() {
  tray.innerHTML = '';
  const traySize = Math.min(Math.max(window.innerWidth * 0.92, 320), 560) / 5;
  trayOrder.forEach((value, idx) => {
    const svg = makePieceSVG(value, traySize);
    svg.classList.add('tray-piece');
    if (selected === idx) svg.classList.add('selected');
    svg.addEventListener('click', () => onTrayClick(idx));
    tray.appendChild(svg);
  });
}

function renderBoard() {
  piecesLayer.innerHTML = '';
  slots.forEach((value, idx) => {
    if (value === null) return;
    const r = Math.floor(idx / SIZE);
    const c = idx % SIZE;
    const svg = makePieceSVG(value, VB);
    svg.classList.add('board-piece');
    svg.style.left = (c * CELL) + 'px';
    svg.style.top = (r * CELL) + 'px';
    piecesLayer.appendChild(svg);
  });
}

function updateStats() {
  const correct = slots.filter(v => v !== null).length;
  correctCountEl.textContent = correct;
  if (correct === TOTAL) {
    winEl.style.display = 'block';
    stopTimer();
    document.getElementById('letterSection').style.display = 'block';
  }
}

document.getElementById('paperInner').textContent = LETTER_TEXT;

document.getElementById('openLetterBtn').addEventListener('click', () => {
  const btn = document.getElementById('openLetterBtn');
  const scrollWrap = document.getElementById('scrollWrap');
  const paper = document.getElementById('paper');
  btn.style.display = 'none';
  scrollWrap.style.display = 'block';
  const targetHeight = document.getElementById('paperInner').scrollHeight;
  requestAnimationFrame(() => {
    paper.style.height = targetHeight + 'px';
  });
});

function onTrayClick(idx) {
  if (!started) startTimer();
  selected = (selected === idx) ? null : idx;
  renderTray();
}

function flashWrong(r, c) {
  const div = document.createElement('div');
  div.className = 'flash';
  div.style.left = (PAD + c * CELL) + 'px';
  div.style.top = (PAD + r * CELL) + 'px';
  div.style.width = CELL + 'px';
  div.style.height = CELL + 'px';
  boardWrap.appendChild(div);
  setTimeout(() => div.remove(), 450);
}

backdrop.addEventListener('click', (e) => {
  if (!started) startTimer();
  const rect = backdrop.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const c = Math.floor(x / CELL);
  const r = Math.floor(y / CELL);
  if (c < 0 || c >= SIZE || r < 0 || r >= SIZE) return;
  const idx = r * SIZE + c;
  if (slots[idx] !== null) return; // already filled, locked

  if (selected === null) {
    flashWrong(r, c);
    return;
  }
  const pieceValue = trayOrder[selected];
  if (pieceValue === idx) {
    // correct!
    slots[idx] = pieceValue;
    trayOrder.splice(selected, 1);
    selected = null;
    renderTray();
    renderBoard();
    updateStats();
  } else {
    // wrong: kembalikan ke tempatnya (tetap di tray)
    flashWrong(r, c);
    selected = null;
    renderTray();
  }
});

document.getElementById('shuffleBtn').addEventListener('click', shuffle);

let previewShown = false;
document.getElementById('previewBtn').addEventListener('click', () => {
  const img = document.getElementById('preview');
  const label = document.getElementById('previewLabel');
  previewShown = !previewShown;
  img.style.display = previewShown ? 'block' : 'none';
  label.style.display = previewShown ? 'block' : 'none';
});

shuffle();

/* Mobile viewport safeguard: keeps the puzzle board inside the phone screen. */
(function () {
  function fitBoardForMobile() {
    const wrap = document.getElementById('boardWrap');
    if (!wrap) return;

    const maxW = Math.min(window.innerWidth - 16, 560);
    if (wrap.style.width && wrap.style.width.includes('px')) {
      const current = parseFloat(wrap.style.width);
      if (!Number.isNaN(current) && current > maxW) {
        wrap.style.width = maxW + 'px';
      }
    }
  }

  window.addEventListener('resize', fitBoardForMobile, { passive: true });
  window.addEventListener('orientationchange', fitBoardForMobile, { passive: true });
  document.addEventListener('DOMContentLoaded', fitBoardForMobile);
})();