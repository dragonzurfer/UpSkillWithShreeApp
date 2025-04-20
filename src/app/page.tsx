import LoginStatus from "@/components/LoginStatus";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-white text-gray-800">
      {/* Header */}
      <header className="w-full py-6 px-8 md:px-12 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00A02B] to-[#5DD62C] text-transparent bg-clip-text">
              UpSkillWithShree
            </h1>
          </Link>
          <nav>
            <ul className="flex space-x-8">
              <li>
                <Link href="/diagnostic-tests" className="text-gray-700 hover:text-green-600 transition-colors duration-200">
                  Tests
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors duration-200">
                  1:1 One on One
                </Link>
              </li>
              <li className="relative group">
                {/* Community dropdown trigger */}
                <span className="text-gray-700 hover:text-green-600 transition-colors duration-200 flex items-center cursor-pointer">
                  Community
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:rotate-180" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                
                {/* Dropdown content with improved positioning and hover detection */}
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-20 
                                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                                transition-all duration-300 transform origin-top-right">
                  <a 
                    href="https://discord.gg/s8wu7kjc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.39-.444.822-.608 1.19a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.19.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                      Discord
                    </div>
                  </a>
                  <a 
                    href="https://www.youtube.com/@UpSkillWithSHree" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                      YouTube
                    </div>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/shreehari-a-173757130/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </div>
                  </a>
                </div>
              </li>
              <li>
                <Link href="/contact" className="text-gray-700 hover:text-green-600 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section - Adjusted padding and spacing */}
      <section className="w-full flex flex-col md:flex-row items-center justify-center py-12 md:py-16 px-8 md:px-12 gap-12">
        <div className="max-w-3xl mx-auto md:mx-0 md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 pt-8 leading-tight">
            Unlock Your Potential: <span className="text-green-600">Analyse</span>, Diagnose, and <span className="text-green-600">Upskill</span>
          </h2>
          <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-2xl mx-auto md:mx-0">
            Discover your strengths and weaknesses. Crack top tech interviews, build a personalized upskilling path, and get hired faster with our tailored learning roadmap.
          </p>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 justify-center sm:justify-start">
            <a
              href="/diagnostic-tests"
              className="inline-block bg-gradient-to-r from-green-600 to-green-800 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
            >
              Explore Tests
            </a>
            <a
              href="/diagnostic-tests"
              className="inline-block bg-white text-green-700 font-semibold py-4 px-10 rounded-lg border-2 border-green-600 shadow-md hover:bg-green-50 hover:scale-105 transition duration-300"
            >
              Take a Sample Test
            </a>
          </div>
        </div>
        
        {/* Right column with illustration and process icons */}
        <div className="md:w-1/2 flex flex-col items-center">
          {/* Illustration */}
          <div className="relative w-full max-w-lg h-80 mb-8 hover:scale-105 transition duration-300 ease-in-out">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl opacity-60 blur-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4ade80" className="w-40 h-40 text-green-400 opacity-95">
                <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
              </svg>
            </div>
          </div>
          
          {/* Process Icons - Fixed for better visibility */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
            <div className="bg-white p-4 rounded-lg shadow-md text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4ade80" className="w-6 h-6">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-700 text-lg mb-1">Assess</h3>
              <p className="text-xs text-gray-600">Take diagnostic tests</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4ade80" className="w-6 h-6">
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-700 text-lg mb-1">Learn</h3>
              <p className="text-xs text-gray-600">Follow your roadmap</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4ade80" className="w-6 h-6">
                  <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="font-semibold text-green-700 text-lg mb-1">Grow</h3>
              <p className="text-xs text-gray-600">Advance your career</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coaching Sessions Section */}
      <section className="w-full py-12 md:py-16 px-8 md:px-12 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">1:1 Coaching Sessions</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Personalized coaching to accelerate your learning and career growth.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Discovery Call */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-green-700">Discovery Call</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹699</span>
                  <span className="text-gray-500 ml-2 line-through">₹999</span>
                  <p className="text-gray-600 mt-1">15-minute meeting</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Clarify personal goals</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Identify actionable steps</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Gain clarity & confidence</span>
                  </li>
                </ul>
                <a href="https://topmate.io/upskillwithshree/1515780" target="_blank" rel="noopener noreferrer" className="block w-full">
                  <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                    Book Now
                  </button>
                </a>
              </div>
            </div>
            
            {/* Interview Prep & Tips */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-green-700">Interview Prep & Tips</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹1,199</span>
                  <span className="text-gray-500 ml-2 line-through">₹1,499</span>
                  <p className="text-gray-600 mt-1">30-minute meeting</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Interview roadmap</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Google FAQs walkthrough</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personalized blueprint</span>
                  </li>
                </ul>
                <a href="https://topmate.io/upskillwithshree/1515774" target="_blank" rel="noopener noreferrer" className="block w-full">
                  <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                    Book Now
                  </button>
                </a>
              </div>
            </div>
            
            {/* Career Guidance */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-green-500 relative">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 rounded-bl-lg font-medium">
                Most Popular
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-green-700">Career Guidance</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹1,199</span>
                  <span className="text-gray-500 ml-2 line-through">₹1,999</span>
                  <p className="text-gray-600 mt-1">30-minute meeting</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day job-switch plan</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Resume optimization</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Skill-gap roadmap</span>
                  </li>
                </ul>
                <a href="https://topmate.io/upskillwithshree/1515776" target="_blank" rel="noopener noreferrer" className="block w-full">
                  <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                    Book Now
                  </button>
                </a>
              </div>
            </div>
            
            {/* Google Mock Interview */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4 text-center text-green-700">Google Mock Interview</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹4,999</span>
                  <span className="text-gray-500 ml-2 line-through">₹5,999</span>
                  <p className="text-gray-600 mt-1">60-minute meeting</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Realistic coding challenges</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>STAR method practice</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Live actionable feedback</span>
                  </li>
                </ul>
                <a href="https://topmate.io/upskillwithshree/1515775" target="_blank" rel="noopener noreferrer" className="block w-full">
                  <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                    Book Now
                  </button>
                </a>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/products" className="inline-block bg-gradient-to-r from-green-600 to-green-800 text-white font-bold py-4 px-10 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition duration-300">
              View All Sessions
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Assessments - Added top margin */}
      <section className="w-full py-12 md:py-16 border-t border-gray-200 px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Featured Diagnostic Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Test Box 1: Technical Proficiency */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5DD62C" className="w-full h-full">
                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                    <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                    <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Technical Proficiency</h3>
                <p className="text-gray-600 text-center mb-8">Evaluate your technical skills through in-depth, hands-on assessments.</p>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Evaluate
                </button>
              </div>
            </div>

            {/* Test Box 2: Soft Skills Analysis */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5DD62C" className="w-full h-full">
                    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Soft Skills Analysis</h3>
                <p className="text-gray-600 text-center mb-8">Measure communication, leadership, and teamwork abilities to boost professional growth.</p>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Evaluate
                </button>
              </div>
            </div>

            {/* Test Box 3: Problem-Solving */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5DD62C" className="w-full h-full">
                    <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.136a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Problem-Solving</h3>
                <p className="text-gray-600 text-center mb-8">Test your analytical thinking and develop solutions to real-world challenges.</p>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Evaluate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specialized Assessments - Added top margin and adjusted background */}
      <section className="w-full py-12 md:py-16 bg-gradient-to-b from-gray-50 to-gray-100 px-8 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Specialized Assessments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Assessment Box 1: Cognitive Abilities */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5DD62C" className="w-full h-full">
                    <path d="M16.5 7.5h-9v9h9v-9z" />
                    <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A1.5 1.5 0 004.5 8.25v7.5A1.5 1.5 0 006 17.25h12a1.5 1.5 0 001.5-1.5v-7.5A1.5 1.5 0 0018 6.75H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Cognitive Abilities</h3>
                <p className="text-gray-600 text-center mb-8">Evaluate memory, attention to detail, and logical reasoning skills.</p>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Evaluate
                </button>
              </div>
            </div>

            {/* Assessment Box 2: Career Aptitude */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5DD62C" className="w-full h-full">
                    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Career Aptitude</h3>
                <p className="text-gray-600 text-center mb-8">Discover which career paths align with your natural talents and interests.</p>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Evaluate
                </button>
              </div>
            </div>

            {/* Assessment Box 3: Performance Metrics */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <div className="w-16 h-16 mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#5DD62C" className="w-full h-full">
                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">Performance Metrics</h3>
                <p className="text-gray-600 text-center mb-8">Assess productivity, efficiency, and work quality with data-driven insights.</p>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Evaluate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Login / Status Section - Added top margin */}
      <section className="w-full py-12 md:py-16 border-t border-gray-200 px-8 md:px-12">
        <div className="max-w-6xl mx-auto text-center">
          <LoginStatus />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-8 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© {new Date().getFullYear()} UpSkillWithShree. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              <Link href="/terms" className="text-gray-600 hover:text-green-600 transition-colors duration-200">Terms & Conditions</Link>
              <Link href="/refunds" className="text-gray-600 hover:text-green-600 transition-colors duration-200">Refunds & Cancellations</Link>
              <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors duration-200">Contact Us</Link>
              <Link href="/products" className="text-gray-600 hover:text-green-600 transition-colors duration-200">1:1 One on One</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
