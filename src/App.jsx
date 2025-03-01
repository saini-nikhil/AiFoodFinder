import { useState } from 'react'

import './App.css'
import LandingPage from './components/page/LandingPage'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div c>
      <h1>Welcome to the Restaurant Voice Assistant</h1>
     <LandingPage />
    </div>
    </>
  )
}

export default App
