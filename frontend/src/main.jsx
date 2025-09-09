import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ApiChecker from './ApiChecker.jsx'
import "bootstrap/dist/css/bootstrap.min.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ApiChecker />
  </StrictMode>,
)
