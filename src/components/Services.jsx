import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const features = [
  {
    title: 'Upload Documents',
    description: 'Drag in Revit models, PDFs, drawings, and specs to your project in seconds.',
    image: 'model1.png',
    alt: 'Upload construction documents',
  },
  {
    title: 'Search Across Everything',
    description: 'Ask plain-language questions and search across plans, documents, models, and emails in one place.',
    image: 'model2.png',
    alt: 'AI-powered search interface',
  },
  {
    title: 'AI Chat Assistant',
    description: 'Get instant answers about room dimensions, materials, and specifications from your construction documents.',
    image: 'model1.png',
    alt: 'AI chat for construction',
  },
  {
    title: 'Version Control',
    description: 'Track revisions automatically and keep architects, engineers, and contractors aligned on the same source of truth.',
    image: 'model2.png',
    alt: 'Document version control',
  },
  {
    title: 'Real-time Collaboration',
    description: 'Share answers, annotations, and updates across your entire construction team instantly.',
    image: 'model1.png',
    alt: 'Team collaboration dashboard',
  },
];

const FeatureCard = ({ feature, index, activeIndex, setActiveIndex }) => {
  const [ref, inView] = useInView({
    threshold: 0.5,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView) {
      setActiveIndex(index);
    }
  }, [inView, index, setActiveIndex]);

  return (
    <motion.div
      ref={ref}
      key={feature.title}
      className={`p-6 rounded-xl snap-start transition-transform duration-300 border-2 ${
        index === activeIndex
          ? 'bg-white shadow-xl scale-105 border-primary'
          : 'opacity-60 bg-white/60 border-transparent'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <h3 className="text-2xl font-bold text-heading">{feature.title}</h3>
      <p className="text-body mt-2">{feature.description}</p>
    </motion.div>
  );
};

const FeaturesShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="w-full bg-background-gray py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-4">
            Powerful Features for Construction Teams
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Everything you need to streamline your pre-construction process
          </p>
        </motion.div>

        {/* Bento Grid Features */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Large Feature Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-7 bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-primary hover:shadow-xl transition-all group cursor-pointer"
            onClick={() => setActiveIndex(0)}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-heading mb-3">
                  {features[0].title}
                </h3>
                <p className="text-body text-base md:text-lg">
                  {features[0].description}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 ml-4">
                <span className="text-2xl">📍</span>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">GPS Enabled</span>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Real-time</span>
            </div>
          </motion.div>

          {/* Medium Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-5 bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setActiveIndex(1)}
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              {features[1].title}
            </h3>
            <p className="text-white/90">
              {features[1].description}
            </p>
          </motion.div>

          {/* Small Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setActiveIndex(2)}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🗺️</span>
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">
              {features[2].title}
            </h3>
            <p className="text-sm text-body">
              {features[2].description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setActiveIndex(3)}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">
              {features[3].title}
            </h3>
            <p className="text-sm text-body">
              {features[3].description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-4 bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all cursor-pointer"
            onClick={() => setActiveIndex(4)}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-bold text-heading mb-2">
              {features[4].title}
            </h3>
            <p className="text-sm text-body">
              {features[4].description}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export { FeaturesShowcase as Services };
export default FeaturesShowcase;
