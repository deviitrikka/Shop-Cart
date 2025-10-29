import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../contexts/CartContext";

const CartPage = () => {
    const {
        cart,
        totalItems,
        totalAmount,
        loading,
        error,
        updateQuantity,
        removeFromCart,
        clearCart,
    } = useCart();
    const [updatingItems, setUpdatingItems] = useState(new Set());

    const handleQuantityChange = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems((prev) => new Set(prev).add(productId));

        try {
            await updateQuantity(productId, newQuantity);
        } finally {
            setUpdatingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (productId) => {
        setUpdatingItems((prev) => new Set(prev).add(productId));

        try {
            await removeFromCart(productId);
        } finally {
            setUpdatingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleClearCart = async () => {
        if (window.confirm("Are you sure you want to clear your cart?")) {
            await clearCart();
        }
    };

    if (loading && !cart) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600">
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 text-lg">{error}</div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-12">
                <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your cart is empty
                </h2>
                <p className="text-gray-600 mb-6">
                    Add some products to get started!
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Continue Shopping</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Shopping Cart
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
                        in your cart
                    </p>
                </div>

                <button
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                    Clear Cart
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="space-y-4">
                        {cart.items.map((item) => (
                            <div
                                key={item.productId.id}
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <div className="flex items-start space-x-4">
                                    {/* Product Image */}
                                    <div className="shrink-0">
                                        <img
                                            src={item.productId.image}
                                            alt={item.productId.name}
                                            className="w-20 h-20 object-cover rounded-md"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                            {item.productId.name}
                                        </h3>                                        
                                        <p className="text-lg font-bold text-blue-600">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex flex-col items-end space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.productId._id,
                                                        item.quantity - 1,
                                                    )}
                                                disabled={updatingItems.has(
                                                    item.productId._id,
                                                ) || item.quantity <= 1}
                                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>

                                            <span className="px-3 py-1 border border-gray-300 rounded-md min-w-12 text-center">
                                                {updatingItems.has(
                                                        item.productId._id,
                                                    )
                                                    ? "..."
                                                    : item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.productId._id,
                                                        item.quantity + 1,
                                                    )}
                                                disabled={updatingItems.has(
                                                    item.productId._id,
                                                ) ||
                                                    item.quantity >=
                                                        item.productId.stock}
                                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() =>
                                                handleRemoveItem(
                                                    item.productId._id,
                                                )}
                                            disabled={updatingItems.has(
                                                item.productId._id,
                                            )}
                                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span>Remove</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Item Total */}
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            {item.quantity}{" "}
                                            × ${item.price.toFixed(2)}
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                            ${(item.price * item.quantity)
                                                .toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Order Summary
                        </h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">
                                    ${totalAmount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax (8%)</span>
                                <span className="font-medium">
                                    ${(totalAmount * 0.08).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-green-600">
                                    Free
                                </span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span>
                                        ${(totalAmount * 1.08).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                to="/checkout"
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors text-center block"
                            >
                                Proceed to Checkout
                            </Link>

                            <Link
                                to="/"
                                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors text-center block"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
