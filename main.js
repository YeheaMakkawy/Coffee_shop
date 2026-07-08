// ============================================
 // Dark and Light mode
// ============================================
const body = document.body;
const mode = document.getElementById("mode");
const icon = document.getElementById("icon");

if (mode && icon) {
  mode.addEventListener("click", function () {
    if (body.classList.contains("light")) {
      body.classList.replace("light", "dark");
      icon.classList.replace("bi-moon", "bi-sun");
    } else {
      body.classList.replace("dark", "light");
      icon.classList.replace("bi-sun", "bi-moon");
    }
  });
}

// 1. About page - Scroll Reveal
const reveals = document.querySelectorAll(".reveal");

window.onscroll = function () {
  reveals.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight - 100) {
      el.classList.add("visible");
    }
  });
};
// ============================================
// 2. Contact page - Form Submit
// ============================================
const form = document.getElementById("form");
const msg  = document.getElementById("msg");

if (form) {
  form.onsubmit = function (e) {
    e.preventDefault();
    msg.innerHTML = "Message Sent ✅";
  };
}


// 3. تحديث عداد الكارت في كل الصفحات
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll("#cart-count").forEach(el => {
    el.textContent = totalItems;
  });
}

// ============================================
// 4. إضافة منتج للكارت
// ============================================
function addToCart(name, price, img) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, img, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showToast(`"${name}" added to cart!`);
}

// ============================================
// 5. رسالة Toast
// ============================================
function showToast(message) {
  const existing = document.getElementById("toast-msg");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "toast-msg";
  toast.textContent = "✅ " + message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: #3a2010;
    color: #fff;
    padding: 12px 28px;
    border-radius: 30px;
    font-size: 15px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    transition: opacity 0.4s;
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}

// ============================================
// 6. تشغيل أزرار Order Now + كل حاجة بعد تحميل الصفحة
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // أزرار المنيو
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const card  = button.closest("[data-name]");
      const name  = card.getAttribute("data-name");
      const price = parseFloat(card.getAttribute("data-price"));
      const img   = card.getAttribute("data-img");
      addToCart(name, price, img);
    });
  });

  // عرض الكارت في cart.html
  const cartItemsContainer = document.getElementById("cart-items");
  if (cartItemsContainer) {
    renderCart();
  }
});

// ============================================
// 7. رسم الكارت
// ============================================
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="margin-top:60px; text-align:center;">
        <i class="fa-solid fa-cart-shopping" style="font-size:60px; color:#ccc;"></i>
        <p style="font-size:20px; color:#888; margin-top:16px;">Your cart is empty!</p>
        <a href="menu_page.html" style="color:#c8a96e; font-weight:bold; font-size:16px;">← Back to Menu</a>
      </div>`;
    return;
  }

  let total = 0;
  let html  = `<div class="cart-list" style="max-width:700px; margin:20px auto;">`;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    html += `
      <div class="cart-card" style="
        display:flex; align-items:center; gap:16px;
        background:#fff; border-radius:14px;
        padding:16px 20px; margin-bottom:16px;
        box-shadow:0 2px 12px rgba(0,0,0,0.08);
      ">
        <img src="${item.img}" alt="${item.name}"
          style="width:75px; height:75px; object-fit:cover; border-radius:10px;">

        <div style="flex:1; text-align:left;">
          <h3 style="margin:0 0 4px; font-size:17px;">${item.name}</h3>
          <p style="margin:0; color:#888; font-size:14px;">$${item.price.toFixed(2)} each</p>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <button onclick="changeQty(${index}, -1)" style="
            width:30px; height:30px; border-radius:50%; border:none;
            background:#f0e6d3; font-size:18px; cursor:pointer; font-weight:bold;">−</button>
          <span style="font-size:16px; font-weight:bold; min-width:20px; text-align:center;">
            ${item.quantity}
          </span>
          <button onclick="changeQty(${index}, 1)" style="
            width:30px; height:30px; border-radius:50%; border:none;
            background:#f0e6d3; font-size:18px; cursor:pointer; font-weight:bold;">+</button>
        </div>

        <div style="font-size:16px; font-weight:bold; color:#3a2010; min-width:60px; text-align:right;">
          $${itemTotal.toFixed(2)}
        </div>

        <button onclick="removeItem(${index})" style="
          background:none; border:none; color:#e74c3c;
          font-size:18px; cursor:pointer; padding:4px 8px;">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>`;
  });

  html += `</div>
  <div style="
    max-width:700px; margin:0 auto 40px;
    text-align:right; padding:20px;
    background:#fff; border-radius:14px;
    box-shadow:0 2px 12px rgba(0,0,0,0.08);
  ">
    <p style="font-size:22px; font-weight:bold; color:#3a2010; margin:0 0 16px;">
      Total: $${total.toFixed(2)}
    </p>
    <div style="display:flex; gap:12px; justify-content:flex-end; flex-wrap:wrap;">
      <button onclick="clearCart()" style="
        background:#e74c3c; color:#fff; padding:10px 24px;
        border:none; border-radius:8px; cursor:pointer; font-size:15px;">
        Clear Cart <i class="fa-solid fa-trash"></i>
      </button>
      <button style="
        background:#3a2010; color:#fff; padding:10px 24px;
        border:none; border-radius:8px; cursor:pointer; font-size:15px;">
        Checkout <i class="fa-solid fa-check"></i>
      </button>
    </div>
  </div>`;

  cartItemsContainer.innerHTML = html;
  updateCartCount();
}

// ============================================
// 8. تغيير الكمية
// ============================================
function changeQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ============================================
// 9. حذف منتج
// ============================================
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ============================================
// 10. مسح الكارت كله
// ============================================
function clearCart() {
  localStorage.removeItem("cart");
  renderCart();
}
