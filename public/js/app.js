const P = {
  wallet:
    '<path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2z"/><path d="M16 14h2"/>',
  arrup: '<path d="M5 21h14M12 16V4M7 9l5-5 5 5"/>',
  arrdn: '<path d="M5 3h14M12 8v12M7 15l5 5 5-5"/>',
  dl: '<path d="M12 4v12M7 11l5 5 5-5M4 20h16"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  hist: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  msg: '<path d="M4 4h16v12H8l-4 4z"/><path d="M8 9h8M8 12h5"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  users:
    '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  chk: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  trend: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4"/>',
  up: '<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  wa: '<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  arr: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  moon: '<path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/>',
};
const I = (n) => `<svg viewBox="0 0 24 24">${P[n]}</svg>`;
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
  );
const brand = `<div class="logo"><i>${I('home')}</i><div><b>SaWarga <em>24</em></b><small>Quanta 2 Kuningan • RT 24 / RW 03</small></div></div>`;
const S = {
  // Kas Warga: data dari api/kas (lihat loadKas).
  kasTab: 'rekap',
  kasTh: new Date().getFullYear(),
  kasBl: 0,
  kasKat: '',
  K: null,
  seq: 0,
  user: null,
  view: 'dash',
  role: 'warga',

  // Pengajuan surat dimuat dari server (api/surat).
  letters: [],
  reps: [
    {
      no: 'LAP-2025-032',
      t: 'Genangan air di Gang Melati',
      lok: 'Gang Melati, dekat rumah No. 14',
      pel: 'Andi Pratama',
      tgl: '10 Mei 2025',
      st: 'Sedang Diproses',
      urg: 5,
      dam: 5,
      lama: 3,
      desc: 'Setelah hujan, air menggenang setinggi kurang lebih 20 cm dan menutup akses jalan. Kondisi ini mengganggu akses sekitar 8 rumah dan berpotensi masuk ke halaman warga.',
      alasan: 'Mendesak karena menghambat akses dan berdampak pada 8 rumah.',
      up: 'Laporan diterima pengurus RT',
    },
    {
      no: 'LAP-2025-031',
      t: 'Lampu jalan depan pos ronda mati',
      lok: 'Depan pos ronda Blok C',
      pel: 'Dewi Lestari',
      tgl: '08 Mei 2025',
      st: 'Sedang Diproses',
      urg: 3,
      dam: 4,
      lama: 5,
      desc: 'Lampu mati lima hari; jalan gelap pada malam hari.',
      alasan: 'Berdampak pada keamanan dan sudah menunggu 5 hari.',
      up: 'Sedang dicek petugas listrik',
    },
    {
      no: 'LAP-2025-033',
      t: 'Bangku taman warga rusak',
      lok: 'Taman warga RT 24',
      pel: 'Fajar Nugraha',
      tgl: '11 Mei 2025',
      st: 'Sedang Diproses',
      urg: 2,
      dam: 3,
      lama: 2,
      desc: 'Dua bangku taman patah dan berbahaya bagi anak.',
      alasan: 'Berdampak pada beberapa warga, tidak mendesak.',
      up: 'Laporan diterima pengurus RT',
    },
    {
      no: 'LAP-2025-034',
      t: 'Cat pagar balai warga mengelupas',
      lok: 'Balai warga RT 24',
      pel: 'Nina Herlina',
      tgl: '12 Mei 2025',
      st: 'Sedang Diproses',
      urg: 1,
      dam: 1,
      lama: 1,
      desc: 'Cat pagar balai warga mengelupas.',
      alasan: 'Dampak kecil dan tidak mendesak.',
      up: 'Laporan diterima pengurus RT',
    },
    {
      no: 'LAP-2025-029',
      t: 'Sampah belum diangkut',
      lok: 'Depan Jl. Melati No. 12',
      pel: 'Budi Santoso',
      tgl: '09 Mei 2025',
      st: 'Sedang Diproses',
      urg: 3,
      dam: 3,
      lama: 4,
      desc: 'Sampah belum diangkut selama empat hari.',
      up: 'Diteruskan ke petugas kebersihan',
      me: 1,
    },
    {
      no: 'LAP-2025-025',
      t: 'Saluran air tersumbat',
      lok: 'Depan Jl. Melati No. 12',
      pel: 'Budi Santoso',
      tgl: '01 Mei 2025',
      st: 'Selesai',
      urg: 3,
      dam: 3,
      lama: 3,
      desc: 'Saluran air depan rumah tersumbat.',
      up: 'Selesai pada 04 Mei 2025',
      me: 1,
    },
    {
      no: 'LAP-2025-021',
      t: 'Pohon rawan tumbang',
      lok: 'Jl. Melati, dekat pos ronda',
      pel: 'Budi Santoso',
      tgl: '22 April 2025',
      st: 'Selesai',
      urg: 4,
      dam: 4,
      lama: 2,
      desc: 'Pohon besar condong ke jalan.',
      up: 'Ditangani pada 24 April 2025',
      me: 1,
    },
  ],
  warga: [
    {
      nik: '3273011208900004',
      nama: 'Budi Santoso',
      alamat: 'Jl. Melati No. 12',
      hub: 'Kepala Keluarga',
    },
    { nik: '3273015411920006', nama: 'Siti Aminah', alamat: 'Jl. Melati No. 12', hub: 'Istri' },
    {
      nik: '3273011807850002',
      nama: 'Ahmad Fauzi',
      alamat: 'Jl. Mawar No. 08',
      hub: 'Kepala Keluarga',
    },
    {
      nik: '3273016509900009',
      nama: 'Dewi Lestari',
      alamat: 'Jl. Anggrek No. 21',
      hub: 'Kepala Keluarga',
    },
  ],
};

// ---------- Koneksi ke backend Laravel (routes/web.php) ----------
// Akun warga dan pengurus RT tersimpan di database MySQL. Pengurus RT dibuat lewat: php artisan sawarga:buat-rt.
let CSRF = '';
async function api(url, body) {
  const opt = { credentials: 'same-origin', headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    opt.method = 'POST';
    opt.headers['X-CSRF-Token'] = CSRF;
    if (body instanceof FormData) opt.body = body;
    else {
      opt.headers['Content-Type'] = 'application/json';
      opt.body = JSON.stringify(body);
    }
  }
  let res, data;
  try {
    res = await fetch(url, opt);
    data = await res.json();
  } catch (_) {
    throw new Error('Tidak dapat terhubung ke server. Jalankan aplikasi lewat php artisan serve (lihat README).');
  }
  if (data.csrf) CSRF = data.csrf;
  if (!data.ok) {
    const e = new Error(data.error || 'Terjadi kesalahan.');
    // Sesi habis saat sedang memakai aplikasi: kembali ke halaman login.
    if (res.status === 401 && S.user) {
      S.user = null;
      login();
      toast('Sesi Anda berakhir. Silakan login kembali.');
      e.handled = true;
    }
    throw e;
  }
  return data;
}
const fail = (e) => e.handled || toast(e.message);
const userFrom = (u) => ({
  name: u.nama,
  sub: u.role === 'rt' ? 'Pengurus RT' : 'Warga',
  ini: u.role === 'rt' ? 'RT' : ini(u.nama),
  nik: u.nik,
  wa: u.wa,
});
const tglID = (iso) => {
  const d = new Date(iso.replace(' ', 'T'));
  return String(d.getDate()).padStart(2, '0') + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
};
const relD = (iso) => {
  const n = Math.round(
    (new Date().setHours(0, 0, 0, 0) - new Date(iso.replace(' ', 'T')).setHours(0, 0, 0, 0)) / 864e5,
  );
  return n === 0 ? 'Hari ini' : n === 1 ? 'Kemarin' : tglID(iso);
};
// Ubah data surat dari server ke bentuk yang dipakai tampilan.
const mapSurat = (x) => ({
  id: x.id,
  no: x.no,
  n: x.nama,
  nik: x.nik,
  alamat: x.alamat,
  j: x.jenis,
  kep: x.keperluan,
  s: x.status,
  cat: x.catatan || '',
  alasan: x.status === 'Ditolak' ? x.catatan : '',
  tgl: tglID(x.dibuat),
  d: relD(x.dibuat),
  jam: x.dibuat.slice(11, 16),
  ver: x.diverifikasi_pada
    ? tglID(x.diverifikasi_pada) + ', ' + x.diverifikasi_pada.slice(11, 16).replace(':', '.')
    : '',
  tglVer: x.diverifikasi_pada ? tglID(x.diverifikasi_pada) : '',
  penandatangan: x.verifikator || '',
  qr: x.qr || '',
  urlVer: x.url_verifikasi || '',
  prio: x.prioritas,
  prioSrc: x.sumber_prioritas,
  docs: x.dokumen.map((d) => ({ id: d.id, n: d.nama, s: sizeTxt(d.ukuran) })),
  me: S.role === 'warga' ? 1 : 0,
});
async function loadSurat() {
  const r = await api('api/surat');
  S.letters = r.surat.map(mapSurat);
}
async function boot() {
  try {
    const r = await api('api/me');
    if (r.user) {
      S.role = r.user.role;
      S.user = userFrom(r.user);
      await loadSurat();
      S.view = 'dash';
      return app();
    }
    login();
  } catch (e) {
    login();
    fail(e);
  }
}
// Samakan status laporan lama dengan pilihan status yang baru.
S.reps.forEach((r) => { if (r.st === 'Diproses' || r.st === 'Baru') r.st = 'Sedang Diproses'; });

const tagC = (s) =>
  /Ditolak/.test(s)
    ? 'r'
    : /Menunggu|Perlu/.test(s)
      ? 'w'
      : /Diproses|Sudah/.test(s)
        ? 'b'
        : /Disetujui|Ditandatangani|Siap|Selesai/.test(s)
          ? 'g'
          : '';
function toast(m) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = m;
  document.body.append(t);
  setTimeout(() => t.remove(), 2200);
}
function theme() {
  const r = document.documentElement,
    d =
      r.dataset.theme === 'dark' ||
      (!r.dataset.theme && matchMedia('(prefers-color-scheme:dark)').matches);
  r.dataset.theme = d ? 'light' : 'dark';
}

function login() {
  $('#root').innerHTML =
    `<div class="login"><section class="hero">${brand}<div><div class="bar"></div><h1>Pelayanan warga yang lebih tertata, transparan, dan mudah.</h1><p>Kelola pengajuan surat, data warga, dan laporan masyarakat dalam satu sistem sederhana.</p></div><footer>© 2025 SaWarga 24 • Quanta 2 Kuningan</footer></section>
 <section class="side"><div class="box"><span class="sm">SELAMAT DATANG</span><h2>Masuk ke akun Anda</h2>
 <div class="tabs"><button class="on" data-r="warga">Warga</button><button data-r="rt">Pengurus RT</button></div>
 <label for="u">Username</label><input id="u" placeholder="Masukkan username" autocomplete="username"><label for="p">Password</label><input id="p" type="password" placeholder="Masukkan password" autocomplete="current-password">
 <div class="err" id="er" role="alert"></div><button class="btn p full" id="go" style="margin-top:8px">Login ${I('arr')}</button>
 <div class="alt">Belum punya akun? <a id="reg">Daftar sekarang</a></div></div></section></div>`;
  let role = 'warga';
  document.querySelectorAll('.tabs button').forEach(
    (b) =>
      (b.onclick = () => {
        role = b.dataset.r;
        document.querySelectorAll('.tabs button').forEach((x) => x.classList.toggle('on', x === b));
        $('#u').value = '';
        $('#p').value = '';
        $('#er').textContent = '';
      }),
  );
  $('#reg').onclick = register;
  $('#go').onclick = async () => {
    const u = $('#u').value.trim(),
      p = $('#p').value,
      btn = $('#go');
    if (!u || !p) {
      $('#er').textContent = 'Username dan password wajib diisi.';
      return;
    }
    btn.disabled = true;
    $('#er').textContent = '';
    try {
      const r = await api('api/login', { username: u, password: p, role });
      S.role = r.user.role;
      S.user = userFrom(r.user);
      await loadSurat();
      S.view = 'dash';
      app();
    } catch (e) {
      $('#er').textContent = e.message;
      btn.disabled = false;
    }
  };
  // Jangan membatalkan input keyboard: hanya jalankan login saat tombol Enter ditekan.
  $('#p').onkeydown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      $('#go').click();
    }
  };
}

function register() {
  $('#root').innerHTML =
    `<div class="login"><section class="hero">${brand}<div><div class="bar"></div><h1>Mulai akses layanan warga dengan satu akun.</h1><p>Daftarkan akun warga untuk mengakses layanan administrasi dan menyampaikan laporan secara online.</p></div><footer>© 2025 SaWarga 24 • Quanta 2 Kuningan</footer></section>
 <section class="side"><form class="box" id="rg" novalidate><button type="button" class="lk back" id="bk">← Kembali ke login</button><span class="sm" style="display:block;margin-top:14px">PENDAFTARAN WARGA</span><h2 style="margin-bottom:6px">Buat akun baru</h2><p class="sub" style="margin:0 0 6px">Isi data sesuai identitas Anda. Akun akan terdaftar sebagai Warga.</p>
 <label for="gn">NIK</label><input id="gn" inputmode="numeric" maxlength="16" placeholder="Masukkan 16 digit NIK" autocomplete="off">
 <div class="g2"><div><label for="gm">Nama Lengkap</label><input id="gm" placeholder="Nama sesuai KTP" autocomplete="name"></div><div><label for="gw">Nomor WhatsApp</label><input id="gw" inputmode="tel" placeholder="Contoh: 081234567890" autocomplete="tel"></div></div>
 <label for="ga">Alamat</label><input id="ga" placeholder="Nama jalan, nomor rumah, dan blok" autocomplete="street-address">
 <div class="g2"><div><label for="gu">Username</label><input id="gu" placeholder="Buat username" autocomplete="username"></div><div><label for="gp">Password</label><input id="gp" type="password" placeholder="Minimal 6 karakter" autocomplete="new-password"></div><div><label for="gc">Konfirmasi Password</label><input id="gc" type="password" placeholder="Ulangi password" autocomplete="new-password"></div></div>
 <label class="chk"><input type="checkbox" id="gk"><span>Saya menyatakan data yang diisi benar dan bersedia mengikuti ketentuan layanan SaWarga 24.</span></label>
 <div class="err" id="er" role="alert"></div><button class="btn p full" style="margin-top:6px">Daftar Akun ${I('arr')}</button><div class="alt">Sudah punya akun? <a id="lg" tabindex="0">Login di sini</a></div></form></section></div>`;
  const E = (t, id) => {
    $('#er').textContent = t;
    $('#' + id).focus();
  };
  $('#rg').onsubmit = async (e) => {
    e.preventDefault();
    const v = (id) => $('#' + id).value.trim(),
      n = v('gn'),
      m = v('gm'),
      w = v('gw').replace(/[\s-]/g, ''),
      a = v('ga'),
      u = v('gu').toLowerCase(),
      p = $('#gp').value;
    if (!/^\d{16}$/.test(n)) return E('NIK harus 16 digit angka.', 'gn');
    if (m.length < 3) return E('Nama lengkap wajib diisi.', 'gm');
    if (!/^(0|\+?62)8\d{7,12}$/.test(w))
      return E('Nomor WhatsApp tidak valid. Contoh: 081234567890.', 'gw');
    if (a.length < 5) return E('Alamat wajib diisi lengkap.', 'ga');
    if (!/^[a-z0-9._]{4,20}$/.test(u))
      return E('Username 4–20 karakter: huruf kecil, angka, titik, atau garis bawah.', 'gu');
    if (p.length < 6) return E('Password minimal 6 karakter.', 'gp');
    if (p !== $('#gc').value) return E('Konfirmasi password tidak sama.', 'gc');
    if (!$('#gk').checked) return E('Centang pernyataan untuk melanjutkan.', 'gk');
    // Username dan NIK yang sudah terdaftar dicek oleh server.
    const btn = $('#rg button.p');
    btn.disabled = true;
    try {
      await api('api/register', {
        nik: n,
        nama: m,
        wa: w,
        alamat: a,
        username: u,
        password: p,
        password2: $('#gc').value,
        setuju: true,
      });
    } catch (err) {
      btn.disabled = false;
      $('#er').textContent = err.message;
      if (/Username/.test(err.message)) $('#gu').focus();
      else if (/NIK/.test(err.message)) $('#gn').focus();
      return;
    }
    login();
    $('#u').value = u;
    $('#p').value = '';
    toast('Akun berhasil dibuat. Silakan login.');
  };
  $('#bk').onclick = $('#lg').onclick = () => login();
}

const MENU = {
  warga: [
    ['dash', 'Dashboard', 'home'],
    ['ajuan', 'Pengajuan Surat', 'doc'],
    ['status', 'Status Surat', 'hist'],
    ['buat', 'Buat Laporan', 'plus'],
    ['saya', 'Laporan Saya', 'msg'],
  ],
  rt: [
    ['dash', 'Dashboard', 'home'],
    ['data', 'Data Warga', 'users'],
    ['verif', 'Verifikasi Surat', 'chk'],
    ['lap', 'Laporan Masyarakat', 'msg'],
    ['prio', 'Prioritas Laporan', 'trend'],
    ['kas', 'Kas Warga', 'wallet'],
  ],
};

function app() {
  const m = MENU[S.role],
    cur = m.find((x) => x[0] === S.view);
  $('#root').innerHTML =
    `<div class="app"><aside id="sd">${brand}<nav><h6>${S.role === 'rt' ? 'MENU PENGURUS' : 'MENU WARGA'}</h6>${m.map((x) => `<button data-v="${x[0]}" class="${x[0] === S.view ? 'on' : ''}">${I(x[2])}${x[1]}</button>`).join('')}</nav>
 <div class="me"><i>${S.user.ini}</i><div><b>${S.user.name}</b><small>${S.user.sub}</small></div></div><button class="out" id="lo">${I('out')}Logout</button></aside>
 <main><header class="top"><button class="mt" id="mt" aria-label="Buka menu">${I('menu')}</button><i>${I(cur[2])}</i><div><b>${S.role === 'warga' && S.view === 'buat' ? 'Laporan Masyarakat' : S.role === 'warga' && S.view === 'status' && S.det != null ? wTitle() : S.role === 'rt' && S.det != null && S.view !== 'verif' ? 'Detail Laporan' : cur[1]}</b><small>RT 24 • Quanta 2 Kuningan</small></div><button class="tg" id="tg" aria-label="Ganti tema">${I('moon')}</button></header><div class="pg" id="pg"></div></main></div>`;
  $('#pg').innerHTML = VIEWS[S.role + '_' + S.view]();
  document.querySelectorAll('nav button').forEach((b) => (b.onclick = () => go(b.dataset.v)));
  $('#lo').onclick = async () => {
    try {
      await api('api/logout', {});
      await api('api/me'); // ambil token CSRF untuk sesi baru
    } catch (_) {
      /* tetap keluar di sisi tampilan */
    }
    S.user = null;
    S.letters = [];
    S.K = null;
    login();
  };
  $('#tg').onclick = theme;
  $('#mt').onclick = () => $('#sd').classList.toggle('open');
  bind();
}
const go = (v) => {
  S.view = v;
  S.wedit = null;
  S.det = null;
  app();
  scrollTo(0, 0);
};
function bind() {
  document.querySelectorAll('[data-go]').forEach((b) => (b.onclick = () => go(b.dataset.go)));
  document.querySelectorAll('[data-pick]').forEach((d) => {
    const inp = $('#' + d.dataset.pick),
      n = $('#' + d.dataset.pick + 'n'),
      orig = n.textContent;
    d.onclick = (e) => {
      if (e.target !== inp) inp.click();
    };
    d.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        inp.click();
      }
    };
    const okFile = (f) =>
      inp.accept.split(',').some((x) => f.name.toLowerCase().endsWith(x)) && f.size <= 5 * 1048576;
    if ('multi' in d.dataset) {
      // Mode banyak file: setiap pilihan ditambahkan ke daftar, bukan menggantikan.
      const id = d.dataset.pick;
      PICK[id] = [];
      const render = () => {
        const L = PICK[id];
        n.textContent = L.length ? `${L.length} file dipilih (maks. ${MAX_DOK}). Klik untuk menambah.` : orig;
        $('#' + id + 'l').innerHTML = L.map(
          (f, i) =>
            `<li>${I('doc')}<span><b>${esc(f.name)}</b><small>${sizeTxt(f.size)}</small></span><button type="button" class="lk" data-rm="${i}" aria-label="Hapus ${esc(f.name)}">${I('x')}</button></li>`,
        ).join('');
        $('#' + id + 'l').querySelectorAll('[data-rm]').forEach(
          (b) =>
            (b.onclick = () => {
              L.splice(+b.dataset.rm, 1);
              render();
            }),
        );
      };
      inp.onchange = () => {
        const fs = [...inp.files],
          L = PICK[id];
        inp.value = '';
        const bad = fs.filter((f) => !okFile(f));
        let add = fs.filter(
          (f) => okFile(f) && !L.some((x) => x.name === f.name && x.size === f.size),
        );
        if (L.length + add.length > MAX_DOK) {
          add = add.slice(0, Math.max(0, MAX_DOK - L.length));
          toast(`Maksimal ${MAX_DOK} file.`);
        } else if (bad.length) toast(bad.length + ' file tidak sesuai format atau lebih dari 5 MB.');
        L.push(...add);
        render();
      };
      return;
    }
    inp.onchange = () => {
      const f = inp.files[0];
      if (!f) return;
      const ok = okFile(f);
      if (!ok) {
        inp.value = '';
        n.textContent = orig;
        toast('File tidak sesuai format atau lebih dari 5 MB.');
        return;
      }
      n.textContent = f.name + ' • ' + (f.size / 1048576).toFixed(1) + ' MB';
    };
  });
  const f = $('#fs');
  if (f)
    f.onsubmit = async (e) => {
      e.preventDefault();
      const k = $('#fk').value.trim();
      if (!k) {
        toast('Keperluan pengajuan wajib diisi.');
        $('#fk').focus();
        return;
      }
      const files = PICK.fd || [];
      if (!files.length) {
        toast('Unggah KTP dan Kartu Keluarga terlebih dahulu.');
        return;
      }
      // Prioritas tidak dikirim dari sini: server mengisi nilai default.
      const fd = new FormData();
      fd.append('jenis', $('#fj').value);
      fd.append('keperluan', k);
      files.forEach((x) => fd.append('dokumen[]', x));
      const btn = f.querySelector('button.p');
      btn.disabled = true;
      try {
        await api('api/surat', fd);
        await loadSurat();
        toast('Pengajuan terkirim.');
        go('status');
      } catch (err) {
        btn.disabled = false;
        fail(err);
      }
    };
  const r = $('#fr');
  if (r)
    r.onsubmit = (e) => {
      e.preventDefault();
      const t = $('#rt').value.trim(),
        d = $('#rd').value.trim();
      if (!t || !d) {
        toast('Judul dan deskripsi laporan wajib diisi.');
        (t ? $('#rd') : $('#rt')).focus();
        return;
      }
      S.reps.unshift({
        t,
        pel: S.user.name,
        tgl: today(),
        ts: Date.now(),
        no: 'LAP-2026-' + String(40 + S.seq++).padStart(3, '0'),
        lok: 'Lingkungan RT 24',
        st: 'Sedang Diproses',
        urg: 3,
        dam: 3,
        desc: d,
        up: 'Laporan diterima pengurus RT',
        me: 1,
      });
      toast('Laporan terkirim.');
      go('saya');
    };
  document.querySelectorAll('[data-act]').forEach(
    (b) =>
      (b.onclick = () => {
        const l = S.letters[+b.dataset.i],
          a = b.dataset.act;
        if (a !== 'fix') return openDet(+b.dataset.i);
        if (a === 'fix') {
          const inp = document.createElement('input');
          inp.type = 'file';
          inp.accept = '.pdf,.jpg,.jpeg,.png';
          inp.multiple = true;
          inp.onchange = async () => {
            const fs = [...inp.files];
            if (!fs.length) return;
            if (fs.length > MAX_DOK) {
              toast(`Maksimal ${MAX_DOK} file.`);
              return;
            }
            if (fs.some((f) => !/\.(pdf|jpe?g|png)$/i.test(f.name) || f.size > 5 * 1048576)) {
              toast('Setiap file harus PDF, JPG, atau PNG dan maksimal 5 MB.');
              return;
            }
            const fd = new FormData();
            fd.append('id', l.id);
            fs.forEach((f) => fd.append('dokumen[]', f));
            try {
              await api('api/surat/perbaikan', fd);
              await loadSurat();
              toast('Dokumen terkirim ulang. Pengajuan akan diperiksa kembali.');
              app();
            } catch (err) {
              fail(err);
            }
          };
          inp.click();
        }
      }),
  );
  const q = $('#q');
  if (q) {
    q.onkeydown = (e) => {
      if (e.key === 'Enter') $('#qb').click();
    };
    $('#qb').onclick = () => {
      S.qw = q.value.trim();
      app();
    };
    $('#addw').onclick = () => editW(-1);
  }
  document.querySelectorAll('[data-we]').forEach((b) => (b.onclick = () => editW(+b.dataset.we)));
  bindW();
  bindDet();
  bindWL();
  bindKas();
  document.querySelectorAll('[data-wd]').forEach(
    (b) =>
      (b.onclick = () => {
        const i = +b.dataset.wd,
          w = S.warga[i];
        modal(
          'Hapus data warga',
          `<p>Hapus data <b>${esc(w.nama)}</b>? Tindakan ini tidak dapat dibatalkan.</p><div class="rt" style="gap:10px"><button class="btn" id="dn">Batal</button><button class="btn p" id="dy">Hapus</button></div>`,
        );
        $('#dn').onclick = closeM;
        $('#dy').onclick = () => {
          S.warga.splice(i, 1);
          S.wedit = null;
          closeM();
          toast('Data warga dihapus.');
          app();
        };
      }),
  );
  document.querySelectorAll('[data-pv]').forEach((b) => (b.onclick = () => openDet(+b.dataset.pv)));
  document.querySelectorAll('[data-rd]').forEach((b) => (b.onclick = () => openDet(+b.dataset.rd)));
  const ql = $('#ql');
  if (ql) {
    ql.onchange = () => {
      S.ql = ql.value.trim();
      app();
    };
    $('#qs').onchange = () => {
      S.qs = $('#qs').value;
      app();
    };
  }
  const ru = $('#rul');
  if (ru)
    ru.onclick = () =>
      modal(
        'Aturan penilaian',
        '<p>Skor akhir = Urgensi 40% + Dampak 40% + Lama menunggu 20%, masing-masing skala 1–5.</p><p>Lama menunggu: 1 hari = 1, naik 1 poin per hari, maksimal 5.</p><p>Tinggi: skor ≥ 4,0. Sedang: 2,5–3,9. Rendah: &lt; 2,5.</p><p style="color:var(--mut)">Rekomendasi hanya membantu. Pengurus RT tetap menentukan penanganan akhir.</p>',
      );
  const wa = $('#wa');
  if (wa)
    wa.onclick = () =>
      waOpen(
        'Halo Ketua RT 24, saya ingin mengonfirmasi laporan yang sudah saya kirim atau masih lama diproses.',
      );
  const waDash = $('#waDash');
  if (waDash)
    waDash.onclick = () => waOpen('Halo Pengurus RT 24, saya ingin menghubungi pengurus.');
}
const KETUA_WA = ''; // Isi nomor WhatsApp Ketua RT dengan format 628xxxxxxxxxx, tanpa + atau spasi.
const waOpen = (msg) => {
  if (!/^62\d{8,13}$/.test(KETUA_WA)) {
    toast('Nomor WhatsApp pengurus belum dikonfigurasi.');
    return;
  }
  window.open(
    'https://wa.me/' + KETUA_WA + '?text=' + encodeURIComponent(msg),
    '_blank',
    'noopener',
  );
};
const my = (a) => a.filter((x) => x.me && (x.n || x.pel) === S.user.name);
const pend = () => S.letters.filter((l) => /Menunggu/.test(l.s));
const stat = (t, n, s, ic, c = '') =>
  `<div class="card stat"><div><span>${t}</span><strong>${n}</strong><small>${s}</small></div><div class="ic ${c}">${I(ic)}</div></div>`;

const ini = (n) =>
  n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
const today = () =>
  new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
const kv = (a) => '<dl>' + a.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('') + '</dl>';
// Batas jumlah dokumen per pengiriman (sama dengan UPLOAD_MAX_FILE di app/Http/Controllers/SuratController.php).
const MAX_DOK = 5;
// File yang dipilih pada input banyak file, per id input.
const PICK = {};
const drop = (id, t, sub, acc, btn, multi) =>
  `<div class="drop" data-pick="${id}"${multi ? ' data-multi' : ''} tabindex="0" role="button"><div class="ic" style="width:44px;height:44px;background:var(--card);border:1px solid var(--line)">${I('up')}</div><div class="dt"><b>${t}</b><small id="${id}n">${sub}</small></div>${btn ? `<span class="btn sm">${multi ? 'Tambah file' : 'Pilih file'}</span>` : ''}<input type="file" id="${id}" hidden accept="${acc}"${multi ? ' multiple' : ''}></div>${multi ? `<ul class="files" id="${id}l"></ul>` : ''}`;
function modal(t, h) {
  const o = document.createElement('div');
  o.className = 'mo';
  o.innerHTML = `<div class="md" role="dialog" aria-modal="true" aria-label="${t}"><div class="ch"><h3>${t}</h3><button class="lk" type="button">Tutup</button></div>${h}</div>`;
  const c = () => {
      o.remove();
      document.removeEventListener('keydown', k);
    },
    k = (e) => e.key === 'Escape' && c();
  o.onclick = (e) => {
    if (e.target === o) c();
  };
  o.querySelector('.lk').onclick = c;
  document.addEventListener('keydown', k);
  document.body.append(o);
  o.querySelector('.lk').focus();
}
const lamaD = (r) => (r.ts ? Math.max(1, Math.ceil((Date.now() - r.ts) / 864e5)) : r.lama);
const score = (r) =>
  Math.round((0.4 * r.urg + 0.4 * r.dam + 0.2 * Math.min(5, Math.max(1, lamaD(r)))) * 10) / 10;
const prio = (r) => (score(r) >= 4 ? 'Tinggi' : score(r) >= 2.5 ? 'Sedang' : 'Rendah');
const sk = (r) => score(r).toFixed(1).replace('.', ',');
const act = () => S.reps.filter((r) => r.st !== 'Selesai');
const pc = (p) => (p === 'Tinggi' ? 'r' : p === 'Sedang' ? 'w' : '');
const closeM = () => document.querySelector('.mo')?.remove();
function editW(i) {
  S.wedit = i;
  app();
  scrollTo(0, 0);
  $('#wn').focus();
}
function wPanel() {
  const i = S.wedit;
  if (i === null || i === undefined) return '';
  const w = i >= 0 ? S.warga[i] : { nik: '', nama: '', alamat: '', hub: 'Kepala Keluarga' };
  const hubs = ['Kepala Keluarga', 'Istri', 'Suami', 'Anak', 'Lainnya'];
  return `<form class="card wp" id="wf" novalidate>
 <div class="ch"><div><span class="sm">${i >= 0 ? 'EDIT DATA WARGA' : 'TAMBAH DATA WARGA'}</span><h3>${i >= 0 ? esc(w.nama) : 'Warga baru'}</h3><p class="sub">${i >= 0 ? 'Perbarui data lalu simpan perubahan.' : 'Isi data warga baru lalu simpan.'}</p></div><button type="button" class="lk" id="wx">Tutup</button></div>
 <div class="g2"><div><label for="wn">NIK</label><input id="wn" value="${esc(w.nik)}" inputmode="numeric" maxlength="16"></div><div><label for="wm">Nama Lengkap</label><input id="wm" value="${esc(w.nama)}"></div>
 <div><label for="wr">Alamat</label><input id="wr" value="${esc(w.alamat)}"></div><div><label for="wh">Hubungan Keluarga</label><select id="wh">${hubs.map((h) => `<option${h === w.hub ? ' selected' : ''}>${h}</option>`).join('')}</select></div></div>
 <div class="err" id="we" role="alert"></div>
 <div class="rt" style="gap:10px"><button type="button" class="btn" id="wb">Batal</button><button class="btn p">${i >= 0 ? 'Simpan Perubahan' : 'Simpan'}</button></div></form>`;
}
function bindW() {
  const f = $('#wf');
  if (!f) return;
  const i = S.wedit,
    close = () => {
      S.wedit = null;
      app();
    };
  $('#wx').onclick = $('#wb').onclick = close;
  f.onsubmit = (e) => {
    e.preventDefault();
    const n = $('#wn').value.trim(),
      m = $('#wm').value.trim(),
      a = $('#wr').value.trim(),
      E = (t) => ($('#we').textContent = t);
    if (!/^\d{16}$/.test(n)) return E('NIK harus 16 digit angka.');
    if (!m || !a) return E('Nama dan alamat wajib diisi.');
    if (S.warga.some((x, j) => x.nik === n && j !== i)) return E('NIK sudah terdaftar.');
    const d = { nik: n, nama: m, alamat: a, hub: $('#wh').value };
    i >= 0 ? (S.warga[i] = d) : S.warga.unshift(d);
    S.wedit = null;
    toast('Data warga disimpan.');
    app();
  };
}
const MON = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];
const ROM = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const suratNo = (l) => {
  const t = (l.tgl || '').split(' ');
  return (l.no || '').split('-').pop() + '/RT24/' + (ROM[MON.indexOf(t[1])] || '—') + '/' + t[2];
};
const wTitle = () => {
  const l = S.letters[S.det];
  return l.s === 'Siap Diunduh'
    ? 'Preview Surat'
    : l.s === 'Ditolak'
      ? 'Pengajuan Ditolak'
      : 'Detail Surat';
};
const wLetterPage = () => {
  const l = S.letters[S.det];
  return l.s === 'Siap Diunduh'
    ? previewPage(l)
    : l.s === 'Ditolak'
      ? tolakPage(l)
      : suratDetail(l);
};
function previewPage(l) {
  const w = S.warga.find((x) => x.nama === l.n),
    usaha = /Usaha/.test(l.j),
    rows = [
      // Isi sama dengan PDF (resources/views/surat-pdf.blade.php).
      ['Nama', l.n],
      ['NIK', l.nik || '—'],
      ['Alamat', (l.alamat || (w ? w.alamat : '—')) + ', RT 24/RW 03'],
      ['Keperluan', l.kep || '—'],
    ];
  return `<div class="wrap"><div class="hd"><div><h1>Preview ${esc(l.j)}</h1><p>Periksa surat sebelum mengunduh dokumen resmi.</p></div><div><button class="btn" id="wk">Kembali</button><button class="btn p" id="dl">${I('doc')}Download PDF</button></div></div>
 <div class="card"><div class="sheet"><div class="kop"><b>RUKUN TETANGGA 24</b><b>RUKUN WARGA 03, KELURAHAN SUKAMAJU</b><small>Kecamatan Sukasari, Kota Bandung</small></div>
 <div class="jd"><b>${esc(l.j).toUpperCase()}</b><span>Nomor: ${suratNo(l)}</span></div>
 <p>Yang bertanda tangan di bawah ini, Ketua RT 24 RW 03 Kelurahan Sukamaju, menerangkan bahwa:</p>
 <dl class="sd">${rows.map(([k, v]) => `<dt>${k}</dt><dd>: ${esc(v)}</dd>`).join('')}</dl>
 <p>${usaha ? 'Benar merupakan warga kami dan memiliki usaha sebagaimana tersebut di atas.' : 'Benar merupakan warga kami dan berdomisili di wilayah RT 24 RW 03 sebagaimana tersebut di atas.'} Surat ini dibuat untuk digunakan sebagaimana mestinya.</p>
 <div class="ttd"><span>Bandung, ${l.tglVer || l.tgl}<br>Ketua RT 24</span>${l.qr ? `<a class="qr" href="${esc(l.urlVer)}" target="_blank" rel="noopener" title="Verifikasi keaslian surat"><img src="${esc(l.qr)}" alt="QR tanda tangan elektronik"></a>` : '<i class="qr-kosong"></i>'}<u>${esc(l.penandatangan || 'Ketua RT 24')}</u>${l.qr ? '<small class="qr-ket">Ditandatangani secara elektronik.<br>Pindai QR untuk memeriksa keaslian surat.</small>' : ''}</div></div></div></div>`;
}
function suratDetail(l) {
  const wait = /Menunggu/.test(l.s),
    done = wait ? 1 : 3,
    steps = [
      ['Pengajuan diterima', l.tgl + ', ' + (l.jam || '09:20').replace(':', '.')],
      ['Data berhasil diverifikasi', l.ver || 'Diperiksa oleh pengurus RT'],
      ['Surat sedang disusun pengurus', 'Estimasi selesai ' + (l.est || '2–3 hari kerja')],
      ['Siap diunduh', 'Menunggu proses selesai'],
    ];
  return `<div class="wrap"><div class="hd"><div><h1>Detail ${esc(l.j)}</h1><p>Pantau tahapan pengajuan dan estimasi penyelesaian surat.</p></div><div><button class="btn" id="wk">Kembali</button></div></div>
 <div class="dg2"><div class="card"><div class="ch"><div class="fld"><small>NOMOR PENGAJUAN</small><b class="mono">${l.no}</b></div><span class="tag ${wait ? 'w' : 'b'}">${wait ? 'Menunggu Verifikasi' : 'Sedang Diproses'}</span></div><hr>
 <h3 class="h3">Perkembangan pengajuan</h3><div class="tl">${steps.map(([t, d], i) => `<div class="it"><i class="${i < done ? '' : 'off'}">${i < done ? I('chk') : i + 1}</i><div><b>${t}</b><small>${esc(d)}</small></div></div>`).join('')}</div></div>
 <div class="card"><h3 class="h3">Ringkasan surat</h3>${fld('Nama pemohon', esc(l.n))}${fld('Jenis surat', esc(l.j))}${fld('Tanggal pengajuan', l.tgl)}${fld('Keperluan', esc(l.kep || '—'))}<div class="alr b">Anda akan menerima notifikasi saat surat sudah dapat diunduh.</div></div></div></div>`;
}
function tolakPage(l) {
  const todo = [
    'Siapkan surat keterangan domisili yang masih berlaku.',
    'Pastikan data alamat pada formulir sesuai dengan dokumen.',
    'Ajukan ulang atau konfirmasi terlebih dahulu kepada Ketua RT.',
  ];
  return `<div class="wrap"><div class="hd"><div><h1>Pengajuan Belum Dapat Disetujui</h1><p>Tinjau alasan penolakan dan langkah yang dapat dilakukan.</p></div><div><button class="btn" id="wk">Kembali</button></div></div>
 <div class="card tk"><div class="tkh"><div class="ic r">${I('doc')}</div><div><span class="tag r">Ditolak</span><h3>${esc(l.j)}</h3><small class="mono">${l.no} • ${l.tgl}</small></div></div>
 <div class="alr r full"><b>Alasan penolakan</b><p>${esc(l.alasan || l.cat)}</p></div><h3 class="h3">Yang dapat Anda lakukan</h3><ol class="todo">${todo.map((t, i) => `<li><i>${i + 1}</i>${t}</li>`).join('')}</ol><hr>
 <div class="row"><button class="btn p" id="ru">${I('plus')}Ajukan Ulang</button><button class="btn" id="hk">${I('wa')}Hubungi Ketua RT</button></div></div></div>`;
}
function bindWL() {
  if (S.role !== 'warga' || S.view !== 'status' || S.det == null) return;
  const l = S.letters[S.det];
  $('#wk').onclick = () => {
    S.det = null;
    app();
  };
  const dl = $('#dl'),
    ru = $('#ru'),
    hk = $('#hk');
  // Unduh PDF resmi yang dibuat server (SuratController@pdf).
  if (dl)
    dl.onclick = () => {
      location.href = 'api/surat/' + l.id + '/pdf';
    };
  if (ru)
    ru.onclick = () => {
      go('ajuan');
      $('#fj').value = l.j;
    };
  if (hk)
    hk.onclick = () =>
      waOpen(
        'Halo Ketua RT 24, saya ' +
          S.user.name +
          '. Mohon arahan terkait pengajuan ' +
          l.j +
          ' (' +
          l.no +
          ') yang belum dapat disetujui.',
      );
}
const rp = (n) => 'Rp ' + Math.abs(n).toLocaleString('id-ID');
const bln = (k) => MON[+k.slice(5) - 1] + ' ' + k.slice(0, 4);
const fmtD = (iso) => {
  const [y, m, d] = iso.split('-');
  return d + ' ' + MON[+m - 1] + ' ' + y;
};
const isoToday = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
// ---------- Kas Warga (pengurus RT) ----------
// Tab mengikuti sheet di file "Laporan Keuangan RT": Rekap, Input Iuran, Pelaporan Iuran,
// Pengeluaran, Data Warga, Petunjuk. Ceklis hanya dari Input Iuran. Data dari api/kas (KasController).
const BL = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const KTAB = [
  ['rekap', 'Rekap'],
  ['iuran', 'Input Iuran'],
  ['lapor', 'Pelaporan Iuran'],
  ['keluar', 'Pengeluaran'],
  ['warga', 'Data Warga'],
  ['bantu', 'Petunjuk'],
];
const tglS = (iso) => {
  const [y, m, d] = iso.split('-');
  return d + ' ' + BL[+m - 1] + ' ' + y;
};
const rpS = (n) => (n < 0 ? '− ' : '') + rp(n);
// [[2026,10],[2026,11],[2026,12],[2027,1]] -> "Okt 2026 – Jan 2027"
function fmtBulan(list) {
  const k = list.map(([t, m]) => t * 12 + m - 1).sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < k.length; i++) {
    let j = i;
    while (j + 1 < k.length && k[j + 1] === k[j] + 1) j++;
    const a = [Math.floor(k[i] / 12), k[i] % 12],
      b = [Math.floor(k[j] / 12), k[j] % 12];
    out.push(
      i === j
        ? BL[a[1]] + ' ' + a[0]
        : a[0] === b[0]
          ? BL[a[1]] + ' – ' + BL[b[1]] + ' ' + a[0]
          : BL[a[1]] + ' ' + a[0] + ' – ' + BL[b[1]] + ' ' + b[0],
    );
    i = j;
  }
  return out.join(', ');
}
async function loadKas() {
  S.kasLoad = true;
  try {
    S.K = await api('api/kas?tahun=' + S.kasTh);
    S.kasTh = S.K.tahun;
  } catch (e) {
    S.K = { gagal: e.message };
  }
  S.kasLoad = false;
  if (S.view === 'kas') app();
}
const kasReload = () => {
  S.K = null;
  loadKas();
};
const wargaBy = (id) => S.K.warga.find((w) => w.id === id);
// Nominal yang sudah dibayar rumah w untuk bulan m (tahun laporan); 0 = belum.
const lunas = (w, m) => S.K.bayar[w.id]?.[m] || 0;
const cari = (ph) =>
  `<div class="kq">${I('search')}<input type="search" id="kq" placeholder="${ph}" aria-label="${ph}"></div>`;
const pilihBulan = () =>
  `<select id="kbl" aria-label="Filter bulan"><option value="0">Semua bulan</option>${BL.map((b, i) => `<option value="${i + 1}"${S.kasBl === i + 1 ? ' selected' : ''}>${MON[i]}</option>`).join('')}</select>`;
const aksi = (t, id) =>
  `<td class="ka">${t === 'iuran' ? '' : `<button class="ib" data-ke="${t}:${id}" title="Ubah" aria-label="Ubah">${I('pen')}</button>`}<button class="ib r" data-kh="${t}:${id}" title="Hapus" aria-label="Hapus">${I('trash')}</button></td>`;

function kasPage() {
  if (!S.K || S.K.tahun !== S.kasTh) {
    if (!S.kasLoad && !S.K?.gagal) loadKas();
    const g = S.K?.gagal;
    return `<div class="wrap"><div class="hd"><div><h1>Kas Warga</h1><p>Laporan keuangan RT: iuran warga, pengeluaran, dan saldo kas.</p></div></div><div class="card"><p class="sub">${g ? esc(g) + ' <button class="lk" id="kasRetry">Coba lagi</button>' : 'Memuat data kas…'}</p></div></div>`;
  }
  const K = S.K,
    th = K.tahun,
    masuk = K.rekap.reduce((a, r) => a + r.masuk, 0),
    keluar = K.rekap.reduce((a, r) => a + r.keluar, 0);
  const card = (cls, t, v, sub, ic, ico) =>
    `<div class="card stat kc ${cls}"><div><span>${t}</span><strong>${v}</strong><small>${sub}</small></div><div class="ic ${ico}">${I(ic)}</div></div>`;
  const tombol = {
    iuran: `<button class="btn p" id="kasAdd">${I('plus')}Catat Iuran</button>`,
    keluar: `<button class="btn p" id="kasAdd">${I('plus')}Tambah Pengeluaran</button>`,
    warga: `<button class="btn p" id="kasAdd">${I('plus')}Tambah Rumah</button>`,
  }[S.kasTab] || '';
  const body = {
    rekap: kRekap,
    iuran: kIuran,
    lapor: kLapor,
    keluar: kKeluar,
    warga: kWarga,
    bantu: kBantu,
  }[S.kasTab]();
  return `<div class="wrap"><div class="hd"><div><h1>Kas Warga</h1><p>Laporan keuangan RT: iuran warga, pengeluaran, dan saldo kas.</p></div><div class="kh2"><label class="kth">Tahun laporan<select id="kth">${K.tahun_list.map((t) => `<option${t === th ? ' selected' : ''}>${t}</option>`).join('')}</select></label>${tombol}</div></div>
 <div class="grid3">${card('bl', 'Saldo Kas Saat Ini', rpS(K.saldo_total), 'Total pemasukan dikurangi pengeluaran', 'wallet', '')}${card('g', 'Pemasukan ' + th, rp(masuk), 'Dari Input Iuran', 'arrup', 'g')}${card('r', 'Pengeluaran ' + th, rp(keluar), 'Dari sheet Pengeluaran', 'arrdn', 'r')}</div>
 <div class="tabs2 ktabs" role="tablist">${KTAB.map(([k, t]) => `<button class="tb ${S.kasTab === k ? 'on' : ''}" data-kt="${k}" role="tab" aria-selected="${S.kasTab === k}">${t}</button>`).join('')}</div>${body}</div>`;
}

function kRekap() {
  const K = S.K;
  let saldo = K.saldo_awal;
  const rows = K.rekap.map((r) => {
    const net = r.masuk - r.keluar;
    saldo += net;
    return `<tr><td><b>${MON[r.bulan - 1]}</b></td><td class="nr up">${rp(r.masuk)}</td><td class="nr dn">${rp(r.keluar)}</td><td class="nr ${net < 0 ? 'dn' : ''}">${rpS(net)}</td><td class="nr"><b>${rpS(saldo)}</b></td></tr>`;
  });
  const mi = K.rekap.reduce((a, r) => a + r.masuk, 0),
    mo = K.rekap.reduce((a, r) => a + r.keluar, 0);
  return `<div class="card"><div class="ch"><div><h3 style="margin:0">Rekap Keuangan RT ${K.tahun}</h3><p class="sub">Pemasukan, pengeluaran, selisih, dan saldo kumulatif per bulan.</p></div><button class="lk2" id="kasCsv">${I('dl')}Unduh CSV</button></div>
 <div class="tw"><table class="kt"><thead><tr><th>BULAN</th><th class="nr">PEMASUKAN IURAN</th><th class="nr">PENGELUARAN</th><th class="nr">SELISIH BULANAN</th><th class="nr">SALDO KUMULATIF</th></tr></thead><tbody>
 ${K.saldo_awal ? `<tr class="sa"><td colspan="4">Saldo awal (sisa kas sebelum ${K.tahun})</td><td class="nr"><b>${rpS(K.saldo_awal)}</b></td></tr>` : ''}${rows.join('')}</tbody>
 <tfoot><tr><td>TOTAL TAHUN</td><td class="nr up">${rp(mi)}</td><td class="nr dn">${rp(mo)}</td><td class="nr">${rpS(mi - mo)}</td><td class="nr">${rpS(saldo)}</td></tr></tfoot></table></div></div>`;
}

function kIuran() {
  const L = S.K.iuran.filter((x) => !S.kasBl || +x.tanggal.slice(5, 7) === S.kasBl),
    tot = L.reduce((a, x) => a + x.total, 0);
  return `<div class="card"><div class="ch"><div><h3 style="margin:0">Input Pembayaran Iuran</h3><p class="sub">${L.length} pembayaran tercatat di ${S.kasBl ? MON[S.kasBl - 1] + ' ' : ''}${S.K.tahun}. Setiap pembayaran otomatis memberi ceklis di Pelaporan Iuran.</p></div><button class="lk2" id="kasCsv">${I('dl')}Unduh CSV</button></div>
 <div class="kbar">${cari('Cari rumah, nama, atau catatan')}${pilihBulan()}</div>
 <div class="tw"><table class="kt"><thead><tr><th>TANGGAL</th><th>BLOK / NO. RUMAH</th><th>NAMA WARGA</th><th>BULAN DIBAYAR</th><th class="nr">TOTAL BAYAR</th><th>METODE</th><th>CATATAN</th><th></th></tr></thead><tbody>
 ${L.map((x) => `<tr data-s="${esc([x.no_rumah, x.nama, x.uraian, x.catatan].join(' ').toLowerCase())}"><td>${tglS(x.tanggal)}</td><td>${x.no_rumah ? `<b>${esc(x.no_rumah)}</b>` : '<span class="tag">Gabungan</span>'}</td><td>${esc(x.nama || x.uraian || '—')}</td><td>${x.bulan.length ? fmtBulan(x.bulan) : '<span class="mut">—</span>'}</td><td class="nr"><b>${rp(x.total)}</b></td><td>${x.metode}</td><td class="mut wr">${esc(x.catatan || '')}</td>${aksi('iuran', x.id)}</tr>`).join('') || '<tr><td colspan="8" class="mut">Belum ada pembayaran.</td></tr>'}</tbody>
 <tfoot><tr><td colspan="4">TOTAL</td><td class="nr">${rp(tot)}</td><td colspan="3"></td></tr></tfoot></table></div></div>`;
}

// Pelaporan Iuran: ceklis otomatis dari pembayaran di Input Iuran.
function kLapor() {
  const K = S.K,
    W = K.warga,
    perBln = Array(12).fill(0);
  const rows = W.map((w, i) => {
    let uang = 0;
    const cells = BL.map((_, j) => {
      const n = lunas(w, j + 1);
      if (n) {
        perBln[j]++;
        uang += n;
      }
      return `<td class="m">${n ? `<i class="ck i" title="${rp(n)}">✓</i>` : ''}</td>`;
    });
    return `<tr data-s="${esc((w.no_rumah + ' ' + (w.nama || '')).toLowerCase())}"><td class="no">${i + 1}</td><td class="st"><b>${esc(w.no_rumah)}</b><small>${esc(w.nama || '(kosong)')}</small></td>${cells.join('')}<td class="nr"><b>${rp(uang)}</b></td></tr>`;
  });
  return `<div class="card"><div class="ch"><div><h3 style="margin:0">Pelaporan Iuran Warga ${K.tahun}</h3><p class="sub">Tanda ✓ terisi otomatis dari pembayaran yang dicatat di Input Iuran.</p></div><button class="lk2" id="kasCsv">${I('dl')}Unduh CSV</button></div>
 <div class="kbar">${cari('Cari rumah atau nama warga')}</div>
 <div class="tw"><table class="kt grid12"><thead><tr><th class="no">NO</th><th class="st">RUMAH / NAMA</th>${BL.map((b) => `<th class="m">${b.toUpperCase()}</th>`).join('')}<th class="nr">TOTAL DIBAYAR</th></tr></thead><tbody>${rows.join('') || '<tr><td colspan="15" class="mut">Data Warga masih kosong.</td></tr>'}</tbody>
 <tfoot><tr><td></td><td class="st">Rumah lunas</td>${perBln.map((n) => `<td class="m">${n}</td>`).join('')}<td class="nr">${W.length} rumah</td></tr></tfoot></table></div></div>`;
}

function kKeluar() {
  const K = S.K,
    L = K.pengeluaran.filter(
      (x) => (!S.kasBl || +x.tanggal.slice(5, 7) === S.kasBl) && (!S.kasKat || x.kategori === S.kasKat),
    ),
    tot = L.reduce((a, x) => a + x.nominal, 0);
  return `<div class="card"><div class="ch"><div><h3 style="margin:0">Pengeluaran Kas RT</h3><p class="sub">${L.length} pengeluaran di ${S.kasBl ? MON[S.kasBl - 1] + ' ' : ''}${K.tahun}${S.kasKat ? ' • ' + esc(S.kasKat) : ''}.</p></div><button class="lk2" id="kasCsv">${I('dl')}Unduh CSV</button></div>
 <div class="kbar">${cari('Cari uraian, peruntukan, atau penerima')}${pilihBulan()}<select id="kkat" aria-label="Filter kategori"><option value="">Semua kategori</option>${K.kategori.map((k) => `<option${S.kasKat === k ? ' selected' : ''}>${k}</option>`).join('')}</select></div>
 <div class="tw"><table class="kt"><thead><tr><th>TANGGAL</th><th>KATEGORI</th><th>PERUNTUKAN</th><th>URAIAN PENGELUARAN</th><th class="nr">NOMINAL</th><th>DIBAYARKAN KEPADA</th><th></th></tr></thead><tbody>
 ${L.map((x) => `<tr data-s="${esc([x.kategori, x.peruntukan, x.uraian, x.dibayar_kepada].join(' ').toLowerCase())}"><td>${tglS(x.tanggal)}</td><td><span class="tag">${esc(x.kategori)}</span></td><td>${esc(x.peruntukan || '—')}</td><td>${esc(x.uraian)}</td><td class="nr dn"><b>${rp(x.nominal)}</b></td><td class="mut wr">${esc(x.dibayar_kepada || '')}</td>${aksi('keluar', x.id)}</tr>`).join('') || '<tr><td colspan="7" class="mut">Belum ada pengeluaran.</td></tr>'}</tbody>
 <tfoot><tr><td colspan="4">TOTAL</td><td class="nr dn">${rp(tot)}</td><td colspan="2"></td></tr></tfoot></table></div></div>`;
}

function kWarga() {
  const W = S.K.warga;
  return `<div class="card"><div class="ch"><div><h3 style="margin:0">Data Warga</h3><p class="sub">${W.length} rumah. Data ini menjadi pilihan rumah saat mencatat iuran.</p></div><button class="lk2" id="kasCsv">${I('dl')}Unduh CSV</button></div>
 <div class="kbar">${cari('Cari rumah, nama, atau keterangan')}</div>
 <div class="tw"><table class="kt"><thead><tr><th class="no">NO</th><th>BLOK / NO. RUMAH</th><th>NAMA WARGA</th><th class="nr">NOMINAL IURAN</th><th>KETERANGAN</th><th></th></tr></thead><tbody>
 ${W.map((w, i) => `<tr data-s="${esc([w.no_rumah, w.nama, w.keterangan].join(' ').toLowerCase())}"><td class="no">${i + 1}</td><td><b>${esc(w.no_rumah)}</b></td><td>${esc(w.nama || '—')}</td><td class="nr">${rp(w.nominal)}</td><td>${w.keterangan ? `<span class="tag ${w.keterangan === 'Rumah Kosong' ? '' : w.keterangan === 'Ada' ? 'g' : 'b'}">${esc(w.keterangan)}</span>` : ''}</td>${aksi('warga', w.id)}</tr>`).join('') || '<tr><td colspan="6" class="mut">Belum ada data rumah.</td></tr>'}</tbody></table></div></div>`;
}

function kBantu() {
  const L = [
    ['Data Warga', 'Isi blok/nomor rumah, nama, dan nominal iuran. Data ini menjadi pilihan saat mencatat iuran.'],
    ['Input Iuran', 'Setiap pembayaran dicatat satu kali: pilih rumah, centang bulan yang dibayar, isi total dan metode. Untuk setoran gabungan (misalnya dari kolektor), pilih "Setoran gabungan" dan tulis uraiannya.'],
    ['Pelaporan Iuran', 'Menampilkan ✓ otomatis pada bulan yang sudah dibayar di Input Iuran. Ganti tahun lewat pilihan "Tahun laporan" di kanan atas.'],
    ['Pengeluaran', 'Catat biaya keamanan, sampah, listrik, kebersihan, kas sosial, acara, dan kebutuhan RT lainnya.'],
    ['Rekap', 'Dihitung otomatis: pemasukan (total bayar menurut tanggal bayar), pengeluaran, selisih, dan saldo kumulatif per bulan, termasuk sisa kas tahun sebelumnya.'],
  ];
  return `<div class="card"><h3 style="margin:0">Petunjuk</h3><p class="sub">Cara memakai menu Kas Warga, sama dengan alur di file Excel laporan keuangan RT.</p><ol class="kbantu">${L.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>
 <div class="alr b">Satu bulan iuran hanya bisa dicatat sekali per rumah. Jika salah input, hapus pembayarannya di Input Iuran lalu catat ulang.</div></div>`;
}

// ----- Form (modal) -----
function kasForm(judul, sub, isi, simpan, tombol = 'Simpan') {
  const o = document.createElement('div');
  o.className = 'mo';
  o.innerHTML = `<form class="md kas" role="dialog" aria-modal="true" aria-label="${judul}" novalidate>
 <div class="kh"><div><h3>${judul}</h3><p class="sub">${sub}</p></div><button type="button" class="x" id="kx" aria-label="Tutup">${I('x')}</button></div>
 <div class="kb">${isi}<div class="err" id="ke" role="alert"></div></div>
 <div class="kf"><button type="button" class="btn" id="kc">Batal</button><button class="btn p" id="ks">${tombol}</button></div></form>`;
  const close = () => {
    o.remove();
    document.removeEventListener('keydown', ek);
  };
  const ek = (e) => e.key === 'Escape' && close();
  document.addEventListener('keydown', ek);
  document.body.append(o);
  const q = (s) => o.querySelector(s);
  // Jangan pakai "e.target === o && close()": handler onclick yang mengembalikan false membatalkan klik tombol Simpan.
  o.onclick = (e) => {
    if (e.target === o) close();
  };
  q('#kx').onclick = q('#kc').onclick = close;
  q('form').onsubmit = async (e) => {
    e.preventDefault();
    q('#ke').textContent = '';
    const b = q('#ks');
    b.disabled = true;
    try {
      const ok = await simpan(q, (t) => (q('#ke').textContent = t));
      if (ok !== false) {
        close();
        kasReload();
      }
    } catch (err) {
      if (!err.handled) q('#ke').textContent = err.message;
    }
    b.disabled = false;
  };
  q('input, select')?.focus();
  return q;
}

function iuranForm() {
  const K = S.K,
    y0 = K.tahun;
  const opsi = K.warga
    .map((w) => `<option value="${w.id}">${esc(w.no_rumah)}${w.nama ? ' — ' + esc(w.nama) : ''}</option>`)
    .join('');
  const q = kasForm(
    'Catat Pembayaran Iuran',
    'Bulan yang dicentang otomatis mendapat ceklis di Pelaporan Iuran.',
    `<div class="g2"><div><label for="fd">Tanggal Bayar</label><input id="fd" type="date" value="${isoToday()}"></div><div><label for="fj">Jenis</label><select id="fj"><option value="r">Per rumah</option><option value="g">Setoran gabungan</option></select></div></div>
 <div id="fr"><label for="fw">Blok / No. Rumah</label><select id="fw"><option value="">Pilih rumah…</option>${opsi}</select>
 <label>Bulan yang dibayar <span class="mut" id="fy"></span></label><div class="g2 fyr"><select id="ft" aria-label="Tahun">${[y0 - 1, y0, y0 + 1].map((t) => `<option${t === y0 ? ' selected' : ''}>${t}</option>`).join('')}</select><span class="mut">Bisa sampai bulan di tahun berikutnya.</span></div><div id="fb"></div></div>
 <div id="fgb" hidden><label for="fu">Uraian Setoran</label><input id="fu" maxlength="150" placeholder="Contoh: Iuran warga Agustus–Oktober (kolektor Blok A)"><div class="alr b">Setoran gabungan hanya menambah pemasukan kas dan tidak memberi ceklis di Pelaporan Iuran. Agar ceklis muncul, catat pembayaran per rumah.</div></div>
 <div class="g2"><div><label for="fn">Total Bayar (Rp)</label><input id="fn" type="number" min="1" step="1" inputmode="numeric" placeholder="0"></div><div><label for="fm">Metode</label><select id="fm">${K.metode.map((m) => `<option>${m}</option>`).join('')}</select></div></div>
 <label for="fc">Catatan</label><input id="fc" maxlength="255" placeholder="Opsional, contoh: Bulan Okt 26 – Mar 27">`,
    async (q, E) => {
      const g = q('#fj').value === 'g',
        body = {
          tanggal: q('#fd').value,
          total: q('#fn').value,
          metode: q('#fm').value,
          catatan: q('#fc').value,
        };
      if (g) {
        body.uraian = q('#fu').value.trim();
        if (!body.uraian) return E('Uraian setoran wajib diisi.'), false;
      } else {
        body.warga_id = q('#fw').value;
        body.bulan = [...q('#fb').querySelectorAll('input:checked')].map((c) => c.value.split('-').map(Number));
        if (!body.warga_id) return E('Pilih rumah terlebih dahulu.'), false;
        if (!body.bulan.length) return E('Centang minimal satu bulan yang dibayar.'), false;
      }
      if (!(+body.total > 0)) return E('Total bayar harus lebih dari 0.'), false;
      await api('api/kas/iuran', body);
      toast('Pembayaran iuran disimpan.');
    },
  );
  let manual = false;
  const hitung = () => {
    if (manual || q('#fj').value === 'g') return;
    const w = wargaBy(+q('#fw').value),
      n = q('#fb').querySelectorAll('input:checked').length;
    q('#fn').value = w && n ? w.nominal * n : '';
  };
  const chips = () => {
    const w = wargaBy(+q('#fw').value),
      t0 = +q('#ft').value;
    q('#fy').textContent = w ? '(' + rp(w.nominal) + ' / bulan)' : '';
    q('#fb').innerHTML = [t0, t0 + 1]
      .map(
        (t) =>
          `<div class="fbl"><small>${t}</small><div>${BL.map((b, j) => {
            const sudah = w && t === K.tahun && lunas(w, j + 1);
            return `<label class="chip ${sudah ? 'dis' : ''}" title="${sudah ? 'Sudah lunas' : ''}"><input type="checkbox" value="${t}-${j + 1}"${sudah ? ' disabled' : ''}>${b}</label>`;
          }).join('')}</div></div>`,
      )
      .join('');
    hitung();
  };
  q('#fw').onchange = q('#ft').onchange = () => {
    manual = false;
    chips();
  };
  q('#fb').onchange = hitung;
  q('#fn').oninput = () => (manual = true);
  q('#fj').onchange = () => {
    const g = q('#fj').value === 'g';
    q('#fr').hidden = g;
    q('#fgb').hidden = !g;
    if (!g) hitung();
  };
  chips();
}

function keluarForm(x) {
  const K = S.K,
    v = x || { tanggal: isoToday(), kategori: '', peruntukan: '', uraian: '', nominal: '', dibayar_kepada: '' };
  kasForm(
    x ? 'Ubah Pengeluaran' : 'Tambah Pengeluaran',
    'Catat setiap pengeluaran kas RT pada satu baris.',
    `<div class="g2"><div><label for="fd">Tanggal</label><input id="fd" type="date" value="${v.tanggal}"></div><div><label for="fk">Kategori</label><select id="fk"><option value="">Pilih kategori…</option>${K.kategori.map((k) => `<option${k === v.kategori ? ' selected' : ''}>${k}</option>`).join('')}</select></div></div>
 <label for="fp">Peruntukan</label><input id="fp" maxlength="100" value="${esc(v.peruntukan || '')}" placeholder="Contoh: Gaji Satpam, Token Listrik">
 <label for="fu">Uraian Pengeluaran</label><input id="fu" maxlength="200" value="${esc(v.uraian)}" placeholder="Contoh: Gaji keamanan bulan Mei">
 <div class="g2"><div><label for="fn">Nominal (Rp)</label><input id="fn" type="number" min="1" step="1" inputmode="numeric" value="${v.nominal}" placeholder="0"></div><div><label for="fo">Dibayarkan Kepada</label><input id="fo" maxlength="100" value="${esc(v.dibayar_kepada || '')}" placeholder="Opsional"></div></div>`,
    async (q, E) => {
      const body = {
        id: x?.id,
        tanggal: q('#fd').value,
        kategori: q('#fk').value,
        peruntukan: q('#fp').value,
        uraian: q('#fu').value.trim(),
        nominal: q('#fn').value,
        dibayar_kepada: q('#fo').value,
      };
      if (!body.tanggal) return E('Tanggal wajib diisi.'), false;
      if (!body.kategori) return E('Pilih kategori pengeluaran.'), false;
      if (!body.uraian) return E('Uraian pengeluaran wajib diisi.'), false;
      if (!(+body.nominal > 0)) return E('Nominal harus lebih dari 0.'), false;
      await api('api/kas/pengeluaran', body);
      toast(x ? 'Pengeluaran diperbarui.' : 'Pengeluaran disimpan.');
    },
  );
}

function wargaForm(x) {
  const K = S.K,
    v = x || { no_rumah: '', nama: '', nominal: 30000, keterangan: 'Ada' };
  kasForm(
    x ? 'Ubah Data Rumah' : 'Tambah Rumah',
    'Data ini menjadi pilihan rumah saat mencatat iuran.',
    `<div class="g2"><div><label for="fr">Blok / No. Rumah</label><input id="fr" maxlength="40" value="${esc(v.no_rumah)}" placeholder="Contoh: A1 No. 05"></div><div><label for="fa">Nama Warga</label><input id="fa" maxlength="100" value="${esc(v.nama || '')}" placeholder="Kosongkan jika rumah kosong"></div></div>
 <div class="g2"><div><label for="fn">Nominal Iuran / Bulan (Rp)</label><input id="fn" type="number" min="0" step="1000" inputmode="numeric" value="${v.nominal}"></div><div><label for="fk">Keterangan</label><select id="fk"><option value="">—</option>${K.keterangan.map((k) => `<option${k === v.keterangan ? ' selected' : ''}>${k}</option>`).join('')}</select></div></div>`,
    async (q, E) => {
      const body = {
        id: x?.id,
        no_rumah: q('#fr').value.trim(),
        nama: q('#fa').value.trim(),
        nominal: q('#fn').value,
        keterangan: q('#fk').value,
      };
      if (!body.no_rumah) return E('Blok / No. Rumah wajib diisi.'), false;
      if (!(+body.nominal >= 0) || body.nominal === '') return E('Nominal iuran tidak valid.'), false;
      await api('api/kas/warga', body);
      toast(x ? 'Data rumah diperbarui.' : 'Rumah ditambahkan.');
    },
  );
}

function kasHapus(t, id) {
  const K = S.K,
    d = {
      iuran: () => {
        const x = K.iuran.find((r) => r.id === id);
        return ['pembayaran', `${esc(x.no_rumah ? x.no_rumah + ' ' + (x.nama || '') : x.uraian)} sebesar <b>${rp(x.total)}</b>${x.bulan.length ? ' (' + fmtBulan(x.bulan) + ')' : ''}`, x.bulan.length ? ' Ceklis bulan tersebut di Pelaporan Iuran ikut terhapus.' : ''];
      },
      keluar: () => {
        const x = K.pengeluaran.find((r) => r.id === id);
        return ['pengeluaran', `${esc(x.uraian)} sebesar <b>${rp(x.nominal)}</b>`];
      },
      warga: () => {
        const x = K.warga.find((r) => r.id === id);
        return ['rumah', `<b>${esc(x.no_rumah)}</b> ${esc(x.nama || '')}`];
      },
    }[t](),
    url = { iuran: 'api/kas/iuran/hapus', keluar: 'api/kas/pengeluaran/hapus', warga: 'api/kas/warga/hapus' }[t];
  modal(
    'Hapus ' + d[0],
    `<p>Hapus ${d[0]} ${d[1]}?${d[2] || ''} Tindakan ini tidak dapat dibatalkan.</p><div class="rt" style="gap:10px"><button class="btn" id="dn">Batal</button><button class="btn p" id="dy">Hapus</button></div>`,
  );
  $('#dn').onclick = closeM;
  $('#dy').onclick = async () => {
    try {
      await api(url, { id });
      closeM();
      toast('Data dihapus.');
      kasReload();
    } catch (e) {
      closeM();
      fail(e);
    }
  };
}

function kasCsv() {
  const K = S.K,
    th = K.tahun;
  let rows, nama;
  if (S.kasTab === 'rekap') {
    let s = K.saldo_awal;
    rows = [['Bulan', 'Pemasukan Iuran', 'Pengeluaran', 'Selisih Bulanan', 'Saldo Kumulatif']].concat(
      K.rekap.map((r) => [MON[r.bulan - 1], r.masuk, r.keluar, r.masuk - r.keluar, (s += r.masuk - r.keluar)]),
    );
    nama = 'rekap';
  } else if (S.kasTab === 'iuran') {
    rows = [['Tanggal Bayar', 'Blok / No. Rumah', 'Nama Warga', 'Bulan Dibayar', 'Total Bayar', 'Metode', 'Catatan']].concat(
      K.iuran.map((x) => [x.tanggal, x.no_rumah || '', x.nama || x.uraian || '', fmtBulan(x.bulan), x.total, x.metode, x.catatan || '']),
    );
    nama = 'input-iuran';
  } else if (S.kasTab === 'lapor') {
    rows = [['No', 'Blok / No. Rumah', 'Nama Warga', ...BL]].concat(
      K.warga.map((w, i) => [i + 1, w.no_rumah, w.nama || '', ...BL.map((_, j) => (lunas(w, j + 1) ? '✓' : ''))]),
    );
    nama = 'pelaporan-iuran';
  } else if (S.kasTab === 'keluar') {
    rows = [['Tanggal', 'Kategori', 'Peruntukan', 'Uraian Pengeluaran', 'Nominal', 'Dibayarkan Kepada']].concat(
      K.pengeluaran.map((x) => [x.tanggal, x.kategori, x.peruntukan || '', x.uraian, x.nominal, x.dibayar_kepada || '']),
    );
    nama = 'pengeluaran';
  } else {
    rows = [['No', 'Blok / No. Rumah', 'Nama Warga', 'Nominal Iuran', 'Keterangan']].concat(
      K.warga.map((w, i) => [i + 1, w.no_rumah, w.nama || '', w.nominal, w.keterangan || '']),
    );
    nama = 'data-warga';
  }
  const sel = (v) => (/[",;\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(
    new Blob(['﻿' + rows.map((r) => r.map(sel).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }),
  );
  a.download = `kas-${nama}-${th}.csv`;
  document.body.append(a);
  a.click();
  a.remove();
}

function bindKas() {
  const r = $('#kasRetry');
  if (r) r.onclick = kasReload;
  const th = $('#kth');
  if (!th) return;
  th.onchange = () => {
    S.kasTh = +th.value;
    S.K = null;
    app();
  };
  document.querySelectorAll('[data-kt]').forEach(
    (b) =>
      (b.onclick = () => {
        S.kasTab = b.dataset.kt;
        S.kasBl = 0;
        S.kasKat = '';
        app();
      }),
  );
  const add = $('#kasAdd');
  if (add) add.onclick = { iuran: iuranForm, keluar: () => keluarForm(), warga: () => wargaForm() }[S.kasTab];
  const csv = $('#kasCsv');
  if (csv) csv.onclick = kasCsv;
  const kq = $('#kq');
  if (kq)
    kq.oninput = () => {
      const s = kq.value.trim().toLowerCase();
      document.querySelectorAll('tr[data-s]').forEach((tr) => (tr.hidden = !!s && !tr.dataset.s.includes(s)));
    };
  const kbl = $('#kbl');
  if (kbl)
    kbl.onchange = () => {
      S.kasBl = +kbl.value;
      app();
    };
  const kkat = $('#kkat');
  if (kkat)
    kkat.onchange = () => {
      S.kasKat = kkat.value;
      app();
    };
  document.querySelectorAll('[data-ke]').forEach(
    (b) =>
      (b.onclick = () => {
        const [t, id] = b.dataset.ke.split(':');
        if (t === 'keluar') keluarForm(S.K.pengeluaran.find((x) => x.id === +id));
        else wargaForm(S.K.warga.find((x) => x.id === +id));
      }),
  );
  document.querySelectorAll('[data-kh]').forEach(
    (b) =>
      (b.onclick = () => {
        const [t, id] = b.dataset.kh.split(':');
        kasHapus(t, +id);
      }),
  );
}
const sizeTxt = (b) =>
  b >= 1048576
    ? (b / 1048576).toFixed(1).replace('.', ',') + ' MB'
    : Math.max(1, Math.round(b / 1024)) + ' KB';
const jam = () =>
  new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
const docsOf = (l) =>
  l.docs || [
    { n: 'KTP_' + l.n.replace(/\s+/g, '_') + '.jpg', s: '1,2 MB' },
    { n: 'Kartu_Keluarga.pdf', s: '840 KB' },
  ];
const fld = (k, v) => `<div class="fld"><small>${k}</small><b>${v}</b></div>`;
const backBtn = (t) => `<button type="button" class="lk back" id="bd">← ${t}</button>`;
function openDet(i) {
  S.det = i;
  app();
  scrollTo(0, 0);
}
function letterDetail() {
  const l = S.letters[S.det],
    w = S.warga.find((x) => x.nama === l.n),
    nik = l.nik || (w && w.nik) || '—';
  return `<div class="wrap">${backBtn('Kembali ke daftar')}<div class="hd" style="margin-top:14px"><div><h1>Detail Pengajuan Surat</h1><p>Periksa data dan dokumen sebelum memberikan keputusan.</p></div></div>
 <div class="dg"><div>
 <div class="card"><h3 class="h3">Informasi pengajuan</h3><div class="g2 fg">${fld('Nama Warga', esc(l.n))}${fld('NIK', nik)}${fld('Jenis Surat', esc(l.j))}${fld('Tanggal Pengajuan', (l.tgl || l.d) + ', ' + (l.jam || '09:24'))}${fld('Prioritas', `<span class="tag ${pc(l.prio)}">${l.prio || '—'}</span>${l.prioSrc === 'default' ? ' <small style="color:var(--mut)">(nilai awal sistem)</small>' : ''}`)}</div>${fld('Keperluan', esc(l.kep || 'Keperluan administrasi.'))}</div>
 <div class="card" style="margin-top:18px"><h3 class="h3">Dokumen persyaratan</h3><div class="g2 docs">${docsOf(
   l,
 )
   .map(
     (d, j) =>
       `<button type="button" class="doc" data-doc="${j}">${I('doc')}<span><b>${esc(d.n)}</b><small>${d.s}</small></span><em>${I('eye')}Lihat</em></button>`,
   )
   .join('')}</div></div></div>
 <form class="card" id="vf" novalidate><h3 class="h3">Keputusan verifikasi</h3><p class="sub">Berikan catatan jika perlu perbaikan atau ditolak.</p><label for="vc">Catatan Pengurus</label><textarea id="vc" rows="4" placeholder="Tulis catatan untuk warga..."></textarea><div class="err" id="ve" role="alert"></div>
 <button type="button" class="btn full ok" data-dec="Siap Diunduh">${I('chk')}Setujui Pengajuan</button><button type="button" class="btn full" data-dec="Perlu Perbaikan">Minta Perbaikan</button><button type="button" class="btn full del" data-dec="Ditolak">Tolak Pengajuan</button></form></div></div>`;
}
function reportDetail() {
  const r = S.reps[S.det],
    p = prio(r),
    done = r.st === 'Selesai' ? 5 : 3,
    steps = [
      'Laporan masuk',
      'Penilaian kriteria',
      'Rekomendasi tampil',
      'Pemeriksaan pengurus',
      'Penanganan akhir',
    ],
    A = {
      Tinggi: 'Mendesak dan perlu segera diperiksa.',
      Sedang: 'Berdampak pada beberapa warga.',
      Rendah: 'Dampak kecil dan tidak mendesak.',
    };
  return `<div class="wrap">${backBtn('Kembali ke ' + (S.view === 'prio' ? 'Prioritas Laporan' : 'Laporan Masyarakat'))}<div class="hd" style="margin-top:14px"><div><h1>${esc(r.t)}</h1><p>${r.no || 'LAP'} • Dilaporkan ${r.tgl}</p></div><div><span class="tag ${tagC(r.st)}">${r.st}</span></div></div>
 <div class="dg"><div>
 <div class="card"><h3 class="h3">Isi laporan</h3><div class="g2 fg">${fld('Pelapor', esc(r.pel))}${fld('Lokasi', esc(r.lok || '—'))}</div>${fld('Deskripsi', esc(r.desc || '—'))}</div>
 <div class="card" style="margin-top:18px"><h3 class="h3">Alur rekomendasi</h3><div class="tw"><div class="flow" style="min-width:560px">${steps.map((t, i) => `<div class="st"><i class="${i < done ? '' : 'off'}">${i + 1}</i>${i < 4 ? '<u></u>' : ''}<span>${t}</span></div>`).join('')}</div></div></div></div>
 <div><div class="card"><div class="ch"><h3 class="h3">Hasil rekomendasi</h3><span class="tag ${pc(p)}">Prioritas ${p}</span></div><div class="mini"><div><small>Urgensi</small><b>${r.urg}/5</b></div><div><small>Dampak</small><b>${r.dam}/5</b></div><div><small>Menunggu</small><b>${lamaD(r)} hari</b></div></div><div class="alr ${pc(p) || 'n'}">${esc(r.alasan || A[p])}</div></div>
 <form class="card" id="rf" style="margin-top:18px" novalidate><h3 class="h3">Tindak lanjut pengurus</h3><label for="rs" style="margin-top:0">Perbarui Status</label><select id="rs">${['Sedang Diproses', 'Selesai'].map((v) => `<option${v === r.st ? ' selected' : ''}>${v}</option>`).join('')}</select><label for="rp">Catatan Penanganan</label><textarea id="rp" rows="4" placeholder="Tulis rencana atau hasil penanganan..."></textarea><button class="btn p full">Simpan Perubahan</button></form></div></div></div>`;
}
function bindDet() {
  if (S.role !== 'rt' || S.det == null) return;
  $('#bd').onclick = () => {
    S.det = null;
    app();
  };
  const l = S.view === 'verif' ? S.letters[S.det] : null;
  document.querySelectorAll('[data-doc]').forEach(
    (b) =>
      (b.onclick = () => {
        const d = docsOf(l)[+b.dataset.doc];
        modal(
          'Pratinjau dokumen',
          kv([
            ['Nama berkas', d.n],
            ['Ukuran', d.s],
            ['Pemohon', l.n],
          ]) +
            (d.id
              ? `<a class="btn p" href="api/dokumen/${d.id}" target="_blank" rel="noopener">${I('eye')}Buka berkas</a>`
              : ''),
        );
      }),
  );
  document.querySelectorAll('[data-dec]').forEach(
    (b) =>
      (b.onclick = async () => {
        const v = b.dataset.dec,
          c = $('#vc').value.trim();
        if (v !== 'Siap Diunduh' && !c) {
          $('#ve').textContent = 'Catatan wajib diisi agar warga tahu alasannya.';
          $('#vc').focus();
          return;
        }
        document.querySelectorAll('[data-dec]').forEach((x) => (x.disabled = true));
        try {
          await api('api/surat/keputusan', { id: l.id, status: v, catatan: c });
          await loadSurat();
          S.det = null;
          toast('Keputusan disimpan.');
          app();
        } catch (err) {
          document.querySelectorAll('[data-dec]').forEach((x) => (x.disabled = false));
          if (!err.handled) $('#ve').textContent = err.message;
        }
      }),
  );
  const rf = $('#rf');
  if (rf)
    rf.onsubmit = (e) => {
      e.preventDefault();
      const r = S.reps[S.det],
        t = $('#rp').value.trim();
      r.st = $('#rs').value;
      r.up = t || (r.st === 'Selesai' ? 'Selesai pada ' + today() : r.up);
      toast('Perubahan disimpan.');
      app();
    };
}
const VIEWS = {
  warga_dash: () => {
    const r = my(S.reps);
    return `<div class="hd"><div><h1>Selamat datang, ${esc(S.user.name.split(' ')[0])}</h1><p>Pantau surat dan laporan Anda.</p></div><div><button class="btn p" data-go="ajuan">${I('doc')}Ajukan Surat</button><button class="btn" data-go="buat">${I('plus')}Buat Laporan</button></div></div>
 <div class="grid">${stat('Total Pengajuan', my(S.letters).length, 'Seluruh pengajuan surat Anda', 'doc')}${stat('Laporan Terkirim', r.length, r.filter((x) => x.st === 'Selesai').length + ' laporan telah ditandatangani', 'plus', 'g')}</div>
 <div class="card info"><div class="ic">${I('bell')}</div><div><span class="sm">INFORMASI WARGA</span><h3>Tetap terhubung dengan lingkungan Quanta 2 Kuningan</h3><p>Pantau pengumuman kegiatan, jadwal kerja bakti, keamanan, dan layanan administrasi RT melalui dashboard ini.</p></div><div class="kon"><small>Kontak layanan</small><b>Pengurus RT 24</b><button class="btn" id="waDash">${I('wa')}Hubungi via WhatsApp</button></div></div>`;
  },
  warga_ajuan:
    () => `<div class="wrap"><div class="hd"><div><h1>Pengajuan Surat Online</h1><p>Lengkapi data dan dokumen persyaratan pengajuan.</p></div></div>
 <form class="card" id="fs" novalidate><h3 style="margin:0">Formulir pengajuan</h3><p class="sub">Data pemohon terisi otomatis sesuai akun warga.</p><hr>
 <div class="g2"><div><label for="fj">Jenis Surat *</label><select id="fj"><option>Surat Keterangan Domisili</option><option>Surat Pengantar SKCK</option><option>Surat Keterangan Usaha</option><option>Surat Pengantar Nikah</option><option>Surat Keterangan Tidak Mampu</option></select></div><div><label for="fn">NIK Pemohon</label><input id="fn" value="${S.user.nik || '3273011208900004'}" readonly></div>
 <div><label for="fm">Nama Lengkap</label><input id="fm" value="${esc(S.user.name)}" readonly></div><div><label for="ft">Tempat, Tanggal Lahir</label><input id="ft" value="${S.user.nik ? '—' : 'Bandung, 12 Agustus 1990'}" readonly></div></div>
 <label for="fk">Keperluan Pengajuan *</label><textarea id="fk" rows="4" placeholder="Contoh: keperluan administrasi pembukaan rekening bank."></textarea>
 <label>Dokumen Persyaratan *</label>${drop('fd', 'Unggah KTP, Kartu Keluarga, dan dokumen lain', `Bisa lebih dari 1 file (maks. ${MAX_DOK}). PDF, JPG, atau PNG, maks. 5 MB per file.`, '.pdf,.jpg,.jpeg,.png', 1, 1)}
 <hr><div class="rt"><button class="btn p">${I('arr')}Kirim Pengajuan</button></div></form></div>`,
  warga_status: () => {
    if (S.det != null) return wLetterPage();
    const L = my(S.letters),
      steps = ['Menunggu Verifikasi', 'Perlu Perbaikan', 'Diproses', 'Siap Diunduh'];
    const act = (l) => {
      const i = S.letters.indexOf(l),
        b = (a, t, ic, c = 'lk2') =>
          `<button class="${c}" data-act="${a}" data-i="${i}">${I(ic)}${t}</button>`;
      return l.s === 'Perlu Perbaikan'
        ? b('fix', 'Perbaiki', 'up', 'btn')
        : l.s === 'Siap Diunduh'
          ? b('preview', 'Preview', 'eye')
          : l.s === 'Ditolak'
            ? b('alasan', 'Lihat Alasan', 'eye')
            : b('detail', 'Detail', 'eye');
    };
    return `<div class="wrap"><div class="hd"><div><h1>Riwayat Pengajuan Surat</h1><p>Lacak proses dan tindak lanjut pengajuan surat Anda.</p></div></div>
 <div class="card"><h3 style="margin:0">Semua pengajuan</h3><p class="sub">${L.length} pengajuan ditemukan</p><div class="tw"><table><thead><tr><th>NO. PENGAJUAN</th><th>JENIS SURAT</th><th>TANGGAL</th><th>STATUS</th><th>CATATAN</th><th></th></tr></thead><tbody>${L.map((l) => `<tr class="${l.s === 'Perlu Perbaikan' ? 'hl' : ''}"><td class="mono">${l.no}</td><td>${l.j}</td><td>${l.tgl}</td><td><span class="tag ${tagC(l.s)}">${l.s}</span></td><td class="cat ${l.s === 'Ditolak' ? 'r' : 'w'}">${l.cat ? esc(l.cat) : '—'}</td><td>${act(l)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Belum ada pengajuan.</td></tr>'}</tbody></table></div></div>
 <div class="card" style="margin-top:22px"><h3 style="margin:0 0 18px">Tahapan status surat</h3><div class="tw"><div class="stp" style="min-width:640px">${steps.map((t, i) => `${i ? '<u></u>' : ''}<i class="${i === 3 ? 'off' : ''}">${i + 1}</i><span>${t}</span>`).join('')}</div></div></div></div>`;
  },
  warga_buat:
    () => `<div class="wrap"><div class="hd"><div><h1>Laporan Masyarakat</h1><p>Sampaikan masalah lingkungan atau layanan di wilayah RT.</p></div></div>
 <form class="card form" id="fr" novalidate><h3 style="margin:0">Buat laporan baru</h3><p class="sub">Jelaskan masalah secara singkat dan jelas.</p>
 <label for="rt">Judul Laporan *</label><input id="rt" placeholder="Contoh: Lampu jalan mati"><label for="rd">Deskripsi Laporan *</label><textarea id="rd" rows="4" placeholder="Jelaskan lokasi, kondisi, dan dampaknya..."></textarea>
 <div style="margin-top:16px">${drop('rf', 'Tambahkan foto pendukung', 'JPG atau PNG, maksimal 5 MB', '.jpg,.jpeg,.png', 0)}</div><div class="rt" style="margin-top:16px"><button class="btn p">${I('arr')}Kirim Laporan</button></div></form></div>`,
  warga_saya: () => {
    const R = my(S.reps);
    return `<div class="wrap"><div class="hd"><div><h1>Laporan Saya</h1><p>Pantau status dan tindak lanjut laporan yang pernah Anda kirim.</p></div><div><button class="btn p" data-go="buat">${I('plus')}Buat Laporan Baru</button></div></div>
 <div class="card"><h3 style="margin:0">Riwayat laporan</h3><p class="sub">${R.length} laporan yang pernah Anda kirim</p><div class="tw"><table><thead><tr><th>JUDUL</th><th>TANGGAL</th><th>STATUS</th><th>PEMBARUAN</th></tr></thead><tbody>${R.map((r) => `<tr><td>${esc(r.t)}</td><td>${r.tgl}</td><td><span class="tag ${tagC(r.st)}">${r.st}</span></td><td class="cat">${esc(r.up)}</td></tr>`).join('') || '<tr><td colspan="4" class="empty">Belum ada laporan.</td></tr>'}</tbody></table></div></div>
 <div class="card wa" style="margin-top:22px"><div><h3>Laporan belum dikonfirmasi atau terlalu lama diproses?</h3><p>Hubungi Ketua RT dengan pesan yang sudah dilengkapi informasi laporan Anda.</p></div><button class="btn" id="wa">${I('wa')}Hubungi via WhatsApp</button></div></div>`;
  },
  rt_dash: () => {
    const p = pend(),
      c = (k) => act().filter((x) => prio(x) === k).length + { Tinggi: 2, Sedang: 3, Rendah: 2 }[k],
      tot = S.reps.length + 5;
    const bar = (k, col) =>
      `<div class="pr"><div><span>${k}</span><b>${c(k)}</b></div><i><u style="width:${(c(k) / tot) * 100 * 1.6}%;background:${col}"></u></i></div>`;
    return `<div class="hd"><div><h1>Dashboard Pengurus RT</h1><p>Ringkasan pelayanan dan aktivitas warga hari ini.</p></div></div>
 <div class="grid">${stat('Jumlah Warga', 438, '126 kepala keluarga', 'users')}${stat('Pengajuan Surat', S.letters.length, p.length + ' perlu diverifikasi', 'doc', 'o')}${stat('Laporan Masyarakat', tot, act().length + ' belum ditandatangani', 'msg', 's')}</div>
 <div class="two"><div class="card"><div class="ch"><h3>Perlu diverifikasi</h3><button class="lk" data-go="verif">Lihat semua</button></div><div class="tw"><table><thead><tr><th>NAMA WARGA</th><th>JENIS SURAT</th><th>DIAJUKAN</th><th>STATUS</th></tr></thead><tbody>${
   p
     .slice(0, 3)
     .map(
       (l) =>
         `<tr><td>${esc(l.n)}</td><td>${esc(l.j)}</td><td>${l.d}</td><td><span class="tag ${tagC(l.s)}">${l.s}</span></td></tr>`,
     )
     .join('') || '<tr><td colspan="4" class="empty">Tidak ada pengajuan yang menunggu.</td></tr>'
 }</tbody></table></div></div>
 <div class="card"><div class="ch"><div><h3>Prioritas laporan</h3><small style="color:var(--mut)">${tot} laporan aktif</small></div>${I('trend')}</div>${bar('Tinggi', '#e11d48')}${bar('Sedang', '#f59e0b')}${bar('Rendah', '#8a99b3')}<button class="btn full" data-go="prio">Lihat rekomendasi</button></div></div>`;
  },
  rt_kas: () => kasPage(),
  rt_data: () => {
    const q = (S.qw || '').toLowerCase(),
      L = S.warga.filter((w) => (w.nik + w.nama).toLowerCase().includes(q));
    return `<div class="wrap"><div class="hd"><div><h1>Manajemen Data Warga</h1><p>Kelola data penduduk yang terdaftar di wilayah RT 24.</p></div><div><button class="btn p" id="addw">${I('plus')}Tambah Warga</button></div></div>
 ${wPanel()}<div class="card sbar"><div class="sx">${I('search')}<input id="q" value="${esc(S.qw || '')}" placeholder="Cari berdasarkan NIK atau nama warga..." aria-label="Cari warga"></div><button class="btn" id="qb">Cari</button></div>
 <div class="card" style="margin-top:16px"><h3 style="margin:0">Daftar warga</h3><p class="sub">Menampilkan ${L.length} dari ${434 + S.warga.length} warga</p><div class="tw"><table><thead><tr><th>NIK</th><th>NAMA LENGKAP</th><th>ALAMAT</th><th>HUBUNGAN KELUARGA</th><th>AKSI</th></tr></thead><tbody>${
   L.map((w) => {
     const i = S.warga.indexOf(w);
     return `<tr><td class="mono">${w.nik}</td><td>${esc(w.nama)}</td><td>${esc(w.alamat)}</td><td>${w.hub}</td><td class="nw"><button class="lk2" data-we="${i}">${I('pen')}Edit</button> <button class="btn del" data-wd="${i}">${I('trash')}Hapus</button></td></tr>`;
   }).join('') || '<tr><td colspan="5" class="empty">Warga tidak ditemukan.</td></tr>'
 }</tbody></table></div></div></div>`;
  },
  rt_verif: () => {
    if (S.det != null) return letterDetail();
    const w = (l) => (/Menunggu|Sudah/.test(l.s) ? 0 : 1),
      L = [...S.letters].sort((a, b) => w(a) - w(b));
    return `<div class="wrap"><div class="hd"><div><h1>Verifikasi Pengajuan Surat</h1><p>Periksa pengajuan surat yang masuk dari warga.</p></div></div>
 <div class="card"><h3 style="margin:0">Daftar pengajuan</h3><p class="sub">${pend().length} pengajuan menunggu diperiksa</p><div class="tw"><table><thead><tr><th>NO. PENGAJUAN</th><th>NAMA WARGA</th><th>JENIS SURAT</th><th>TANGGAL</th><th>STATUS</th><th>PRIORITAS</th><th></th></tr></thead><tbody>${L.map((l) => `<tr><td class="mono">${l.no || '—'}</td><td>${esc(l.n)}</td><td>${esc(l.j)}</td><td>${l.tgl || l.d}</td><td><span class="tag ${tagC(l.s)}">${l.s}</span></td><td><span class="tag ${pc(l.prio)}">${l.prio || '—'}</span></td><td><button class="btn" data-pv="${S.letters.indexOf(l)}">${I('eye')}Periksa</button></td></tr>`).join('') || '<tr><td colspan="7" class="empty">Belum ada pengajuan.</td></tr>'}</tbody></table></div></div></div>`;
  },
  rt_lap: () => {
    if (S.det != null) return reportDetail();
    const q = (S.ql || '').toLowerCase(),
      st = S.qs || '',
      L = S.reps.filter((r) => r.t.toLowerCase().includes(q) && (!st || r.st === st));
    return `<div class="wrap"><div class="hd"><div><h1>Laporan Masyarakat</h1><p>Pantau dan perbarui tindak lanjut laporan dari warga.</p></div></div>
 <div class="fil"><div class="sx">${I('search')}<input id="ql" value="${esc(S.ql || '')}" placeholder="Cari judul laporan..." aria-label="Cari laporan"></div><select id="qs" aria-label="Filter status">${['', 'Sedang Diproses', 'Selesai'].map((v) => `<option value="${v}"${v === st ? ' selected' : ''}>${v || 'Semua status'}</option>`).join('')}</select></div>
 <div class="card"><h3 style="margin:0">Semua laporan</h3><p class="sub">${L.length} laporan masyarakat</p><div class="tw"><table><thead><tr><th>JUDUL LAPORAN</th><th>PELAPOR</th><th>TANGGAL</th><th>STATUS</th><th>PRIORITAS</th><th></th></tr></thead><tbody>${L.map((r) => `<tr><td>${esc(r.t)}</td><td>${esc(r.pel)}</td><td>${r.tgl}</td><td><span class="tag ${tagC(r.st)}">${r.st}</span></td><td><span class="tag ${pc(prio(r))}">${prio(r)}</span></td><td><button class="btn" data-rd="${S.reps.indexOf(r)}">${I('eye')}Detail</button></td></tr>`).join('') || '<tr><td colspan="6" class="empty">Laporan tidak ditemukan.</td></tr>'}</tbody></table></div></div></div>`;
  },
  rt_prio: () => {
    if (S.det != null) return reportDetail();
    const L = act().sort((a, b) => score(b) - score(a)),
      A = {
        Tinggi: 'Mendesak dan perlu segera diperiksa.',
        Sedang: 'Berdampak pada beberapa warga.',
        Rendah: 'Dampak kecil dan tidak mendesak.',
      };
    return `<div class="wrap"><div class="hd"><div><h1>Rekomendasi Prioritas Laporan</h1><p>Urutan rekomendasi pemeriksaan berdasarkan kriteria yang disepakati.</p></div></div>
 <div class="note">${I('shield')}<div><b>Rekomendasi ini bersifat sebagai bantuan.</b><br>Pengurus RT tetap memeriksa laporan dan menentukan penanganan akhir. Aturan prioritas perlu disepakati bersama.</div></div>
 <div class="card"><div class="ch"><div><h3>Aturan penilaian sederhana</h3><p class="sub">Skala 1–5 • skor akhir = Urgensi 40% + Dampak 40% + Lama Menunggu 20%</p></div><button class="btn" id="rul">Lihat aturan</button></div><div class="th3"><div><small>TINGGI</small>Skor ≥ 4,0</div><div><small>SEDANG</small>Skor 2,5–3,9</div><div><small>RENDAH</small>Skor &lt; 2,5</div></div></div>
 <div class="card" style="margin-top:18px"><h3 style="margin:0">Urutan pemeriksaan laporan</h3><p class="sub">Diurutkan dari rekomendasi tertinggi</p><div class="tw"><table><thead><tr><th>#</th><th>JUDUL LAPORAN</th><th>URGENSI</th><th>DAMPAK</th><th>LAMA MENUNGGU</th><th>REKOMENDASI</th><th>ALASAN</th><th></th></tr></thead><tbody>${L.map((r, n) => `<tr><td><span class="num">${n + 1}</span></td><td>${esc(r.t)}</td><td><b>${r.urg}</b>/5</td><td><b>${r.dam}</b>/5</td><td>${lamaD(r)} hari</td><td><span class="tag ${pc(prio(r))}">${prio(r)}</span></td><td class="cat">${esc(r.alasan || A[prio(r)])}</td><td><button class="btn" data-rd="${S.reps.indexOf(r)}">Detail</button></td></tr>`).join('') || '<tr><td colspan="8" class="empty">Tidak ada laporan aktif.</td></tr>'}</tbody></table></div></div></div>`;
  },
};
boot();