// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Hero from './components/Hero';
// import About from './components/About';
// import FAQ from './components/FAQ';
// import Footer from './components/Footer';
// import Testimonials from './components/Testimonials';
// import Profile from './components/Profile';
// import SignIn from './components/SignIn';
// import Contact from './components/Contact';
// import Services from './components/Services';
// import { motion, AnimatePresence } from 'framer-motion';
// import TutorialSlides from './components/TutorialSlides';
// import CivicReporter from './components/CivicReporter';


// import AdminDashboard from './components/AdminDashboard';

// <Route path="/admin" element={<AdminDashboard />} />

// function MainContent() {
// 	const [user, setUser] = useState(null);
// 	const [showWelcome, setShowWelcome] = useState(false);
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const loggedInUser = localStorage.getItem('user');
// 		if (loggedInUser) {
// 			setUser(JSON.parse(loggedInUser));
// 		}
// 	}, []);

// 	const handleSignIn = (userData) => {
// 		setUser(userData);
// 		localStorage.setItem('user', JSON.stringify(userData));
// 		setShowWelcome(true);
// 		navigate('/');
// 		setTimeout(() => setShowWelcome(false), 5000);
// 	};


// 	const handleSignOut = () => {
// 		setUser(null);
// 		localStorage.removeItem('user');
// 		navigate('/');
// 	};

// 	return (
// 		<>
// 			<Navbar user={user} onSignOut={handleSignOut} />

// 			{/* Welcome Message */}
// 			<AnimatePresence>
// 				{showWelcome && (
// 					<motion.div
// 						initial={{ opacity: 0, y: -50 }}
// 						animate={{ opacity: 1, y: 0 }}
// 						exit={{ opacity: 0, y: -50 }}
// 						className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#251c1a] text-white px-6 py-3 rounded-full shadow-lg"
// 					>
// 						<span className="font-medium">Welcome back, {user?.name}! 👋</span>
// 					</motion.div>
// 				)}
// 			</AnimatePresence>

// 			<Routes>
// 				<Route path="/" element={
// 					<>
// 						<section id="hero"><Hero /></section>
// 						<section id="services"><Services /></section>
// 						<section id="about"><About /></section>
// 						<section id="testimonials"><Testimonials /></section>
// 						<section id="faq"><FAQ /></section>
// 						<section id="contact"><Contact /></section>
// 						<Footer />
// 					</>
// 				} />
// 				<Route path="/profile" element={user ? <Profile user={user} /> : <SignIn onSignIn={handleSignIn} />} />
// 				<Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
// 				<Route path="/tutorialslides" element={<TutorialSlides />} />
// 				<Route path="/report" element={<CivicReporter />} />
// 			</Routes>
// 		</>
// 	);
// }

// function App() {
// 	return (
// 		<Router>
// 			<MainContent />
// 		</Router>
// 	);
// }

// export default App;




import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import Profile from './components/Profile';
import SignIn from './components/SignIn';
import AuthSuccess from './components/AuthSuccess';
import Services from './components/Services';
import Stakeholders from './components/Stakeholders';
import { motion, AnimatePresence } from 'framer-motion';
import TutorialSlides from './components/TutorialSlides';

function ProtectedRoute({ children }) {
	const { isAuthenticated, loading } = useAuth();
	
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}
	
	return isAuthenticated ? children : <Navigate to="/signin" />;
}

function MainContent() {
	const { user, logout } = useAuth();

	const handleSignOut = async () => {
		await logout();
	};

	return (
		<>
			<Navbar user={user} onSignOut={handleSignOut} />

			<Routes>
				<Route path="/" element={
					<>
						<section id="hero"><Hero /></section>
						<section id="services"><Services /></section>
						<section id="stakeholders"><Stakeholders /></section>
						<section id="about"><About /></section>
						<section id="testimonials"><Testimonials /></section>
						<section id="faq"><FAQ /></section>
						<Footer />
					</>
				} />
				<Route path="/signin" element={<SignIn />} />
				<Route path="/auth/success" element={<AuthSuccess />} />
				<Route path="/profile" element={
					<ProtectedRoute>
						<Profile user={user} />
					</ProtectedRoute>
				} />
				<Route path="/tutorialslides" element={<TutorialSlides />} />
			</Routes>
		</>
	);
}

function App() {
	return (
		<Router>
			<AuthProvider>
				<MainContent />
			</AuthProvider>
		</Router>
	);
}

export default App;


















