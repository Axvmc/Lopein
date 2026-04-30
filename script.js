let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;
  const cartItems = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Keranjang kosong</p>';
    cartTotal.textContent = 'Rp 0';
    return;
  }
  
  let total = 0;
  cartItems.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="cart-item">
        <div style="width:60px;height:60px;background:#f0f0f0;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#999;font-size:24px;">📦</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')}</div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${index})">Hapus</button>
      </div>
    `;
  }).join('');
  cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function addToCart(name, price, button) {
  button.textContent = '✅ Ditambah!';
  button.style.background = '#28a745';
  setTimeout(() => {
    button.textContent = '🛒 Pesan';
    button.style.background = '';
  }, 1000);
  
  cart.push({name, price});
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
  showNotification(`${name} ditambahkan!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function toggleCart() {
  document.getElementById('cartDropdown').classList.toggle('active');
}

function checkout() {
  if (cart.length === 0) return alert('Keranjang kosong!');
  
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const message = `Halo Lokal Peduli Indonesia!\n\nPesanan:\n${cart.map(item => `• ${item.name} - Rp ${item.price.toLocaleString('id-ID')}`).join('\n')}\n\nTOTAL: Rp ${total.toLocaleString('id-ID')}\n\nMohon konfirmasi pembayaran. Terima kasih!`;
  
  // GANTI 6281234567890 dengan nomor WA admin kamu
  window.open(`https://wa.me/6282135952135?text=${encodeURIComponent(message)}`, '_blank');
  
  cart = []; localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI(); toggleCart();
  showNotification('Pesanan terkirim ke WhatsApp! ✅');
}

function showNotification(msg) {
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#0e8a95;color:white;padding:15px 20px;border-radius:10px;z-index:9999;transform:translateX(350px);transition:0.3s;font-weight:500;box-shadow:0 5px 15px rgba(0,0,0,0.3)';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(()=>toast.style.transform='translateX(0)',100);
  setTimeout(()=>toast.remove(),3000);
}

// Tutup cart klik luar
document.addEventListener('click', e => {
  if (!e.target.closest('.cart-container') && !e.target.closest('.cart-dropdown')) {
    document.getElementById('cartDropdown').classList.remove('active');
  }
});

// Start
updateCartUI();