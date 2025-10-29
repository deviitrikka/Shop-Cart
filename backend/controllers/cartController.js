const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Generate session ID for cart
const generateSessionId = () => {
    return "session_" + Date.now() + "_" +
        Math.random().toString(36).substr(2, 9);
};

// Get or create cart
const getOrCreateCart = async (sessionId) => {
    let cart = await Cart.findOne({ sessionId }).populate("items.productId");

    if (!cart) {
        cart = new Cart({ sessionId });
        await cart.save();
    }

    return cart;
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const sessionId = req.headers["x-session-id"] || generateSessionId();

        // Verify product exists
        const product = await Product.findOne({ _id: productId });
        console.log(product);
        if (!product) {
            console.log(productId);
            console.log("product");
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`,
            });
        }

        const cart = await getOrCreateCart(sessionId);

        // Check if item already exists in cart
        const existingItem = cart.items.find((item) =>
            item.productId.toString() === product._id
        );

        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: `Cannot add ${quantity} more items. Only ${
                        product.stock - existingItem.quantity
                    } available`,
                });
            }
            existingItem.quantity = newQuantity;
        } else {
            // Add new item
            cart.items.push({
                productId: product._id,
                quantity,
                price: product.price,
            });
        }

        await cart.save();
        await cart.populate("items.productId");

        res.json({
            success: true,
            message: "Item added to cart successfully",
            data: {
                sessionId,
                cart: cart,
                totalItems: cart.totalItems,
                totalAmount: cart.totalAmount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding item to cart",
            error: error.message,
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const sessionId = req.headers["x-session-id"];

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID required",
            });
        }

        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        // Remove item by product ID
        cart.items = cart.items.filter((item) =>
            item.productId.toString() !== id
        );

        await cart.save();
        await cart.populate("items.productId");

        res.json({
            success: true,
            message: "Item removed from cart successfully",
            data: {
                cart: cart,
                totalItems: cart.totalItems,
                totalAmount: cart.totalAmount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing item from cart",
            error: error.message,
        });
    }
};

// Get cart
const getCart = async (req, res) => {
    try {
        const sessionId = req.headers["x-session-id"];

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID required",
            });
        }

        const cart = await Cart.findOne({ sessionId }).populate(
            "items.productId",
        );

        if (!cart) {
            return res.json({
                success: true,
                message: "Cart is empty",
                data: {
                    items: [],
                    totalItems: 0,
                    totalAmount: 0,
                },
            });
        }

        res.json({
            success: true,
            data: {
                sessionId: cart.sessionId,
                items: cart.items,
                totalItems: cart.totalItems,
                totalAmount: cart.totalAmount,
                createdAt: cart.createdAt,
                updatedAt: cart.updatedAt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error: error.message,
        });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const sessionId = req.headers["x-session-id"];

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID required",
            });
        }

        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find((item) =>
            item.productId.toString() === id
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        // Verify product stock
        const product = await Product.findById(id);
        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`,
            });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate("items.productId");

        res.json({
            success: true,
            message: "Cart item updated successfully",
            data: {
                cart: cart,
                totalItems: cart.totalItems,
                totalAmount: cart.totalAmount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating cart item",
            error: error.message,
        });
    }
};

// Clear cart
const clearCart = async (req, res) => {
    try {
        const sessionId = req.headers["x-session-id"];

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: "Session ID required",
            });
        }

        const cart = await Cart.findOne({ sessionId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items = [];
        await cart.save();

        res.json({
            success: true,
            message: "Cart cleared successfully",
            data: {
                totalItems: 0,
                totalAmount: 0,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error clearing cart",
            error: error.message,
        });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart,
    updateCartItem,
    clearCart,
};
