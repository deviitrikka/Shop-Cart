# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

No authentication required for this demo application.

## Session Management

Cart operations require a session ID in the request header:

```
x-session-id: your-session-id
```

## Response Format

All API responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... },
  "error": "Error details (if any)"
}
```

## Products API

### GET /products

Get all products with optional filtering.

**Query Parameters:**

- `category` (string): Filter by category
- `search` (string): Search in name and description
- `limit` (number): Items per page (default: 20)
- `page` (number): Page number (default: 1)

**Response:**

```json
{
    "success": true,
    "data": [
        {
            "_id": "product-id",
            "name": "Product Name",
            "price": 29.99,
            "description": "Product description",
            "image": "https://...",
            "category": "electronics",
            "rating": {
                "rate": 4.5,
                "count": 120
            },
            "stock": 50
        }
    ],
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalProducts": 100,
        "hasNext": true,
        "hasPrev": false
    }
}
```

### GET /products/:id

Get single product by ID.

### GET /products/categories

Get all available product categories.

## Cart API

### POST /cart

Add item to cart.

**Headers:**

```
x-session-id: session_1234567890_abc123
```

**Body:**

```json
{
    "productId": "product-id",
    "quantity": 2
}
```

**Response:**

```json
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "sessionId": "session_1234567890_abc123",
    "cart": { ... },
    "totalItems": 2,
    "totalAmount": 59.98
  }
}
```

### GET /cart

Get cart contents.

**Headers:**

```
x-session-id: session_1234567890_abc123
```

### DELETE /cart/:id

Remove item from cart by product ID.

### PUT /cart/:id

Update item quantity in cart.

**Body:**

```json
{
    "quantity": 3
}
```

### DELETE /cart

Clear entire cart.

## Orders API

### POST /orders

Process checkout and create order.

**Body:**

```json
{
    "cartItems": [
        {
            "productId": "product-id",
            "quantity": 2
        }
    ],
    "customerInfo": {
        "email": "customer@example.com",
        "name": "John Doe"
    }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "orderId": "ORD-1234567890-ABC123",
      "totalAmount": 59.98,
      "totalItems": 2,
      "status": "pending",
      "customerInfo": { ... },
      "items": [ ... ]
    },
    "receipt": {
      "orderId": "ORD-1234567890-ABC123",
      "timestamp": "2023-10-28T10:30:00.000Z",
      "subtotal": 59.98,
      "tax": 4.80,
      "total": 64.78,
      "paymentMethod": "Mock Payment (No Real Payment Processed)",
      "shippingAddress": "Mock Address (No Real Shipping)",
      "estimatedDelivery": "2023-11-04T10:30:00.000Z"
    }
  }
}
```

### GET /orders/:id

Get order by ID.

### GET /orders/customer/:email

Get orders by customer email.

### PUT /orders/:id/status

Update order status.

**Body:**

```json
{
    "status": "confirmed"
}
```

**Valid Statuses:** `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`

## Error Codes

- `400` - Bad Request (validation errors, insufficient stock)
- `404` - Not Found (product, cart, or order not found)
- `500` - Internal Server Error

## Example Usage with curl

```bash
# Get products
curl -X GET "http://localhost:3000/api/products?category=electronics"

# Add to cart
curl -X POST "http://localhost:3000/api/cart" \
  -H "Content-Type: application/json" \
  -H "x-session-id: session_1234567890_abc123" \
  -d '{"productId": "product-id", "quantity": 2}'

# Get cart
curl -X GET "http://localhost:3000/api/cart" \
  -H "x-session-id: session_1234567890_abc123"

# Checkout
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [{"productId": "product-id", "quantity": 2}],
    "customerInfo": {"email": "test@example.com", "name": "Test User"}
  }'
```
