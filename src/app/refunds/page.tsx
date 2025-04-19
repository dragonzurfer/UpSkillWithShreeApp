import React from "react";
import Link from "next/link";

export default function RefundsAndCancellations() {
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
        <h1 className="text-4xl font-bold mb-8 text-center">Refunds & Cancellations</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
          <div className="prose max-w-none">
            <p className="mb-6">
              At UpSkillWithShree, we strive to provide the highest quality services to our users. We understand that there may be situations where you might need to cancel a service or request a refund. This policy outlines our approach to refunds and cancellations.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">1. Diagnostic Test Cancellations</h2>
            <p className="mb-4">
              If you have purchased access to a diagnostic test and have not yet started the test, you may cancel and request a refund within 7 days of purchase. Once you have started a test, no refunds will be provided.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">2. Subscription Cancellations</h2>
            <p className="mb-4">
              For monthly subscriptions, you may cancel at any time. Your subscription will remain active until the end of the current billing period, after which it will not renew.
            </p>
            <p className="mb-4">
              For annual subscriptions, you may cancel within 14 days of purchase for a full refund, provided you have not accessed more than 20% of the available content. After 14 days, or if you have accessed more than 20% of the content, no refunds will be provided for the remaining subscription period.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">3. Coaching Session Cancellations</h2>
            <p className="mb-4">
              For one-on-one coaching sessions:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Cancellations made more than 48 hours before the scheduled session will receive a full refund.</li>
              <li className="mb-2">Cancellations made between 24 and 48 hours before the scheduled session will be charged 50% of the session fee.</li>
              <li className="mb-2">Cancellations made less than 24 hours before the scheduled session will not be eligible for a refund.</li>
              <li className="mb-2">If you need to reschedule a session, please do so at least 24 hours in advance to avoid any penalties.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">4. How to Request a Refund</h2>
            <p className="mb-4">
              To request a refund, please contact our support team at <a href="mailto:dragonzurfer@gmail.com" className="text-green-600 hover:underline">dragonzurfer@gmail.com</a> with the following information:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Your full name</li>
              <li className="mb-2">Email address associated with your account</li>
              <li className="mb-2">Order number or transaction ID</li>
              <li className="mb-2">Reason for the refund request</li>
              <li className="mb-2">Date of purchase</li>
            </ul>
            <p className="mb-4">
              We will review your request and respond within 3 business days.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">5. Refund Processing</h2>
            <p className="mb-4">
              Approved refunds will be processed within 7-10 business days. The refund will be issued to the original payment method used for the purchase. Please note that it may take additional time for the refund to appear in your account, depending on your payment provider.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">6. Special Circumstances</h2>
            <p className="mb-4">
              We understand that exceptional circumstances may arise. If you experience technical issues that significantly impact your ability to use our services, or if there are other extenuating circumstances, please contact us, and we will review your case individually.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">7. Changes to This Policy</h2>
            <p className="mb-4">
              We reserve the right to modify this refund policy at any time. Any changes to our refund policy will be posted on this page and will become effective immediately upon posting.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4 text-green-700">8. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about our refund and cancellation policies, please contact us at <a href="mailto:dragonzurfer@gmail.com" className="text-green-600 hover:underline">dragonzurfer@gmail.com</a>.
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