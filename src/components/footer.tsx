import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-yellow-400 py-14 px-6 border-t border-yellow-900/40 shadow-inner mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
        {/* Padhai Buddy Info */}
        <div>
          <h2 className="text-lg font-bold text-yellow-300 mb-3">
            Padhai Buddy{" "}
            <span role="img" aria-label="books and sparkles">
              📚✨
            </span>
          </h2>
          <p className="text-yellow-200 leading-relaxed">
            Your AI-powered study companion that helps you read, simplify,
            summarize, translate, and understand any text easily — even
            hands-free.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-yellow-300 mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#home"
                className="hover:underline focus:underline transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:underline focus:underline transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:underline focus:underline transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:underline focus:underline transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Socials */}
        <div>
          <h3 className="font-semibold text-yellow-300 mb-3">
            Connect with Us
          </h3>
          <ul className="space-y-2">
            <li>
              Email:{" "}
              <a
                href="mailto:hello@padhaibuddy.ai"
                className="hover:underline focus:underline transition-colors"
              >
                hello@padhaibuddy.ai
              </a>
            </li>
            <li>
              Instagram:{" "}
              <a
                href="https://instagram.com/padhaibuddy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus:underline transition-colors"
              >
                @padhaibuddy
              </a>
            </li>
            <li>
              Twitter:{" "}
              <a
                href="https://twitter.com/padhaibuddy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus:underline transition-colors"
              >
                @padhaibuddy
              </a>
            </li>
            <li>
              GitHub:{" "}
              <a
                href="https://github.com/padhaibuddy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline focus:underline transition-colors"
              >
                /padhaibuddy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-yellow-600 border-t border-yellow-800 pt-5 text-xs tracking-wide">
        &copy; {new Date().getFullYear()} Padhai Buddy. Built with{" "}
        <span role="img" aria-label="yellow heart">
          💛
        </span>{" "}
        by Team Noah.
      </div>
    </footer>
  );
};

export default Footer;
