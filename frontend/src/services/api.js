import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Session management
const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getSessionId = () => {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = generateSessionId();
        localStorage.setItem("sessionId", sessionId);
    }
    return sessionId;
};

// Products API
export const productsApi = {
    // Get all products with optional filtering
    getProducts: async (params = {}) => {
        const response = await api.get("/products", { params });
        return response.data;
    },

    // Get single product by ID
    getProduct: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Get product categories
    getCategories: async () => {
        const response = await api.get("/products/categories");
        return response.data;
    },
};

// Cart API
export const cartApi = {
    // Add item to cart
    addItem: async (productId, quantity) => {
        console.log(productId);
        console.log(quantity);
        const sessionId = getSessionId();
        const response = await api.post("/cart", { productId, quantity }, {
            headers: { "x-session-id": sessionId },
        });
        return response.data;
    },

    // Get cart contents
    getCart: async () => {
        const sessionId = getSessionId();
        const response = await api.get("/cart", {
            headers: { "x-session-id": sessionId },
        });
        return response.data;
    },

    // Update item quantity
    updateItemQuantity: async (productId, quantity) => {
        const sessionId = getSessionId();
        const response = await api.put(`/cart/${productId}`, { quantity }, {
            headers: { "x-session-id": sessionId },
        });
        return response.data;
    },

    // Remove item from cart
    removeItem: async (productId) => {
        const sessionId = getSessionId();
        const response = await api.delete(`/cart/${productId}`, {
            headers: { "x-session-id": sessionId },
        });
        return response.data;
    },

    // Clear entire cart
    clearCart: async () => {
        const sessionId = getSessionId();
        const response = await api.delete("/cart", {
            headers: { "x-session-id": sessionId },
        });
        return response.data;
    },
};

// Orders API
export const ordersApi = {
    // Create order (checkout)
    createOrder: async (cartItems, customerInfo) => {
        const response = await api.post("/orders", {
            cartItems,
            customerInfo,
        });
        return response.data;
    },

    // Get order by ID
    getOrder: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Get orders by customer email
    getOrdersByCustomer: async (email) => {
        const response = await api.get(`/orders/customer/${email}`);
        return response.data;
    },

    // Update order status
    updateOrderStatus: async (id, status) => {
        const response = await api.put(`/orders/${id}/status`, { status });
        return response.data;
    },
};

export default api;
