import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShieldAlt, FaUsers } from "react-icons/fa";
import TutorialSlides from "./TutorialSlides"; 

const Hero = () => {
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <section className="relative py-24 px-4 md:px-8 lg:px-12 overflow-hidden bg-background-gray">
      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Main Hero Card - Large */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-8 bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden min-h-[400px] md:min-h-[500px] flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold leading-tight mb-6"
              >
                Structure your<br />
                 <span className="text-white/90">Pre-Construction</span> process
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-white/90 mb-8 max-w-xl"
              >
                An AI platform for Construction teams to search, extract, and collaborate across construction drawings, and BIM models
              </motion.p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTutorial(true)}
                className="bg-white text-primary hover:bg-white/90 transition px-8 py-4 rounded-full font-bold shadow-xl"
              >
                Get Started →
              </motion.button>
            </div>
          </motion.div>

          {/* Platform Mockup - Medium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 flex items-center justify-center"
          >
            <img 
              src="/model2.png" 
              alt="Constructure AI Mobile App" 
              className="w-full h-auto max-w-[200px] object-contain"
            />
          </motion.div>

          {/* Feature Cards - Small */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">Upload Documents</h3>
            <p className="text-sm text-body">Drag in Revit models, PDFs, drawings, and specs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">Search Everything</h3>
            <p className="text-sm text-body">Ask questions and search across plans, documents, and models</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-3xl">🔄</span>
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">Stay in Sync</h3>
            <p className="text-sm text-body">Share answers, track revisions, and keep teams aligned</p>
          </motion.div>

          {/* Laptop Mockup - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="md:col-span-12 bg-gradient-to-br from-background-gray to-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 overflow-hidden"
          >
            <img 
              src="/model1.png" 
              alt="Constructure AI Platform Dashboard" 
              className="w-full h-auto object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>

        </div>
      </div>

      {/* Tutorial Slides Overlay */}
      {showTutorial && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-80"
        >
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-heading font-bold text-xl hover:text-primary"
              onClick={() => setShowTutorial(false)}
            >
              ×
            </button>
            <TutorialSlides />
             {/* Show TutorialSlides as a modal */}
      {showTutorial && (
        <TutorialSlides onClose={() => setShowTutorial(false)} />
      )}
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;
