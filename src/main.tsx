import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import BrewLab from './BrewLab'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrewLab />
  </StrictMode>,
)
