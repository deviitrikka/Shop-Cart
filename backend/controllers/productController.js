const axios = require("axios");
const Product = require("../models/Product");

// Fetch products from FakeStore API and populate database
const fetchAndPopulateProducts = async () => {
    try {
        const response = await axios.get("https://fakestoreapi.com/products");
        const products = response.data;
        // console.log(products);

        // Clear existing products and drop all indexes to avoid conflicts
        await Product.deleteMany({});

        // Transform and save products
        const transformedProducts = products.map((product) => ({
            id: product.id,
            name: product.title,
            price: product.price,
            description: product.description,
            image: product.image,
            category: product.category,
            rating: {
                rate: product.rating.rate,
                count: product.rating.count,
            },
            stock: Math.floor(Math.random() * 100) + 1, // Random stock between 1-100
            // Note: We exclude the 'id' field from FakeStore API to let MongoDB generate ObjectIds
        }));

        await Product.insertMany(transformedProducts);
        console.log("Products populated successfully");
    } catch (error) {
        console.error("Error populating products:", error.message);
    }
};

// Get all products
const getProducts = async (req, res) => {
    try {
        const { category, search, limit = 12, page = 1 } = req.query;

        let query = {};

        // Filter by category
        if (category) {
            query.category = { $regex: category, $options: "i" };
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .limit(parseInt(limit))
            .skip(skip)
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(query);

        res.json({
            success: true,
            data: products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalProducts: total,
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching products",
            error: error.message,
        });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message,
        });
    }
};

// Get product categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct("category");

        res.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message,
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getCategories,
    fetchAndPopulateProducts,
};
