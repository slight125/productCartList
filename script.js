document.addEventListener("DOMContentLoaded", () => {
    
    let products = []
    let cart = []
    let selectedProducts = {}
  
    
    const productsGrid = document.getElementById("products-grid")
    const cartItems = document.getElementById("cart-items")
    const cartCount = document.getElementById("cart-count")
    const totalPrice = document.getElementById("total-price")
    const modalTotalPrice = document.getElementById("modal-total-price")
    const confirmOrderBtn = document.getElementById("confirm-order")
    const newOrderBtn = document.getElementById("new-order-btn")
    const orderModal = document.getElementById("order-modal")
    const orderSummary = document.getElementById("order-summary")
    const emptyCart = document.getElementById("empty-cart")
    const cartSummary = document.getElementById("cart-summary")
  
    
    const productTemplate = document.getElementById("product-template")
    const cartItemTemplate = document.getElementById("cart-item-template")
    const orderSummaryItemTemplate = document.getElementById("order-summary-item-template")
  
    
    async function fetchProducts() {
      try {
        const response = await fetch("data.json")
        const data = await response.json()
        products = data.products
        renderProducts()
      } catch (error) {
        console.error("Error fetching products:", error)
        
        products = [
          {
            id: 1,
            category: "Waffle",
            name: "Waffle with Berries",
            price: 6.5,
            image:
              "https://images.unsplash.com/photo-1562376552-0d160a2f35b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 2,
            category: "Crème Brûlée",
            name: "Vanilla Bean Crème Brûlée",
            price: 7.0,
            image:
              "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 3,
            category: "Macaron",
            name: "Macaron Mix of Five",
            price: 8.0,
            image:
              "https://images.unsplash.com/photo-1558326567-98ae2405596b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 4,
            category: "Tiramisu",
            name: "Classic Tiramisu",
            price: 5.5,
            image:
              "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 5,
            category: "Baklava",
            name: "Pistachio Baklava",
            price: 4.0,
            image:
              "https://images.unsplash.com/photo-1519676867240-f03562e64548?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 6,
            category: "Pie",
            name: "Lemon Meringue Pie",
            price: 5.0,
            image:
              "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 7,
            category: "Cake",
            name: "Red Velvet Cake",
            price: 4.5,
            image:
              "https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 8,
            category: "Brownie",
            name: "Salted Caramel Brownie",
            price: 5.5,
            image:
              "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
          {
            id: 9,
            category: "Panna Cotta",
            name: "Vanilla Panna Cotta",
            price: 6.5,
            image:
              "https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          },
        ]
        renderProducts()
      }
    }
  
   
    function renderProducts() {
      productsGrid.innerHTML = ""
  
      products.forEach((product) => {
        const productElement = productTemplate.content.cloneNode(true)
        const productCard = productElement.querySelector(".product-card")
        const productImage = productElement.querySelector(".product-image")
        const img = productElement.querySelector(".product-image img")
        const quantityControls = productElement.querySelector(".quantity-controls")
  
        img.src = product.image
        img.alt = product.name
  
        productElement.querySelector(".product-category").textContent = product.category
        productElement.querySelector(".product-name").textContent = product.name
        productElement.querySelector(".product-price").textContent = `$${product.price.toFixed(2)}`
  
        const addToCartBtn = productElement.querySelector(".add-to-cart-btn")
        const decreaseBtn = productElement.querySelector(".decrease")
        const increaseBtn = productElement.querySelector(".increase")
        const quantitySpan = productElement.querySelector(".quantity")
  
        
        if (selectedProducts[product.id]) {
          productImage.classList.add("selected")
          quantityControls.classList.add("visible")
          quantitySpan.textContent = selectedProducts[product.id].quantity
        }
  
        addToCartBtn.addEventListener("click", () => {
          addToCart(product, productCard)
        })
  
        decreaseBtn.addEventListener("click", (e) => {
          e.stopPropagation()
          const currentQuantity = Number.parseInt(quantitySpan.textContent)
          if (currentQuantity > 1) {
            quantitySpan.textContent = currentQuantity - 1
            if (selectedProducts[product.id]) {
              selectedProducts[product.id].quantity = currentQuantity - 1
              updateCart()
            }
          } else {
            
            productImage.classList.remove("selected")
            quantityControls.classList.remove("visible")
            quantitySpan.textContent = "1"
  
            if (selectedProducts[product.id]) {
              delete selectedProducts[product.id]
              removeFromCart(product.id)
            }
          }
        })
  
        increaseBtn.addEventListener("click", (e) => {
          e.stopPropagation()
          const currentQuantity = Number.parseInt(quantitySpan.textContent)
          quantitySpan.textContent = currentQuantity + 1
  
          if (selectedProducts[product.id]) {
            selectedProducts[product.id].quantity = currentQuantity + 1
            updateCart()
          }
        })
  
        productsGrid.appendChild(productElement)
      })
    }
  
    
    function addToCart(product, productCard) {
      const productImage = productCard.querySelector(".product-image")
      const quantityControls = productCard.querySelector(".quantity-controls")
      const quantityElement = productCard.querySelector(".quantity")
      const quantity = Number.parseInt(quantityElement.textContent)
  
      
      selectedProducts[product.id] = {
        ...product,
        quantity,
      }
  
      
      productImage.classList.add("selected")
      quantityControls.classList.add("visible")
  
      
      const existingItem = cart.find((item) => item.id === product.id)
  
      if (existingItem) {
        existingItem.quantity = quantity
      } else {
        cart.push({
          ...product,
          quantity,
        })
      }
  
      updateCart()
    }
  
    
    function removeFromCart(productId) {
      cart = cart.filter((item) => item.id !== productId)
      delete selectedProducts[productId]
  
      
      const productCards = document.querySelectorAll(".product-card")
      productCards.forEach((card) => {
        const addToCartBtn = card.querySelector(".add-to-cart-btn")
        const productData = products.find((p) => p.name === card.querySelector(".product-name").textContent)
  
        if (productData && productData.id === productId) {
          const productImage = card.querySelector(".product-image")
          const quantityControls = card.querySelector(".quantity-controls")
          const quantityElement = card.querySelector(".quantity")
  
          productImage.classList.remove("selected")
          quantityControls.classList.remove("visible")
          quantityElement.textContent = "1"
        }
      })
  
      updateCart()
    }
  
   
    function updateCart() {
      renderCartItems()
      updateCartSummary()
    }
  
    
    function renderCartItems() {
      cartItems.innerHTML = ""
  
      if (cart.length === 0) {
        emptyCart.style.display = "flex"
        cartSummary.classList.remove("visible")
      } else {
        emptyCart.style.display = "none"
        cartSummary.classList.add("visible")
  
        cart.forEach((item) => {
          const cartItemElement = cartItemTemplate.content.cloneNode(true)
  
          cartItemElement.querySelector(".cart-item-name").textContent = item.name
          cartItemElement.querySelector(".quantity-value").textContent = item.quantity
          cartItemElement.querySelector(".item-unit-price").textContent = `$${item.price.toFixed(2)}`
          cartItemElement.querySelector(".item-total-price").textContent = `$${(item.price * item.quantity).toFixed(2)}`
  
          const removeBtn = cartItemElement.querySelector(".remove-item-btn")
          removeBtn.addEventListener("click", () => removeFromCart(item.id))
  
          cartItems.appendChild(cartItemElement)
        })
      }
    }
  
    
    function updateCartSummary() {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
      cartCount.textContent = totalItems
  
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      totalPrice.textContent = `$${total.toFixed(2)}`
      modalTotalPrice.textContent = `$${total.toFixed(2)}`
    }
  
    
    function renderOrderSummary() {
      orderSummary.innerHTML = ""
  
      cart.forEach((item) => {
        const orderItemElement = orderSummaryItemTemplate.content.cloneNode(true)
        const img = orderItemElement.querySelector(".order-item-image")
  
        img.src = item.image
        img.alt = item.name
  
        orderItemElement.querySelector(".order-item-name").textContent = item.name
        orderItemElement.querySelector(".quantity-value").textContent = item.quantity
        orderItemElement.querySelector(".item-unit-price").textContent = `$${item.price.toFixed(2)}`
        orderItemElement.querySelector(".order-item-price").textContent = `$${(item.price * item.quantity).toFixed(2)}`
  
        orderSummary.appendChild(orderItemElement)
      })
    }
  
   
    confirmOrderBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty. Please add some items before confirming your order.")
        return
      }
  
      renderOrderSummary()
      orderModal.classList.add("visible")
    })
  
    
    newOrderBtn.addEventListener("click", () => {
      orderModal.classList.remove("visible")
      cart = []
      selectedProducts = {}
      updateCart()
      renderProducts()
    })
  
    
    orderModal.addEventListener("click", (e) => {
      if (e.target === orderModal) {
        orderModal.classList.remove("visible")
      }
    })
  
    
    fetchProducts()
  })
  