
import React, {createContext, useContext} from 'react';  // React MUST be imported here
import {useProductReducer} from './reducers';


const StoreContext = createContext();
const {Provider} = StoreContext;


export const StoreProvider = ({value = [], ...props}) => {
    const [state, dispatch] = useProductReducer({
        products: [],
        categories: [],
        currentCategory: null,
    });
    
    console.log(state);
    
    return <Provider value={[state, dispatch]} {...props} />;  // `props` is necessary here because this Provider will wrap all other elements on the page; `props.children` will allow access to those other elements
}

export const useStoreContext = () => useContext(StoreContext);