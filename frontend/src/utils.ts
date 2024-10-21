import { useState } from "react";
import { navStateType, themeType } from "./types"

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

export function constructUrl(url: string, args: Object) {
    url += "?";
    for (const [arg, value] of Object.entries(args)) {
        url += `${arg}=${value}&`
    }

    return url
}

export function stateToUrl(state: navStateType) {
    let url = `/${state.id}`

    while (state.prevState) {
        url = `${url}/${state.prevState.id}`
        state = state.prevState
    }

    return url
}

export function addToLocalStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        clearLocalStorage();
        localStorage.setItem(key, value);
    }
}

export function clearLocalStorage() {
    const permanent: string[] = [];
    const n = localStorage.length;

    for (let i = 0; i < n; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (permanent.includes(key)) continue;
        localStorage.removeItem(key);
    }
}

export function img2Base64(img: Blob, callback: (url: string) => void) {
    var reader = new FileReader();
    reader.onloadend = function() {
      if (typeof reader.result === 'string') return callback(reader.result)
    }
    reader.readAsDataURL(img);
}