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

export async function post(url: RequestInfo | URL, body: any, headers: HeadersInit, other?: any) {
    return await fetch(url, {
        method: 'POST',
        headers: {
            ...headers
        },
        credentials: 'same-origin',
        body: body,
        ...other
    })
}

export async function get(url: string, args: Object, headers: HeadersInit) {
    url += "?";
    for (const [arg, value] of Object.entries(args)) {
        url += `${arg}=${value}&`
    }

    return await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    })
}