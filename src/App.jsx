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
import ChatbotDashboard from './components/ChatbotDashboard';

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
				<Route path="/dashboard" element={
					<ProtectedRoute>
						<ChatbotDashboard />
					</ProtectedRoute>
				} />
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


















