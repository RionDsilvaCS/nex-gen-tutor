import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, Send, MicOff, RotateCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import './ChatApp.css';

const ChatApp = () => {
  const { subject='physics' } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!subject) {
      navigate('/');
    }
  }, [subject, navigate]);

  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(`${subject}ChatMessages`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraZoomed, setCameraZoomed] = useState(false);
  const messagesEndRef = useRef(null);
  const recognition = useRef(null);

  // Add greeting message when starting a new conversation
  useEffect(() => {
    if (messages.length === 0) {
      const greetingMessage = {
        text: `Hello! 👋 I'm your ${subject} assistant. Feel free to ask me any questions about ${subject}. I'm here to help!`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([greetingMessage]);
    }
  }, [subject, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (subject) {
      localStorage.setItem(`${subject}ChatMessages`, JSON.stringify(messages));
      scrollToBottom();
    }
  }, [subject, messages]);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      // ... speech recognition setup
    } else {
      alert('Speech recognition is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
    setIsListening(false);
  };

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]); // This will trigger the greeting message to appear again
      localStorage.removeItem(`${subject}ChatMessages`);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    // Stop listening if microphone is active
    if (isListening) {
      stopListening();
    }

    const newUserMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Make the API request and update the messages
      const response = await fetch('http://localhost:8005/chat-sample', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputText,
        }),
      });

      const data = await response.json();

      const newBotMessage = {
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reference: data.reference,
        responseTime: data.time,
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "Sorry, I couldn't process that request. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Delete to clear chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
        clearChat();
      }
      // Ctrl/Cmd + M to toggle microphone
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        isListening ? stopListening() : startListening();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isListening]);

  const renderMessageContent = (message) => {
    if (message.sender === 'bot') {
      return (
        <ReactMarkdown className="markdown-content">
          {message.text}
        </ReactMarkdown>
      );
    }
    return <p>{message.text}</p>;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1 className="chat-title">{subject.charAt(0).toUpperCase() + subject.slice(1)} Chat</h1>
        <button onClick={clearChat} className="clear-chat-button">
          <RotateCcw />
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message-wrapper ${message.sender} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-content">
              <img
                src={message.sender === 'user' ? "https://cdn-icons-png.flaticon.com/128/3177/3177440.png" : "https://cdn-icons-png.flaticon.com/128/5292/5292342.png"}
                alt={message.sender}
                className="avatar"
              />
              <div className="message-bubble">
                {renderMessageContent(message)}
                <span className="message-timestamp">
                  {message.timestamp}
                  {message.responseTime && ` • ${message.responseTime.toFixed(3)}s`}
                </span>
                {message.reference && (
                  <span className="message-reference">
                    Reference: {message.reference}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message-wrapper bot">
            <div className="typing-indicator">
              <span className="dot">●</span>
              <span className="dot">●</span>
              <span className="dot">●</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Type your ${subject} question...`}
            className="text-input"
          />
          <button
            onClick={isListening ? stopListening : startListening}
            className={`mic-button ${isListening ? 'listening' : 'not-listening'}`}
            title={`${isListening ? 'Stop listening (Ctrl/Cmd + M)' : 'Start listening (Ctrl/Cmd + M)'}`}
          >
            {isListening ? <MicOff /> : <Mic />}
          </button>
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="send-button"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;