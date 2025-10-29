const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    totalItems: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    customerInfo: {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
}, {
    timestamps: true,
});

// Generate unique order ID
orderSchema.pre("save", function (next) {
    if (!this.orderId) {
        this.orderId = "ORD-" + Date.now() + "-" +
            Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

// Ensure orderId is always generated
orderSchema.pre("validate", function (next) {
    if (!this.orderId) {
        this.orderId = "ORD-" + Date.now() + "-" +
            Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    next();
});

module.exports = mongoose.model("Order", orderSchema);
