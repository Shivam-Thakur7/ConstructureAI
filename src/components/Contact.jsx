import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  function formSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    fetch("https://getform.io/f/amdkwqmb", {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" },
    })
    .then((response) => {
      console.log(response);
      document.getElementById('form').reset();
    })
    .catch((error) => console.log(error));
  }

  useEffect(() => {
    const form = document.getElementById("form");
    form.addEventListener("submit", formSubmit);
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background-light font-sans px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-8 md:p-12 mb-8 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto">
            Ready to streamline your construction workflow? Let's talk about how Constructure AI can help your team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          
          {/* Contact Info Cards */}
          {[
            {
              icon: <FaEnvelope className="text-2xl text-primary" />,
              title: "Email",
              info: "ayan@constructureai.com",
              span: 4
            },
            {
              icon: <FaPhone className="text-2xl text-primary" />,
              title: "Phone",
              info: "+1 (555) 123-4567",
              span: 4
            },
            {
              icon: <FaMapMarkerAlt className="text-2xl text-primary" />,
              title: "Location",
              info: "San Francisco, CA",
              span: 4
            }
          ].map(({ icon, title, info, span }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`md:col-span-${span} bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-heading">{title}</h3>
                <p className="text-body text-sm">{info}</p>
              </div>
            </motion.div>
          ))}

          {/* Contact Form - Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-12 bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-200"
          >
            <form method="POST" acceptCharset="UTF-8" id="form" className="space-y-6">
              {["name", "email", "subject"].map((field, i) => (
                <div key={i}>
                  <label htmlFor={field} className="block text-sm font-medium mb-2 capitalize text-heading">
                    {field}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-background-gray border border-gray-300 text-heading focus:outline-none focus:ring-2 focus:ring-primary/50 transition duration-300"
                  />
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2 text-heading">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background-gray border border-gray-300 text-heading focus:outline-none focus:ring-2 focus:ring-primary/50 transition duration-300"
                ></textarea>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-primary text-white px-8 py-4 rounded-xl font-medium shadow hover:shadow-lg hover:bg-primary-dark transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Send Message</span>
                <FaPaperPlane className="text-lg" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Contact;