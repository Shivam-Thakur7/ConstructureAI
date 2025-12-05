import React, { useState, useEffect } from 'react';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ user, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path) => {
    if (path.startsWith('/#')) {
      const sectionId = path.slice(2);
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/report' },
    { name: 'How It Works', path: '/#about' },
    { name: 'Testimonials', path: '/#testimonials' },
    { name: 'FAQ', path: '/#faq' },
    { name: 'Contact', path: '/#contact' },
    ...(user
      ? [
          { name: user.name, icon: <FaUser />, path: '/profile' },
          { name: 'Sign Out', icon: <FaSignOutAlt />, onClick: onSignOut },
        ]
      : [{ name: 'Sign In', icon: <FaUser />, path: '/signin' }]),
  ];

  const isActive = (path) => {
    if (!path) return false;
    if (path.startsWith('/#')) {
      const hash = `#${path.slice(2)}`;
      return location.pathname === '/' && window.location.hash === hash;
    }
    return location.pathname === path;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8"
    >
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xl'
          : 'bg-white/90 shadow-lg'
      } rounded-full border border-gray-200/50`}>
        <div className="flex justify-between items-center h-16 px-6">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <img
              src="/logo.png"
              alt="CivicSense Logo"
              className="w-40 h-15 rounded-lg"
            />
           
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center bg-background-gray rounded-full px-2 py-2 space-x-1">
            {navItems.slice(0, -1).map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={item.onClick || (() => handleNavigation(item.path))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-white text-heading shadow-sm'
                    : 'text-body hover:text-heading'
                }`}
              >
                <span>{item.name}</span>
              </motion.button>
            ))}
          </div>

          {/* CTA Button or User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation('/profile')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-background-gray text-heading font-medium hover:bg-gray-200 transition-all"
                >
                  <FaUser size={14} />
                  <span className="text-sm">{user.name}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onSignOut}
                  className="p-2.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-all"
                >
                  <FaSignOutAlt size={16} />
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('/signin')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-all shadow-md"
              >
                <span className="text-sm">Sign in</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-background-gray text-heading transition-all"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </motion.button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200/50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={item.onClick || (() => handleNavigation(item.path))}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'bg-background-gray text-heading hover:bg-gray-200'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;
