import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-yellow-400 py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        {/* Padhai Buddy Info */}
        <div>
          <h2 className="text-lg font-bold text-yellow-300 mb-2">Padhai Buddy 📚✨</h2>
          <p className="text-yellow-200">
            Your AI-powered study companion that helps you read, simplify, summarize, translate, and understand any text easily — even hands-free.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-yellow-300 mb-2">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#home" className="hover:underline">Home</a></li>
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#about" className="hover:underline">About</a></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="font-semibold text-yellow-300 mb-2">Connect with Us</h3>
          <ul className="space-y-2">
            <li>Email: <a href="mailto:hello@padhaibuddy.ai" className="hover:underline">hello@padhaibuddy.ai</a></li>
            <li>Instagram: <a href="https://instagram.com/padhaibuddy" target="_blank" className="hover:underline">@padhaibuddy</a></li>
            <li>Twitter: <a href="https://twitter.com/padhaibuddy" target="_blank" className="hover:underline">@padhaibuddy</a></li>
            <li>GitHub: <a href="https://github.com/padhaibuddy" target="_blank" className="hover:underline">/padhaibuddy</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center text-yellow-600 border-t border-yellow-800 pt-4 text-xs">
        &copy; {new Date().getFullYear()} Padhai Buddy. Built with 💛 by Team Noah.
      </div>
    </footer>
  );
};

export default Footer;
