import React from 'react';
import { BarChart3, Info } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  onShowInfo: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onShowInfo }) => {
  return (
    <header className="relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 ${isDarkMode ? 'gradient-bg-dark' : 'gradient-bg'}`} />
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl float-animation" />
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl float-animation" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-white/10 rounded-full blur-xl float-animation" style={{ animationDelay: '4s' }} />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="text-center">
          {/* Logo and title */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <BarChart3 size={40} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Sort<span className="text-yellow-300">Viz</span>
            </h1>
          </div>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Visualize sorting algorithms with beautiful animations and interactive controls
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={onShowInfo}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Info size={20} />
              Learn More
            </button>
            {/* <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <Github size={20} />
              View Source
            </a> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;