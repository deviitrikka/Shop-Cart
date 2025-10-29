const express = require("express");
const router = express.Router();
const {
    processCheckout,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
} = require("../controllers/orderController");
const { validateCheckout } = require("../middleware/validation");
const { validateRequest } = require("../middleware/errorHandler");

// POST /api/checkout - Process checkout and create order
router.post("/", validateCheckout, validateRequest, processCheckout);

// GET /api/orders/:id - Get order by ID
router.get("/:id", getOrderById);

// GET /api/orders/customer/:email - Get orders by customer email
router.get("/customer/:email", getOrdersByCustomer);

// PUT /api/orders/:id/status - Update order status
router.put("/:id/status", updateOrderStatus);

module.exports = router;
