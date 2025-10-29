const request = require("supertest");
const app = require("../server");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

describe("Cart API Tests", () => {
    let testProduct;
    let sessionId;

    beforeEach(async () => {
        // Clear database before each test
        await Product.deleteMany({});
        await Cart.deleteMany({});

        // Create test product
        testProduct = new Product({
            name: "Test Product",
            price: 10.99,
            category: "electronics",
            stock: 10,
        });
        await testProduct.save();

        // Generate session ID
        sessionId = "test_session_" + Date.now();
    });

    describe("POST /api/cart", () => {
        it("should add item to cart successfully", async () => {
            const res = await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 2,
                })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Item added to cart successfully");
            expect(res.body.data.totalItems).toBe(2);
            expect(res.body.data.totalAmount).toBe(21.98);
        });

        it("should update quantity when adding existing item", async () => {
            // First add item
            await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 2,
                });

            // Add same item again
            const res = await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 3,
                })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.totalItems).toBe(5);
            expect(res.body.data.totalAmount).toBe(54.95);
        });

        it("should return error for non-existent product", async () => {
            const fakeId = "507f1f77bcf86cd799439011";

            const res = await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: fakeId,
                    quantity: 1,
                })
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Product not found");
        });

        it("should return error for insufficient stock", async () => {
            const res = await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 15,
                })
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("Only 10 items available");
        });

        it("should validate required fields", async () => {
            const res = await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({})
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation Error");
        });
    });

    describe("GET /api/cart", () => {
        it("should return empty cart for new session", async () => {
            const res = await request(app)
                .get("/api/cart")
                .set("x-session-id", sessionId)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.items).toEqual([]);
            expect(res.body.data.totalItems).toBe(0);
            expect(res.body.data.totalAmount).toBe(0);
        });

        it("should return cart with items", async () => {
            // Add item to cart first
            await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 2,
                });

            const res = await request(app)
                .get("/api/cart")
                .set("x-session-id", sessionId)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.items).toHaveLength(1);
            expect(res.body.data.totalItems).toBe(2);
            expect(res.body.data.totalAmount).toBe(21.98);
        });

        it("should return error without session ID", async () => {
            const res = await request(app)
                .get("/api/cart")
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Session ID required");
        });
    });

    describe("DELETE /api/cart/:id", () => {
        beforeEach(async () => {
            // Add item to cart first
            await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 2,
                });
        });

        it("should remove item from cart", async () => {
            const res = await request(app)
                .delete(`/api/cart/${testProduct._id}`)
                .set("x-session-id", sessionId)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe(
                "Item removed from cart successfully",
            );
            expect(res.body.data.totalItems).toBe(0);
            expect(res.body.data.totalAmount).toBe(0);
        });

        it("should return error for non-existent cart", async () => {
            const newSessionId = "new_session_" + Date.now();

            const res = await request(app)
                .delete(`/api/cart/${testProduct._id}`)
                .set("x-session-id", newSessionId)
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Cart not found");
        });
    });

    describe("PUT /api/cart/:id", () => {
        beforeEach(async () => {
            // Add item to cart first
            await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 2,
                });
        });

        it("should update item quantity", async () => {
            const res = await request(app)
                .put(`/api/cart/${testProduct._id}`)
                .set("x-session-id", sessionId)
                .send({ quantity: 5 })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Cart item updated successfully");
            expect(res.body.data.totalItems).toBe(5);
            expect(res.body.data.totalAmount).toBe(54.95);
        });

        it("should return error for insufficient stock", async () => {
            const res = await request(app)
                .put(`/api/cart/${testProduct._id}`)
                .set("x-session-id", sessionId)
                .send({ quantity: 15 })
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("Only 10 items available");
        });
    });

    describe("DELETE /api/cart", () => {
        beforeEach(async () => {
            // Add item to cart first
            await request(app)
                .post("/api/cart")
                .set("x-session-id", sessionId)
                .send({
                    productId: testProduct._id,
                    quantity: 2,
                });
        });

        it("should clear entire cart", async () => {
            const res = await request(app)
                .delete("/api/cart")
                .set("x-session-id", sessionId)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Cart cleared successfully");
            expect(res.body.data.totalItems).toBe(0);
            expect(res.body.data.totalAmount).toBe(0);
        });
    });
});
