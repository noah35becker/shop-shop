
import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_CART_QUANTITY,
    CLEAR_CART,
    TOGGLE_CART
} from './actions';

import {useReducer} from 'react';


export const reducer = (state, action) => {   // this kind of 'overwriting' could be handled just as well via React `useState`s
    console.log(action);
    switch(action.type){
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products]
            };
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories]
            };
        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };
        case ADD_TO_CART:
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, action.product]
            };
        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cartOpen: action.products.length > 0,
                cart: [...state.cart, ...action.products]
            };
        case REMOVE_FROM_CART:
            let updatedCart = state.cart.filter(product => product._id !== action._id);
            return {
                ...state,
                cartOpen: updatedCart.length > 0,
                cart: updatedCart
            };
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartOpen: true,
                cart: state.cart.map(product => {
                    if (product._id === action._id)
                        product.purchaseQuantity = action.purchaseQuantity;
                    return product;
                })
            };
        case CLEAR_CART:
            return {
                ...state,
                cartOpen: false,
                cart: []
            };
        case TOGGLE_CART:
            return {
                ...state,
                cartOpen: !state.cartOpen
            };
        default:
            return state;
    }
}


export function useProductReducer(initialState){
    return useReducer(reducer, initialState);
}