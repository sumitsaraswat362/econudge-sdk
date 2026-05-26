'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onVoiceCommand: (transcript: string) => void;
}

export default function VoiceNudge({ onVoiceCommand }: Props) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);

      const keywords = ['green', 'eco', 'nudge', 'sustainable', 'help', 'alternative'];
      if (keywords.some((kw) => text.toLowerCase().includes(kw))) {
        setShowToast(true);
        onVoiceCommand(text);
        setTimeout(() => setShowToast(false), 3000);
      }

      setTimeout(() => setTranscript(''), 4000);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [onVoiceCommand]);

  if (!isSupported) return null;

  return (
    <>
      {/* Floating mic button */}
      <motion.button
        onClick={startListening}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-2xl shadow-2xl border border-white/10 cursor-pointer"
      >
        {isListening ? (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-500"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ) : null}
        <span>{isListening ? '🔴' : '🎙️'}</span>
      </motion.button>

      {/* Transcript tooltip */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-24 right-6 z-50 max-w-xs rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white backdrop-blur-xl shadow-2xl"
          >
            <p className="text-xs text-gray-500 mb-1">You said:</p>
            <p className="font-medium">"{transcript}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Command detected toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed top-24 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400 backdrop-blur-xl shadow-2xl"
          >
            🎤 Voice command detected! Opening EcoNudge...
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
