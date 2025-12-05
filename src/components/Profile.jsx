import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaRobot, FaEnvelopeOpen, FaChartLine, FaEdit } from 'react-icons/fa';

function Profile({ user }) {
    if (!user) {
        return (
            <section className="min-h-screen py-20 bg-background-gray relative overflow-hidden">
                <div className="container mx-auto px-6 sm:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h2 className="text-4xl font-bold text-heading mb-4">Please Sign In</h2>
                        <p className="text-body mb-8">
                            Sign in to access your email assistant profile
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '#login'}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary-dark transition-colors duration-300"
                        >
                            Sign In Now
                        </motion.button>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen py-20 bg-[#f3eee5] relative overflow-hidden">
            {/* Animated background patterns */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYuMjUgMzUuMjVhMi4yNSAyLjI1IDAgMTAwLTQuNSAyLjI1IDIuMjUgMCAwMDAgNC41eiIgZmlsbD0iIzI1MWMxYSIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L2c+PC9zdmc+')] opacity-10"></div>
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-[#251c1a]/5 via-transparent to-[#3a2e2b]/5"
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            <div className="container mx-auto px-6 sm:px-8 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                    >
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center mx-auto">
                                <FaUser className="text-6xl text-white" />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg"
                            >
                                <FaEdit className="text-primary" />
                            </motion.button>
                        </div>
                        <h2 className="text-4xl font-bold text-heading mb-4">
                            Welcome back, {user.name}!
                        </h2>
                        <p className="text-body">
                            Your AI Email Assistant Dashboard
                        </p>
                    </motion.div>

                    {/* Profile Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <h3 className="text-2xl font-bold text-heading mb-6">Account Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FaUser className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-body">Full Name</p>
                                        <p className="font-medium text-heading">{user.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <FaEnvelope className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-body">Email</p>
                                        <p className="font-medium text-heading">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Email Stats */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-xl p-8"
                        >
                            <h3 className="text-2xl font-bold text-heading mb-6">Email Activity</h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <FaEnvelopeOpen className="text-2xl text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-heading mb-1">0</p>
                                    <p className="text-sm text-body">Emails Read</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <FaRobot className="text-2xl text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-heading mb-1">0</p>
                                    <p className="text-sm text-body">AI Replies</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <FaChartLine className="text-2xl text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-heading mb-1">0</p>
                                    <p className="text-sm text-body">Categorized</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                        <FaEnvelope className="text-2xl text-primary" />
                                    </div>
                                    <p className="text-3xl font-bold text-heading mb-1">0</p>
                                    <p className="text-sm text-body">Sent</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-8 bg-white rounded-2xl shadow-xl p-8"
                    >
                        <h3 className="text-2xl font-bold text-heading mb-6">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => window.location.href = '/dashboard'}
                                className="bg-primary/10 hover:bg-primary/20 text-primary py-4 px-6 rounded-xl font-medium transition-colors"
                            >
                                Go to Dashboard
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-primary/10 hover:bg-primary/20 text-primary py-4 px-6 rounded-xl font-medium transition-colors"
                            >
                                Email Settings
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-primary/10 hover:bg-primary/20 text-primary py-4 px-6 rounded-xl font-medium transition-colors"
                            >
                                View Analytics
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default Profile; 