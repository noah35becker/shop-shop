
import React, {createContext, useContext} from 'react';  // React MUST be imported here
import {useProductReducer} from './reducers';


const StoreContext = createContext();
const {Provider} = StoreContext;


export const StoreProvider = ({value = [], ...props}) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        categories: [],
        currentCategory: null,
        cart: [],
        cartOpen: false
    });
    
    return <Provider value={[state, dispatch]} {...props} />;  // `props` is necessary here because this Provider wraps all other elements on the page in App.js; `props.children` ultimately allows access to those other elements
    // return (    // HERE is another way to express the same return statement
    //     <Provider value={[state, dispatch]}>
    //         {props.children}
    //     </Provider>
    // );
}

export const useStoreContext = () => useContext(StoreContext);