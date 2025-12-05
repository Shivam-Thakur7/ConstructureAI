import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaMapMarkerAlt } from 'react-icons/fa';

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Constructure AI?",
      answer: "Constructure AI is an AI-powered platform for construction teams to search, extract, and collaborate across construction drawings, PDFs, and BIM models. It understands your construction documents and helps you find information in seconds."
    },
    {
      question: "What types of documents can I upload?",
      answer: "You can upload Revit models, PDFs, construction drawings, specifications, and any construction-related documents. Our AI processes and indexes everything for instant search and collaboration."
    },
    {
      question: "How does the AI search work?",
      answer: "Simply ask plain-language questions like 'What's the ceiling height in Room 109?' or 'Find all electrical specifications.' The AI searches across all your documents, models, and even emails to provide accurate answers instantly."
    },
    {
      question: "How does version control work?",
      answer: "Every document upload is automatically versioned. You can track all revisions, see what changed, and ensure architects, engineers, and contractors are always working from the latest version."
    },
    {
      question: "Is my construction data secure?",
      answer: "Yes, we use enterprise-grade encryption and security protocols. Your construction documents and BIM models are stored securely and only accessible by your authorized team members."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background-gray font-sans px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 md:p-12 mb-8 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Everything you need to know about Constructure AI
          </p>
        </motion.div>

        {/* Bento Grid FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden ${
                index === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 md:p-8 flex items-start justify-between text-left hover:bg-background-gray/50 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-primary text-xl" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-heading mb-2">
                      {faq.question}
                    </h3>
                    {openIndex !== index && (
                      <p className="text-sm text-body line-clamp-2">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 flex-shrink-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <FaChevronDown className="text-primary text-sm" />
                  </div>
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-6 md:pb-8 text-body leading-relaxed text-base ml-16">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-200 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-heading mb-4">
            Still have questions?
          </h3>
          <p className="text-body mb-6 max-w-xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all">
            Contact Support
          </button>
        </motion.div>

      </div>
    </section>
  );
}

export default FAQ;
