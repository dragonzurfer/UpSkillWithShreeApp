import React from "react";
import Link from "next/link";

export default function Products() {
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
                <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors duration-200 font-semibold">
                  1:1 One on One
                </Link>
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

      <div className="max-w-6xl mx-auto my-12 px-8 md:px-0 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">1:1 One on One Sessions</h1>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          Personalized coaching to accelerate your learning and career growth. Our expert mentors provide tailored guidance for your specific needs.
          All prices are listed in Indian Rupees (INR).
        </p>
        
        {/* Diagnostic Tests Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Personalized Assessment & Coaching</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Diagnostic Test */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-center text-green-700">Basic Assessment</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹1,999</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Technical proficiency assessment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>60-minute evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Basic skill gap analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Email summary report</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Comprehensive Diagnostic Test */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-2 border-green-500 relative">
              <div className="absolute top-0 right-0 bg-green-600 text-white px-4 py-1 rounded-bl-lg font-medium">
                Most Popular
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-center text-green-700">Comprehensive Assessment</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹4,999</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Full technical & soft skills evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>120-minute assessment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Detailed skill gap analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Personalized learning roadmap</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-minute review call</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Get Started
                </button>
              </div>
            </div>
            
            {/* Premium Diagnostic Test */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="p-8">
                <h3 className="text-2xl font-semibold mb-4 text-center text-green-700">Premium Assessment</h3>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹9,999</span>
                  <span className="text-gray-600 ml-2">one-time</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All-inclusive assessment package</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>150-minute comprehensive evaluation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Advanced skill gap & career alignment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Customized learning path</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Two 45-minute coaching sessions</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-8 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">© {new Date().getFullYear()} UpSkillWithShree. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-gray-600 hover:text-green-600 transition-colors duration-200">Terms & Conditions</Link>
              <Link href="/refunds" className="text-gray-600 hover:text-green-600 transition-colors duration-200">Refunds & Cancellations</Link>
              <Link href="/contact" className="text-gray-600 hover:text-green-600 transition-colors duration-200">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
} 