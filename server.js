const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// In-memory database (replace with real database in production)
let products = [
    {
        id: 1,
        name: 'Royal Aso Ebi Gown',
        category: 'aso-ebi',
        price: 85000,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
        description: 'Stunning royal blue Aso Ebi with intricate gold embroidery',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Traditional Yoruba Buba',
        category: 'yoruba',
        price: 65000,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80',
        description: 'Authentic Yoruba Buba and Iro set with traditional patterns',
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: 'Elegant Igbo Wrapper',
        category: 'igbo',
        price: 75000,
        stock: 6,
        image: 'https://images.unsplash.com/photo-1583391733981-e6c8c8736f33?w=800&q=80',
        description: 'Premium George wrapper with matching blouse',
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        name: 'Classic Evening Gown',
        category: 'classic',
        price: 95000,
        stock: 3,
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80',
        description: 'Sophisticated floor-length evening gown',
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        name: 'Premium Aso Ebi Set',
        category: 'aso-ebi',
        price: 120000,
        stock: 4,
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
        description: 'Luxurious Aso Ebi with Swarovski crystals',
        createdAt: new Date().toISOString()
    },
    {
        id: 6,
        name: 'Yoruba Agbada Set',
        category: 'yoruba',
        price: 110000,
        stock: 2,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
        description: 'Complete Agbada set with hand-woven details',
        createdAt: new Date().toISOString()
    }
];

let orders = [];
let contacts = [];

// ==================== PRODUCT ROUTES ====================

// Get all products
app.get('/api/products', (req, res) => {
    const { category, search, sortBy, order = 'desc' } = req.query;
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    // Search
    if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        );
    }
    
    // Sort
    if (sortBy === 'price') {
        filteredProducts.sort((a, b) => 
            order === 'asc' ? a.price - b.price : b.price - a.price
        );
    } else if (sortBy === 'name') {
        filteredProducts.sort((a, b) => 
            order === 'asc' 
                ? a.name.localeCompare(b.name) 
                : b.name.localeCompare(a.name)
        );
    } else {
        filteredProducts.sort((a, b) => 
            order === 'asc' 
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt)
        );
    }
    
    res.json(filteredProducts);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// Create product
app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;
        
        // Validation
        if (!name || !category || !price || !description) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const newProduct = {
            id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
            name,
            category,
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            description,
            image: req.file 
                ? `http://localhost:${PORT}/uploads/${req.file.filename}`
                : req.body.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
            createdAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        
        res.status(201).json({
            message: 'Product created successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const index = products.findIndex(p => p.id === productId);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const { name, category, price, stock, description } = req.body;
        
        products[index] = {
            ...products[index],
            name: name || products[index].name,
            category: category || products[index].category,
            price: price ? parseFloat(price) : products[index].price,
            stock: stock ? parseInt(stock) : products[index].stock,
            description: description || products[index].description,
            image: req.file 
                ? `http://localhost:${PORT}/uploads/${req.file.filename}`
                : req.body.image || products[index].image,
            updatedAt: new Date().toISOString()
        };
        
        res.json({
            message: 'Product updated successfully',
            product: products[index]
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === productId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    const deletedProduct = products.splice(index, 1)[0];
    
    res.json({
        message: 'Product deleted successfully',
        product: deletedProduct
    });
});

// ==================== ORDER ROUTES ====================

// Get all orders
app.get('/api/orders', (req, res) => {
    res.json(orders);
});

// Create order
app.post('/api/orders', (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, items, totalAmount, shippingAddress } = req.body;
        
        if (!customerName || !customerEmail || !items || !totalAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const newOrder = {
            id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
            customerName,
            customerEmail,
            customerPhone,
            items,
            totalAmount,
            shippingAddress,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        
        // Update product stock
        items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (product) {
                product.stock = Math.max(0, product.stock - item.quantity);
            }
        });
        
        res.status(201).json({
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Update order status
app.patch('/api/orders/:id/status', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { status } = req.body;
    
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    
    order.status = status;
    order.updatedAt = new Date().toISOString();
    
    res.json({
        message: 'Order status updated successfully',
        order
    });
});

// ==================== CONTACT ROUTES ====================

// Submit contact form
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const newContact = {
            id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
            name,
            email,
            message,
            createdAt: new Date().toISOString()
        };
        
        contacts.push(newContact);
        
        res.status(201).json({
            message: 'Message received successfully',
            contact: newContact
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// Get all contacts
app.get('/api/contacts', (req, res) => {
    res.json(contacts);
});

// ==================== STATS ROUTES ====================

// Get dashboard stats
app.get('/api/stats', (req, res) => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    const categoryStats = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {});
    
    res.json({
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        categoryStats
    });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Peacefulshoplet API is running',
        timestamp: new Date().toISOString()
    });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         Peacefulshoplet API Server Running            ║
║                                                       ║
║  Server: http://localhost:${PORT}                        ║
║  API Endpoint: http://localhost:${PORT}/api               ║
║  Health Check: http://localhost:${PORT}/api/health        ║
║                                                       ║
║  Available Routes:                                    ║
║  - GET    /api/products                              ║
║  - POST   /api/products                              ║
║  - PUT    /api/products/:id                          ║
║  - DELETE /api/products/:id                          ║
║  - GET    /api/orders                                ║
║  - POST   /api/orders                                ║
║  - POST   /api/contact                               ║
║  - GET    /api/stats                                 ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
