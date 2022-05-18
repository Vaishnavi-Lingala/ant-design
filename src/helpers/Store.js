import React, { useState } from 'react';

export const StoreContext = React.createContext();

export const StoreContextProvider = props => {
    const [toastList, setToastList] = useState([]);

    return (
        <StoreContext.Provider value={[toastList, setToastList]}>
            {props.children}
        </StoreContext.Provider>
    )
}