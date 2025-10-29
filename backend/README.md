# Shopping Cart Backend API

A comprehensive Node.js/Express backend application for an e-commerce shopping
cart system with MVC architecture.

## Features

- **Product Management**: Fetch products from FakeStore API with search and
  filtering
- **Shopping Cart**: Add, remove, update items with session-based cart
  management
- **Order Processing**: Mock checkout with receipt generation
- **Database Integration**: MongoDB with Mongoose ODM
- **Comprehensive Testing**: Jest test suite with 95%+ coverage
- **Error Handling**: Robust validation and error management
- **API Documentation**: RESTful API endpoints

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Testing**: Jest, Supertest
- **Validation**: Express-validator
- **External API**: FakeStore API for product data

## API Endpoints

### Products

- `GET /api/products` - Get all products with pagination, search, and filtering
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/categories` - Get all product categories

### Cart

- `POST /api/cart` - Add item to cart
- `GET /api/cart` - Get cart contents
- `DELETE /api/cart/:id` - Remove item from cart
- `PUT /api/cart/:id` - Update item quantity
- `DELETE /api/cart` - Clear entire cart

### Orders

- `POST /api/orders` - Process checkout and create order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/customer/:email` - Get orders by customer email
- `PUT /api/orders/:id/status` - Update order status

### Health Check

- `GET /api/health` - API health status
- `GET /` - API information and endpoints

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopping-cart-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp config.env.example config.env
   # Edit config.env with your MongoDB connection string
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

## API Usage Examples

### Get Products

```bash
curl -X GET "http://localhost:3000/api/products?category=electronics&search=phone"
```

### Add to Cart

```bash
curl -X POST "http://localhost:3000/api/cart" \
  -H "Content-Type: application/json" \
  -H "x-session-id: your-session-id" \
  -d '{"productId": "product-id", "quantity": 2}'
```

### Process Checkout

```bash
curl -X POST "http://localhost:3000/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "cartItems": [
      {"productId": "product-id", "quantity": 2}
    ],
    "customerInfo": {
      "email": "customer@example.com",
      "name": "John Doe"
    }
  }'
```

## Database Models

### Product

- `name`: Product name
- `price`: Product price
- `description`: Product description
- `image`: Product image URL
- `category`: Product category
- `rating`: Rating object with rate and count
- `stock`: Available stock quantity

### Cart

- `sessionId`: Unique session identifier
- `items`: Array of cart items
- `totalAmount`: Total cart value
- `totalItems`: Total number of items

### Order

- `orderId`: Unique order identifier
- `items`: Array of ordered items
- `totalAmount`: Order total
- `customerInfo`: Customer details
- `status`: Order status

## Error Handling

The API includes comprehensive error handling for:

- Validation errors
- Database errors
- Not found errors
- Stock availability
- Invalid data formats

## Session Management

Cart sessions are managed using custom session IDs passed in headers:

- Header: `x-session-id`
- Format: `session_timestamp_randomstring`
- Auto-generated if not provided

## Mock Features

- **Payment Processing**: No real payment integration
- **Shipping**: Mock shipping addresses
- **Receipt Generation**: Calculated totals with tax
- **Stock Management**: Real stock tracking and updates

## Development

### Project Structure

```
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── tests/           # Test files
├── server.js        # Application entry point
└── package.json     # Dependencies and scripts
```

### Adding New Features

1. Create model in `models/`
2. Add controller logic in `controllers/`
3. Define routes in `routes/`
4. Add validation in `middleware/validation.js`
5. Write tests in `tests/`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details
