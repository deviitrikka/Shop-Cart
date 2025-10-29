import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, ShoppingCart, Store } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const Layout = ({ children }) => {
    const location = useLocation();
    const { totalItems } = useCart();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-lg shadow-blue-500/50 w-10/12 sticky top-4 z-50 rounded-lg mx-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <Store className="h-8 w-8 text-red-600" />
                            <span className="text-xl font-bold text-gray-900">
                                ShopCart
                            </span>
                        </Link>

                        {/* Navigation */}
                        <nav className="flex space-x-8">
                            <Link
                                to="/"
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    isActive("/")
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                <Package className="h-4 w-4" />
                                <span>Products</span>
                            </Link>

                            <Link
                                to="/cart"
                                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                                    isActive("/cart")
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span>Cart</span>
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-gray-600">
                        <p>
                            &copy; 2025 ShopCart. Built with React & Tailwind
                            CSS.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
