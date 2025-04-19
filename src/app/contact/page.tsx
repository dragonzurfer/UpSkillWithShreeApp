import React from "react";
import Link from "next/link";

export default function ContactUs() {
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
                <Link href="/products" className="text-gray-700 hover:text-green-600 transition-colors duration-200">
                  1:1 One on One
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto my-12 px-8 md:px-0 w-full">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                We're here to help and answer any question you might have. We look forward to hearing from you!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Email</h3>
                    <p className="text-gray-600">dragonzurfer@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Location</h3>
                    <p className="text-gray-600">Bengaluru, Karnataka, India</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 bg-green-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">Business Hours</h3>
                    <p className="text-gray-600">Monday – Friday: 9AM – 5PM IST</p>
                    <p className="text-gray-600">Saturday & Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-green-700">Send a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-green-600 to-green-800 text-white font-medium py-2 px-6 rounded-lg hover:shadow-lg transition duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full py-8 bg-white border-t border-gray-200 mt-auto">
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