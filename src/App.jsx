import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Type, 
  Puzzle, 
  Search, 
  X, 
  ArrowRightLeft, 
  CheckCircle2,
  RefreshCcw,
  Zap
} from 'lucide-react';

// --- Custom CSS for animations and 3D effects ---
const customStyles = `
  .perspective-1000 { perspective: 1000px; }
  .preserve-3d { transform-style: preserve-3d; }
  .backface-hidden { backface-visibility: hidden; }
  .rotate-y-180 { transform: rotateY(180deg); }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// --- Data Structure ---
const CATEGORIES = {
  SPELLING: { id: 'spelling', label: 'Letter & Spelling Magic', color: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-600', icon: Type },
  SOUND: { id: 'sound', label: 'Sound & Meaning Beats', color: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-600', icon: Volume2 },
  UNIQUE: { id: 'unique', label: 'Unique Oddities', color: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-600', icon: Sparkles },
};

const WORD_DATA = [
  // SPELLING PROPERTIES
  {
    id: 'anagram',
    term: 'Anagram',
    category: 'spelling',
    definition: 'A word or phrase formed by rearranging the letters of a different word.',
    examples: [
      { input: 'listen', output: 'silent' },
      { input: 'elbow', output: 'below' },
      { input: 'dusty', output: 'study' }
    ],
    type: 'transform',
    emoji: '🔀'
  },
  {
    id: 'antigram',
    term: 'Antigram',
    category: 'spelling',
    definition: 'An anagram that means the opposite (antonym) of the original word!',
    examples: [
      { input: 'violence', output: 'nice love' },
      { input: 'united', output: 'untied' }
    ],
    type: 'transform',
    emoji: '😈'
  },
  {
    id: 'palindrome',
    term: 'Palindrome',
    category: 'spelling',
    definition: 'A word or phrase that reads the same backward as forward.',
    examples: ['racecar', 'level', 'madam'],
    type: 'checker',
    emoji: '🔁'
  },
  {
    id: 'isogram',
    term: 'Isogram',
    category: 'spelling',
    definition: 'A word where no letter appears more than once.',
    examples: ['background', 'fly', 'dermatoglyphics'],
    type: 'static',
    emoji: '🔠'
  },
  {
    id: 'lipogram',
    term: 'Lipogram',
    category: 'spelling',
    definition: 'Writing that intentionally avoids a specific letter (like E).',
    examples: ['The bold old fox (No "E")', 'Gatsby (Original had many lipograms)'],
    type: 'static',
    emoji: '🚫'
  },
  {
    id: 'pangram',
    term: 'Pangram',
    category: 'spelling',
    definition: 'A sentence containing every letter of the alphabet at least once.',
    examples: ['The quick brown fox jumps over the lazy dog.'],
    type: 'static',
    emoji: '🦊'
  },
  {
    id: 'kangaroo',
    term: 'Kangaroo Word',
    category: 'spelling',
    definition: 'A word carrying its own synonym inside it (in order)!',
    examples: [
      { word: 'masculine', inner: 'male' },
      { word: 'chicken', inner: 'hen' },
      { word: 'observe', inner: 'see' }
    ],
    type: 'kangaroo',
    emoji: '🦘'
  },
  {
    id: 'semordnilap',
    term: 'Semordnilap',
    category: 'spelling',
    definition: 'A word that spells a different word when read backward.',
    examples: [
      { input: 'desserts', output: 'stressed' },
      { input: 'diaper', output: 'repaid' }
    ],
    type: 'transform',
    emoji: '🔙'
  },
  {
    id: 'capitonym',
    term: 'Capitonym',
    category: 'spelling',
    definition: 'A word that changes meaning when capitalized.',
    examples: [
      { input: 'turkey (bird)', output: 'Turkey (country)' },
      { input: 'polish (shiny)', output: 'Polish (from Poland)' }
    ],
    type: 'transform',
    emoji: '🏛️'
  },

  // SOUND & MEANING
  {
    id: 'homophone',
    term: 'Homophone',
    category: 'sound',
    definition: 'Words that sound the same but have different meanings and spellings.',
    examples: ['To / Too / Two', 'Flour / Flower', 'Knight / Night'],
    type: 'static',
    emoji: '👂'
  },
  {
    id: 'homograph',
    term: 'Homograph',
    category: 'sound',
    definition: 'Words spelled the same but with different meanings (and sometimes sounds).',
    examples: ['Lead (to guide) vs Lead (metal)', 'Bass (fish) vs Bass (guitar)'],
    type: 'static',
    emoji: '🎸'
  },
  {
    id: 'onomatopoeia',
    term: 'Onomatopoeia',
    category: 'sound',
    definition: 'Words that imitate the actual sound they describe.',
    examples: ['Buzz', 'Splash', 'Meow', 'Bang'],
    type: 'sound_fx',
    emoji: '💥'
  },
  {
    id: 'portmanteau',
    term: 'Portmanteau',
    category: 'sound',
    definition: 'A new word formed by fusing parts of two existing words.',
    examples: [
      { p1: 'Breakfast', p2: 'Lunch', res: 'Brunch' },
      { p1: 'Smoke', p2: 'Fog', res: 'Smog' },
      { p1: 'Spoon', p2: 'Fork', res: 'Spork' }
    ],
    type: 'math',
    emoji: '🧩'
  },
  {
    id: 'mondegreen',
    term: 'Mondegreen',
    category: 'sound',
    definition: 'A mishearing of a phrase (usually lyrics) that creates a new meaning.',
    examples: ['"Gladly the cross I\'d bear" -> "Gladly the cross-eyed bear"'],
    type: 'static',
    emoji: '🐻'
  },
  {
    id: 'autoantonym',
    term: 'Auto-antonym',
    category: 'sound',
    definition: 'A word that can mean the opposite of itself.',
    examples: ['Dust (to remove dust OR to add dust)', 'Left (remained OR departed)'],
    type: 'static',
    emoji: '🎭'
  },
  {
    id: 'aptronym',
    term: 'Aptronym',
    category: 'sound',
    definition: 'A name that perfectly fits the person\'s job or character.',
    examples: ['Usain Bolt (fast runner)', 'William Wordsworth (poet)'],
    type: 'static',
    emoji: '🏃'
  },

  // UNIQUE / OTHER
  {
    id: 'oxymoron',
    term: 'Oxymoron',
    category: 'unique',
    definition: 'A figure of speech combining contradictory terms.',
    examples: ['Jumbo Shrimp', 'Deafening Silence', 'Old News'],
    type: 'static',
    emoji: '🍤'
  },
  {
    id: 'spoonerism',
    term: 'Spoonerism',
    category: 'unique',
    definition: 'Swapping the starting sounds of words for a funny effect.',
    examples: [
      { input: 'Lighting a fire', output: 'Fighting a liar' },
      { input: 'Bunny phone', output: 'Funny bone' }
    ],
    type: 'transform',
    emoji: '🥄'
  },
  {
    id: 'tautogram',
    term: 'Tautogram',
    category: 'unique',
    definition: 'A sentence where every word starts with the same letter.',
    examples: ['Peter Piper picked a peck of pickled peppers.'],
    type: 'static',
    emoji: '🅱️'
  },
  {
    id: 'neologism',
    term: 'Neologism',
    category: 'unique',
    definition: 'Newly invented words that are entering common use.',
    examples: ['Selfie', 'Binge-watch', 'Hangry'],
    type: 'static',
    emoji: '🆕'
  }
];

// --- Helper Components ---

const KangarooVisual = ({ word, inner }) => {
  const renderLetters = () => {
    let innerIndex = 0;
    // Safety check
    if (!word || !inner) return null;
    
    return word.split('').map((char, idx) => {
      const isMatch = innerIndex < inner.length && char.toLowerCase() === inner[innerIndex].toLowerCase();
      if (isMatch) innerIndex++;
      
      return (
        <span 
          key={idx} 
          className={`text-4xl font-bold transition-all duration-500 ${isMatch ? 'text-orange-600 translate-y-[-5px] inline-block' : 'text-gray-300'}`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center space-y-2 bg-orange-50 p-4 rounded-xl">
      <div className="flex space-x-1">
        {renderLetters()}
      </div>
      <div className="text-sm text-orange-400 font-semibold">Found: {inner}</div>
    </div>
  );
};

const PalindromeChecker = () => {
  const [text, setText] = useState('');
  
  // Safe palindrome check
  const isPalindrome = text.length > 1 && 
    text.toLowerCase().replace(/[^a-z0-9]/g, '') === 
    text.toLowerCase().replace(/[^a-z0-9]/g, '').split('').reverse().join('');

  return (
    <div className="w-full">
      <input 
        type="text"
        placeholder="Type a word (e.g. level)..."
        className="w-full p-3 border-2 border-purple-200 rounded-xl text-center text-xl outline-none focus:border-purple-500 transition-colors"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className={`mt-4 p-4 rounded-xl text-center font-bold transition-all ${isPalindrome ? 'bg-green-100 text-green-700 scale-105' : 'bg-gray-100 text-gray-400'}`}>
        {text.length < 2 ? "Start typing..." : isPalindrome ? "YES! It's a Palindrome! 🎉" : "Not quite backwards yet..."}
      </div>
    </div>
  );
};

const PortmanteauMath = ({ examples }) => {
  const [idx, setIdx] = useState(0);
  const ex = examples[idx];

  const nextExample = () => {
    setIdx((prev) => (prev + 1) % examples.length);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-xl sm:text-3xl font-bold text-slate-700 mb-6">
        <span className="bg-white p-3 rounded-lg shadow-sm">{ex.p1}</span>
        <span className="text-purple-400">+</span>
        <span className="bg-white p-3 rounded-lg shadow-sm">{ex.p2}</span>
        <span>=</span>
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg shadow-lg animate-bounce">{ex.res}</span>
      </div>
      <button 
        onClick={nextExample}
        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <RefreshCcw size={16} /> Next Example
      </button>
    </div>
  );
};

const TransformCard = ({ examples }) => {
  const [flipped, setFlipped] = useState(false);
  const [idx, setIdx] = useState(0);
  const current = examples[idx];

  const handleNext = (e) => {
    e.stopPropagation(); // Prevent flipping when clicking button
    setFlipped(false);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % examples.length);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div 
        className="cursor-pointer perspective-1000 w-full max-w-xs h-40 relative mb-4 group"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`w-full h-full transition-all duration-500 transform preserve-3d relative ${flipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-blue-50 rounded-2xl border-2 border-blue-200 flex flex-col items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-gray-500 text-xs uppercase tracking-widest mb-2">Original</span>
            <span className="text-3xl font-bold text-blue-800">{current.input}</span>
            <div className="mt-4 text-blue-400 text-sm flex items-center gap-1">Tap to flip <RefreshCcw size={12}/></div>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-indigo-500 rounded-2xl rotate-y-180 flex flex-col items-center justify-center text-white shadow-lg">
            <span className="text-indigo-200 text-xs uppercase tracking-widest mb-2">Transformed</span>
            <span className="text-3xl font-bold">{current.output}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={handleNext}
        className="text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        Try Another Word
      </button>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  const filteredWords = WORD_DATA.filter(word => {
    const matchesCategory = activeCategory === 'all' || word.category === activeCategory;
    const matchesSearch = word.term.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCardClick = (word) => {
    setSelectedWord(word);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-yellow-200">
      {/* Safe Style Injection */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-xl rotate-3">
                <Sparkles className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                Word<span className="text-yellow-500">Wonder</span> Land
              </h1>
            </div>
            
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Find a word type..." 
                className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full bg-slate-100 focus:bg-white border-2 border-transparent focus:border-yellow-400 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-slate-800 text-white shadow-lg scale-105' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              All Wonders
            </button>
            {Object.values(CATEGORIES).map(cat => {
              const Icon = cat.icon;
              return (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all ${activeCategory === cat.id ? `${cat.color} text-white shadow-lg scale-105` : 'bg-white text-slate-600 hover:bg-slate-100'}`}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {filteredWords.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <h2 className="text-2xl font-bold mb-2">No words found!</h2>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWords.map(word => {
              const catTheme = Object.values(CATEGORIES).find(c => c.id === word.category);
              return (
                <div 
                  key={word.id}
                  onClick={() => handleCardClick(word)}
                  className={`group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl border-2 border-transparent hover:border-yellow-400 transition-all cursor-pointer transform hover:-translate-y-1 overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 p-3 rounded-bl-2xl ${catTheme.light}`}>
                    <span className="text-2xl">{word.emoji}</span>
                  </div>
                  
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3 ${catTheme.light} ${catTheme.text}`}>
                    {catTheme.label.split(' ')[0].toUpperCase()}
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-yellow-600 transition-colors">
                    {word.term}
                  </h3>
                  
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                    {word.definition}
                  </p>

                  <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-slate-800">
                    Tap to play <ArrowRightLeft size={12} className="ml-1" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`relative p-8 ${CATEGORIES[selectedWord.category.toUpperCase()].color} text-white overflow-hidden`}>
              <button 
                onClick={() => setSelectedWord(null)}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              {/* Background Decoration */}
              <Zap className="absolute -bottom-6 -right-6 text-white/20 rotate-12" size={120} />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="text-6xl bg-white/20 p-4 rounded-2xl backdrop-blur-md shadow-inner">
                  {selectedWord.emoji}
                </div>
                <div>
                  <div className="text-white/80 font-bold tracking-wider text-sm uppercase mb-1">
                    {CATEGORIES[selectedWord.category.toUpperCase()].label}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-extrabold">{selectedWord.term}</h2>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Search size={20} className="text-yellow-500" />
                  What is it?
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed">{selectedWord.definition}</p>
              </div>

              {/* Interactive Section */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Puzzle size={20} className="text-purple-500" />
                  See it in action!
                </h3>

                <div className="flex justify-center">
                  {/* Logic to render different toys based on word type */}
                  
                  {selectedWord.type === 'kangaroo' && (
                     <div className="flex flex-col gap-4 w-full">
                        {selectedWord.examples.map((ex, i) => (
                          <KangarooVisual key={i} word={ex.word} inner={ex.inner} />
                        ))}
                     </div>
                  )}

                  {selectedWord.type === 'checker' && (
                    <PalindromeChecker />
                  )}

                  {selectedWord.type === 'transform' && (
                    <TransformCard examples={selectedWord.examples} />
                  )}

                  {selectedWord.type === 'math' && (
                    <PortmanteauMath examples={selectedWord.examples} />
                  )}

                  {selectedWord.type === 'static' && (
                    <div className="grid gap-3 w-full">
                      {selectedWord.examples.map((ex, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400 flex items-center gap-3">
                          <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                          <span className="font-medium text-slate-700 text-lg">{ex}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {selectedWord.type === 'sound_fx' && (
                    <div className="flex flex-wrap gap-4 justify-center">
                      {selectedWord.examples.map((ex, i) => (
                         <div key={i} className="bg-yellow-400 text-slate-900 font-black text-2xl py-4 px-8 rounded-[2rem] shadow-lg transform hover:scale-110 transition-transform cursor-default rotate-3 odd:-rotate-2 border-4 border-black">
                            {ex}!
                         </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}