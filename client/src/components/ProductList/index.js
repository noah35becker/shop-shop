import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import spinner from '../../assets/spinner.gif';
import {useStoreContext} from '../../utils/GlobalState'
import {UPDATE_PRODUCTS} from '../../utils/actions';
import {idbPromise} from '../../utils/helpers';

function ProductList() {
  const [state, dispatch] = useStoreContext();
  const {currentCategory} = state;
  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(
    () => {
      if (data){
        dispatch({  // store in global state object
          type: UPDATE_PRODUCTS,
          products: data.products
        });

        data.products.forEach(product => {  // store in IndexedDB
          idbPromise('products', 'put', product);
        })
      }else if (!loading){  // if `loading` is undefined, that means the GraphQL `useQuery` hook isn't working and we're probably offline
        idbPromise('products', 'get').then(products => {
          dispatch({
            type: UPDATE_PRODUCTS,
            products
          });
        });
      }
    }, [data, dispatch, loading]
  );

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(product => product.category._id === currentCategory);
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
