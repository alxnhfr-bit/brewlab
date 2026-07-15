import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/dm-mono/400.css'
import '@fontsource/dm-mono/500.css'
import './index.css'
import BrewLab from './BrewLab'
import { initNativeSessionEffects } from './lib/native'

initNativeSessionEffects()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrewLab />
  </StrictMode>,
)
