const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Process checkout and create order
const processCheckout = async (req, res) => {
    try {
        const { cartItems, customerInfo } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty",
            });
        }

        // Validate all products exist and check stock
        const productIds = cartItems.map((item) => item.productId);
        const products = await Product.findByIds(productIds);

        if (products.length !== cartItems.length) {
            return res.status(400).json({
                success: false,
                message: "One or more products not found",
            });
        }

        // Check stock availability and calculate totals
        let totalAmount = 0;
        let totalItems = 0;
        const orderItems = [];

        for (const cartItem of cartItems) {
            const product = products.find((p) =>
                p._id.toString() === cartItem.productId
            );

            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${cartItem.productId} not found`,
                });
            }

            if (product.stock < cartItem.quantity) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`,
                });
            }

            const itemTotal = product.price * cartItem.quantity;
            totalAmount += itemTotal;
            totalItems += cartItem.quantity;

            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: cartItem.quantity,
                price: product.price,
            });
        }

        // Create order
        const order = new Order({
            items: orderItems,
            totalAmount,
            totalItems,
            customerInfo,
        });

        await order.save();

        // Update product stock
        for (const cartItem of cartItems) {
            await Product.findByIdAndUpdate(
                cartItem.productId,
                { $inc: { stock: -cartItem.quantity } },
            );
        }

        // Generate mock receipt
        const receipt = {
            orderId: order.orderId,
            timestamp: order.createdAt,
            customerInfo: order.customerInfo,
            items: order.items,
            subtotal: totalAmount,
            tax: Math.round(totalAmount * 0.08 * 100) / 100, // 8% tax
            total: Math.round((totalAmount * 1.08) * 100) / 100,
            totalItems: totalItems,
            status: order.status,
            paymentMethod: "Mock Payment (No Real Payment Processed)",
            shippingAddress: "Mock Address (No Real Shipping)",
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        };

        res.json({
            success: true,
            message: "Order placed successfully",
            data: {
                order: order,
                receipt: receipt,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error processing checkout",
            error: error.message,
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "items.productId",
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching order",
            error: error.message,
        });
    }
};

// Get orders by customer email
const getOrdersByCustomer = async (req, res) => {
    try {
        const { email } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const orders = await Order.find({ "customerInfo.email": email })
            .populate("items.productId")
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Order.countDocuments({
            "customerInfo.email": email,
        });

        res.json({
            success: true,
            data: orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalOrders: total,
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "pending",
            "confirmed",
            "shipped",
            "delivered",
            "cancelled",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be one of: " +
                    validStatuses.join(", "),
            });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true },
        ).populate("items.productId");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message,
        });
    }
};

module.exports = {
    processCheckout,
    getOrderById,
    getOrdersByCustomer,
    updateOrderStatus,
};
