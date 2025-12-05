import React, { useState } from 'react';
import { motion } from 'framer-motion';

const stakeholders = [
  {
    id: 1,
    title: 'Architects',
    icon: '📐',
    color: 'from-primary to-primary-dark',
    benefits: [
      'Keep design intent clear across every revision.',
      'Search details across drawings, PDFs, and BIM in one place.',
      'Share source-linked answers with engineers and contractors.'
    ]
  },
  {
    id: 2,
    title: 'Engineers',
    icon: '⚙️',
    color: 'from-blue-500 to-blue-700',
    benefits: [
      'Tie calculations back to the exact sheets and models.',
      'Jump from a question to the right view, section, or model element.',
      'Track changes across versions so nothing slips through.'
    ]
  },
  {
    id: 3,
    title: 'Contractors & Subs',
    icon: '🔨',
    color: 'from-green-500 to-green-700',
    benefits: [
      'Pull the right install detail without chasing email threads.',
      'Link or sync with current tools (Autodesk, Procore, Bluebeam, email).',
      'Reduce manual RFIs by answering common questions in seconds.'
    ]
  },
  {
    id: 4,
    title: 'Clients & Owners',
    icon: '🏢',
    color: 'from-purple-500 to-purple-700',
    benefits: [
      "One clear picture of what's being built.",
      'View decisions and specs from a single, shared source of truth.',
      'Give access without forcing them to learn complex project software.'
    ]
  }
];

const Stakeholders = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-background-light px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            The future of collaboration
          </h2>
          <p className="text-lg md:text-xl text-body max-w-3xl">
            Built for AEC teams and their clients. Everyone works off the same project data, without learning yet another heavy platform.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Left Side - Stakeholder Cards */}
          <div className="md:col-span-5 space-y-4">
            {stakeholders.map((stakeholder, index) => (
              <motion.div
                key={stakeholder.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveIndex(index)}
                className={`relative bg-white rounded-3xl p-6 shadow-lg border-2 cursor-pointer transition-all duration-300 ${
                  activeIndex === index 
                    ? 'border-primary scale-105 shadow-xl' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                    activeIndex === index ? stakeholder.color : 'from-gray-100 to-gray-200'
                  } flex items-center justify-center text-3xl transition-all duration-300`}>
                    {activeIndex === index ? stakeholder.icon : stakeholder.id}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold transition-colors ${
                      activeIndex === index ? 'text-primary' : 'text-heading'
                    }`}>
                      {stakeholder.title}
                    </h3>
                  </div>
                </div>
                
                {/* Active indicator */}
                {activeIndex === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right Side - Benefits Display */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-7 bg-gradient-to-br from-background-gray to-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-200"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stakeholders[activeIndex].color} flex items-center justify-center text-4xl mb-6 shadow-lg`}>
              {stakeholders[activeIndex].icon}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-heading mb-6">
              {stakeholders[activeIndex].title}
            </h3>

            <div className="space-y-4">
              {stakeholders[activeIndex].benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-primary text-sm font-bold">✓</span>
                  </div>
                  <p className="text-body text-base md:text-lg leading-relaxed">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Additional Info Box */}
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/20">
              <p className="text-sm text-body italic">
                {activeIndex === 0 && "Keep your design vision intact from concept to completion."}
                {activeIndex === 1 && "Every calculation linked to source documents for full traceability."}
                {activeIndex === 2 && "Spend less time searching, more time building."}
                {activeIndex === 3 && "Stay informed without the complexity of traditional project tools."}
              </p>
            </div>
          </motion.div>

        </div>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-10 text-center text-white shadow-xl"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to transform your workflow?
          </h3>
          <p className="text-white/90 text-lg mb-6">
            Join leading construction teams using Constructure AI
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-primary px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Schedule a Demo →
          </motion.button>
        </motion.div>

      </div>
    </section>
  );
};

export default Stakeholders;
