/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Editor from './components/Editor';
import Player from './components/Player';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'editor' | 'player'>('home');
  const [activeQuizId, setActiveQuizId] = useState<string | undefined>();

  const handleNavigate = (screen: 'home' | 'editor' | 'player', quizId?: string) => {
    setCurrentScreen(screen);
    setActiveQuizId(quizId);
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans text-gray-900">
      <Navbar onNavigate={handleNavigate} />
      
      <main>
        {currentScreen === 'home' && <Home onNavigate={handleNavigate} />}
        {currentScreen === 'editor' && <Editor onNavigate={handleNavigate} />}
        {currentScreen === 'player' && activeQuizId && (
          <Player quizId={activeQuizId} onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}

