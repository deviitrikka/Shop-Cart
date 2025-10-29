# MERN Stack Shopping Cart Application

A full-stack e-commerce shopping cart application built with the MERN stack
(MongoDB, Express, React, Node.js). This application provides a complete
shopping experience with product browsing, cart management, and order
processing.

## 🚀 Features

### Frontend Features

- **Product Catalog**: Browse products with search and category filtering
- **Shopping Cart**: Add, remove, and update items with real-time quantity
  controls
- **Checkout Process**: Secure checkout form with customer information
- **Order Confirmation**: Receipt modal with order details and tracking
- **Responsive Design**: Mobile-first design that works on all devices
- **Session Management**: Persistent cart using localStorage

### Backend Features

- **RESTful API**: Complete REST API with product, cart, and order management
- **MongoDB Integration**: Database models for products, carts, and orders
- **Session-based Cart**: Secure cart management with session IDs
- **Order Processing**: Mock checkout with receipt generation
- **Comprehensive Testing**: Jest test suite with high coverage
- **Error Handling**: Robust validation and error management

## 📋 Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **Jest** - Testing framework
- **Express Validator** - Input validation

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Context API** - State management

### Screenshots
<img width="1919" height="965" alt="image" src="https://github.com/user-attachments/assets/53772d52-79fc-4b5a-8d9e-60096ab0e175" />
<img width="1887" height="964" alt="image" src="https://github.com/user-attachments/assets/d1fcb257-5094-43c1-b409-7eeaaeb40090" />
<img width="1286" height="717" alt="image" src="https://github.com/user-attachments/assets/a7644078-7955-4afe-bdc0-c8e0de10419c" />

## 📁 Project Structure

```
MERN/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── cartController.js    # Cart business logic
│   │   ├── orderController.js   # Order business logic
│   │   └── productController.js # Product business logic
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── validation.js       # Input validation middleware
│   ├── models/
│   │   ├── Cart.js              # Cart model
│   │   ├── Order.js              # Order model
│   │   └── Product.js            # Product model
│   ├── routes/
│   │   ├── cartRoutes.js        # Cart API routes
│   │   ├── orderRoutes.js       # Order API routes
│   │   └── productRoutes.js     # Product API routes
│   ├── tests/                    # Test files
│   ├── server.js                # Server entry point
│   ├── package.json
│   └── config.env                # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Layout.jsx        # Main layout component
    │   │   └── ReceiptModal.jsx # Order receipt modal
    │   ├── contexts/
    │   │   └── CartContext.jsx  # Cart state management
    │   ├── pages/
    │   │   ├── ProductsPage.jsx # Products listing page
    │   │   ├── CartPage.jsx      # Shopping cart page
    │   │   └── CheckoutPage.jsx  # Checkout page
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # App entry point
    │   └── index.css             # Global styles
    ├── package.json
    └── vite.config.js            # Vite configuration
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `config.env` file in the backend directory:
   ```env
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/shopping-cart
   ```

4. **Start MongoDB**
   ```bash
   # Windows
   mongod

   # macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the backend server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

   The backend server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🎯 Usage Guide

### Starting the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend Server** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open Browser**
   - Navigate to `http://localhost:5173`
   - The application is now running!

### Using the Application

1. **Browse Products**
   - View products in the grid layout
   - Use search to find specific products
   - Filter by category
   - Click "Add to Cart" to add items

2. **Manage Cart**
   - View cart items and quantities
   - Update quantities using +/- buttons
   - Remove items from cart
   - View order summary with tax calculation

3. **Checkout**
   - Enter customer information (name and email)
   - Review order summary
   - Submit order to complete purchase
   - View receipt modal with order details

## 🔌 API Endpoints

### Products

- `GET /api/products` - Get all products (with pagination, search, filtering)
- `GET /api/products/:id` - Get single product by ID
- `GET /api/products/categories` - Get all product categories

### Cart

- `POST /api/cart` - Add item to cart (requires `x-session-id` header)
- `GET /api/cart` - Get cart contents (requires `x-session-id` header)
- `PUT /api/cart/:id` - Update item quantity (requires `x-session-id` header)
- `DELETE /api/cart/:id` - Remove item from cart (requires `x-session-id`
  header)
- `DELETE /api/cart` - Clear entire cart (requires `x-session-id` header)

### Orders

- `POST /api/orders` - Create new order (checkout)
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/customer/:email` - Get orders by customer email
- `PUT /api/orders/:id/status` - Update order status

### Health Check

- `GET /api/health` - API health status

> **Note**: Detailed API documentation is available in
> `backend/API_DOCUMENTATION.md`

## 🧪 Testing

### Backend Tests

Run the comprehensive test suite:

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm test -- --coverage
```

### Frontend Tests

Currently, the frontend doesn't have test setup. You can add testing frameworks
like:

- Jest + React Testing Library

## 📱 Responsive Design

The frontend is fully responsive with Tailwind CSS.

## 🔒 Session Management

Cart sessions are managed using:

- **Session ID Generation**: Automatically generated and stored in localStorage
- **Session Header**: `x-session-id` header for cart API calls
- **Session Format**: `session_timestamp_randomstring`
- **Persistence**: Cart persists across page refreshes

## 🗄️ Database Models

### Product

- `name`: Product name (required)
- `price`: Product price (required)
- `description`: Product description
- `image`: Product image URL
- `category`: Product category (required)
- `rating`: Rating object with rate and count
- `stock`: Available stock quantity

### Cart

- `sessionId`: Unique session identifier (required, unique)
- `items`: Array of cart items with productId, quantity, and price
- `totalAmount`: Total cart value (calculated)
- `totalItems`: Total number of items (calculated)

### Order

- `orderId`: Unique order identifier (auto-generated)
- `items`: Array of ordered items
- `totalAmount`: Order total
- `totalItems`: Total number of items
- `customerInfo`: Customer name and email
- `status`: Order status (pending, confirmed, shipped, delivered, cancelled)

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**
   - Ensure MongoDB is running
   - Check if port 5000 is available
   - Verify `config.env` file exists with correct database URL

2. **Frontend can't connect to backend**
   - Ensure backend is running on `http://localhost:5000`
   - Check CORS settings in backend
   - Verify API base URL in `frontend/src/services/api.js`

3. **MongoDB connection error**
   - Ensure MongoDB service is running
   - Check database URL in `config.env`
   - Verify MongoDB port (default: 27017)

4. **Tailwind CSS not working**
   - Ensure Tailwind CSS v4 is properly installed
   - Check `vite.config.js` includes Tailwind plugin
   - Verify `index.css` imports Tailwind correctly

## 📝 Development

### Adding New Features

#### Backend

1. Create model in `backend/models/`
2. Add controller logic in `backend/controllers/`
3. Define routes in `backend/routes/`
4. Add validation in `backend/middleware/validation.js`
5. Write tests in `backend/tests/`

#### Frontend

1. Create component in `frontend/src/components/`
2. Add page in `frontend/src/pages/`
3. Update routes in `frontend/src/App.jsx`
4. Add API methods in `frontend/src/services/api.js`

## 🔧 Environment Variables

### Backend (`config.env`)

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/shopping-cart
```

### Frontend

No environment variables required. API base URL is configured in
`src/services/api.js`.

## 📦 Build for Production

### Backend

```bash
cd backend
npm install --production
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview  # Preview production build
```

The production build will be in `frontend/dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details


**Happy Coding! 🚀**
