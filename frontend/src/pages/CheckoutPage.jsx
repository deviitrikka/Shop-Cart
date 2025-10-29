import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Mail, User } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { ordersApi } from "../services/api";
import ReceiptModal from "../components/ReceiptModal";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, totalAmount, clearCart } = useCart();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [showReceipt, setShowReceipt] = useState(false);

    // Redirect if cart is empty
    React.useEffect(() => {
        if (!cart || cart.items.length === 0) {
            navigate("/cart");
        }
    }, [cart, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepare cart items for order
            const cartItems = cart.items.map((item) => ({
                productId: item.productId._id,
                quantity: item.quantity,
            }));

            // Create order
            const response = await ordersApi.createOrder(cartItems, {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
            });

            if (response.success) {
                setOrderData(response.data);
                setShowReceipt(true);
                // Clear cart after successful order
                await clearCart();
            } else {
                alert("Failed to create order: " + response.message);
            }
        } catch (error) {
            console.error("Order creation error:", error);
            alert("Failed to create order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReceiptClose = () => {
        setShowReceipt(false);
        navigate("/");
    };

    if (!cart || cart.items.length === 0) {
        return null; // Will redirect to cart
    }

    const tax = totalAmount * 0.08;
    const finalTotal = totalAmount + tax;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate("/cart")}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Cart</span>
                </button>

                <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
                <p className="text-gray-600 mt-1">Complete your order</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Customer Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.name
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                            errors.email
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="h-5 w-5 mr-2" />
                                Payment Information
                            </h2>

                            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                                <p className="text-blue-800 text-sm">
                                    <strong>Demo Payment:</strong>{" "}
                                    This is a demo application. No real payment
                                    will be processed. Your order will be
                                    created successfully without any payment.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                                loading
                                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                        >
                            {loading
                                ? "Processing Order..."
                                : `Place Order - $${finalTotal.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Order Summary
                        </h2>

                        {/* Cart Items */}
                        <div className="space-y-3 mb-6">
                            {cart.items.map((item) => (
                                <div
                                    key={item.productId._id}
                                    className="flex items-center space-x-3"
                                >
                                    <img
                                        src={item.productId.image}
                                        alt={item.productId.name}
                                        className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {item.productId.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Qty: {item.quantity}{" "}
                                            × ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(
                                            2,
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-2 border-t pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">
                                    ${totalAmount.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax (8%)</span>
                                <span className="font-medium">
                                    ${tax.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium text-green-600">
                                    Free
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && orderData && (
                <ReceiptModal
                    orderData={orderData}
                    onClose={handleReceiptClose}
                />
            )}
        </div>
    );
};

export default CheckoutPage;
