# Frontend - React E-commerce Application

A modern React frontend for the MERN stack e-commerce application built with
Vite, React Router, and Tailwind CSS v4.

## Features

- **Products Grid**: Browse products with search and category filtering
- **Shopping Cart**: Add/remove items, update quantities, view totals
- **Checkout Process**: Customer information form with order summary
- **Order Confirmation**: Receipt modal with order details
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Session Management**: Persistent cart using localStorage

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library
- **Context API** - State management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend server running on `http://localhost:3000`

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout with navigation
│   └── ReceiptModal.jsx # Order confirmation modal
├── contexts/           # React context providers
│   └── CartContext.jsx # Cart state management
├── pages/              # Page components
│   ├── ProductsPage.jsx # Products listing
│   ├── CartPage.jsx    # Shopping cart
│   └── CheckoutPage.jsx # Checkout form
├── services/           # API services
│   └── api.js         # Backend API integration
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles with Tailwind
```

## API Integration

The frontend integrates with the backend API endpoints:

- **Products**: `/api/products` - Get products, categories, search
- **Cart**: `/api/cart` - Add, update, remove items (requires session ID)
- **Orders**: `/api/orders` - Create orders, get order details

## Features Overview

### Products Page

- Grid layout with product cards
- Search functionality
- Category filtering
- Star ratings display
- Stock status indicators
- Add to cart functionality

### Cart Page

- Item list with images and details
- Quantity controls (+/- buttons)
- Remove item functionality
- Order summary with tax calculation
- Proceed to checkout button

### Checkout Page

- Customer information form (name, email)
- Order summary sidebar
- Form validation
- Order creation and confirmation

### Receipt Modal

- Order confirmation details
- Order ID and status
- Customer information
- Itemized order list
- Payment summary
- Estimated delivery date

## Responsive Design

The application is fully responsive with breakpoints:

- Mobile: Default styles
- Tablet: `sm:` (640px+)
- Desktop: `lg:` (1024px+)
- Large: `xl:` (1280px+)

## Session Management

Cart persistence is handled through:

- Session ID generation and localStorage storage
- Automatic session ID inclusion in cart API calls
- Cart state management via React Context

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

No environment variables required for basic functionality. The API base URL is
hardcoded to `http://localhost:3000/api`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
