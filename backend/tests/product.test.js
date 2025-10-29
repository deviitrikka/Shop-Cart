const request = require("supertest");
const app = require("../server");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

describe("Product API Tests", () => {
    beforeEach(async () => {
        // Clear database before each test
        await Product.deleteMany({});
        await Cart.deleteMany({});
        await Order.deleteMany({});
    });

    describe("GET /api/products", () => {
        it("should return empty array when no products exist", async () => {
            const res = await request(app)
                .get("/api/products")
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toEqual([]);
            expect(res.body.pagination.totalProducts).toBe(0);
        });

        it("should return products with pagination", async () => {
            // Create test products
            const products = [
                {
                    name: "Test Product 1",
                    price: 10.99,
                    category: "electronics",
                    stock: 5,
                },
                {
                    name: "Test Product 2",
                    price: 20.99,
                    category: "clothing",
                    stock: 10,
                },
                {
                    name: "Test Product 3",
                    price: 30.99,
                    category: "electronics",
                    stock: 3,
                },
            ];

            await Product.insertMany(products);

            const res = await request(app)
                .get("/api/products")
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(3);
            expect(res.body.pagination.totalProducts).toBe(3);
            expect(res.body.pagination.currentPage).toBe(1);
        });

        it("should filter products by category", async () => {
            const products = [
                {
                    name: "Electronics Product",
                    price: 10.99,
                    category: "electronics",
                    stock: 5,
                },
                {
                    name: "Clothing Product",
                    price: 20.99,
                    category: "clothing",
                    stock: 10,
                },
            ];

            await Product.insertMany(products);

            const res = await request(app)
                .get("/api/products?category=electronics")
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].category).toBe("electronics");
        });

        it("should search products by name", async () => {
            const products = [
                {
                    name: "iPhone 13",
                    price: 999.99,
                    category: "electronics",
                    stock: 5,
                },
                {
                    name: "Samsung Galaxy",
                    price: 899.99,
                    category: "electronics",
                    stock: 10,
                },
            ];

            await Product.insertMany(products);

            const res = await request(app)
                .get("/api/products?search=iPhone")
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].name).toContain("iPhone");
        });
    });

    describe("GET /api/products/:id", () => {
        it("should return product by ID", async () => {
            const product = new Product({
                name: "Test Product",
                price: 10.99,
                category: "electronics",
                stock: 5,
            });
            await product.save();

            const res = await request(app)
                .get(`/api/products/${product._id}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe("Test Product");
            expect(res.body.data.price).toBe(10.99);
        });

        it("should return 404 for non-existent product", async () => {
            const fakeId = "507f1f77bcf86cd799439011";

            const res = await request(app)
                .get(`/api/products/${fakeId}`)
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Product not found");
        });
    });

    describe("GET /api/products/categories", () => {
        it("should return all unique categories", async () => {
            const products = [
                {
                    name: "Product 1",
                    price: 10.99,
                    category: "electronics",
                    stock: 5,
                },
                {
                    name: "Product 2",
                    price: 20.99,
                    category: "clothing",
                    stock: 10,
                },
                {
                    name: "Product 3",
                    price: 30.99,
                    category: "electronics",
                    stock: 3,
                },
            ];

            await Product.insertMany(products);

            const res = await request(app)
                .get("/api/products/categories")
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toContain("electronics");
            expect(res.body.data).toContain("clothing");
            expect(res.body.data).toHaveLength(2);
        });
    });
});
