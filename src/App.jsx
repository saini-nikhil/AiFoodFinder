import { useState } from 'react'

import './App.css'
import LandingPage from './components/page/LandingPage'
import { Routes ,Route } from 'react-router-dom'
import VoiceRestaurantAssistant5 from "./components/page/VoiceRestaurantAssistant"
import PrivacyPolicyPage from './components/page/PrivacyPolicyPage'
import AboutUsPage from './components/page/AboutUsPage'
import TermsOfService from './components/page/TermsOfService'
import ContactUs from './components/page/ContactUs'
import PageNotFound from './components/page/PageNotFound'
import LoginPage  from "./components/auth/LoginPage"
import SignupPage from './components/auth/SignupPage'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div c>
      
     <Routes>
     <Route path="/" element={<LandingPage/>} />
     <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
      <Route path="/VoiceRestaurantAssistant5" element={<VoiceRestaurantAssistant5/>} />
      <Route path="/privacy" element={<PrivacyPolicyPage/>} />
      <Route path="/about" element={<AboutUsPage/>} />
      <Route path="/terms" element={<TermsOfService/>} />
      <Route path="/contact" element={<ContactUs/>} />
      <Route path="*" element={<PageNotFound/>} />
     </Routes>
    </div>
    </>
  )
}

export default App
