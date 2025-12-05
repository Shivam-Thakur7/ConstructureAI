import React from 'react';
import { FaLinkedin, FaEnvelope, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-16 font-sans bg-background-light px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Logo and Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-4"
          >
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="Constructure AI Logo" 
                className="w-30 h-15 object-contain"
              />
             
            </div>
            
            <div className="flex space-x-3 mt-6">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center transition-colors group"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="text-body group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center transition-colors group"
                aria-label="Email"
              >
                <FaEnvelope className="text-body group-hover:text-primary transition-colors" />
              </a>
            </div>
          </motion.div>

          {/* Product Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-4"
          >
            <h3 className="text-lg font-bold text-heading mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-body hover:text-primary transition-colors">
                  Integrations
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Company Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-4"
          >
            <h3 className="text-lg font-bold text-heading mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-body hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-body hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-body">
            © {currentYear} ConstructureAI. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-body hover:text-primary transition-colors">
              Privacy Policy
            </a>
            
            {/* Scroll to Top Button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary/10 flex items-center justify-center transition-colors group"
              aria-label="Scroll to top"
            >
              <FaArrowUp className="text-body group-hover:text-primary transition-colors" />
            </button>
          </div>
        </motion.div>

      </div>
    </footer>
  );
};

export default Footer;
