/* ===============================
   DATA PRODUK
================================ */
const PRODUCTS = [
  { id: 1, name: "Smartphone X1", price: 3500000, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop" },
  { id: 2, name: "Headphone Pro", price: 850000, image: "https://images.unsplash.com/photo-1518444024103-0f0f3f0b8e07?q=80&w=800&auto=format&fit=crop" },
  { id: 3, name: "Kamera Mirrorless", price: 5250000, image: "https://images.unsplash.com/photo-1519183071298-a2962f2f6e3b?q=80&w=800&auto=format&fit=crop" },
  { id: 4, name: "Smartwatch 2", price: 1250000, image: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=800&auto=format&fit=crop" },
  { id: 5, name: "Powerbank 20K", price: 175000, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop" },
  { id: 6, name: "Speaker Bluetooth", price: 450000, image: "https://images.unsplash.com/photo-1518444024103-0f0f3f0b8e07?q=80&w=800&auto=format&fit=crop" }
];

/* ===============================
   HELPER LOCAL STORAGE
================================ */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function load(key) {
  return JSON.parse(localStorage.getItem(key));
}

/* ===============================
   AUTH SYSTEM
================================ */
function getCurrentUser() {
  return load("currentUser");
}

function registerUser() {
  const username = document.getElementById("reg-username").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  if (!username || !password) {
    alert("Isi username dan password");
    return;
  }

  const users = load("users") || [];
  if (users.find(u => u.username === username)) {
    alert("Username sudah terdaftar");
    return;
  }

  users.push({ username, password });
  save("users", users);

  alert("Registrasi berhasil");
  window.location.href = "login.html";
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const users = load("users") || [];
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    alert("Username atau password salah");
    return;
  }

  save("currentUser", { username });
  window.location.href = "index.html";
}
function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("cart");
  alert("Anda berhasil logout");
  window.location.href = "index.html";
}


================================ */
function updateAuthArea() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  const user = getCurrentUser();
  const cart = load("cart") || [];
  const totalItem = cart.reduce((s, i) => s + i.qty, 0);

  if (user) {
    authArea.innerHTML = `
      <span class="hi-user">Hi, ${user.username}</span>
      <a href="cart.html">Cart(${totalItem})</a>
      <button onclick="logout()">Logout</button>
    `;
  } else {
    authArea.innerHTML = `
      <a href="login.html">Login</a>
      <a href="register.html">Daftar</a>
      <a href="cart.html">Cart(${totalItem})</a>
    `;
  }
}

function renderProducts() {
  const list = document.getElementById("product-list");
  if (!list) return;

  list.innerHTML = "";
  PRODUCTS.forEach(p => {
    list.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>Rp ${p.price.toLocaleString("id-ID")}</p>
        <button onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
      </div>
    `;
  });
}

function renderHomeProducts() {
  const home = document.getElementById("home-products");
  if (!home) return;

  home.innerHTML = "";
  PRODUCTS.slice(0, 4).forEach(p => {
    home.innerHTML += `
      <div class="product">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>Rp ${p.price.toLocaleString("id-ID")}</p>
      </div>
    `;
  });
}


function getCart() {
  return load("cart") || [];
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const cart = getCart();

  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ ...product, qty: 1 });

  save("cart", cart);
  updateAuthArea();
  alert("Produk ditambahkan");
}

function renderCart() {
  const body = document.getElementById("cart-body");
  const totalEl = document.getElementById("cart-total");
  if (!body || !totalEl) return;

  const cart = getCart();
  body.innerHTML = "";

  let total = 0;
  cart.forEach((item, i) => {
    const sub = item.qty * item.price;
    total += sub;

    body.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>Rp ${item.price.toLocaleString("id-ID")}</td>
        <td>
          <input type="number" min="1" value="${item.qty}"
            onchange="updateQty(${i}, this.value)">
        </td>
        <td>Rp ${sub.toLocaleString("id-ID")}</td>
        <td>
          <button onclick="removeItem(${i})">Hapus</button>
        </td>
      </tr>
    `;
  });

  totalEl.textContent = "Total: Rp " + total.toLocaleString("id-ID");
}

function updateQty(index, value) {
  const cart = getCart();
  cart[index].qty = Math.max(1, parseInt(value) || 1);
  save("cart", cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  save("cart", cart);
  renderCart();
  updateAuthArea();
}

/* ===============================
   CHECKOUT
================================ */
function goCheckout() {
  if (!getCurrentUser()) {
    alert("Silakan login terlebih dahulu");
    window.location.href = "login.html";
    return;
  }

  if (getCart().length === 0) {
    alert("Keranjang masih kosong");
    return;
  }

  if (!confirm("Yakin ingin checkout?")) return;

  save("cart", []);
  alert("Checkout berhasil. Terima kasih!");
  window.location.href = "index.html";
}

function protectCheckout() {
  if (!getCurrentUser()) {
    window.location.href = "login.html";
    return;
  }

  const userEl = document.getElementById("checkout-user");
  const totalEl = document.getElementById("checkout-total");

  const total = getCart().reduce((s, i) => s + i.qty * i.price, 0);

  if (userEl) userEl.textContent = getCurrentUser().username;
  if (totalEl) totalEl.textContent = "Rp " + total.toLocaleString("id-ID");
}

function finishOrder() {
  if (getCart().length === 0) {
    alert("Keranjang kosong");
    return;
  }

  save("cart", []);
  alert("Pembayaran berhasil");
  window.location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", () => {
  updateAuthArea();
  renderProducts();
  renderHomeProducts();
  renderCart();
  protectCheckout();
});
