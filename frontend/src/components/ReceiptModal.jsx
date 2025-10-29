import React from "react";
import {
    Calendar,
    CheckCircle,
    CreditCard,
    Package,
    Truck,
    X,
} from "lucide-react";

const ReceiptModal = ({ orderData, onClose }) => {
    if (!orderData) return null;

    const { order, receipt } = orderData;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDeliveryDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <h2 className="text-xl font-bold text-gray-900">
                            Order Confirmed!
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Order ID */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <Package className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-green-800">
                                    Order ID
                                </p>
                                <p className="font-bold text-green-900">
                                    {order.orderId}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Order Date
                                </p>
                                <p className="font-medium text-gray-900">
                                    {formatDate(receipt.timestamp)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Truck className="h-5 w-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-600">
                                    Estimated Delivery
                                </p>
                                <p className="font-medium text-gray-900">
                                    {formatDeliveryDate(
                                        receipt.estimatedDelivery,
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Customer Information
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="font-medium text-gray-900">
                                {order.customerInfo.name}
                            </p>
                            <p className="text-gray-600">
                                {order.customerInfo.email}
                            </p>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Order Items
                        </h3>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                        <Package className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        ${(item.price * item.quantity).toFixed(
                                            2,
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Payment Summary
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">
                                    ${receipt.subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">
                                    ${receipt.tax.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2">
                                <span>Total</span>
                                <span>${receipt.total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Payment Information
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <CreditCard className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {receipt.paymentMethod}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {receipt.shippingAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full">
                            </div>
                            <p className="text-blue-800">
                                <strong>Status:</strong>{" "}
                                {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                            </p>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                            You will receive an email confirmation shortly.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
