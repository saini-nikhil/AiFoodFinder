import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { ThemeContext } from '../ThemeContext/Themecontext';
import { useAuth } from '../auth/Authcontext';
import { MessageCircle, ShoppingCart, Loader2 } from 'lucide-react';

const AiRecipeGenerator = () => {
  const [formData, setFormData] = useState({
    recipeQuery: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipeResult, setRecipeResult] = useState(null);
  const [activeTag, setActiveTag] = useState('all');
  const [error, setError] = useState(null);
  
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useAuth();

  // API key should be imported from a secure location
  // This is a placeholder - in production, use environment variables or a secure key management system
  const API_KEY = "AIzaSyDtt9iTVZyMWurYKixqAO4CdfzGNFF3N2g"

  const tags = [
    { id: 'all', label: 'All Recipes', icon: '🍳' },
    { id: 'vegetarian', label: 'Vegetarian', icon: '🥬' },
    { id: 'vegan', label: 'Vegan', icon: '🌱' },
    { id: 'non-veg', label: 'Non-Vegetarian', icon: '🍗' },
    { id: 'gluten-free', label: 'Gluten Free', icon: '🌾' },
    { id: 'dairy-free', label: 'Dairy Free', icon: '🥛' },
    { id: 'keto', label: 'Keto', icon: '🥓' },
    { id: 'quick-meals', label: 'Quick Meals', icon: '⏱️' },
    { id: 'mediterranean', label: 'Mediterranean', icon: '🌊' },
    { id: 'paleo', label: 'Paleo', icon: '🍖' },
    { id: 'low-carb', label: 'Low Carb', icon: '🚫🍞' },
    { id: 'soup', label: 'Soup', icon: '🥣' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const callGeminiAI = async (inputMessage) => {
    setIsSubmitting(true);
    setError(null);
  
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': API_KEY,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Generate a recipe and grocery list for the following meal plan: ${inputMessage}. 
                       Provide the recipe and the grocery list in the following format:
                       {
                         "recipe": "recipe_instructions_here",
                         "groceryItems": [
                           {
                             "id": "unique_id",
                             "name": "item_name",
                             "category": "item_category",
                             "quantity": "amount_needed",
                             "icon": "emoji_icon"
                           }
                         ]
                       }`
              }]
            }]
          })
        }
      );
      //  console.log(response.data)
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data)
  
      try {
        // Extract the response text and clean up any markdown syntax
        let textResponse = data.candidates[0].content.parts[0].text;
  
        // Remove any backticks (`) or markdown block syntax (e.g., ` ```json `)
        textResponse = textResponse.replace(/```json|```/g, '').trim();
  
        // Now try parsing the cleaned response
        const parsedResponse = JSON.parse(textResponse);
        
        // If successful, set the recipe result
        setRecipeResult(parsedResponse);
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        setRecipeResult(null);
        setError("Failed to parse response from the API.");
      }
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      setRecipeResult(null);
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.recipeQuery.trim()) {
      callGeminiAI(formData.recipeQuery);
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-b from-indigo-50 to-white'} transition-colors duration-300`}>
      {/* Header */}
      <header className="pt-6 px-6 z-10 relative">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} ml-2`}>FoodFinder</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Home</Link>
            <Link to="/about" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>About Us</Link>
            <Link to="/recipe-generator" className={`${theme === 'dark' ? 'text-white bg-indigo-600 px-3 py-1 rounded-md' : 'text-indigo-900 border-b-2 border-indigo-600'} transition-colors`}>Recipe Generator</Link>
            <Link to="/contact" className={`${theme === 'dark' ? 'text-indigo-300 hover:text-indigo-100' : 'text-indigo-700 hover:text-indigo-900'} transition-colors`}>Contact</Link>
          </nav>
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className={`${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  {currentUser.displayName || 'User'}
                </span>
                <button
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className={`px-4 py-2 border ${theme === 'dark' ? 'border-indigo-400 text-indigo-400 hover:bg-gray-700' : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'} rounded-lg transition-colors hidden md:block`}>
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      
      {/* Page Title Section */}
      <section className={`py-12 md:py-20 relative overflow-hidden ${theme === 'dark' ? 'text-white' : ''}`}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6`}>AI Recipe Generator</h1>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Describe what you'd like to cook, and our AI will generate a recipe and shopping list for you!
            </p>
          </div>
        </div>
        
        {/* Background decorative elements */}
        {theme !== 'dark' && (
          <>
            <div className="absolute top-1/4 right-0 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
            <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
          </>
        )}
      </section>
      
      {/* Recipe Tags */}
      <section className="py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center mb-8 overflow-x-auto">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(tag.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all transform hover:-translate-y-0.5 ${
                  activeTag === tag.id 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                    : theme === 'dark' 
                      ? 'bg-gray-800 text-indigo-300 hover:bg-gray-700' 
                      : 'bg-white text-indigo-700 shadow hover:shadow-md'
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Recipe Generator Form */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 mb-12`}>
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6 flex items-center gap-2`}>
                <MessageCircle className="w-6 h-6" />
                Tell Us What You Want to Cook
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="recipeQuery" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2`}>
                    Recipe Description
                  </label>
                  <textarea
                    id="recipeQuery"
                    name="recipeQuery"
                    value={formData.recipeQuery}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe what you'd like to cook, e.g., 'A quick vegetarian pasta dish with spinach and mushrooms' or 'Something with chicken for a family dinner'"
                    className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Generating Recipe...
                    </span>
                  ) : (
                    'Generate Recipe & Shopping List'
                  )}
                </button>
              </form>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700 border border-red-200">
                <p>{error}</p>
              </div>
            )}
            
            {/* Recipe Results */}
            {recipeResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Recipe Instructions */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6`}>Recipe</h2>
                  <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} recipe-content whitespace-pre-line`}>
                    {recipeResult.recipe}
                  </div>
                </div>
                
                {/* Shopping List */}
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8`}>
                  <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-6 flex items-center gap-2`}>
                    <ShoppingCart className="w-5 h-5" />
                    Shopping List
                  </h2>
                  
                  <div className="space-y-3">
                    {recipeResult.groceryItems.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-lg flex items-center justify-between ${
                          theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                        } transition-colors`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <h4 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {item.name}
                            </h4>
                            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                              {item.category}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          theme === 'dark' 
                            ? 'bg-indigo-900 text-indigo-200' 
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gradient-to-b from-white to-indigo-50'} transition-colors duration-300`}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-4`}>Frequently Asked Questions</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Get answers to common questions about our Recipe Generator.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>How accurate are the recipes?</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Our AI generates recipes based on culinary principles and popular cooking techniques. All recipes are designed to be tasty and practical, though you may need to adjust to your personal taste.</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>Can I save my favorite recipes?</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Yes! With a premium account, you can save unlimited recipes and create customized recipe collections for different occasions and dietary preferences.</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>Can I specify dietary restrictions?</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Absolutely! Just mention your dietary needs in your recipe request. You can also use the category tags above to focus on specific diet types like vegetarian, vegan, or gluten-free.</p>
            </div>
            
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-md p-6`}>
              <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-900'} mb-3`}>How many recipes can I generate?</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Free users can generate up to 5 recipes per day. Premium subscribers enjoy unlimited recipe generations and additional features like nutrition analysis and meal planning.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AiRecipeGenerator;