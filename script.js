document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const productsGrid = document.getElementById('products-grid');
  const cartItems = document.getElementById('cart-items');
  const emptyCart = document.getElementById('empty-cart');
  const cartQuantity = document.getElementById('cart-quantity');
  const cartTotal = document.getElementById('cart-total');
  const btnConfirmOrder = document.getElementById('btn-confirm-order');
  const confirmationModal = document.getElementById('confirmation-modal');
  const modalItems = document.getElementById('modal-items');
  const modalTotal = document.getElementById('modal-total');
  const btnNewOrder = document.getElementById('btn-new-order');
  const overlay = document.getElementById('overlay');

  // State
  let products = [];
  let cart = [];

  // Fetch products from data.json
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      renderProducts();
    })
    .catch(error => console.error('Error loading products:', error));

  // Render products
  function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.setAttribute('tabindex', '0');
      
      // Use responsive images based on screen size
      const imgSrc = window.innerWidth < 768 ? product.image.mobile : 
                    window.innerWidth < 1024 ? product.image.tablet : 
                    product.image.desktop;
      
      productCard.innerHTML = `
        <img class="product-image" src="${imgSrc}" alt="${product.name}">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-category">${product.category}</p>
          <p class="product-price">$${product.price.toFixed(2)}</p>
          <div class="carbon-neutral">
            <img src="./assets/images/icon-carbon-neutral.svg" alt="Carbon neutral">
            <span>Carbon neutral</span>
          </div>
          <button class="btn-add-to-cart" aria-label="Add ${product.name} to cart">
            <img src="./assets/images/icon-add-to-cart.svg" alt="">
            Add to Cart
          </button>
        </div>
      `;
      
      const addToCartBtn = productCard.querySelector('.btn-add-to-cart');
      addToCartBtn.addEventListener('click', () => addToCart(product));
      
      productsGrid.appendChild(productCard);
    });
  }

  // Add product to cart
  function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }
    
    updateCart();
  }

  // Remove product from cart
  function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCart();
  }

  // Increase product quantity
  function increaseQuantity(productName) {
    const item = cart.find(item => item.name === productName);
    if (item) {
      item.quantity += 1;
      updateCart();
    }
  }

  
  function decreaseQuantity(productName) {
    const item = cart.find(item => item.name === productName);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      updateCart();
    } else if (item && item.quantity === 1) {
      removeFromCart(productName);
    }
  }

  
  function updateCart() {
    
    const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
    cartQuantity.textContent = totalQuantity;
    
    
    if (totalQuantity === 0) {
      emptyCart.style.display = 'flex';
      cartItems.style.display = 'none';
      btnConfirmOrder.disabled = true;
    } else {
      emptyCart.style.display = 'none';
      cartItems.style.display = 'flex';
      btnConfirmOrder.disabled = false;
    }
    
    
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      
      cartItem.innerHTML = `
        <img class="cart-item-image" src="${item.image.thumbnail}" alt="${item.name}">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="btn-quantity btn-decrease" aria-label="Decrease quantity">
            <img src="./assets/images/icon-decrement-quantity.svg" alt="">
          </button>
          <span class="quantity-value">${item.quantity}</span>
          <button class="btn-quantity btn-increase" aria-label="Increase quantity">
            <img src="./assets/images/icon-increment-quantity.svg" alt="">
          </button>
        </div>
        <button class="btn-remove" aria-label="Remove ${item.name} from cart">
          <img src="./assets/images/icon-remove-item.svg" alt="">
        </button>
      `;
      
      const decreaseBtn = cartItem.querySelector('.btn-decrease');
      const increaseBtn = cartItem.querySelector('.btn-increase');
      const removeBtn = cartItem.querySelector('.btn-remove');
      
      decreaseBtn.addEventListener('click', () => decreaseQuantity(item.name));
      increaseBtn.addEventListener('click', () => increaseQuantity(item.name));
      removeBtn.addEventListener('click', () => removeFromCart(item.name));
      
      cartItems.appendChild(cartItem);
    });
    
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  }

  
  function showConfirmationModal() {

    modalItems.innerHTML = '';
    cart.forEach(item => {
      const modalItem = document.createElement('div');
      modalItem.className = 'modal-item';
      
      modalItem.innerHTML = `
        <div class="modal-item-name">${item.name}</div>
        <div class="modal-item-quantity">x${item.quantity}</div>
      `;
      
      modalItems.appendChild(modalItem);
    });
    
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    modalTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
   
    confirmationModal.classList.add('active');
    overlay.classList.add('active');
  }

  
  function hideConfirmationModal() {
    confirmationModal.classList.remove('active');
    overlay.classList.remove('active');
  }

 
  function startNewOrder() {
    cart = [];
    updateCart();
    hideConfirmationModal();
  }

  
  btnConfirmOrder.addEventListener('click', showConfirmationModal);
  btnNewOrder.addEventListener('click', startNewOrder);
  overlay.addEventListener('click', hideConfirmationModal);

  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && confirmationModal.classList.contains('active')) {
      hideConfirmationModal();
    }
  });

  
  window.addEventListener('resize', () => {
    if (products.length > 0) {
      renderProducts();
    }
  });
});