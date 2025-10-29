const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: [true, "Product ID is required"],
        unique: true,
    },
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0, "Price cannot be negative"],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1500, "Description cannot exceed 1500 characters"],
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/300x300",
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true,
    },
    rating: {
        rate: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    stock: {
        type: Number,
        default: 0,
        min: 0,
    },
}, {
    timestamps: true,
});

// Index for better search performance
productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
