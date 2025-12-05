import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function AuthSuccess() {
  const navigate = useNavigate();
  const { handleAuthSuccess } = useAuth();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const processAuth = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          setStatus('error');
          setMessage(decodeURIComponent(error));
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setMessage('No authentication token received');
          setTimeout(() => navigate('/signin'), 3000);
          return;
        }

        // Save token and get user data
        await handleAuthSuccess(token);
        
        setStatus('success');
        setMessage('Sign in successful! Redirecting to dashboard...');
        
        // Redirect to home/dashboard after success
        setTimeout(() => navigate('/'), 1500);
      } catch (err) {
        console.error('Auth success error:', err);
        setStatus('error');
        setMessage(err.message || 'Failed to complete sign in');
        setTimeout(() => navigate('/signin'), 3000);
      }
    };

    processAuth();
  }, [handleAuthSuccess, navigate]);

  return (
    <div className="min-h-screen bg-background-gray flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center"
      >
        {status === 'processing' && (
          <>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-heading mb-2">Processing...</h2>
            <p className="text-body">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-heading mb-2">Success!</h2>
            <p className="text-body">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-bold text-heading mb-2">Authentication Failed</h2>
            <p className="text-body mb-4">{message}</p>
            <p className="text-sm text-body">Redirecting to sign in...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default AuthSuccess;
