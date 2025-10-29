const { body, param } = require("express-validator");

// Product validation rules
const validateProduct = [
    body("name")
        .notEmpty()
        .withMessage("Product name is required")
        .isLength({ max: 100 })
        .withMessage("Product name cannot exceed 100 characters"),
    body("price")
        .isNumeric()
        .withMessage("Price must be a number")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
    body("description")
        .optional()
        .isLength({ max: 1500 })
        .withMessage("Description cannot exceed 500 characters"),
    body("category")
        .notEmpty()
        .withMessage("Category is required")
        .isLength({ max: 50 })
        .withMessage("Category cannot exceed 50 characters"),
    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer"),
];

// Cart item validation rules
const validateCartItem = [
    body("productId")
        .isMongoId()
        .withMessage("Invalid product ID"),
    body("quantity")
        .isInt({ min: 1, max: 100 })
        .withMessage("Quantity must be between 1 and 100"),
];

// Cart ID validation
const validateCartId = [
    param("id")
        .isMongoId()
        .withMessage("Invalid cart item ID"),
];

// Checkout validation rules
const validateCheckout = [
    body("cartItems")
        .isArray()
        .withMessage("Cart items must be an array"),
    body("cartItems.*.productId")
        .optional()
        .isMongoId()
        .withMessage("Invalid product ID in cart items"),
    body("cartItems.*.quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Invalid quantity in cart items"),
    body("customerInfo.email")
        .isEmail()
        .withMessage("Valid email is required"),
    body("customerInfo.name")
        .notEmpty()
        .withMessage("Customer name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Customer name must be between 2 and 50 characters"),
];

module.exports = {
    validateProduct,
    validateCartItem,
    validateCartId,
    validateCheckout,
};
