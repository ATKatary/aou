import './icons';
import { getTheme } from './utils';
import ReactDOM from 'react-dom/client';
import React, { useState } from 'react';
import { Editor, Home, MB } from './pages';
import reportWebVitals from './reportWebVitals';
import { themeContextType, themeType } from './types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './assets/css/utils.css';  
import './assets/css/vars/_fonts.css';  
import './assets/css/vars/_theme.css';
import '@xyflow/react/dist/style.css';

import './assets/css/flow.css';  
import './assets/css/vars/_flow.css';  

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
            <Route path={"/:uid/playground/"} element={<Editor />}/>

            <Route path={"/"} element={<Home />}/>
            <Route path={"/:uid"} element={<Home />}/>
            <Route path={"/:uid/mb/:mbId"} element={<MB />}/>
            <Route path={"/:uid/projects"} element={<Home projects/>}/>
            <Route path={"/:uid/project/:projectId"} element={<Home />}/>
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
