import React, { useState, useEffect } from 'react';
import { useAppTheme } from '../../context/ThemeContext';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';

const ReportAssistant = () => {
  const { isDarkMode } = useAppTheme();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportUrl, setReportUrl] = useState('');
  const [error, setError] = useState('');

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setIsListening(true);
      recognition.start();
    }
  }, []);

  const toggleListening = () => {
    if (!isListening) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      // Implementation for stopping speech recognition
    }
  };

  const generateReport = async () => {
    if (!transcript.trim()) {
      alert('Please enter or speak your report query');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query: transcript })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setReportUrl(url);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Voice Command Instructions */}
      <div className="p-4 rounded-lg bg-opacity-20 bg-gray-700 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-2">
          💡 Voice Commands Available!
        </h3>
        <p className="text-gray-300 text-sm">
          Click the microphone button {isListening ? '🛑' : '🎤'} and say something like:
        </p>
        <ul className="list-disc list-inside text-sm mt-2 text-gray-300 space-y-1">
          <li>"Generate payroll report for last 3 months"</li>
          <li>"Show stock report for Q2"</li>
          <li>"Create sales report for last quarter"</li>
        </ul>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Type or click the mic to speak..."
            className="flex-1 p-3 rounded-lg bg-opacity-20 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          {isListening && (
            <button
              onClick={toggleListening}
              className={`p-3 rounded-lg flex items-center justify-center min-w-[48px] transition-colors duration-200 bg-red-500 hover:bg-red-600`}
              title="Stop listening"
            >
              <span className="text-xl">🛑</span>
            </button>
          )}
        </div>

        {isListening && (
          <div className="text-sm text-green-400 animate-pulse flex items-center justify-center">
            🎤 Listening... Speak now
          </div>
        )}

        <button
          onClick={generateReport}
          disabled={isGenerating || !transcript.trim()}
          className={`w-full p-3 rounded-lg font-medium transition-colors duration-200 ${
            isGenerating || !transcript.trim()
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600'
          } text-white`}
        >
          {isGenerating ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div>
    </div>
  );
};

export default ReportAssistant; 