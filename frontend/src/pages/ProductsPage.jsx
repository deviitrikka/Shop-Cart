import React, { useEffect, useState } from "react";
import { Filter, Package, Search, ShoppingCart, Star } from "lucide-react";
import { productsApi } from "../services/api";
import { useCart } from "../contexts/CartContext";
import { toast } from "react-toastify";

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [pagination, setPagination] = useState({});

    const { addToCart, updateQuantity, cart, loading: cartLoading } = useCart();

    // Load products and categories
    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    // Load products when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadProducts();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedCategory]);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const params = {
                search: searchTerm || undefined,
                category: selectedCategory || undefined,
                limit: 10,
                page: 1,
            };

            const response = await productsApi.getProducts(params);

            if (response.success) {
                setProducts(response.data);
                setPagination(response.pagination);
                setError(null);
            } else {
                setError(response.message);
            }
        } catch (err) {
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await productsApi.getCategories();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (err) {
            console.error("Failed to load categories:", err);
        }
    };

    const handleAddToCart = async (productId) => {
        // Check if the item already exists in the cart
        console.log(cart);
        const existingItem = cart?.items?.find((item) =>
            item.productId._id === productId
        );

        let result;
        if (existingItem) {
            // Item exists, update quantity by incrementing it
            result = await updateQuantity(productId, existingItem.quantity + 1);

            if (result.success) {
                toast.success("Cart quantity updated successfully");
            } else {
                toast.error(result.message || "Failed to update cart quantity");
            }
        } else {
            // Item doesn't exist, add it to cart
            result = await addToCart(productId, 1);

            if (result.success) {
                toast.success("Added to cart successfully");
            } else {
                toast.error(result.message || "Failed to add to cart");
            }
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />,
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Star
                    key="half"
                    className="h-4 w-4 fill-yellow-400/50 text-yellow-400"
                />,
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />,
            );
        }

        return stars;
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600">
                </div>
            </div>
        );
    }
    const handleNextPage = async (page) => {
        const response = await productsApi.getProducts({
            search: searchTerm || undefined,
            category: selectedCategory || undefined,
            limit: 10,
            page,
        });
        if (response.success) {
            setProducts(response.data);
            setPagination(response.pagination);
        }
    };

    const handlePreviousPage = async (page) => {
        const response = await productsApi.getProducts({
            search: searchTerm || undefined,
            category: selectedCategory || undefined,
            limit: 10,
            page,
        });
        if (response.success) {
            setProducts(response.data);
            setPagination(response.pagination);
        }
    };
    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-600 text-lg">{error}</div>
                <button
                    onClick={loadProducts}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Products
                </h1>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                    >
                        {/* Product Image */}
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-52 h-auto mx-auto object-cover hover:scale-105 transition-transform duration-200"
                            />
                        </div>

                        {/* Product Info */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {product.name}
                            </h3>

                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {product.description}
                            </p>

                            {/* Rating */}
                            <div className="flex items-center mb-3">
                                <div className="flex items-center">
                                    {renderStars(product.rating.rate)}
                                </div>
                                <span className="ml-2 text-sm text-gray-600">
                                    ({product.rating.count})
                                </span>
                            </div>

                            {/* Price and Stock */}
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    ${product.price.toFixed(2)}
                                </span>
                                <span
                                    className={`text-sm px-2 py-1 rounded-full ${
                                        product.stock > 10
                                            ? "bg-green-100 text-green-800"
                                            : product.stock > 0
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {product.stock > 0
                                        ? `${product.stock} in stock`
                                        : "Out of stock"}
                                </span>
                            </div>

                            {/* Add to Cart Button */}
                            <button
                                onClick={() => handleAddToCart(product._id)}
                                disabled={product.stock === 0 || cartLoading}
                                className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-md font-medium transition-colors ${
                                    product.stock === 0 || cartLoading
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                <span>
                                    {product.stock === 0
                                        ? "Out of Stock"
                                        : cartLoading
                                        ? "Adding..."
                                        : "Add to Cart"}
                                </span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {products.length === 0 && !loading && (
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No products found
                    </h3>
                    <p className="text-gray-600">
                        Try adjusting your search or filter criteria.
                    </p>
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                        <button
                            disabled={!pagination.hasPrev}
                            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            onClick={() =>
                                handlePreviousPage(pagination.currentPage - 1)}
                        >
                            Previous
                        </button>
                        <span className="px-3 py-2 text-gray-600">
                            Page {pagination.currentPage} of{" "}
                            {pagination.totalPages}
                        </span>
                        <button
                            disabled={!pagination.hasNext}
                            className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            onClick={() =>
                                handleNextPage(pagination.currentPage + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsPage;
