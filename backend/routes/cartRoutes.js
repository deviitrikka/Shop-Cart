const express = require("express");
const router = express.Router();
const {
    addToCart,
    removeFromCart,
    getCart,
    updateCartItem,
    clearCart,
} = require("../controllers/cartController");
const { validateCartItem, validateCartId } = require(
    "../middleware/validation",
);
const { validateRequest } = require("../middleware/errorHandler");

// POST /api/cart - Add item to cart
router.post("/", validateCartItem, validateRequest, addToCart);

// GET /api/cart - Get cart contents
router.get("/", getCart);

// DELETE /api/cart/:id - Remove item from cart
router.delete("/:id", validateCartId, validateRequest, removeFromCart);

// PUT /api/cart/:id - Update item quantity in cart
router.put("/:id", validateCartId, validateRequest, updateCartItem);

// DELETE /api/cart - Clear entire cart
router.delete("/", clearCart);

module.exports = router;
