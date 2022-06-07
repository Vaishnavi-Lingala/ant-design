import { useState, createContext, useEffect } from "react";
import { SELECTED_HEADER } from "./constants";
export const Store = createContext();

function StoreProvider({ children }) {
    const [selectedHeaderOption, setSelectedHeaderOption] = useState("Directory");

    useEffect(() => {
        const selectedHeader = localStorage.getItem(SELECTED_HEADER);
        if (selectedHeader) setSelectedHeaderOption(selectedHeader);
    }, []);

    useEffect(() => {
        localStorage.setItem(SELECTED_HEADER, selectedHeaderOption);
        console.log({ selectedHeaderOption });
    }, [selectedHeaderOption]);

    return (
        <Store.Provider value={[selectedHeaderOption, setSelectedHeaderOption]}>
            {children}
        </Store.Provider>
    );
}

export default StoreProvider;