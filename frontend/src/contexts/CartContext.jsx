import React, { createContext, useContext, useEffect, useReducer } from "react";
import { cartApi } from "../services/api";

// Cart Context
const CartContext = createContext();

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_CART":
            return {
                ...state,
                cart: action.payload.cart || null,
                totalItems: action.payload.totalItems || 0,
                totalAmount: action.payload.totalAmount || 0,
                loading: false,
                error: null,
            };

        case "ADD_TO_CART_SUCCESS":
            return {
                ...state,
                cart: action.payload.cart,
                totalItems: action.payload.totalItems,
                totalAmount: action.payload.totalAmount,
                loading: false,
                error: null,
            };

        case "UPDATE_CART_SUCCESS":
            return {
                ...state,
                cart: action.payload.cart,
                totalItems: action.payload.totalItems,
                totalAmount: action.payload.totalAmount,
                loading: false,
                error: null,
            };

        case "REMOVE_FROM_CART_SUCCESS":
            return {
                ...state,
                cart: action.payload.cart,
                totalItems: action.payload.totalItems,
                totalAmount: action.payload.totalAmount,
                loading: false,
                error: null,
            };

        case "CLEAR_CART_SUCCESS":
            return {
                ...state,
                cart: null,
                totalItems: 0,
                totalAmount: 0,
                loading: false,
                error: null,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        default:
            return state;
    }
};

// Initial state
const initialState = {
    cart: null,
    totalItems: 0,
    totalAmount: 0,
    loading: false,
    error: null,
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Load cart on mount
    useEffect(() => {
        loadCart();
    }, []);

    // Load cart from API
    const loadCart = async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            const response = await cartApi.getCart();

            if (response.success) {
                dispatch({
                    type: "SET_CART",
                    payload: {
                        cart: response.data.cart,
                        totalItems: response.data.totalItems,
                        totalAmount: response.data.totalAmount,
                    },
                });
            } else {
                dispatch({ type: "SET_ERROR", payload: response.message });
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
        }
    };

    // Add item to cart
    const addToCart = async (productId, quantity = 1) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            const response = await cartApi.addItem(productId, quantity);

            if (response.success) {
                dispatch({
                    type: "ADD_TO_CART_SUCCESS",
                    payload: {
                        cart: response.data.cart,
                        totalItems: response.data.totalItems,
                        totalAmount: response.data.totalAmount,
                    },
                });
                return { success: true, message: response.message };
            } else {
                dispatch({ type: "SET_ERROR", payload: response.message });
                return { success: false, message: response.message };
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            return { success: false, message: error.message };
        }
    };

    // Update item quantity
    const updateQuantity = async (productId, quantity) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            const response = await cartApi.updateItemQuantity(
                productId,
                quantity,
            );

            if (response.success) {
                dispatch({
                    type: "UPDATE_CART_SUCCESS",
                    payload: {
                        cart: response.data.cart,
                        totalItems: response.data.totalItems,
                        totalAmount: response.data.totalAmount,
                    },
                });
                return { success: true, message: response.message };
            } else {
                dispatch({ type: "SET_ERROR", payload: response.message });
                return { success: false, message: response.message };
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            return { success: false, message: error.message };
        }
    };

    // Remove item from cart
    const removeFromCart = async (productId) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            const response = await cartApi.removeItem(productId);

            if (response.success) {
                dispatch({
                    type: "REMOVE_FROM_CART_SUCCESS",
                    payload: {
                        cart: response.data.cart,
                        totalItems: response.data.totalItems,
                        totalAmount: response.data.totalAmount,
                    },
                });
                return { success: true, message: response.message };
            } else {
                dispatch({ type: "SET_ERROR", payload: response.message });
                return { success: false, message: response.message };
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            return { success: false, message: error.message };
        }
    };

    // Clear entire cart
    const clearCart = async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });
            const response = await cartApi.clearCart();

            if (response.success) {
                dispatch({ type: "CLEAR_CART_SUCCESS" });
                return { success: true, message: response.message };
            } else {
                dispatch({ type: "SET_ERROR", payload: response.message });
                return { success: false, message: response.message };
            }
        } catch (error) {
            dispatch({ type: "SET_ERROR", payload: error.message });
            return { success: false, message: error.message };
        }
    };

    const value = {
        ...state,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        loadCart,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export default CartContext;
