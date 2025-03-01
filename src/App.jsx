import { useState } from 'react'

import './App.css'
import LandingPage from './components/page/LandingPage'
import { Routes ,Route } from 'react-router-dom'
import VoiceRestaurantAssistant5 from "./components/page/VoiceRestaurantAssistant"



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div c>
      
     <Routes>
     <Route path="/" element={<LandingPage/>} />
      <Route path="/VoiceRestaurantAssistant5" element={<VoiceRestaurantAssistant5/>} />
     </Routes>
    </div>
    </>
  )
}

export default App
