import React from "react";
import { motion } from "framer-motion";

const journeyStats = [
  {
    icon: "📐",
    title: "Documents Processed",
    subtext: "10,000+ drawings & models analyzed",
  },
  {
    icon: "⚡",
    title: "Time Saved",
    subtext: "75% faster document search",
  },
  {
    icon: "🏗️",
    title: "Projects Managed",
    subtext: "500+ active construction sites",
  },
  {
    icon: "👥",
    title: "Team Collaboration",
    subtext: "1,200+ architects & engineers",
  },
];

const OurJourney = () => {
  return (
    <section className="bg-background-light py-16 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 md:p-12 mb-8 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-heading mb-4 uppercase tracking-wide">
            WE'VE CRACKED THE CODE
          </h2>
          <p className="text-lg text-body max-w-2xl mx-auto">
            To understand your construction documents in seconds
          </p>
        </motion.div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
          
          {/* Large stat card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="md:col-span-3 bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-primary hover:shadow-xl transition-all group"
          >
            <div className="text-6xl md:text-7xl mb-4">{journeyStats[0].icon}</div>
            <h3 className="font-bold text-2xl md:text-3xl text-heading mb-2 leading-snug">
              {journeyStats[0].title}
            </h3>
            <p className="text-base text-body font-medium">{journeyStats[0].subtext}</p>
            <div className="mt-6 flex items-center text-primary font-bold">
              <span className="text-4xl">1,275</span>
              <span className="ml-2 text-sm">↗ +12%</span>
            </div>
          </motion.div>

          {/* Medium stat card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="md:col-span-3 bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="text-6xl md:text-7xl mb-4">{journeyStats[1].icon}</div>
            <h3 className="font-bold text-2xl md:text-3xl mb-2 leading-snug">
              {journeyStats[1].title}
            </h3>
            <p className="text-base text-white/90 font-medium">{journeyStats[1].subtext}</p>
            <div className="mt-6 flex items-center font-bold">
              <span className="text-4xl">892</span>
              <span className="ml-2 text-sm">↗ +8%</span>
            </div>
          </motion.div>

          {/* Small stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="text-5xl mb-3">{journeyStats[2].icon}</div>
            <h3 className="font-bold text-lg text-heading mb-2">
              {journeyStats[2].title}
            </h3>
            <p className="text-sm text-body">{journeyStats[2].subtext}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all"
          >
            <div className="text-5xl mb-3">{journeyStats[3].icon}</div>
            <h3 className="font-bold text-lg text-heading mb-2">
              {journeyStats[3].title}
            </h3>
            <p className="text-sm text-body">{journeyStats[3].subtext}</p>
          </motion.div>

          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-background-gray rounded-3xl p-6 flex flex-col items-center justify-center text-center"
          >
            <div className="text-xl md:text-2xl font-bold text-heading mb-2">
              Building smarter.
            </div>
            <div className="text-lg font-bold text-primary">
              One project at a time.
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default OurJourney;
