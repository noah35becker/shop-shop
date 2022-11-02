
import React from "react";
import {useStoreContext} from "../../utils/GlobalState";
import {REMOVE_FROM_CART, UPDATE_CART_QUANTITY} from "../../utils/actions";

// COMPONENT
export default function CartItem({item}){
    const [, dispatch] = useStoreContext();

    function removeFromCart(){
        dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
        });
    }

    function qtyChange({target}){
        const value = +target.value;

        if (value > 0)
            dispatch({
                type: UPDATE_CART_QUANTITY,
                _id: item._id,
                purchaseQuantity: value
            });
        else
            dispatch({
                type: REMOVE_FROM_CART,
                _id: item._id
            });
    }

    const onChange = (e) => {
        const value = e.target.value;
      
        if (value === '0') {
          dispatch({
            type: REMOVE_FROM_CART,
            _id: item._id
          });
        } else {
          dispatch({
            type: UPDATE_CART_QUANTITY,
            _id: item._id,
            purchaseQuantity: parseInt(value)
          });
        }
      };

    return (
        <div className="flex-row">
            <div>
                <img src={`/images/${item.image}`} alt={item.name} />
            </div>

            <div>
                <div>{item.name}, ${item.price}</div>

                <div>
                    <span>Qty:</span>
                    
                    <input type='number' value={item.purchaseQuantity} onChange={qtyChange} />

                    <span role='img' aria-label='trash' onClick={removeFromCart}>🗑️</span>
                </div>
            </div>
        </div>
    );
}