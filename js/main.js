(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Config wiring ---------- */
  (function applyConfig() {
    if (CFG.hoursText) $('#hoursText').textContent = CFG.hoursText;

    if (CFG.mapsLink) {
      ['#dirLink', '#revLink', '#quickDir'].forEach(function (s) { var a = $(s); if (a) a.href = CFG.mapsLink; });
    }

    if (CFG.phoneDisplay) {
      var tel = CFG.phoneDisplay.replace(/[^\d+]/g, '');
      var link = $('#phoneLink');
      link.textContent = CFG.phoneDisplay;
      link.href = 'tel:' + tel;
      $('#phoneLine').hidden = false;
    }

    var social = $('#socialLine');
    var items = [];
    if (CFG.instagram) items.push('<a href="' + CFG.instagram + '" target="_blank" rel="noopener">Instagram</a>');
    if (CFG.facebook) items.push('<a href="' + CFG.facebook + '" target="_blank" rel="noopener">Facebook</a>');
    if (items.length) { social.innerHTML = items.join(''); social.hidden = false; }

    if (CFG.whatsapp) $('#submitBtn').textContent = 'Send request on WhatsApp';
    else $('#submitBtn').textContent = 'Prepare my request';

    $('#yr').textContent = new Date().getFullYear();
  })();

  /* ---------- Proposal ribbon ---------- */
  (function ribbon() {
    var el = $('#ribbon');
    if (CFG.showProposalBanner === false) return;
    var dismissed = false;
    try { dismissed = sessionStorage.getItem('handson-ribbon') === '1'; } catch (e) {}
    if (dismissed) return;
    el.hidden = false;
    $('#ribbonClose').addEventListener('click', function () {
      el.hidden = true;
      try { sessionStorage.setItem('handson-ribbon', '1'); } catch (e) {}
    });
  })();

  /* ---------- Hero strands (generated, no image files needed) ---------- */
  (function strands() {
    var g = $('#strandPaths');
    if (!g) return;
    var NS = 'http://www.w3.org/2000/svg';
    var W = 800, H = 1100, N = 54, STEPS = 40;
    var seed = 11;
    function rnd() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    var phase = rnd() * 6.28, amp = 90 + rnd() * 60;
    var frag = document.createDocumentFragment();

    for (var i = 0; i < N; i++) {
      var o = i - (N - 1) / 2, d = '';
      for (var k = 0; k <= STEPS; k++) {
        var v = k / STEPS;
        var cp = Math.cos(v * Math.PI * 1.25 + 0.4), pinch = 0.35 + 0.65 * cp * cp;
        var x = W / 2 + amp * Math.sin(v * Math.PI * 1.7 + phase) + o * 10 * pinch + 14 * Math.sin(v * 9 + i * 0.35);
        var y = -40 + v * (H + 80);
        d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      }
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('pathLength', '1');
      p.setAttribute('stroke-width', (0.8 + rnd() * 1.7).toFixed(2));
      p.setAttribute('opacity', (0.4 + rnd() * 0.55).toFixed(2));
      p.style.setProperty('--i', i);
      frag.appendChild(p);
    }
    g.appendChild(frag);
  })();

  /* ---------- Look picker ---------- */
  var LOOKS = {
    spa:   { text: 'Spa treatments to slow down and recharge.',  target: 'svc-spa' },
    care:  { text: 'Personal care for a fresher you.',            target: 'svc-care' },
    hair:  { text: 'Haircuts for women and men.',                 target: 'svc-hair' },
    beard: { text: 'Beard trims, neat and clean.',                target: 'svc-beard' }
  };
  var stage = $('#stage'), caption = $('#lookCaption'), lookLink = $('#lookLink');

  function setLook(key) {
    var L = LOOKS[key]; if (!L) return;
    stage.setAttribute('data-look', key);
    caption.textContent = L.text;
    lookLink.setAttribute('data-open', L.target);
    $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-look') === key)); });
  }
  $$('.chip').forEach(function (c) { c.addEventListener('click', function () { setLook(c.getAttribute('data-look')); }); });
  setLook('spa');

  lookLink.addEventListener('click', function (e) {
    e.preventDefault();
    openService(lookLink.getAttribute('data-open'));
  });

  function openService(id) {
    var d = document.getElementById(id);
    if (!d) return;
    d.open = true;
    $('#services').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    var s = d.querySelector('summary'); if (s) setTimeout(function () { s.focus({ preventScroll: true }); }, 350);
  }

  /* ---------- Nav: solid on scroll, mobile drawer ---------- */
  var nav = $('#nav');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  var menuBtn = $('#menuBtn'), drawer = $('#drawer');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 960 && !drawer.hidden) setMenu(false); });

  /* ---------- "Book this" buttons preselect the service ---------- */
  var svcSelect = $('#fService');
  $$('[data-book]').forEach(function (b) {
    b.addEventListener('click', function () {
      var want = b.getAttribute('data-book');
      $$('option', svcSelect).forEach(function (o) { if (o.textContent === want) svcSelect.value = o.value || o.textContent; });
      var target = $('#book');
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      setTimeout(function () { $('#fName').focus({ preventScroll: true }); }, 450);
    });
  });

  /* ---------- Booking form ---------- */
  var form = $('#bookForm'), result = $('#result');
  var dateInput = $('#fDate');
  (function setMinDate() {
    var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    dateInput.min = t.toISOString().slice(0, 10);
  })();

  function fail(input, errEl, msg) {
    input.setAttribute('aria-invalid', 'true');
    errEl.textContent = msg;
  }
  function clear(input, errEl) {
    input.removeAttribute('aria-invalid');
    errEl.textContent = '';
  }
  ['#fName', '#fPhone'].forEach(function (s) {
    $(s).addEventListener('input', function () { clear($(s), $(s === '#fName' ? '#eName' : '#ePhone')); });
  });

  function formatDate(v) {
    if (!v) return '';
    var p = v.split('-'); if (p.length !== 3) return v;
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#fName'), phone = $('#fPhone');
    var ok = true;
    clear(name, $('#eName')); clear(phone, $('#ePhone'));

    if (!name.value.trim()) { fail(name, $('#eName'), 'Please enter your name.'); ok = false; }
    var digits = phone.value.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(digits)) { fail(phone, $('#ePhone'), 'Please enter a valid 10-digit mobile number.'); ok = false; }
    if (!ok) { (name.getAttribute('aria-invalid') ? name : phone).focus(); return; }

    var lines = [
      'Hello Hand\'s on, I would like to request an appointment.',
      'Name: ' + name.value.trim(),
      'Mobile: ' + digits,
      'Service: ' + svcSelect.value
    ];
    if (dateInput.value) lines.push('Preferred day: ' + formatDate(dateInput.value));
    var note = $('#fNote').value.trim(); if (note) lines.push('Note: ' + note);
    var msg = lines.join('\n');

    if (CFG.whatsapp) {
      var num = String(CFG.whatsapp).replace(/\D/g, '');
      window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
      showResult('Opening WhatsApp', 'Your message is ready in WhatsApp. Press send there and the team will confirm your time.', msg);
    } else {
      showResult('Demo mode: request prepared',
        'No WhatsApp number is connected yet, so nothing was sent. Once the salon adds its number in js/site-config.js, this button opens WhatsApp with the message below.',
        msg);
    }
  });

  function showResult(title, text, msg) {
    $('#resultTitle').textContent = title;
    $('#resultText').textContent = text;
    $('#resultMsg').textContent = msg;
    form.hidden = true;
    result.hidden = false;
    result.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  $('#againBtn').addEventListener('click', function () {
    result.hidden = true; form.hidden = false; $('#fName').focus();
  });

  $('#copyBtn').addEventListener('click', function () {
    var btn = this, text = $('#resultMsg').textContent;
    function done(ok) { btn.textContent = ok ? 'Copied' : 'Press and hold the text to copy'; setTimeout(function () { btn.textContent = 'Copy message'; }, 2200); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else { done(false); }
  });
})();
