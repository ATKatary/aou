import './icons';
import { getTheme } from './utils';
import { AOUEditor } from './pages';
import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';
import reportWebVitals from './reportWebVitals';
import { themeContextType, themeType } from './types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './assets/css/utils.css';  
import './assets/css/vars/_fonts.css';  
import './assets/css/vars/_theme.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
export const ThemeContext = React.createContext<themeContextType | null>(null);

function App() {
    const [theme, setTheme] = useState<themeType>(getTheme())

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        setTheme(getTheme())
    });
    
    return (
      <ThemeContext.Provider value={{theme, setTheme}}>
        <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<AOUEditor />}/>
          </Routes>
        </BrowserRouter>
      </ThemeContext.Provider>
    )
}
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

reportWebVitals();
