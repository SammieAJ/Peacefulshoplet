// // ============================================
// // PEACEFULSHOPLET - MAIN.JS
// // Complete working version - No backend needed
// // ============================================

// // API Configuration - Set to null to work without backend
// const API_URL = null;
// const PEXELS_API_KEY = 'YOUR_KEY_HERE';

// // State Management
// let products = [];
// let cart = JSON.parse(localStorage.getItem('cart')) || [];
// let currentSlide = 0;
// let currentFilter = 'all';

// // ============================================
// // INITIALIZATION
// // ============================================

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('Peacefulshoplet initializing...');
//     loadProducts();
//     loadCategories();
//     updateCartCount();
//     setupCarousel();
//     console.log('Peacefulshoplet ready!');
// });

// // ============================================
// // DEMO PRODUCTS
// // ============================================

// function getDemoProducts() {
//     return [
//         {
//             id: 1,
//             name: 'Royal Aso Ebi Gown',
//             category: 'aso-ebi',
//             price: 85000,
//             stock: 5,
//             image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
//             description: 'Stunning royal blue Aso Ebi with intricate gold embroidery'
//         },
//         {
//             id: 2,
//             name: 'Traditional Yoruba Buba',
//             category: 'yoruba',
//             price: 65000,
//             stock: 8,
//             image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
//             description: 'Authentic Yoruba Buba and Iro set with traditional patterns'
//         },
//         {
//             id: 3,
//             name: 'Elegant Igbo Wrapper',
//             category: 'igbo',
//             price: 75000,
//             stock: 6,
//             image: 'https://images.unsplash.com/photo-1583391733981-e6c8c8736f33?w=800&q=80',
//             description: 'Premium George wrapper with matching blouse'
//         },
//         {
//             id: 4,
//             name: 'Classic Evening Gown',
//             category: 'classic',
//             price: 95000,
//             stock: 3,
//             image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
//             description: 'Sophisticated floor-length evening gown'
//         },
//         {
//             id: 5,
//             name: 'Premium Aso Ebi Set',
//             category: 'aso-ebi',
//             price: 120000,
//             stock: 4,
//             image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
//             description: 'Luxurious Aso Ebi with Swarovski crystals'
//         },
//         {
//             id: 6,
//             name: 'Yoruba Agbada Set',
//             category: 'yoruba',
//             price: 110000,
//             stock: 2,
//             image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
//             description: 'Complete Agbada set with hand-woven details'
//         },
//         {
//             id: 7,
//             name: 'Igbo Celebration Attire',
//             category: 'igbo',
//             price: 88000,
//             stock: 7,
//             image: 'https://images.unsplash.com/photo-1592492152545-c77d8e3e3c2d?w=800&q=80',
//             description: 'Festive Igbo outfit perfect for special occasions'
//         },
//         {
//             id: 8,
//             name: 'Luxury Cocktail Dress',
//             category: 'classic',
//             price: 78000,
//             stock: 5,
//             image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80',
//             description: 'Chic cocktail dress with modern silhouette'
//         }
//     ];
// }

// // ============================================
// // LOAD PRODUCTS
// // ============================================

// async function loadProducts() {
//     try {
//         showLoading();
//         console.log('Loading products...');
        
//         // Load from localStorage or use demo products
//         const savedProducts = localStorage.getItem('products');
        
//         if (savedProducts) {
//             products = JSON.parse(savedProducts);
//             console.log(`Loaded ${products.length} products from localStorage`);
//         } else {
//             products = getDemoProducts();
//             localStorage.setItem('products', JSON.stringify(products));
//             console.log(`Created ${products.length} demo products`);
//         }
        
//         // Render products
//         renderProducts(products);
//         renderCarousel(products.slice(0, 6));
        
//         hideLoading();
//         console.log('Products loaded successfully!');
        
//     } catch (error) {
//         console.error('Error loading products:', error);
//         products = getDemoProducts();
//         renderProducts(products);
//         renderCarousel(products.slice(0, 6));
//         hideLoading();
//     }
// }

// // ============================================
// // RENDER PRODUCTS
// // ============================================

// function renderProducts(productsToRender) {
//     const grid = document.getElementById('products-grid');
    
//     if (!grid) {
//         console.error('Products grid not found!');
//         return;
//     }
    
//     grid.innerHTML = productsToRender.map(product => `
//         <div class="product-card" data-category="${product.category}">
//             <div class="overflow-hidden">
//                 <img src="${product.image}" alt="${product.name}" loading="lazy" 
//                      onerror="this.src='https://via.placeholder.com/800x1000/2D1810/C9A86A?text=Fashion'">
//             </div>
//             <div class="p-6">
//                 <h3 class="display-font text-xl font-bold text-[var(--primary)] mb-2">${product.name}</h3>
//                 <p class="text-[var(--primary)]/60 text-sm mb-4">${product.description}</p>
//                 <div class="flex justify-between items-center">
//                     <span class="text-2xl font-bold text-[var(--accent)]">₦${product.price.toLocaleString()}</span>
//                     <button onclick="addToCart(${product.id})" class="btn-primary !py-2 !px-4 !text-xs">Add to Cart</button>
//                 </div>
//             </div>
//         </div>
//     `).join('');
    
//     console.log(`Rendered ${productsToRender.length} products`);
// }

// // ============================================
// // FILTER PRODUCTS
// // ============================================

// async function filterProducts(category) {
//     currentFilter = category;
    
//     // Update button states
//     document.querySelectorAll('.filter-btn').forEach(btn => {
//         btn.classList.remove('!bg-[var(--primary)]', '!text-[var(--accent)]');
//     });
    
//     if (event && event.target) {
//         event.target.classList.add('!bg-[var(--primary)]', '!text-[var(--accent)]');
//     }
    
//     const filtered = category === 'all' 
//         ? products 
//         : products.filter(p => p.category === category);
    
//     renderProducts(filtered);
//     console.log(`Filtered to ${filtered.length} products in category: ${category}`);
// }

// // ============================================
// // CAROUSEL
// // ============================================

// function setupCarousel() {
//     setInterval(() => {
//         nextSlide();
//     }, 5000);
// }

// function renderCarousel(featuredProducts) {
//     const carousel = document.getElementById('carousel');
    
//     if (!carousel) {
//         console.error('Carousel not found!');
//         return;
//     }
    
//     carousel.innerHTML = featuredProducts.map((product, index) => `
//         <div class="carousel-slide">
//             <div class="grid md:grid-cols-2 gap-8 items-center">
//                 <div class="order-2 md:order-1 p-8">
//                     <p class="text-[var(--accent)] uppercase tracking-widest text-sm mb-4">${product.category.replace('-', ' ')}</p>
//                     <h3 class="display-font text-3xl md:text-4xl font-bold text-[var(--primary)] mb-4">${product.name}</h3>
//                     <p class="text-[var(--primary)]/70 mb-6">${product.description}</p>
//                     <div class="flex items-center gap-4 mb-6">
//                         <span class="display-font text-3xl font-bold text-[var(--accent)]">₦${product.price.toLocaleString()}</span>
//                     </div>
//                     <button onclick="addToCart(${product.id})" class="btn-primary">Add to Cart</button>
//                 </div>
//                 <div class="order-1 md:order-2">
//                     <img src="${product.image}" alt="${product.name}" 
//                          class="w-full h-[500px] object-cover rounded-lg shadow-2xl"
//                          onerror="this.src='https://via.placeholder.com/800x1000/2D1810/C9A86A?text=Fashion'">
//                 </div>
//             </div>
//         </div>
//     `).join('');
    
//     console.log('Carousel rendered');
// }

// function nextSlide() {
//     const carousel = document.getElementById('carousel');
//     if (!carousel) return;
    
//     const slides = carousel.children.length;
//     if (slides === 0) return;
    
//     currentSlide = (currentSlide + 1) % slides;
//     carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
// }

// function prevSlide() {
//     const carousel = document.getElementById('carousel');
//     if (!carousel) return;
    
//     const slides = carousel.children.length;
//     if (slides === 0) return;
    
//     currentSlide = (currentSlide - 1 + slides) % slides;
//     carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
// }

// // ============================================
// // CATEGORIES
// // ============================================

// function loadCategories() {
//     const categories = [
//         {
//             name: 'Aso Ebi',
//             image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
//             filter: 'aso-ebi',
//             description: 'Traditional Nigerian celebration attire'
//         },
//         {
//             name: 'Yoruba Traditional',
//             image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
//             filter: 'yoruba',
//             description: 'Authentic Yoruba cultural fashion'
//         },
//         {
//             name: 'Igbo Attire',
//             image: 'https://images.unsplash.com/photo-1583391733981-e6c8c8736f33?w=800&q=80',
//             filter: 'igbo',
//             description: 'Traditional Igbo wedding wear'
//         }
//     ];
    
//     const grid = document.getElementById('categories');
    
//     if (!grid) {
//         console.error('Categories grid not found!');
//         return;
//     }
    
//     grid.innerHTML = categories.map(cat => `
//         <div class="category-card cursor-pointer" onclick="handleCategoryClick('${cat.filter}')">
//             <img src="${cat.image}" alt="${cat.name}" class="w-full h-full object-cover" loading="lazy"
//                  onerror="this.src='https://via.placeholder.com/800x1000/2D1810/C9A86A?text=${encodeURIComponent(cat.name)}'">
//             <div class="category-overlay"></div>
//             <div class="absolute bottom-8 left-8 z-10">
//                 <h3 class="display-font text-3xl font-bold text-white mb-2">${cat.name}</h3>
//                 <p class="text-white/80 text-sm mb-3">${cat.description}</p>
//                 <button class="btn-secondary !border-white !text-white hover:!bg-white hover:!text-[var(--primary)] !py-2 !px-6">Explore</button>
//             </div>
//         </div>
//     `).join('');
    
//     console.log('Categories loaded');
// }

// async function handleCategoryClick(category) {
//     console.log(`Category clicked: ${category}`);
    
//     // Scroll to products section
//     const productsSection = document.querySelector('#products-grid');
//     if (productsSection) {
//         productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
    
//     // Wait a bit for scroll, then filter
//     setTimeout(async () => {
//         await filterProducts(category);
//     }, 500);
// }

// // ============================================
// // CART FUNCTIONS
// // ============================================

// function addToCart(productId) {
//     const product = products.find(p => p.id === productId);
//     if (!product) {
//         console.error('Product not found:', productId);
//         return;
//     }
    
//     const existingItem = cart.find(item => item.id === productId);
    
//     if (existingItem) {
//         existingItem.quantity++;
//     } else {
//         cart.push({ ...product, quantity: 1 });
//     }
    
//     saveCart();
//     updateCartCount();
//     showNotification('Added to cart! 🛍️', 'success');
//     console.log('Item added to cart:', product.name);
// }

// function removeFromCart(productId) {
//     cart = cart.filter(item => item.id !== productId);
//     saveCart();
//     updateCartCount();
//     renderCartItems();
// }

// function updateQuantity(productId, change) {
//     const item = cart.find(item => item.id === productId);
//     if (item) {
//         item.quantity += change;
//         if (item.quantity <= 0) {
//             removeFromCart(productId);
//         } else {
//             saveCart();
//             renderCartItems();
//         }
//     }
// }

// function saveCart() {
//     localStorage.setItem('cart', JSON.stringify(cart));
// }

// function updateCartCount() {
//     const count = cart.reduce((sum, item) => sum + item.quantity, 0);
//     const cartCountEl = document.getElementById('cart-count');
//     if (cartCountEl) {
//         cartCountEl.textContent = count;
//     }
// }

// function viewCart() {
//     renderCartItems();
//     const modal = document.getElementById('cart-modal');
//     if (modal) {
//         modal.classList.remove('hidden');
//         modal.classList.add('flex');
//     }
// }

// function closeCart() {
//     const modal = document.getElementById('cart-modal');
//     if (modal) {
//         modal.classList.add('hidden');
//         modal.classList.remove('flex');
//     }
// }

// function renderCartItems() {
//     const container = document.getElementById('cart-items');
//     if (!container) return;
    
//     const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
//     if (cart.length === 0) {
//         container.innerHTML = '<p class="text-center text-[var(--primary)]/60 py-8">Your cart is empty</p>';
//         const totalEl = document.getElementById('cart-total');
//         if (totalEl) totalEl.textContent = '₦0';
//         return;
//     }
    
//     container.innerHTML = cart.map(item => `
//         <div class="flex gap-4 mb-4 pb-4 border-b">
//             <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded">
//             <div class="flex-1">
//                 <h4 class="font-bold text-[var(--primary)]">${item.name}</h4>
//                 <p class="text-[var(--accent)] font-semibold">₦${item.price.toLocaleString()}</p>
//                 <div class="flex items-center gap-2 mt-2">
//                     <button onclick="updateQuantity(${item.id}, -1)" class="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300">-</button>
//                     <span class="w-12 text-center">${item.quantity}</span>
//                     <button onclick="updateQuantity(${item.id}, 1)" class="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300">+</button>
//                 </div>
//             </div>
//             <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
//                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
//                 </svg>
//             </button>
//         </div>
//     `).join('');
    
//     const totalEl = document.getElementById('cart-total');
//     if (totalEl) {
//         totalEl.textContent = `₦${total.toLocaleString()}`;
//     }
// }

// function checkout() {
//     if (cart.length === 0) {
//         showNotification('Your cart is empty!', 'error');
//         return;
//     }
    
//     showNotification('Checkout feature coming soon! Contact us to complete your order.', 'info');
// }

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================

// function showLoading() {
//     const loadingEl = document.getElementById('loading');
//     if (loadingEl) {
//         loadingEl.classList.remove('hidden');
//     }
// }

// function hideLoading() {
//     const loadingEl = document.getElementById('loading');
//     if (loadingEl) {
//         loadingEl.classList.add('hidden');
//     }
// }

// function showNotification(message, type = 'success') {
//     const notification = document.createElement('div');
//     const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
//     notification.className = `fixed top-24 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${bgColor} text-white transform translate-x-0 transition-transform duration-300`;
//     notification.textContent = message;
    
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//         notification.style.transform = 'translateX(120%)';
//         setTimeout(() => notification.remove(), 300);
//     }, 3000);
// }

// function scrollToSection(sectionId) {
//     const section = document.getElementById(sectionId);
//     if (section) {
//         section.scrollIntoView({ behavior: 'smooth' });
//     }
// }

// function toggleMobileMenu() {
//     const menu = document.getElementById('mobile-menu');
//     if (menu) {
//         menu.classList.toggle('active');
//     }
// }

// // ============================================
// // FORM HANDLERS
// // ============================================

// function handleNewsletter(event) {
//     event.preventDefault();
//     const email = event.target.querySelector('input[type="email"]').value;
    
//     console.log('Newsletter subscription:', email);
//     showNotification('Thank you for subscribing! 📧', 'success');
//     event.target.reset();
// }

// async function handleContact(event) {
//     event.preventDefault();
    
//     const formData = {
//         name: event.target.querySelector('input[type="text"]').value,
//         email: event.target.querySelector('input[type="email"]').value,
//         message: event.target.querySelector('textarea').value
//     };
    
//     console.log('Contact form submitted:', formData);
//     showNotification('Thank you! Your message has been received. 📬', 'success');
//     event.target.reset();
// }

// // ============================================
// // EVENT LISTENERS
// // ============================================

// document.addEventListener('click', (e) => {
//     const modal = document.getElementById('cart-modal');
//     if (e.target === modal) {
//         closeCart();
//     }
// });

// document.addEventListener('keydown', (e) => {
//     if (e.key === 'Escape') {
//         closeCart();
//         const mobileMenu = document.getElementById('mobile-menu');
//         if (mobileMenu && mobileMenu.classList.contains('active')) {
//             toggleMobileMenu();
//         }
//     }
// });

// // ============================================
// // LOAD MORE PRODUCTS
// // ============================================

// async function loadMoreProducts() {
//     const btn = document.getElementById('load-more-btn');
//     if (btn) {
//         const originalText = btn.textContent;
//         btn.textContent = 'Loading...';
//         btn.disabled = true;
        
//         setTimeout(() => {
//             showNotification('All products loaded! 🎉', 'success');
//             btn.textContent = originalText;
//             btn.disabled = false;
//         }, 1000);
//     }
// }

// console.log('✅ Peacefulshoplet main.js loaded successfully!');



// ============================================
// QUICK VIEW POPUP LOGIC
// ============================================

function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');

    content.innerHTML = `
        <div class="grid md:grid-cols-2 gap-8">
            <div class="overflow-hidden rounded-lg">
                <img src="${product.image}" alt="${product.name}" class="w-full h-[400px] object-cover">
            </div>
            <div class="flex flex-col justify-center">
                <span class="text-[var(--accent)] uppercase tracking-widest text-xs mb-2">${product.category}</span>
                <h2 class="display-font text-3xl font-bold text-[var(--primary)] mb-4">${product.name}</h2>
                <p class="text-gray-600 mb-6 leading-relaxed">${product.description}</p>
                <div class="text-3xl font-bold text-[var(--primary)] mb-6">₦${product.price.toLocaleString()}</div>
                <button onclick="addToCart(${product.id}); closeQuickView()" class="btn-primary w-full py-4">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
}

function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Add this to your existing event listeners at the bottom
document.addEventListener('click', (e) => {
    const modal = document.getElementById('quick-view-modal');
    if (e.target === modal) closeQuickView();
});

// ============================================
// 1. UPDATED PRODUCTS (Ensuring categories match)
// ============================================
function getDemoProducts() {
    return [
        {
            id: 1,
            name: 'Royal Aso Ebi Gown',
            category: 'aso-ebi', // This must match the filter below
            price: 85000,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
            description: 'Stunning royal blue Aso Ebi with gold embroidery'
        },
        {
            id: 2,
            name: 'Classic Yoruba Buba',
            category: 'yoruba', // This must match the filter below
            price: 65000,
            image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
            description: 'Traditional Yoruba Buba and Iro set'
        },
        {
            id: 3,
            name: 'Elegant Igbo Wrapper',
            category: 'igbo', // This must match the filter below
            price: 75000,
            image: 'https://images.unsplash.com/photo-1583391733981-e6c8c8736f33?w=800&q=80',
            description: 'Premium George wrapper with matching blouse'
        }
    ];
}

// ============================================
// 2. UPDATED CATEGORIES (The "Routing" Fix)
// ============================================
function loadCategories() {
    const categories = [
        {
            name: 'Aso Ebi',
            image: 'https://images.unsplash.com/photo-1572491975038-dc60464f94ce?w=800&q=80',
            filter: 'aso-ebi', // This matches the product category above
            description: 'Celebration attire'
        },
        {
            name: 'Yoruba Style',
            image: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&q=80',
            filter: 'yoruba', // Matches 'yoruba'
            description: 'Authentic Yoruba fashion'
        },
        {
            name: 'Igbo Attire',
            image: 'https://images.unsplash.com/photo-1563203119-9486f0592929?w=800&q=80',
            filter: 'igbo', // Matches 'igbo'
            description: 'Igbo cultural wear'
        }
    ];
    
    const grid = document.getElementById('categories');
    if (!grid) return;
    
    grid.innerHTML = categories.map(cat => `
        <div class="category-card relative group cursor-pointer overflow-hidden rounded-lg" 
             onclick="handleCategoryClick('${cat.filter}')">
            <img src="${cat.image}" class="w-full h-80 object-cover">
            <div class="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
                <h3 class="text-2xl font-bold text-white">${cat.name}</h3>
                <p class="text-white/80 text-sm">Click to view items</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// 3. THE FILTER FUNCTION (The "Connection")
// ============================================
function handleCategoryClick(category) {
    console.log("Filtering for:", category);
    
    // 1. Filter the products array
    const filtered = products.filter(p => p.category === category);
    
    // 2. Re-render the grid with ONLY those products
    renderProducts(filtered);
    
    // 3. Smooth scroll to the products
    document.getElementById('products-grid').scrollIntoView({ behavior: 'smooth' });
}