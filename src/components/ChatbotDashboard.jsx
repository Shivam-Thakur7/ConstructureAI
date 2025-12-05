import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

function ChatbotDashboard() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message on first load
    if (messages.length === 0 && user) {
      const welcomeMessage = {
        id: Date.now(),
        type: 'system',
        content: `Hello ${user.name}! 👋\n\nI'm your AI email assistant. Here's what I can help you with:\n\n📧 **"read emails"** - Fetch your 5 most recent emails with AI-generated summaries\n\n✍️ **"generate replies"** - Create AI-powered responses for your emails\n\n📤 **"send reply to email #"** - Send a generated reply (e.g., "send reply to email 1")\n\n🗑️ **"delete email #"** - Delete a specific email (e.g., "delete email 2")\n\n🗑️ **"delete email from [sender]"** - Delete latest email from a sender\n\n🗑️ **"delete email with subject [keyword]"** - Delete email by subject keyword\n\nJust type your command naturally, and I'll handle the rest!`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [user]);

  const addMessage = (content, type = 'user') => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      const lowerMessage = userMessage.toLowerCase();

      // Read emails command
      if (lowerMessage.includes('read') && lowerMessage.includes('email')) {
        await handleReadEmails();
      }
      // Generate replies command
      else if (lowerMessage.includes('generate') && lowerMessage.includes('repl')) {
        await handleGenerateReplies();
      }
      // Send reply command
      else if (lowerMessage.includes('send') && lowerMessage.includes('repl')) {
        const emailMatch = userMessage.match(/email\s*#?(\d+)/i);
        if (emailMatch) {
          await handleSendReply(parseInt(emailMatch[1]));
        } else {
          addMessage('Please specify which email to reply to (e.g., "send reply to email 1")', 'system');
        }
      }
      // Delete email command
      else if (lowerMessage.includes('delete')) {
        await handleDeleteEmail(userMessage);
      }
      // Unknown command
      else {
        addMessage('I didn\'t understand that command. Try:\n• "read emails"\n• "generate replies"\n• "send reply to email #"\n• "delete email #"', 'system');
      }
    } catch (error) {
      console.error('Command error:', error);
      addMessage(`Error: ${error.message || 'Something went wrong'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadEmails = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/emails/read`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch emails');

      const data = await response.json();
      setEmails(data.emails);

      let emailsText = `📬 **Your 5 Most Recent Emails:**\n\n`;
      data.emails.forEach((email, index) => {
        emailsText += `**Email #${index + 1}**\n`;
        emailsText += `📨 From: ${email.sender}\n`;
        emailsText += `📋 Subject: ${email.subject}\n`;
        emailsText += `📄 Summary: ${email.summary}\n`;
        emailsText += `🕐 Date: ${new Date(email.date).toLocaleString()}\n\n`;
      });

      addMessage(emailsText, 'system');
    } catch (error) {
      addMessage(`Failed to read emails: ${error.message}`, 'error');
    }
  };

  const handleGenerateReplies = async () => {
    if (emails.length === 0) {
      addMessage('Please read your emails first using "read emails" command.', 'system');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/emails/generate-replies`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails }),
      });

      if (!response.ok) throw new Error('Failed to generate replies');

      const data = await response.json();

      let repliesText = `✍️ **AI-Generated Replies:**\n\n`;
      data.replies.forEach((reply, index) => {
        repliesText += `**Reply for Email #${index + 1}** (${emails[index].subject})\n`;
        repliesText += `${reply}\n\n`;
        repliesText += `Type "send reply to email ${index + 1}" to send this reply.\n\n`;
      });

      // Store replies in emails
      const updatedEmails = emails.map((email, index) => ({
        ...email,
        generatedReply: data.replies[index],
      }));
      setEmails(updatedEmails);

      addMessage(repliesText, 'system');
    } catch (error) {
      addMessage(`Failed to generate replies: ${error.message}`, 'error');
    }
  };

  const handleSendReply = async (emailIndex) => {
    const arrayIndex = emailIndex - 1;
    if (arrayIndex < 0 || arrayIndex >= emails.length) {
      addMessage('Invalid email number. Please check your email list.', 'error');
      return;
    }

    const email = emails[arrayIndex];
    if (!email.generatedReply) {
      addMessage('Please generate replies first using "generate replies" command.', 'system');
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/emails/send-reply`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_id: email.id,
          reply_content: email.generatedReply,
        }),
      });

      if (!response.ok) throw new Error('Failed to send reply');

      const data = await response.json();
      addMessage(`✅ Reply sent successfully to ${email.sender}!`, 'system');
    } catch (error) {
      addMessage(`Failed to send reply: ${error.message}`, 'error');
    }
  };

  const handleDeleteEmail = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    let deleteParams = {};

    // Delete by number
    const numberMatch = userMessage.match(/email\s*#?(\d+)/i);
    if (numberMatch) {
      const arrayIndex = parseInt(numberMatch[1]) - 1;
      if (arrayIndex < 0 || arrayIndex >= emails.length) {
        addMessage('Invalid email number. Please check your email list.', 'error');
        return;
      }
      deleteParams = { email_id: emails[arrayIndex].id };
    }
    // Delete by sender
    else if (lowerMessage.includes('from')) {
      const fromMatch = userMessage.match(/from\s+(.+)$/i);
      if (fromMatch) {
        deleteParams = { sender: fromMatch[1].trim() };
      }
    }
    // Delete by subject
    else if (lowerMessage.includes('subject')) {
      const subjectMatch = userMessage.match(/subject\s+(.+)$/i);
      if (subjectMatch) {
        deleteParams = { subject_keyword: subjectMatch[1].trim() };
      }
    }

    if (Object.keys(deleteParams).length === 0) {
      addMessage('Please specify how to delete:\n• "delete email #2"\n• "delete email from sender@example.com"\n• "delete email with subject meeting"', 'system');
      return;
    }

    // Ask for confirmation
    const confirmMessage = `⚠️ Are you sure you want to delete this email? Type "confirm delete" to proceed or anything else to cancel.`;
    addMessage(confirmMessage, 'system');

    // Store delete params for confirmation
    window.pendingDelete = deleteParams;
  };

  const confirmDelete = async (deleteParams) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/emails/delete`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteParams),
      });

      if (!response.ok) throw new Error('Failed to delete email');

      const data = await response.json();
      addMessage(`✅ Email deleted successfully!`, 'system');

      // Refresh emails list
      if (emails.length > 0) {
        await handleReadEmails();
      }
    } catch (error) {
      addMessage(`Failed to delete email: ${error.message}`, 'error');
    }
  };

  // Handle confirmation in input
  useEffect(() => {
    if (inputValue.toLowerCase().includes('confirm delete') && window.pendingDelete) {
      const params = window.pendingDelete;
      window.pendingDelete = null;
      setInputValue('');
      confirmDelete(params);
    }
  }, [inputValue]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-background-gray py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-orange-600 p-6 text-white">
            <h1 className="text-2xl font-bold">Email Assistant</h1>
            <p className="text-sm opacity-90">Powered by AI • Connected to {user?.email}</p>
          </div>

          {/* Messages Container */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-primary text-white'
                        : message.type === 'error'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-white text-gray-800 shadow-md border border-gray-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your command... (e.g., 'read emails')"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ChatbotDashboard;
