/**
 * ============================================================
 * RESORTIFY — Luxury Interactivity Suite  v2.0
 * comparison.js
 *
 * HOW TO USE:
 *   Add this line just before </body> in comparison.html:
 *   <script src="comparison.js"></script>
 *
 * FEATURES:
 *   1. Column Highlight      — click a suite column to select it
 *   2. Suite Confirm Modal   — elegant popup before proceeding
 *   3. Price Breakdown Modal — click any price to see full costs
 *   4. Amenity Detail Modal  — click any feature row for details
 *   5. Special Offer Modal   — badge in each suite header
 *   6. Guest Reviews Modal   — star ratings per suite
 * ============================================================
 */

/* ─────────────────────────────────────────
   SUITE DATA  — single source of truth
───────────────────────────────────────── */
const SUITES = [
  {
    name:  'Deluxe Room',
    price: '$450',
    href:  'bill.html',
    breakdown: { room: 450, taxes: 63, service: 22, resort: 15 },
    offer: {
      headline: '15% OFF on Spa Treatments',
      detail:   'Book the Deluxe Room for 3+ nights and enjoy complimentary breakfast for two, plus a 15% discount on all Resortify Spa services.',
      expires:  'Offer valid until 31 August 2025',
    },
    reviews: [
      { author: 'Priya S.',  stars: 5, text: 'Absolutely immaculate room. The king bed and garden view made it unforgettable.' },
      { author: 'James W.', stars: 4, text: 'Great value for the experience. The balcony was a lovely touch.' },
    ],
  },
  {
    name:  'Executive Suite',
    price: '$720',
    href:  'bill.html',
    breakdown: { room: 720, taxes: 100, service: 36, resort: 20 },
    offer: {
      headline: 'Complimentary Airport Transfer',
      detail:   'Stay 2+ nights and receive a round-trip airport transfer in our luxury sedan — plus a welcome bottle of champagne on arrival.',
      expires:  'Limited availability — act fast',
    },
    reviews: [
      { author: 'Anika R.', stars: 5, text: 'The butler service was phenomenal. We felt like royalty from check-in to checkout.' },
      { author: 'Marco L.', stars: 5, text: 'The OLED TV, Grand King bed, premium Wi-Fi — everything was flawless.' },
    ],
  },
  {
    name:  'Royal Villa',
    price: '$1,250',
    href:  'bill.html',
    breakdown: { room: 1250, taxes: 175, service: 62, resort: 30 },
    offer: {
      headline: 'Exclusive Culinary Journey',
      detail:   'Enjoy a private 5-course dinner by our Michelin-starred chef, a daily in-villa spa ritual, and a dedicated 24/7 concierge for the entire stay.',
      expires:  'Subject to availability — book early',
    },
    reviews: [
      { author: 'Sophia T.', stars: 5, text: 'The private pool on the balcony at sunrise — words simply cannot do it justice.' },
      { author: 'Rajan K.',  stars: 5, text: 'Our anniversary stay in the Royal Villa was the most luxurious experience of our lives.' },
    ],
  },
];

/* Amenity detail content, keyed by the exact feature-name text */
const AMENITY_DETAILS = {
  'Total Area': {
    icon: '📐',
    desc: 'Our suites range from a generous 450 sq. ft. Deluxe Room to an expansive 1,800 sq. ft. Royal Villa — each thoughtfully designed to maximise comfort, natural light, and privacy.',
  },
  'Bed Type': {
    icon: '🛏',
    desc: 'Every mattress is custom-crafted with Hypnos springs and 600-thread-count Egyptian cotton. From Twin/King Deluxe options to the bespoke California King in the Royal Villa — sleep is never compromised.',
  },
  'Private Balcony': {
    icon: '🌅',
    desc: 'Each suite offers a private balcony with curated garden or ocean views. The Royal Villa\'s balcony features a heated private plunge pool and a daybed for two.',
  },
  'Smart TV': {
    icon: '📺',
    desc: 'Rooms feature 55" 4K LED, 65" OLED, and 85" QLED screens paired with Bose surround sound in the Royal Villa. Stream, cast, or browse our in-house content library.',
  },
  'High-Speed Wi-Fi': {
    icon: '📡',
    desc: 'Standard Wi-Fi handles everyday browsing. Premium Ultra delivers 500 Mbps for the Executive Suite. The Royal Villa\'s dedicated fibre line provides 1 Gbps symmetrical — perfect for remote work.',
  },
  'Butler Service': {
    icon: '🎩',
    desc: 'Our on-call butler handles wardrobe pressing, private dining arrangements, and more. Royal Villa guests enjoy a personal butler available 24/7 throughout their entire stay.',
  },
  'Airport Transfer': {
    icon: '🚘',
    desc: 'Executive guests receive a complimentary one-way luxury transfer. Royal Villa guests enjoy full round-trip service in a chauffeur-driven Mercedes-Benz S-Class with mineral water and a welcome gift.',
  },
};


/* ─────────────────────────────────────────
   STYLES  (all JS-driven UI in one place)
───────────────────────────────────────── */
const injectStyles = () => {
  document.head.insertAdjacentHTML('beforeend', `<style>
    /* Column highlight */
    .col-selected { background:#fdf5ea !important; }

    /* Row entrance animation */
    .row-hidden  { opacity:0; transform:translateY(16px);
                   transition:opacity .5s cubic-bezier(.22,1,.36,1),
                               transform .5s cubic-bezier(.22,1,.36,1); }
    .row-visible { opacity:1; transform:translateY(0); }

    /* Offer badge injected into suite header */
    .offer-badge {
      display:inline-block; margin-top:10px;
      padding:5px 12px; font-size:10px; letter-spacing:1.5px;
      color:#b2905a; border:1px solid #b2905a;
      cursor:pointer; transition:all .25s;
      font-family:'Inter',sans-serif;
    }
    .offer-badge:hover { background:#b2905a; color:#fff; }

    /* Reviews link injected into suite header */
    .reviews-link {
      display:inline-block; margin-top:6px;
      font-size:10px; letter-spacing:1.5px; color:#aaa;
      cursor:pointer; transition:color .2s;
      font-family:'Inter',sans-serif;
    }
    .reviews-link:hover { color:#b2905a; }

    /* Feature rows look clickable */
    .comparison-table tbody tr:not(.category-row) { cursor:pointer; }
    .comparison-table tbody tr:not(.category-row):hover { background:#fafaf8; }

    /* ── Overlay ── */
    .rfy-overlay {
      position:fixed; inset:0;
      background:rgba(10,7,3,.76);
      display:flex; align-items:center; justify-content:center;
      z-index:9999; opacity:0; pointer-events:none;
      transition:opacity .35s ease;
      backdrop-filter:blur(7px);
    }
    .rfy-overlay.open { opacity:1; pointer-events:all; }

    /* ── Modal box ── */
    .rfy-modal {
      background:#fff; width:min(500px,92vw);
      padding:46px 42px; position:relative; text-align:center;
      transform:translateY(24px) scale(.97);
      transition:transform .42s cubic-bezier(.22,1,.36,1);
    }
    .rfy-overlay.open .rfy-modal { transform:none; }

    .rfy-modal-close {
      position:absolute; top:14px; right:18px;
      background:none; border:none; font-size:22px;
      color:#bbb; cursor:pointer; transition:color .2s;
    }
    .rfy-modal-close:hover { color:#333; }

    /* Shared modal typography */
    .rfy-crown { width:44px; margin:0 auto 18px; display:block; }
    .rfy-modal h2 {
      font-family:'Playfair Display',serif;
      font-size:20px; font-weight:400; letter-spacing:2px;
      color:#222; margin-bottom:6px;
    }
    .rfy-sub { font-size:11px; letter-spacing:3px; color:#b2905a;
                text-transform:uppercase; margin-bottom:20px; }
    .rfy-divider { width:36px; height:1px; background:#b2905a; margin:0 auto 22px; }
    .rfy-modal p { font-size:14px; color:#555; line-height:1.75; margin-bottom:24px; }

    /* Price breakdown table */
    .rfy-price-table { width:100%; border-collapse:collapse; margin-bottom:26px; text-align:left; }
    .rfy-price-table td { padding:9px 0; font-size:13px; color:#555;
                          border-bottom:1px solid #f0f0f0; font-family:'Inter',sans-serif; }
    .rfy-price-table td:last-child { text-align:right; color:#333; font-weight:600; }
    .rfy-price-table tr.total td { color:#222; font-weight:700; font-size:15px;
                                    border-top:2px solid #e0e0e0; border-bottom:none; }

    /* Review blocks */
    .rfy-stars { color:#b2905a; font-size:15px; letter-spacing:2px; margin-bottom:4px; }
    .rfy-review-block { text-align:left; padding:14px 0; border-bottom:1px solid #f0f0f0; }
    .rfy-review-block:last-child { border-bottom:none; }
    .rfy-review-author { font-size:11px; letter-spacing:2px; color:#b2905a;
                          text-transform:uppercase; margin-bottom:6px; }
    .rfy-review-text { font-size:13px; color:#666; line-height:1.65; font-style:italic; }

    /* Amenity icon */
    .rfy-amenity-icon { font-size:38px; margin-bottom:14px; display:block; }

    /* Offer highlight box */
    .rfy-offer-box {
      background:#fdf8f1; border-left:3px solid #b2905a;
      padding:16px 18px; margin-bottom:24px; text-align:left;
    }
    .rfy-offer-box strong { display:block; font-size:13px; color:#333;
                              letter-spacing:1px; margin-bottom:8px; }
    .rfy-offer-box span { font-size:11px; color:#999; letter-spacing:1px; }

    /* Button row */
    .rfy-btn-row { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
    .rfy-btn-gold {
      background:#b2905a; color:#fff; border:none;
      padding:13px 30px; font-size:11px; letter-spacing:2px; font-weight:600;
      cursor:pointer; transition:background .25s; font-family:'Inter',sans-serif;
    }
    .rfy-btn-gold:hover { background:#967a4b; }
    .rfy-btn-outline {
      background:none; border:1px solid #ddd; color:#888;
      padding:13px 26px; font-size:11px; letter-spacing:2px;
      cursor:pointer; transition:all .25s; font-family:'Inter',sans-serif;
    }
    .rfy-btn-outline:hover { border-color:#b2905a; color:#b2905a; }
  </style>`);
};


/* ─────────────────────────────────────────
   MODAL ENGINE — one reusable overlay
───────────────────────────────────────── */
let overlay, modalBody;

const buildOverlay = () => {
  overlay = document.createElement('div');
  overlay.className = 'rfy-overlay';
  overlay.innerHTML = `
    <div class="rfy-modal" role="dialog" aria-modal="true">
      <button class="rfy-modal-close" aria-label="Close">&times;</button>
      <div class="rfy-modal-body"></div>
    </div>`;
  document.body.appendChild(overlay);
  modalBody = overlay.querySelector('.rfy-modal-body');

  overlay.querySelector('.rfy-modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
};

const openModal = html => {
  modalBody.innerHTML = html;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
};

/* Crown SVG reused across all modals */
const crown = `<svg class="rfy-crown" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 28 L4 24 L12 10 L24 20 L36 10 L44 24 L44 28 Z"
        fill="none" stroke="#b2905a" stroke-width="1.4" stroke-linejoin="round"/>
  <circle cx="4"  cy="10" r="2.5" fill="#b2905a"/>
  <circle cx="24" cy="6"  r="2.5" fill="#b2905a"/>
  <circle cx="44" cy="10" r="2.5" fill="#b2905a"/>
</svg>`;


/* ─────────────────────────────────────────
   MODAL 1 — Suite Confirmation
───────────────────────────────────────── */
const showConfirmModal = idx => {
  const s = SUITES[idx];
  openModal(`
    ${crown}
    <h2>CONFIRM YOUR SANCTUARY</h2>
    <div class="rfy-sub">${s.name}</div>
    <div class="rfy-divider"></div>
    <p>You have selected the <strong>${s.name}</strong> at <strong>${s.price} / night</strong>.
       Proceed to complete your luxury reservation.</p>
    <div class="rfy-btn-row">
      <button class="rfy-btn-gold" id="rfy-proceed">PROCEED TO BOOKING</button>
      <button class="rfy-btn-outline" id="rfy-cancel">CHANGE SUITE</button>
    </div>
  `);
  document.getElementById('rfy-proceed').addEventListener('click', () => {
    closeModal();
    setTimeout(() => { window.location.href = s.href; }, 280);
  });
  document.getElementById('rfy-cancel').addEventListener('click', closeModal);
};


/* ─────────────────────────────────────────
   MODAL 2 — Price Breakdown
───────────────────────────────────────── */
const showPriceModal = idx => {
  const s = SUITES[idx];
  const b = s.breakdown;
  const total = b.room + b.taxes + b.service + b.resort;
  openModal(`
    ${crown}
    <h2>PRICE BREAKDOWN</h2>
    <div class="rfy-sub">${s.name} · Per Night</div>
    <div class="rfy-divider"></div>
    <table class="rfy-price-table">
      <tr><td>Room Rate</td>          <td>$${b.room.toLocaleString()}</td></tr>
      <tr><td>Taxes & Fees (14%)</td> <td>$${b.taxes}</td></tr>
      <tr><td>Service Charge</td>     <td>$${b.service}</td></tr>
      <tr><td>Resort Fee</td>         <td>$${b.resort}</td></tr>
      <tr class="total"><td>Total per Night</td><td>$${total.toLocaleString()}</td></tr>
    </table>
    <div class="rfy-btn-row">
      <button class="rfy-btn-gold" id="rfy-pb-book">BOOK THIS SUITE</button>
      <button class="rfy-btn-outline" id="rfy-pb-close">CLOSE</button>
    </div>
  `);
  document.getElementById('rfy-pb-book').addEventListener('click', () => showConfirmModal(idx));
  document.getElementById('rfy-pb-close').addEventListener('click', closeModal);
};


/* ─────────────────────────────────────────
   MODAL 3 — Amenity Detail
───────────────────────────────────────── */
const showAmenityModal = featureName => {
  const a = AMENITY_DETAILS[featureName];
  if (!a) return;
  openModal(`
    <span class="rfy-amenity-icon">${a.icon}</span>
    <h2>${featureName.toUpperCase()}</h2>
    <div class="rfy-divider"></div>
    <p>${a.desc}</p>
    <div class="rfy-btn-row">
      <button class="rfy-btn-outline" id="rfy-am-close">CLOSE</button>
    </div>
  `);
  document.getElementById('rfy-am-close').addEventListener('click', closeModal);
};


/* ─────────────────────────────────────────
   MODAL 4 — Special Offer
───────────────────────────────────────── */
const showOfferModal = idx => {
  const s = SUITES[idx];
  const o = s.offer;
  openModal(`
    ${crown}
    <h2>EXCLUSIVE OFFER</h2>
    <div class="rfy-sub">${s.name}</div>
    <div class="rfy-divider"></div>
    <div class="rfy-offer-box">
      <strong>✦ ${o.headline}</strong>
      ${o.detail}<br><br>
      <span>${o.expires}</span>
    </div>
    <div class="rfy-btn-row">
      <button class="rfy-btn-gold" id="rfy-claim">CLAIM & BOOK</button>
      <button class="rfy-btn-outline" id="rfy-off-close">MAYBE LATER</button>
    </div>
  `);
  document.getElementById('rfy-claim').addEventListener('click', () => showConfirmModal(idx));
  document.getElementById('rfy-off-close').addEventListener('click', closeModal);
};


/* ─────────────────────────────────────────
   MODAL 5 — Guest Reviews
───────────────────────────────────────── */
const showReviewsModal = idx => {
  const s = SUITES[idx];
  const reviewsHTML = s.reviews.map(r => `
    <div class="rfy-review-block">
      <div class="rfy-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <div class="rfy-review-author">${r.author}</div>
      <div class="rfy-review-text">"${r.text}"</div>
    </div>
  `).join('');
  openModal(`
    ${crown}
    <h2>GUEST REVIEWS</h2>
    <div class="rfy-sub">${s.name}</div>
    <div class="rfy-divider"></div>
    ${reviewsHTML}
    <br>
    <div class="rfy-btn-row">
      <button class="rfy-btn-gold" id="rfy-rv-book">BOOK THIS SUITE</button>
      <button class="rfy-btn-outline" id="rfy-rv-close">CLOSE</button>
    </div>
  `);
  document.getElementById('rfy-rv-book').addEventListener('click', () => showConfirmModal(idx));
  document.getElementById('rfy-rv-close').addEventListener('click', closeModal);
};


/* ─────────────────────────────────────────
   INIT: Column Highlight + inject badges
───────────────────────────────────────── */
const initColumns = () => {
  const headerCells = document.querySelectorAll(
    '.comparison-table thead th:not(.feature-col)'
  );

  headerCells.forEach((th, i) => {
    // Inject offer badge and reviews link into each suite header
    th.querySelector('.room-head')?.insertAdjacentHTML('beforeend', `
      <br>
      <span class="offer-badge">✦ SPECIAL OFFER</span>
      <br>
      <span class="reviews-link">★ Read Reviews</span>
    `);

    th.querySelector('.offer-badge')?.addEventListener('click', e => {
      e.stopPropagation();
      showOfferModal(i);
    });
    th.querySelector('.reviews-link')?.addEventListener('click', e => {
      e.stopPropagation();
      showReviewsModal(i);
    });

    // Column highlight on header click
    th.addEventListener('click', () => {
      document.querySelectorAll('.col-selected').forEach(el => el.classList.remove('col-selected'));
      const col = i + 2; // feature-col is col 1; suite cols start at 2
      document.querySelectorAll(
        `.comparison-table tr td:nth-child(${col}),
         .comparison-table thead th:nth-child(${col})`
      ).forEach(cell => cell.classList.add('col-selected'));
    });
  });

  // Click outside table → deselect
  document.addEventListener('click', e => {
    if (!e.target.closest('th:not(.feature-col)') && !e.target.closest('.rfy-overlay')) {
      document.querySelectorAll('.col-selected').forEach(el => el.classList.remove('col-selected'));
    }
  });
};


/* ─────────────────────────────────────────
   INIT: SELECT buttons → Confirm Modal
───────────────────────────────────────── */
const initSelectButtons = () => {
  document.querySelectorAll('.btn-select').forEach((btn, i) => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showConfirmModal(i);
    });
  });
};


/* ─────────────────────────────────────────
   INIT: Price cells → Price Breakdown
───────────────────────────────────────── */
const initPriceCells = () => {
  document.querySelectorAll('.room-head .price').forEach((el, i) => {
    el.style.cursor = 'pointer';
    el.title = 'Click to see full price breakdown';
    el.addEventListener('click', e => {
      e.stopPropagation();
      showPriceModal(i);
    });
  });
};


/* ─────────────────────────────────────────
   INIT: Feature rows → Amenity Detail
───────────────────────────────────────── */
const initFeatureRows = () => {
  document.querySelectorAll('.comparison-table tbody tr:not(.category-row)').forEach(row => {
    const name = row.querySelector('.feature-name')?.textContent.trim();
    if (!name || !AMENITY_DETAILS[name]) return;
    row.title = `Click to learn more about ${name}`;
    row.addEventListener('click', () => showAmenityModal(name));
  });
};


/* ─────────────────────────────────────────
   INIT: Entrance animations on scroll
───────────────────────────────────────── */
const initEntranceAnimations = () => {
  const rows = document.querySelectorAll(
    '.comparison-table tbody tr, .comparison-table tfoot tr'
  );
  rows.forEach((row, i) => {
    row.classList.add('row-hidden');
    row.style.transitionDelay = `${i * 50}ms`;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.replace('row-hidden', 'row-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  rows.forEach(row => obs.observe(row));
};


/* ─────────────────────────────────────────
   RUN
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  buildOverlay();
  initColumns();
  initSelectButtons();
  initPriceCells();
  initFeatureRows();
  initEntranceAnimations();
});
