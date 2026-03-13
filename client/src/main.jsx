import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';
import { ThemeProvider } from './context/ThemeContext'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>		{/* <-- оборачиваем */}
      <App />
	</ThemeProvider>
  </StrictMode>,
)
