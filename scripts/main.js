const byId = (id) => document.getElementById(id);
const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80';

const storageKey = 'techstore_state_v1';
const prefsKey = 'techstore_prefs_v1';

const defaultState = { compare: [], cart: [] };

const state = loadState() || defaultState;

const currencies = {
  USD: { rate: 1, locale: 'en-US', symbol: 'USD' },
  EUR: { rate: 0.92, locale: 'de-DE', symbol: 'EUR' }
};

let currentCurrency = loadPrefs()?.currency || detectCurrencyFromLocale() || 'USD';
let currentLanguage = loadPrefs()?.language || navigator.language || 'en-US';

const formatCurrency = (value, currency = currentCurrency) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return formatWithLocale(0, currency);
  return formatWithLocale(value, currency);
};

function formatWithLocale(value, currency) {
  const cfg = currencies[currency] || currencies.USD;
  try {
    return new Intl.NumberFormat(cfg.locale, { style: 'currency', currency: cfg.symbol }).format(value);
  } catch (e) {
    return (currency === 'EUR' ? '€' : '$') + value.toFixed(2);
  }
}

function saveState() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (e) {
    // ignore
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function savePrefs() {
  try {
    localStorage.setItem(prefsKey, JSON.stringify({ currency: currentCurrency, language: currentLanguage }));
  } catch (e) {}
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(prefsKey);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function notify(message, opts = {}) {
  const containerId = 'toast-root';
  let container = byId(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 350);
  }, opts.duration || 2600);
}

function detectCurrencyFromLocale() {
  try {
    const lang = navigator.language || 'en-US';
    if (lang.startsWith('en') || lang.startsWith('us')) return 'USD';
    if (lang.startsWith('de') || lang.startsWith('fr') || lang.startsWith('es')) return 'EUR';
  } catch (e) {}
  return 'USD';
}

const priceLabel = (product) => product.price || formatCurrency(product.priceValue, currentCurrency);

const addToCart = (productId) => {
  const item = products.find((p) => p.id === productId);
  if (!item) return;

  const existing = state.cart.find((c) => c.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({ id: productId, qty: 1 });
  }

  renderCart();
  updateCartBadge();
};

// persist and notify
const _afterCartChange = (message) => {
  saveState();
  updateCartBadge();
  if (message) notify(message);
};

const removeFromCart = (productId) => {
  state.cart = state.cart.filter((c) => c.id !== productId);
  renderCart();
  updateCartBadge();
};

const _removeFromCart = (productId) => {
  removeFromCart(productId);
  _afterCartChange('Item removed from cart');
};

const updateCartBadge = () => {
  const badge = byId('cart-badge');
  if (!badge) return;

  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalValue = state.cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product?.priceValue || 0) * item.qty;
  }, 0);

  badge.textContent = `Cart (${totalItems}) • ${formatCurrency(totalValue, currentCurrency)}`;
  saveState();
};

const renderCart = () => {
  const container = byId('cart-items');
  const countEl = byId('cart-count');
  const totalEl = byId('cart-total');
  if (!container || !countEl || !totalEl) return;

  if (!state.cart.length) {
    container.innerHTML = '<span class="muted">Cart is empty.</span>';
    countEl.textContent = '0';
    totalEl.textContent = formatCurrency(0, currentCurrency);
    return;
  }

  const items = state.cart
    .map((entry) => {
      const product = products.find((p) => p.id === entry.id);
      if (!product) return '';
      const lineTotal = (product.priceValue || 0) * entry.qty;
      return `
        <div class="cart-item">
          <div>
            <strong>${product.name}</strong>
            <p class="muted">${entry.qty} × ${priceLabel(product)}</p>
          </div>
          <div>
            <span>${formatCurrency(lineTotal)}</span>
            <button class="text-link" data-remove="${product.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join('');

  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalValue = state.cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.id);
    return sum + (product?.priceValue || 0) * item.qty;
  }, 0);

  container.innerHTML = items;
  countEl.textContent = totalItems;
  totalEl.textContent = formatCurrency(totalValue, currentCurrency);

  container.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', () => _removeFromCart(btn.dataset.remove));
  });
};

const toggleCompare = (productId) => {
  if (state.compare.includes(productId)) {
    state.compare = state.compare.filter((id) => id !== productId);
  } else if (state.compare.length < 3) {
    state.compare.push(productId);
  }
  renderCompare();
};

const _toggleCompare = (productId) => {
  toggleCompare(productId);
  saveState();
  notify(state.compare.includes(productId) ? 'Added to compare' : 'Removed from compare');
};

const renderCompare = () => {
  const grid = byId('compare-grid');
  if (!grid) return;

  if (!state.compare.length) {
    grid.classList.add('muted');
    grid.innerHTML = 'Select products to compare.';
    return;
  }

  grid.classList.remove('muted');
  const items = state.compare
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .map(
      (product) => `
        <div class="compare-card">
          <strong>${product.name}</strong>
          <p class="muted">${priceLabel(product)}</p>
          <p class="muted">${product.specs.cpu}</p>
          <p class="muted">${product.specs.screen}</p>
          <p class="muted">${product.specs.ram || product.ramSize + 'GB'}</p>
        </div>
      `
    )
    .join('');

  grid.innerHTML = items;
};

const renderProductCard = (product) => {
  const specs = product.shortSpecs.map((spec) => `<span class="chip">${spec}</span>`).join('');
  const checked = state.compare.includes(product.id) ? 'checked' : '';
  return `
    <article class="product-card">
      <a href="product.html?id=${product.id}">
        <img src="${product.image || fallbackImage}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage}';">
      </a>
      <div class="card-header">
        <h3>${product.name}</h3>
        <span class="price">${priceLabel(product)}</span>
      </div>
      <p class="muted">${product.description}</p>
      <div class="chip-row">${specs}</div>
      <div class="card-actions">
        <label class="muted"><input type="checkbox" class="compare-toggle" data-id="${product.id}" ${checked}> Compare</label>
        <button class="btn primary add-cart" data-id="${product.id}" type="button">Add to cart</button>
      </div>
      <a class="text-link" href="product.html?id=${product.id}">View details →</a>
    </article>
  `;
};

const renderFeatured = () => {
  const featuredGrid = byId('featured-grid');
  if (!featuredGrid || !Array.isArray(products)) return;

  const featured = products.slice(0, 4);
  featuredGrid.innerHTML = featured.map(renderProductCard).join('');
};

const renderProducts = () => {
  const grid = byId('products-grid');
  if (!grid || !Array.isArray(products)) return;

  const searchInput = byId('search');
  const categorySelect = byId('category-filter');
  const cpuSelect = byId('cpu-filter');
  const priceRange = byId('price-filter');
  const ramRange = byId('ram-filter');
  const priceLabelEl = byId('price-label');
  const ramLabelEl = byId('ram-label');
  const resetBtn = byId('reset-filters');

  const applyFilter = () => {
    const query = (searchInput?.value || '').toLowerCase().trim();
    const category = categorySelect?.value || '';
    const cpu = cpuSelect?.value || '';
    const maxPrice = Number(priceRange?.value || 2500);
    const minRam = Number(ramRange?.value || 0);

    const filtered = products.filter((item) => {
      const haystack = [
        item.name,
        item.description,
        ...item.shortSpecs,
        ...Object.values(item.specs)
      ]
        .join(' ')
        .toLowerCase();

      const matchQuery = !query || haystack.includes(query);
      const matchCategory = !category || item.category === category;
      const matchCpu = !cpu || item.cpuFamily === cpu;
      const matchPrice = (item.priceValue || 0) <= maxPrice;
      const matchRam = (item.ramSize || 0) >= minRam;

      return matchQuery && matchCategory && matchCpu && matchPrice && matchRam;
    });

    grid.classList.toggle('single-hit', filtered.length === 1);
    grid.innerHTML = filtered.map(renderProductCard).join('') || '<p class="muted">No matches found. Try another search.</p>';
  };

  applyFilter();
  renderCompare();
  renderCart();
  updateCartBadge();

  searchInput?.addEventListener('input', applyFilter);
  categorySelect?.addEventListener('change', applyFilter);
  cpuSelect?.addEventListener('change', applyFilter);
  priceRange?.addEventListener('input', () => {
    if (priceLabelEl) priceLabelEl.textContent = formatCurrency(Number(priceRange.value));
    applyFilter();
  });
  ramRange?.addEventListener('input', () => {
    if (ramLabelEl) ramLabelEl.textContent = `${ramRange.value} GB`;
    applyFilter();
  });
  resetBtn?.addEventListener('click', () => {
    if (searchInput) searchInput.value = '';
    if (categorySelect) categorySelect.value = '';
    if (cpuSelect) cpuSelect.value = '';
    if (priceRange) priceRange.value = '2500';
    if (ramRange) ramRange.value = '0';
    if (priceLabelEl) priceLabelEl.textContent = '$2500';
    if (ramLabelEl) ramLabelEl.textContent = '0 GB';
    applyFilter();
  });

  grid.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('add-cart')) {
      addToCart(target.dataset.id);
    }
  });

  grid.addEventListener('change', (e) => {
    const target = e.target;
    if (target.classList.contains('compare-toggle')) {
      toggleCompare(target.dataset.id);
      applyFilter();
    }
  });

  byId('clear-compare')?.addEventListener('click', () => {
    state.compare = [];
    renderCompare();
    applyFilter();
  });

  byId('clear-cart')?.addEventListener('click', () => {
    state.cart = [];
    renderCart();
    updateCartBadge();
  });
};

const renderDetail = () => {
  const container = byId('product-detail');
  if (!container || !Array.isArray(products)) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  const product = products.find((p) => p.id === productId) || products[0];

  if (!product) {
    container.innerHTML = '<p class="muted">Product not found.</p>';
    return;
  }

  const specItems = Object.entries(product.specs)
    .map(
      ([key, value]) => `
        <div class="spec-item">
          <span class="spec-label">${key.toUpperCase()}</span>
          <span class="spec-value">${value}</span>
        </div>
      `
    )
    .join('');

  container.innerHTML = `
    <div class="detail-media">
      <img src="${product.image || fallbackImage}" alt="${product.name}" onerror="this.onerror=null;this.src='${fallbackImage}';">
    </div>
    <div class="detail-info">
      <p class="eyebrow">${product.name}</p>
      <h1>${product.name}</h1>
      <p class="detail-price">${priceLabel(product)}</p>
      <p class="muted">${product.description}</p>
      <div class="spec-grid">${specItems}</div>
      <div class="hero-actions">
        <button class="btn primary" id="add-detail-cart" type="button">Add to cart</button>
        <a class="btn ghost" href="products.html">Back to catalog</a>
      </div>
    </div>
  `;

  byId('add-detail-cart')?.addEventListener('click', () => addToCart(product.id));

  renderRelated(product.id);
  updateCartBadge();
};

const renderRelated = (currentId) => {
  const grid = byId('related-grid');
  if (!grid || !Array.isArray(products)) return;

  const related = products.filter((p) => p.id !== currentId).slice(0, 3);
  grid.innerHTML = related.map(renderProductCard).join('');
};

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  if (page === 'home') {
    renderFeatured();
    updateCartBadge();
  }

  if (page === 'products') {
    renderProducts();
  }

  if (page === 'product') {
    renderDetail();
  }
});
