const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product ID is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
        max: [100, "Quantity cannot exceed 100"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
}, {
    timestamps: true,
});

const cartSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: [true, "Session ID is required"],
        unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalItems: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});

// Calculate totals before saving
cartSchema.pre("save", function (next) {
    this.totalItems = this.items.reduce(
        (total, item) => total + item.quantity,
        0,
    );
    this.totalAmount = this.items.reduce(
        (total, item) => total + (item.price * item.quantity),
        0,
    );
    next();
});

// Instance method to add item to cart
cartSchema.methods.addItem = function (productId, quantity, price) {
    const existingItem = this.items.find((item) =>
        item.productId.toString() === productId.toString()
    );

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        this.items.push({ productId, quantity, price });
    }

    return this.save();
};

// Instance method to remove item from cart
cartSchema.methods.removeItem = function (productId) {
    this.items = this.items.filter((item) =>
        item.productId.toString() !== productId.toString()
    );
    return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function (productId, quantity) {
    const item = this.items.find((item) =>
        item.productId.toString() === productId.toString()
    );
    if (item) {
        item.quantity = quantity;
    }
    return this.save();
};

module.exports = mongoose.model("Cart", cartSchema);
