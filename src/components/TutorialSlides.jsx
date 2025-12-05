import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

const slides = [
  {
    title: 'Welcome to Constructure AI 🏗️',
    description: "Let's get started with AI-powered construction document management.",
    videoSrc: '/Video 1.mp4'
  },
  {
    title: 'Upload Documents 📄',
    description: "Drag and drop your Revit models, PDFs, drawings, and specifications — our AI will index everything!",
    videoSrc: '/Video 2.mp4'
  },
  {
    title: 'Ask Questions 🔍',
    description: 'Search using plain language. Ask about room dimensions, materials, or any specification.',
    videoSrc: '/Video 3.mp4'
  },
  {
    title: 'Collaborate & Track 🤝',
    description: 'Share answers with your team, track revisions, and keep everyone aligned.',
    videoSrc: '/Video 4.mp4'
  }
];

export default function TutorialSlides({ onClose }) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 overflow-hidden">
        
        {/* Exit Button */}
        <button
          onClick={() => {
            if (typeof onClose === 'function') onClose();
          }}
          className="absolute top-4 right-4 text-primary hover:text-primary-dark transition"
        >
          <X size={24} />
        </button>

        {/* Slide Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="rounded-xl w-full h-56 mb-6 overflow-hidden flex items-center justify-center bg-black">
              <video
                src={slides[step].videoSrc}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover rounded-xl"
                style={{ transform: 'scale(1.5)', borderRadius: '12px' }}
              />
            </div>

            <h2 className="text-3xl font-bold text-heading mb-4">
              {slides[step].title}
            </h2>
            <p className="text-body text-lg">{slides[step].description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-10">
          <button
            onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
            disabled={step === 0}
            className="flex items-center gap-2 bg-gray-200 text-heading px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ArrowLeft size={18} /> Back
          </button>

          {step < slides.length - 1 ? (
            <button
              onClick={() => setStep((prev) => Math.min(prev + 1, slides.length - 1))}
              className="flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-white font-semibold hover:bg-primary-dark transition-all"
            >
              Next <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => {
                if (typeof onClose === 'function') onClose();
              }}
              className="bg-primary px-6 py-2 rounded-lg font-medium text-white hover:bg-primary-dark transition-all"
            >
              Done
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === step ? 'bg-[#b1f22a] scale-110' : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
