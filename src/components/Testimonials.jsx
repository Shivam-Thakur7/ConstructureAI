import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Project Manager',
    company: 'Turner Construction',
    image: 'https://i.pinimg.com/474x/57/98/78/5798782f9d8f580266d08521f3d507d5.jpg',
    quote: 'Constructure AI has cut our document search time by 75%. Finding specs and revisions is now instant.',
    rating: 5
  },
  {
    name: 'David Chen',
    role: 'Senior Architect',
    company: 'Gensler',
    image: 'https://i.pinimg.com/474x/47/01/77/470177c3c1d29dd0e95d9079bac12a19.jpg',
    quote: 'The AI chat feature is incredible. It understands our BIM models and answers complex queries instantly.',
    rating: 5
  },
  {
    name: 'Maria Rodriguez',
    role: 'Construction Engineer',
    company: 'Bechtel',
    image: 'https://i.pinimg.com/474x/5a/fd/5d/5afd5d03dbd8b8ad527414d10da74595.jpg',
    quote: 'Finally, a platform that keeps our entire team on the same page. No more version conflicts!',
    rating: 5
  },
  {
    name: 'James Thompson',
    role: 'MEP Coordinator',
    company: 'Skanska',
    image: 'https://i.pinimg.com/474x/f0/4b/c7/f04bc7f4b16a2fc94078139ad03e6f88.jpg',
    quote: 'Searching through thousands of drawings used to take hours. Now it takes seconds with Constructure AI.',
    rating: 5
  },
  {
    name: 'Emily Park',
    role: 'BIM Manager',
    company: 'HOK',
    image: 'https://i.pinimg.com/474x/1f/5e/01/1f5e011e9b8dc817c581ad6f64819c6e.jpg',
    quote: 'The version tracking and collaboration features have transformed how our team works together.',
    rating: 5
  },
  {
    name: 'Michael Johnson',
    role: 'General Contractor',
    company: 'DPR Construction',
    image: 'https://i.pinimg.com/474x/83/8b/24/838b2427d975b902e9e63a11269d8606.jpg',
    quote: "Game-changing technology for construction. It's like having an expert assistant for every project.",
    rating: 5
  }
];

const Testimonial = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const preload = testimonials.map(t => {
      return new Promise((res, rej) => {
        const img = new Image();
        img.src = t.image;
        img.onload = res;
        img.onerror = rej;
      });
    });
    Promise.all(preload).then(() => setImagesLoaded(true));
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imagesLoaded]);

  return (
    <section className="bg-background-light py-16 md:py-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-heading mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            Real stories from real people making a difference
          </p>
        </motion.div>

        {!imagesLoaded ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
            
            {/* Featured Large Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 md:p-10 shadow-xl"
            >
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-white" />
                    ))}
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{testimonials[activeIndex].name}</h3>
                  <p className="text-white/80 text-sm">
                    {testimonials[activeIndex].role} • {testimonials[activeIndex].company}
                  </p>
                </div>
              </div>
              <FaQuoteLeft className="text-4xl text-white/30 mb-4" />
              <p className="text-xl md:text-2xl font-medium leading-relaxed">
                "{testimonials[activeIndex].quote}"
              </p>
            </motion.div>

            {/* Side Testimonial Cards */}
            <div className="md:col-span-4 space-y-4">
              {testimonials.slice(0, 2).map((t, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-all"
                  onClick={() => setActiveIndex(idx)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-heading text-sm">{t.name}</h4>
                      <p className="text-xs text-body">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={12} className="text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-body line-clamp-3">"{t.quote}"</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom Testimonial Cards */}
            {testimonials.slice(2, 5).map((t, idx) => (
              <motion.div
                key={idx + 2}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (idx + 2) * 0.1 }}
                className="md:col-span-4 bg-white rounded-2xl p-6 shadow-lg border border-gray-200 cursor-pointer hover:shadow-xl transition-all"
                onClick={() => setActiveIndex(idx + 2)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-heading text-sm">{t.name}</h4>
                    <p className="text-xs text-body">{t.role}</p>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} size={12} className="text-primary" />
                  ))}
                </div>
                <p className="text-sm text-body line-clamp-2">"{t.quote}"</p>
              </motion.div>
            ))}

          </div>
        )}

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-primary w-8' : 'bg-primary/30 w-2'
              }`}
            />
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          .animate-gradient {
            background-size: 200% auto;
            animation: shimmer 5s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Testimonial;
