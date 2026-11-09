import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Anniversary from './components/anniversary/Anniversary.jsx'
import StoryPoster from './components/anniversary/StoryPoster.jsx'

// /1ano/?story=1 ou ?story=2 mostra a arte do story do Instagram em vez da experiência.
const storyVariant = new URLSearchParams(window.location.search).get('story')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {storyVariant ? <StoryPoster variant={storyVariant} /> : <Anniversary />}
  </StrictMode>,
)
