import React from "react";
import Link from "next/link";

export default function TermsAndConditions() {
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
        <h1 className="text-4xl font-bold mb-8 text-center">Terms & Conditions</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="prose max-w-none">
            <p className="mb-6">
              Welcome to UpSkillWithShree. These terms and conditions outline the rules and regulations for the use of our website and services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing this website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of them, you must not use our website or services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">2. User Accounts</h2>
            <p className="mb-4">
              When you create an account with us, you guarantee that the information you provide is accurate, complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the immediate termination of your account.
            </p>
            <p className="mb-4">
              You are responsible for maintaining the confidentiality of your account and password, and for restricting access to your computer and/or account. You agree to accept responsibility for all activities that occur under your account or password.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">3. Services and Pricing</h2>
            <p className="mb-4">
              All services and diagnostic tests are priced in Indian Rupees (INR). We reserve the right to modify or discontinue any service without notice at any time.
            </p>
            <p className="mb-4">
              We shall not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">4. Payment Terms</h2>
            <p className="mb-4">
              We accept payments through various methods as indicated on our website. Payment must be received prior to the provision of services.
            </p>
            <p className="mb-4">
              All payments are processed securely through our payment gateway partners. We do not store your credit card information.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">5. Intellectual Property</h2>
            <p className="mb-4">
              The content, organization, graphics, design, compilation, and other matters related to the website are protected under applicable copyrights, trademarks, and other proprietary rights. Copying, redistribution, use, or publication by you of any such content is strictly prohibited without our express permission.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">6. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">7. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">8. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">9. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@upskillwithshree.com" className="text-green-600 hover:underline">legal@upskillwithshree.com</a>.
            </p>
            
            <p className="mt-8 text-sm text-gray-600">
              Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
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