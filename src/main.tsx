import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/archivo/400.css'
import '@fontsource/archivo/600.css'
import '@fontsource/archivo/700.css'
import '@fontsource/archivo-black/400.css'
import './index.css'
import BrewLab from './BrewLab'
import { initNativeSessionEffects } from './lib/native'

initNativeSessionEffects()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrewLab />
  </StrictMode>,
)
