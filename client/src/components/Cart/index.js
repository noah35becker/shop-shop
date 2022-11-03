
// IMPORTS
import React, {useEffect} from "react";
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';
import {useStoreContext} from "../../utils/GlobalState";
import {TOGGLE_CART, ADD_MULTIPLE_TO_CART} from "../../utils/actions";
import { idbPromise } from "../../utils/helpers";
import {QUERY_CHECKOUT} from '../../utils/queries';
import {loadStripe} from '@stripe/stripe-js';
import { useLazyQuery } from "@apollo/client";

const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');


// COMPONENT
export default function Cart(){
    const [state, dispatch] = useStoreContext();
    const [getCheckout, {data}] = useLazyQuery(QUERY_CHECKOUT);  // `data` will contain the Stripe checkout session, but only after the query is actually called via the `getCheckout` function

    useEffect(
        () => {
            function getCart(){
                idbPromise('cart', 'get')
                .then(cartItems => {
                    dispatch({
                        type: ADD_MULTIPLE_TO_CART,
                        products: [...cartItems]
                    });
                });
            }

            if (!state.cart.length)
                getCart();
        }, [state.cart.length, dispatch]
    );

    useEffect(
        () => {
            if (data)
                stripePromise.then(response => 
                    response.redirectToCheckout({sessionId: data.checkout.session})
                );
        }, [data]
    );

    function toggleCart(){
        dispatch({type: TOGGLE_CART});
    }

    function calculateTotal(){
        let sum = 0;
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity;
        });
        return sum.toFixed(2);
    }

    function submitCheckout(){
        const productIds = [];

        state.cart.forEach(item => {
            for (let i = 0; i < item.purchaseQuantity; i++)
                productIds.push(item._id);
        });

        getCheckout({
            variables: {products: productIds}
        });
    }

    if (state.cartOpen)
        return (
            <div className="cart">
                <div className="close" onClick={toggleCart}>[close]</div>

                <h2>Shopping Cart</h2>

                {state.cart.length ?
                        <div>
                            {state.cart.map(item => <CartItem key={item._id} item={item} />)}

                            <div className="flex-row space-between">
                                <b>Total: ${calculateTotal()}</b>
                                {Auth.loggedIn ?
                                        <button onClick={submitCheckout}>Checkout</button>
                                    :
                                        <span>(Log in to check out)</span>
                                }
                            </div>
                        </div>
                    :
                        <h3>
                            <span role='img' aria-label="shocked">😱</span>
                            You haven't added anything to your cart yet!
                        </h3>
                }
            </div>
        );
    
    return (
        <div className="cart-closed" onClick={toggleCart}>
            <span role='img' aria-label="cart">🛒</span>
        </div>
    );
};