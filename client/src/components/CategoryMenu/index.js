import React, {useEffect} from 'react';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import {useStoreContext} from '../../utils/GlobalState'
import {UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY} from '../../utils/actions';
import {idbPromise} from '../../utils/helpers';


function CategoryMenu() {
  const [state, dispatch] = useStoreContext();
  const {categories} = state;
  const {loading, data: categoryData} = useQuery(QUERY_CATEGORIES);

  useEffect(
    () => {
      if (categoryData){
        dispatch({  // store in global state object
          type: UPDATE_CATEGORIES,
          categories: categoryData.categories
        });

        categoryData.categories.forEach(category => {  // store in IndexedDB
          idbPromise('categories', 'put', category);
        })
      }else if (!loading){  // if `loading` is undefined, that means the GraphQL `useQuery` hook isn't working and we're probably offline
        idbPromise('categories', 'get').then(categories => {
          dispatch({
            type: UPDATE_CATEGORIES,
            categories
          });
        });
      }
    }, [categoryData, dispatch, loading]

  );

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    })
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map((item) => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
