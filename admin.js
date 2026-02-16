// API Configuration
const API_URL = 'http://localhost:3000/api';

// State
let products = [];
let currentImageFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadDashboardStats();
    loadProducts();
    setupDragAndDrop();
});

// Authentication
function checkAuth() {
    // In production, check for valid auth token
    const isAuthenticated = localStorage.getItem('admin_auth');
    if (!isAuthenticated) {
        // For demo purposes, auto-authenticate
        localStorage.setItem('admin_auth', 'true');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_auth');
        window.location.href = 'login.html';
    }
}

// Section Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(sectionId).classList.remove('hidden');

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Load section data
    if (sectionId === 'products') {
        loadProducts();
    } else if (sectionId === 'dashboard') {
        loadDashboardStats();
    }
}

// Dashboard Stats
async function loadDashboardStats() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = response.ok ? await response.json() : getDemoProducts();
        
        document.getElementById('total-products').textContent = products.length;
        document.getElementById('total-orders').textContent = Math.floor(Math.random() * 50);
        
        const totalRevenue = products.reduce((sum, p) => sum + (p.price || 0), 0);
        document.getElementById('total-revenue').textContent = `₦${totalRevenue.toLocaleString()}`;
    } catch (error) {
        console.error('Error loading stats:', error);
        const demoProducts = getDemoProducts();
        document.getElementById('total-products').textContent = demoProducts.length;
        document.getElementById('total-orders').textContent = '0';
        document.getElementById('total-revenue').textContent = '₦0';
    }
}

// Products Management
async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        products = response.ok ? await response.json() : getDemoProducts();
        renderProductsList();
    } catch (error) {
        console.error('Error loading products:', error);
        products = getDemoProducts();
        renderProductsList();
    }
}

function getDemoProducts() {
    return JSON.parse(localStorage.getItem('products')) || [
        {
            id: 1,
            name: 'Royal Aso Ebi Gown',
            category: 'aso-ebi',
            price: 85000,
            stock: 5,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
            description: 'Stunning royal blue Aso Ebi with intricate gold embroidery'
        },
        {
            id: 2,
            name: 'Traditional Yoruba Buba',
            category: 'yoruba',
            price: 65000,
            stock: 8,
            image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
            description: 'Authentic Yoruba Buba and Iro set with traditional patterns'
        },
        {
            id: 3,
            name: 'Elegant Igbo Wrapper',
            category: 'igbo',
            price: 75000,
            stock: 6,
            image: 'https://images.unsplash.com/photo-1583391733981-e6c8c8736f33?w=800&q=80',
            description: 'Premium George wrapper with matching blouse'
        }
    ];
}

function renderProductsList() {
    const container = document.getElementById('products-list');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-center text-[var(--primary)]/60 py-8">No products yet. Add your first product!</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-item flex gap-4">
            <img src="${product.image}" alt="${product.name}" class="w-24 h-24 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-bold text-[var(--primary)] text-lg">${product.name}</h3>
                <p class="text-[var(--primary)]/60 text-sm mb-2">${product.description}</p>
                <div class="flex gap-4 text-sm">
                    <span class="text-[var(--accent)] font-semibold">₦${product.price.toLocaleString()}</span>
                    <span class="text-[var(--primary)]/60">Stock: ${product.stock || 0}</span>
                    <span class="text-[var(--primary)]/60 capitalize">${product.category.replace('-', ' ')}</span>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <button onclick="editProduct(${product.id})" class="btn-primary !py-2 !px-4 text-sm">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="btn-danger !py-2 !px-4 text-sm">Delete</button>
            </div>
        </div>
    `).join('');
}

function searchProducts() {
    const query = document.getElementById('search-products').value.toLowerCase();
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
    
    const container = document.getElementById('products-list');
    container.innerHTML = filtered.map(product => `
        <div class="product-item flex gap-4">
            <img src="${product.image}" alt="${product.name}" class="w-24 h-24 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-bold text-[var(--primary)] text-lg">${product.name}</h3>
                <p class="text-[var(--primary)]/60 text-sm mb-2">${product.description}</p>
                <div class="flex gap-4 text-sm">
                    <span class="text-[var(--accent)] font-semibold">₦${product.price.toLocaleString()}</span>
                    <span class="text-[var(--primary)]/60">Stock: ${product.stock || 0}</span>
                    <span class="text-[var(--primary)]/60 capitalize">${product.category.replace('-', ' ')}</span>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <button onclick="editProduct(${product.id})" class="btn-primary !py-2 !px-4 text-sm">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="btn-danger !py-2 !px-4 text-sm">Delete</button>
            </div>
        </div>
    `).join('');
}

// Image Upload
function setupDragAndDrop() {
    const zone = document.getElementById('image-upload-zone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        zone.addEventListener(eventName, () => {
            zone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        zone.addEventListener(eventName, () => {
            zone.classList.remove('dragover');
        }, false);
    });

    zone.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    
    if (files.length > 0) {
        document.getElementById('image-input').files = files;
        handleImageUpload({ target: { files } });
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size must be less than 5MB', 'error');
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file', 'error');
        return;
    }

    currentImageFile = file;

    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('image-preview').innerHTML = `
            <img src="${e.target.result}" class="preview-image" alt="Preview">
        `;
    };
    reader.readAsDataURL(file);
}

// Form Handling
async function handleProductSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submit-text');
    const loadingBtn = document.getElementById('submit-loading');
    
    submitBtn.classList.add('hidden');
    loadingBtn.classList.remove('hidden');

    const formData = new FormData(event.target);
    
    // Convert to product object
    const product = {
        id: Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        description: formData.get('description'),
        image: currentImageFile ? await convertImageToBase64(currentImageFile) : 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'
    };

    try {
        // Try to send to API
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error('API not available');

        showNotification('Product added successfully!');
    } catch (error) {
        // Fallback to localStorage
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
        showNotification('Product added successfully!');
    }

    resetForm();
    loadDashboardStats();
    
    submitBtn.classList.remove('hidden');
    loadingBtn.classList.add('hidden');
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function resetForm() {
    document.getElementById('product-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    currentImageFile = null;
}

// Product Actions
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    showSection('add-product');
    
    // Populate form
    const form = document.getElementById('product-form');
    form.name.value = product.name;
    form.category.value = product.category;
    form.price.value = product.price;
    form.stock.value = product.stock;
    form.description.value = product.description;

    // Show preview
    document.getElementById('image-preview').innerHTML = `
        <img src="${product.image}" class="preview-image" alt="Preview">
    `;

    // Change submit button behavior
    form.onsubmit = async (e) => {
        e.preventDefault();
        await updateProduct(productId, new FormData(e.target));
    };

    document.getElementById('submit-text').textContent = 'Update Product';
}

async function updateProduct(productId, formData) {
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) return;

    products[index] = {
        ...products[index],
        name: formData.get('name'),
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        stock: parseInt(formData.get('stock')),
        description: formData.get('description'),
        image: currentImageFile ? await convertImageToBase64(currentImageFile) : products[index].image
    };

    try {
        await fetch(`${API_URL}/products/${productId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(products[index])
        });
    } catch (error) {
        localStorage.setItem('products', JSON.stringify(products));
    }

    showNotification('Product updated successfully!');
    resetForm();
    showSection('products');
    loadProducts();
}

async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE'
        });
    } catch (error) {
        // Fallback to localStorage
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
    }

    showNotification('Product deleted successfully!');
    loadProducts();
    loadDashboardStats();
}

// Notifications
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white transform translate-x-0 transition-transform duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
