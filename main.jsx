import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Fullform1 from './Fullform1.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Fullform1 />
  </StrictMode>,
)
