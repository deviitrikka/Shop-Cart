const request = require("supertest");
const app = require("../server");
const Product = require("../models/Product");
const Order = require("../models/Order");

describe("Order API Tests", () => {
    let testProducts;

    beforeEach(async () => {
        // Clear database before each test
        await Product.deleteMany({});
        await Order.deleteMany({});

        // Create test products
        testProducts = await Product.insertMany([
            {
                name: "Test Product 1",
                price: 10.99,
                category: "electronics",
                stock: 10,
            },
            {
                name: "Test Product 2",
                price: 20.99,
                category: "clothing",
                stock: 5,
            },
        ]);
    });

    describe("POST /api/orders", () => {
        it("should process checkout successfully", async () => {
            const checkoutData = {
                cartItems: [
                    {
                        productId: testProducts[0]._id,
                        quantity: 2,
                    },
                    {
                        productId: testProducts[1]._id,
                        quantity: 1,
                    },
                ],
                customerInfo: {
                    email: "test@example.com",
                    name: "Test Customer",
                },
            };

            const res = await request(app)
                .post("/api/orders")
                .send(checkoutData)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Order placed successfully");
            expect(res.body.data.order.totalAmount).toBe(42.97); // (10.99 * 2) + (20.99 * 1)
            expect(res.body.data.order.totalItems).toBe(3);
            expect(res.body.data.receipt.orderId).toBeDefined();
            expect(res.body.data.receipt.tax).toBeDefined();
            expect(res.body.data.receipt.total).toBeDefined();
        });

        it("should return error for empty cart", async () => {
            const checkoutData = {
                cartItems: [],
                customerInfo: {
                    email: "test@example.com",
                    name: "Test Customer",
                },
            };

            const res = await request(app)
                .post("/api/orders")
                .send(checkoutData)
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Cart is empty");
        });

        it("should return error for non-existent product", async () => {
            const fakeId = "507f1f77bcf86cd799439011";

            const checkoutData = {
                cartItems: [
                    {
                        productId: fakeId,
                        quantity: 1,
                    },
                ],
                customerInfo: {
                    email: "test@example.com",
                    name: "Test Customer",
                },
            };

            const res = await request(app)
                .post("/api/orders")
                .send(checkoutData)
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("One or more products not found");
        });

        it("should return error for insufficient stock", async () => {
            const checkoutData = {
                cartItems: [
                    {
                        productId: testProducts[0]._id,
                        quantity: 15, // More than available stock (10)
                    },
                ],
                customerInfo: {
                    email: "test@example.com",
                    name: "Test Customer",
                },
            };

            const res = await request(app)
                .post("/api/orders")
                .send(checkoutData)
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("Insufficient stock");
        });

        it("should validate customer information", async () => {
            const checkoutData = {
                cartItems: [
                    {
                        productId: testProducts[0]._id,
                        quantity: 1,
                    },
                ],
                customerInfo: {
                    email: "invalid-email",
                    name: "",
                },
            };

            const res = await request(app)
                .post("/api/orders")
                .send(checkoutData)
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Validation Error");
        });

        it("should update product stock after successful order", async () => {
            const initialStock = testProducts[0].stock;

            const checkoutData = {
                cartItems: [
                    {
                        productId: testProducts[0]._id,
                        quantity: 3,
                    },
                ],
                customerInfo: {
                    email: "test@example.com",
                    name: "Test Customer",
                },
            };

            await request(app)
                .post("/api/orders")
                .send(checkoutData)
                .expect(200);

            // Check if stock was updated
            const updatedProduct = await Product.findById(testProducts[0]._id);
            expect(updatedProduct.stock).toBe(initialStock - 3);
        });
    });

    describe("GET /api/orders/:id", () => {
        let testOrder;

        beforeEach(async () => {
            // Create test order
            testOrder = new Order({
                items: [
                    {
                        productId: testProducts[0]._id,
                        name: testProducts[0].name,
                        quantity: 2,
                        price: testProducts[0].price,
                    },
                ],
                totalAmount: 21.98,
                totalItems: 2,
                customerInfo: {
                    email: "test@example.com",
                    name: "Test Customer",
                },
            });
            await testOrder.save();
        });

        it("should return order by ID", async () => {
            const res = await request(app)
                .get(`/api/orders/${testOrder._id}`)
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data.totalAmount).toBe(21.98);
            expect(res.body.data.totalItems).toBe(2);
            expect(res.body.data.customerInfo.email).toBe("test@example.com");
        });

        it("should return 404 for non-existent order", async () => {
            const fakeId = "507f1f77bcf86cd799439011";

            const res = await request(app)
                .get(`/api/orders/${fakeId}`)
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Order not found");
        });
    });

    describe("GET /api/orders/customer/:email", () => {
        beforeEach(async () => {
            // Create test orders
            await Order.insertMany([
                {
                    items: [
                        {
                            productId: testProducts[0]._id,
                            name: testProducts[0].name,
                            quantity: 1,
                            price: testProducts[0].price,
                        },
                    ],
                    totalAmount: 10.99,
                    totalItems: 1,
                    customerInfo: {
                        email: "test@example.com",
                        name: "Test Customer",
                    },
                },
                {
                    items: [
                        {
                            productId: testProducts[1]._id,
                            name: testProducts[1].name,
                            quantity: 2,
                            price: testProducts[1].price,
                        },
                    ],
                    totalAmount: 41.98,
                    totalItems: 2,
                    customerInfo: {
                        email: "test@example.com",
                        name: "Test Customer",
                    },
                },
            ]);
        });

        it("should return orders by customer email", async () => {
            const res = await request(app)
                .get("/api/orders/customer/test@example.com")
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(2);
            expect(res.body.pagination.totalOrders).toBe(2);
        });

        it("should return empty array for non-existent customer", async () => {
            const res = await request(app)
                .get("/api/orders/customer/nonexistent@example.com")
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(0);
            expect(res.body.pagination.totalOrders).toBe(0);
        });
    });

    describe("PUT /api/orders/:id/status", () => {
        let testOrder;

        beforeEach(async () => {
            // Create test order
            testOrder = new Order({
                items: [
                    {
                        productId: testProducts[0]._id,
                        name: testProducts[0].name,
                        quantity: 1,
                        price: testProducts[0].price,
                    },
                ],
                totalAmount: 10.99,
                totalItems: 1,
                customerInfo: {
                    email: "test@example.com",
                    name: "Test Customer",
                },
            });
            await testOrder.save();
        });

        it("should update order status", async () => {
            const res = await request(app)
                .put(`/api/orders/${testOrder._id}/status`)
                .send({ status: "confirmed" })
                .expect(200);

            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Order status updated successfully");
            expect(res.body.data.status).toBe("confirmed");
        });

        it("should return error for invalid status", async () => {
            const res = await request(app)
                .put(`/api/orders/${testOrder._id}/status`)
                .send({ status: "invalid_status" })
                .expect(400);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toContain("Invalid status");
        });

        it("should return 404 for non-existent order", async () => {
            const fakeId = "507f1f77bcf86cd799439011";

            const res = await request(app)
                .put(`/api/orders/${fakeId}/status`)
                .send({ status: "confirmed" })
                .expect(404);

            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Order not found");
        });
    });
});
