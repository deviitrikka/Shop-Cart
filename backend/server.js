const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { fetchAndPopulateProducts } = require("./controllers/productController");

// Load environment variables
dotenv.config({ path: "./config.env" });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Shopping Cart API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
    });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Shopping Cart API",
        version: "1.0.0",
        endpoints: {
            products: "/api/products",
            cart: "/api/cart",
            orders: "/api/orders",
            health: "/api/health",
        },
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== "test") {
    // Start server
    app.listen(PORT, async () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`);

        // Populate products from FakeStore API on startup
        try {
            await fetchAndPopulateProducts();
        } catch (error) {
            console.error("Error populating products:", error.message);
        }
    });
}

module.exports = app;
