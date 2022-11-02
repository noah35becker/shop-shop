
import React from "react";

// COMPONENT
export default function CartItem({item}){
    return (
        <div className="flex-row">
            <div>
                <img src={`/images/${item.image}`} alt={item.name} />
            </div>

            <div>
                <div>{item.name}, ${item.price}</div>

                <div>
                    <span>Qty:</span>
                    
                    <input type='number' placeholder="1" value={item.purchaseQuantity} />

                    <span role='img' aria-label='trash'>🗑️</span>
                </div>
            </div>
        </div>
    );
}