
import './App.css'
import LandingPage from './components/page/LandingPage'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import VoiceRestaurantAssistant5 from "./components/page/VoiceRestaurantAssistant"
import PrivacyPolicyPage from './components/page/PrivacyPolicyPage'
import AboutUsPage from './components/page/AboutUsPage'
import TermsOfService from './components/page/TermsOfService'
import ContactUs from './components/page/ContactUs'
import PageNotFound from './components/page/PageNotFound'
import LoginPage from "./components/auth/LoginPage"
import SignupPage from './components/auth/SignupPage'
import { AuthProvider } from './components/auth/Authcontext'
import PrivateRoute from './components/auth/Privateroute'
import { ThemeProvider } from "./components/page/Themecontext"
import VoiceRestaurantAssistant from './components/new/VoiceRestaurantAssistant'
import AiRecipeGenerator from './components/page/AiRecipeGenerator'
import ChatBot from './components/page/Chatbot'

function App() {
 

  return (
    <ThemeProvider>
 
    <BrowserRouter>
      <AuthProvider>
        <div>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/VoiceRestaurantAssistant" 
              element={
                <PrivateRoute>
                  <VoiceRestaurantAssistant />
                </PrivateRoute>
              } 
            />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            
            <Route path="/AiRecipeGenerator" element={<AiRecipeGenerator />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/chatBot" element={<ChatBot />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App