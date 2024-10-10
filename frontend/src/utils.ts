import { useState } from "react";
import { themeType } from "./types"

export const getPropValue =  (prop: string) => window.getComputedStyle(document.documentElement).getPropertyValue(prop)
export function getTheme(): themeType {
    return {
        bg: {
            primary: getPropValue('--bg-primary'),
            secondary: getPropValue('--bg-secondary')
        }
    }
}

export function useCustomState<T>(initialState: any): [T, (newState: any) => any] {
    const [state, setState] = useState(initialState);
    const setCustomSate = (newState: any) => {
        setState((prevState: any) => ({...prevState, ...newState}))
    };
    
    return [state, setCustomSate];
}