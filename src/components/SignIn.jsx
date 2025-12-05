import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGoogle, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

function SignIn() {
    const { login, error: authError } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            setError('');
            await login();
        } catch (err) {
            setError(err.message || 'Failed to sign in with Google');
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen py-20 bg-background-gray relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <div className="container mx-auto px-6 sm:px-8 relative z-10 flex flex-col items-center">
                
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="bg-white rounded-3xl mt-20 shadow-xl p-8 border border-gray-200"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white">C</span>
                            </div>
                            <h2 className="text-3xl font-bold mb-2 text-heading">
                                Welcome to Constructure AI
                            </h2>
                            <p className="text-body">
                                Sign in with your Google account to continue
                            </p>
                        </div>

                        {(error || authError) && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-between"
                            >
                                <span className="text-sm">{error || authError}</span>
                                <button onClick={() => setError('')}>
                                    <FaTimes />
                                </button>
                            </motion.div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full bg-white border-2 border-gray-300 text-heading py-4 rounded-xl font-medium hover:bg-gray-50 hover:border-primary transition duration-300 flex items-center justify-center gap-3 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaGoogle className="text-xl text-primary" />
                            <span>{loading ? 'Signing in...' : 'Sign in with Google'}</span>
                        </motion.button>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <p className="text-sm text-body text-center">
                                By signing in, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                <p className="text-sm text-blue-800 font-medium mb-2">
                                    What you can do with Constructure AI:
                                </p>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• Upload and manage construction documents</li>
                                    <li>• Search through all your documents instantly</li>
                                    <li>• Chat with AI about your projects</li>
                                    <li>• Collaborate with your team</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default SignIn;
// import { motion } from 'framer-motion';
// import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaTimes } from 'react-icons/fa';
// import api from '../api'; // ✅ Use shared axios instance

// function SignIn({ onSignIn }) {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       if (isSignUp) {
//         if (!formData.name || !formData.email || !formData.password) {
//           setError('All fields are required');
//           return;
//         }
//         if (formData.password !== formData.confirmPassword) {
//           setError('Passwords do not match');
//           return;
//         }

//         // ✅ Register API call
//         await api.post('/auth/register', {
//           name: formData.name,
//           email: formData.email,
//           password: formData.password
//         });

//         // ✅ Auto login after registration
//         const loginRes = await api.post('/auth/login', {
//           email: formData.email,
//           password: formData.password
//         });

//         const { token } = loginRes.data;
//         localStorage.setItem('token', token);

//         const userInfo = JSON.parse(atob(token.split('.')[1]));
//         const user = {
//           id: userInfo.id,
//           name: formData.name,
//           email: formData.email
//         };

//         onSignIn(user);
//       } else {
//         if (!formData.email || !formData.password) {
//           setError('Email and password are required');
//           return;
//         }

//         // ✅ Login API call
//         const res = await api.post('/auth/login', {
//           email: formData.email,
//           password: formData.password
//         });

//         const { token } = res.data;
//         localStorage.setItem('token', token);

//         const userInfo = JSON.parse(atob(token.split('.')[1]));
//         const user = {
//           id: userInfo.id,
//           name: userInfo.name || "User",
//           email: formData.email
//         };

//         onSignIn(user);
//       }
//     } catch (err) {
//       console.error('Auth error:', err);
//       setError(err.response?.data?.message || err.response?.data?.error || 'Authentication failed');
//     }
//   };

//   return (
//     <section className="min-h-screen py-20 bg-[#0e0e0e] text-[#90EE90] relative overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           className="absolute inset-0 bg-gradient-to-br from-[#90ee901a] via-transparent to-[#90ee9022]"
//           animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
//           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//         />
//       </div>

//       <div className="container mx-auto px-6 sm:px-8 relative z-10 flex flex-col items-center">
//         <img src="/logo.png" alt="CivicSense Logo" className="w-36 sm:w-48 mb-10 drop-shadow-[0_0_30px_rgba(144,238,144,0.25)]" />

//         <div className="w-full max-w-md">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
//           >
//             <div className="text-center mb-8">
//               <h2 className="text-3xl font-bold mb-2 text-heading">
//                 {isSignUp ? 'Create Account' : 'Welcome Back'}
//               </h2>
//               <p className="text-body">
//                 {isSignUp ? 'Join CivicSense Community' : 'Sign in to continue'}
//               </p>
//             </div>

//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center justify-between"
//               >
//                 <span>{error}</span>
//                 <button onClick={() => setError('')}>
//                   <FaTimes />
//                 </button>
//               </motion.div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {isSignUp && (
//                 <div className="relative">
//                   <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body" />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="Full Name"
//                     className="w-full pl-12 pr-4 py-3 bg-background-gray border border-gray-300 rounded-xl text-heading placeholder-body focus:outline-none focus:ring-2 focus:ring-primary/30"
//                     required
//                   />
//                 </div>
//               )}

//               <div className="relative">
//                 <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Email Address"
//                   className="w-full pl-12 pr-4 py-3 bg-background-gray border border-gray-300 rounded-xl text-heading placeholder-body focus:outline-none focus:ring-2 focus:ring-primary/30"
//                   required
//                 />
//               </div>

//               <div className="relative">
//                 <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body" />
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Password"
//                   className="w-full pl-12 pr-4 py-3 bg-background-gray border border-gray-300 rounded-xl text-heading placeholder-body focus:outline-none focus:ring-2 focus:ring-primary/30"
//                   required
//                 />
//               </div>

//               {isSignUp && (
//                 <div className="relative">
//                   <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-body" />
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleChange}
//                     placeholder="Confirm Password"
//                     className="w-full pl-12 pr-4 py-3 bg-background-gray border border-gray-300 rounded-xl text-heading placeholder-body focus:outline-none focus:ring-2 focus:ring-primary/30"
//                     required
//                   />
//                 </div>
//               )}

//               <motion.button
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 type="submit"
//                 className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary-dark transition duration-300 flex items-center justify-center gap-2 shadow-md"
//               >
//                 <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
//                 <FaArrowRight />
//               </motion.button>
//             </form>

//             <div className="mt-6 text-center">
//               <button
//                 onClick={() => {
//                   setIsSignUp(!isSignUp);
//                   setError('');
//                   setFormData({
//                     name: '',
//                     email: '',
//                     password: '',
//                     confirmPassword: ''
//                   });
//                 }}
//                 className="text-body hover:text-primary transition duration-300"
//               >
//                 {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default SignIn;
