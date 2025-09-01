
import React from 'react';
import PostCrafter from './components/PostCrafter';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-gray-50 to-brand-gray-100 text-brand-gray-900 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-16">
        <HeroSection />
        <PostCrafter />
      </main>
      <footer className="text-center py-6 text-brand-gray-500 text-sm">
        <p>Powered by Gemini AI. Crafted for Professionals.</p>
        <p className="mt-2">
          Crafted by <a href="https://github.com/akshaykarthicks" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline font-semibold">akshaykarthicks</a>
        </p>
      </footer>
    </div>
  );
};

const HeroSection: React.FC = () => (
  <header className="text-center mb-12">
    <h1 className="text-4xl md:text-6xl font-extrabold text-brand-blue mb-4 tracking-tight">
      LinkedIn Post Crafter
    </h1>
    <p className="max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-800">
      Stop staring at a blank cursor. Select your goal, provide the key points, choose a tone, and let AI generate a captivating LinkedIn post in seconds.
    </p>
  </header>
);

export default App;
