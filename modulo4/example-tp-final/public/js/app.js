// ─────────────────────────────────────────────────────────────
// app.js — Lógica del frontend ShopAPI
// ─────────────────────────────────────────────────────────────

// ── State ─────────────────────────────────────────────────────
const state = {
  user: null,
  cart: [], // [{ product, quantity }]
  currentPage: 1,
  totalPages: 1,
  filters: { category: "", sort: "-createdAt", search: "" },
  categoriesMap: {},
};

// ── Helpers ───────────────────────────────────────────────────
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove("show"), 3500);
}

function showModal(id) {
  document.getElementById(id).classList.add("open");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("open");
}
function switchModal(from, to) {
  closeModal(from);
  setTimeout(() => showModal(to), 200);
}

function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add("visible");
}
function clearError(id) {
  const el = document.getElementById(id);
  el.textContent = "";
  el.classList.remove("visible");
}

function formatPrice(price) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(price);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function categoryEmoji(name = "") {
  const n = name.toLowerCase();
  if (n.includes("electroni") || n.includes("tecno")) return "💻";
  if (n.includes("ropa") || n.includes("moda")) return "👗";
  if (n.includes("deporte")) return "⚽";
  if (n.includes("hogar") || n.includes("cocin")) return "🏠";
  if (n.includes("libro")) return "📚";
  if (n.includes("juguete")) return "🧸";
  if (n.includes("aliment") || n.includes("comida")) return "🍎";
  if (n.includes("belleza") || n.includes("salud")) return "💆";
  if (n.includes("bazar")) return "🍴";
  if (n.includes("ferre") || n.includes("herrami")) return "🔧";
  if (n.includes("exterio") || n.includes("jard")) return "🏡";
  return "📦";
}

function productEmoji(name = "") {
  const n = name.toLowerCase();
  if (n.includes("laptop") || n.includes("notebook")) return "💻";
  if (n.includes("celular") || n.includes("phone")) return "📱";
  if (n.includes("audifonos") || n.includes("auricular")) return "🎧";
  if (n.includes("zapato") || n.includes("zapatilla")) return "👟";
  if (n.includes("camara") || n.includes("cámara")) return "📷";
  if (n.includes("libro") || n.includes("book")) return "📖";
  if (n.includes("reloj")) return "⌚";
  if (n.includes("bolso") || n.includes("mochila")) return "🎒";
  return "🛍️";
}

// ── Auth ──────────────────────────────────────────────────────
function saveAuth(user, token) {
  state.user = user;
  localStorage.setItem("shop_token", token);
  localStorage.setItem("shop_user", JSON.stringify(user));
  updateAuthUI();
}

function clearAuth() {
  state.user = null;
  state.cart = [];
  localStorage.removeItem("shop_token");
  localStorage.removeItem("shop_user");
  updateAuthUI();
  updateCartBadge();
}

function loadAuth() {
  const token = localStorage.getItem("shop_token");
  const user = localStorage.getItem("shop_user");
  if (token && user) {
    state.user = JSON.parse(user);
    updateAuthUI();
  }
}

function updateAuthUI() {
  const authButtons = document.getElementById("authButtons");
  const userMenu = document.getElementById("userMenu");
  const ordersLink = document.getElementById("ordersNavLink");
  const cartFab = document.getElementById("cartFab");

  if (state.user) {
    authButtons.style.display = "none";
    userMenu.style.display = "flex";
    document.getElementById("userName").textContent =
      state.user.name.split(" ")[0];
    document.getElementById("userAvatar").textContent = state.user.name
      .charAt(0)
      .toUpperCase();
    ordersLink.style.display = "block";
    cartFab.style.display = "block";
  } else {
    authButtons.style.display = "flex";
    userMenu.style.display = "none";
    ordersLink.style.display = "none";
    cartFab.style.display = "none";
    document.getElementById("orders").style.display = "none";
  }
}

// ── Cart ──────────────────────────────────────────────────────
function addToCart(product) {
  if (!state.user) {
    showToast("Debes iniciar sesión para agregar al carrito", "error");
    showModal("loginModal");
    return;
  }
  const existing = state.cart.find((i) => i.product._id === product._id);
  if (existing) {
    if (existing.quantity >= product.stock) {
      showToast("No hay más stock disponible", "error");
      return;
    }
    existing.quantity++;
  } else {
    state.cart.push({ product, quantity: 1 });
  }
  updateCartBadge();
  showToast(`✓ ${product.name} agregado al carrito`, "success");
}

function updateCartBadge() {
  const total = state.cart.reduce((acc, i) => acc + i.quantity, 0);
  document.getElementById("cartBadge").textContent = total;
}

function openCart() {
  if (state.cart.length === 0) {
    showToast("Tu carrito está vacío", "info");
    return;
  }
  renderOrderCart();
  showModal("orderModal");
}

function renderOrderCart() {
  const cartEl = document.getElementById("orderCart");
  const totalEl = document.getElementById("orderTotal");
  cartEl.innerHTML = state.cart
    .map(
      (item, idx) => `
    <div class="cart-item-row">
      <span class="cart-item-name">${item.product.name}</span>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
      </div>
      <span class="cart-item-price">${formatPrice(
        item.product.price * item.quantity
      )}</span>
    </div>
  `
    )
    .join("");

  const total = state.cart.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    0
  );
  totalEl.textContent = `Total: ${formatPrice(total)}`;
}

function changeQty(idx, delta) {
  const item = state.cart[idx];
  item.quantity += delta;
  if (item.quantity <= 0) state.cart.splice(idx, 1);
  updateCartBadge();
  if (state.cart.length === 0) {
    closeModal("orderModal");
    return;
  }
  renderOrderCart();
}

// ── Categories ────────────────────────────────────────────────
async function loadCategories() {
  try {
    const { data } = await Categories.getAll();
    const grid = document.getElementById("categoriesGrid");
    const filterSelect = document.getElementById("filterCategory");

    data.categories.forEach((cat) => {
      state.categoriesMap[cat._id] = cat;
    });

    // Stats
    document.getElementById("statCategories").textContent =
      data.categories.length;

    // Grid
    grid.innerHTML =
      `
      <div class="category-card active" id="cat-all" onclick="filterByCategory('')">
        <div class="category-icon">🛒</div>
        <div class="category-name">Todos</div>
      </div>
    ` +
      data.categories
        .map(
          (cat) => `
      <div class="category-card" id="cat-${
        cat._id
      }" onclick="filterByCategory('${cat._id}')">
        <div class="category-icon">${categoryEmoji(cat.name)}</div>
        <div class="category-name">${cat.name}</div>
      </div>
    `
        )
        .join("");

    // Filter select
    data.categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat._id;
      opt.textContent = cat.name;
      filterSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Error cargando categorías:", err);
  }
}

function filterByCategory(categoryId) {
  state.filters.category = categoryId;
  state.currentPage = 1;
  // Update active card
  document
    .querySelectorAll(".category-card")
    .forEach((c) => c.classList.remove("active"));
  document
    .getElementById(categoryId ? `cat-${categoryId}` : "cat-all")
    ?.classList.add("active");
  // Sync select
  document.getElementById("filterCategory").value = categoryId;
  loadProducts();
}

// ── Products ──────────────────────────────────────────────────
async function loadProducts() {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join("");

  try {
    const params = {
      page: state.currentPage,
      limit: 9,
      sort: state.filters.sort,
    };
    if (state.filters.category) params.category = state.filters.category;
    if (state.filters.search) params.search = state.filters.search;

    const { data } = await Products.getAll(params);
    state.totalPages = data.pagination.pages;
    document.getElementById("statProducts").textContent = data.pagination.total;

    if (data.products.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">No se encontraron productos</div>
          <p>Intenta con otros filtros</p>
        </div>
      `;
      renderPagination();
      return;
    }

    grid.innerHTML = data.products.map((p) => renderProductCard(p)).join("");
    renderPagination();
  } catch (err) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-state-icon">⚠️</div><div class="empty-state-title">Error cargando productos</div><p>${err.message}</p></div>`;
  }
}

function renderProductCard(p) {
  const stockClass = p.stock === 0 ? "out" : p.stock < 5 ? "low" : "";
  const stockText =
    p.stock === 0
      ? "❌ Sin stock"
      : p.stock < 5
      ? `⚠️ Solo ${p.stock} restantes`
      : `✓ ${p.stock} en stock`;
  const disabled = p.stock === 0 ? "disabled" : "";
  const catName = p.category?.name || "";

  return `
    <div class="product-card">
      <div class="product-img-placeholder">${productEmoji(p.name)}</div>
      <div class="product-body">
        <div class="product-category">${catName}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-description">${p.description}</div>
        <div class="product-footer">
          <div>
            <div class="product-price">${formatPrice(p.price)}</div>
            <div class="product-stock ${stockClass}">${stockText}</div>
          </div>
          <button class="add-to-cart-btn" ${disabled} onclick='addToCart(${JSON.stringify(
    p
  )})'>
            + Agregar
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (state.totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";
  for (let i = 1; i <= state.totalPages; i++) {
    html += `<button class="page-btn ${
      i === state.currentPage ? "active" : ""
    }" onclick="goToPage(${i})">${i}</button>`;
  }
  pagination.innerHTML = html;
}

function goToPage(page) {
  state.currentPage = page;
  loadProducts();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// ── Orders ────────────────────────────────────────────────────
async function loadMyOrders() {
  const grid = document.getElementById("ordersGrid");
  grid.innerHTML = '<div class="skeleton-card" style="height:120px"></div>';
  try {
    const { data } = await Orders.getMyOrders();
    if (data.orders.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-title">Aún no tienes órdenes</div>
        </div>
      `;
      return;
    }
    grid.innerHTML = data.orders.map((o) => renderOrderCard(o)).join("");
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--error)">${err.message}</p>`;
  }
}

function renderOrderCard(o) {
  const items = o.items
    .map(
      (i) => `
    <div class="order-item-row">
      <span>${i.product?.name || "Producto"} × ${i.quantity}</span>
      <span>${formatPrice(i.priceAtPurchase * i.quantity)}</span>
    </div>
  `
    )
    .join("");

  const canCancel = !["delivered", "cancelled"].includes(o.status);

  return `
    <div class="order-card">
      <div class="order-header">
        <div>
          <div class="order-id">Orden #${o._id.slice(-8).toUpperCase()}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">${formatDate(
            o.createdAt
          )}</div>
        </div>
        <span class="order-status-badge status-${o.status}">${o.status}</span>
      </div>
      <div class="order-items">${items}</div>
      <div class="order-footer">
        <div>
          <div style="font-size:12px;color:var(--text-muted)">Envío: ${
            o.shippingAddress.city
          }</div>
          <div style="font-size:12px;color:var(--text-muted)">Pago: ${
            o.paymentMethod
          }</div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <span class="order-total-price">${formatPrice(o.totalPrice)}</span>
          ${
            canCancel
              ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder('${o._id}')">Cancelar</button>`
              : ""
          }
        </div>
      </div>
    </div>
  `;
}

async function cancelOrder(id) {
  if (!confirm("¿Seguro que deseas cancelar esta orden?")) return;
  try {
    await Orders.cancel(id);
    showToast("Orden cancelada correctamente", "success");
    loadMyOrders();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ── Event Listeners ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  loadAuth();
  loadCategories();
  loadProducts();

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    document
      .getElementById("navbar")
      .classList.toggle("scrolled", window.scrollY > 20);
  });

  // Hero CTA
  document.getElementById("heroCTABtn").addEventListener("click", () => {
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  });

  // Auth buttons
  document
    .getElementById("loginBtn")
    .addEventListener("click", () => showModal("loginModal"));
  document
    .getElementById("registerBtn")
    .addEventListener("click", () => showModal("registerModal"));
  document.getElementById("logoutBtn").addEventListener("click", () => {
    clearAuth();
    showToast("Sesión cerrada", "info");
  });

  // Cart
  document.getElementById("cartBtn").addEventListener("click", openCart);

  // Orders nav link
  document.getElementById("ordersNavLink").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("orders").style.display = "block";
    document.getElementById("orders").scrollIntoView({ behavior: "smooth" });
    loadMyOrders();
  });

  // Login form
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError("loginError");
    const btn = document.getElementById("loginSubmitBtn");
    btn.querySelector(".btn-text").style.display = "none";
    btn.querySelector(".btn-loader").style.display = "inline";

    try {
      const { data } = await Auth.login({
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value,
      });
      saveAuth(data.user, data.token);
      closeModal("loginModal");
      showToast(
        `¡Bienvenido de vuelta, ${data.user.name.split(" ")[0]}! 👋`,
        "success"
      );
      document.getElementById("loginForm").reset();
    } catch (err) {
      showError("loginError", err.message);
    } finally {
      btn.querySelector(".btn-text").style.display = "inline";
      btn.querySelector(".btn-loader").style.display = "none";
    }
  });

  // Register form
  document
    .getElementById("registerForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      clearError("registerError");
      const btn = document.getElementById("registerSubmitBtn");
      btn.querySelector(".btn-text").style.display = "none";
      btn.querySelector(".btn-loader").style.display = "inline";

      try {
        const { data } = await Auth.register({
          name: document.getElementById("registerName").value,
          email: document.getElementById("registerEmail").value,
          password: document.getElementById("registerPassword").value,
        });
        saveAuth(data.user, data.token);
        closeModal("registerModal");
        showToast(
          `¡Cuenta creada! Bienvenida, ${data.user.name.split(" ")[0]} ✨`,
          "success"
        );
        document.getElementById("registerForm").reset();
      } catch (err) {
        showError("registerError", err.message);
      } finally {
        btn.querySelector(".btn-text").style.display = "inline";
        btn.querySelector(".btn-loader").style.display = "none";
      }
    });

  // Order form
  document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError("orderError");

    const items = state.cart.map((i) => ({
      product: i.product._id,
      quantity: i.quantity,
    }));
    const body = {
      items,
      shippingAddress: {
        street: document.getElementById("orderStreet").value,
        city: document.getElementById("orderCity").value,
        zipCode: document.getElementById("orderZip").value,
        country: "Argentina",
      },
      paymentMethod: document.getElementById("orderPayment").value,
    };

    try {
      const { data } = await Orders.create(body);
      state.cart = [];
      updateCartBadge();
      closeModal("orderModal");
      showToast("🎉 ¡Orden confirmada exitosamente!", "success");
      document.getElementById("orderForm").reset();
    } catch (err) {
      showError("orderError", err.message);
    }
  });

  // Search (debounce)
  let searchTimer;
  document.getElementById("searchInput").addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      state.filters.search = e.target.value.trim();
      state.currentPage = 1;
      loadProducts();
    }, 500);
  });

  // Sort
  document.getElementById("sortProducts").addEventListener("change", (e) => {
    state.filters.sort = e.target.value;
    state.currentPage = 1;
    loadProducts();
  });

  // Category filter select
  document.getElementById("filterCategory").addEventListener("change", (e) => {
    filterByCategory(e.target.value);
  });

  // Close modal on overlay click
  document.querySelectorAll(".modal-overlay").forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  });
});
