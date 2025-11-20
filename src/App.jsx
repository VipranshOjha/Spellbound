import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  Type, 
  Puzzle, 
  Search, 
  X,
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
  // --- SPELLING PROPERTIES (9 + 1 new = 10) ---
  {
    id: 'anagram',
    term: '1. Anagram',
    category: 'spelling',
    definition: 'A word or phrase formed by rearranging the letters of a different word.',
    examples: [
      { input: 'Listen', output: 'Silent' },
      { input: 'Elbow', output: 'Below' },
      { input: 'Dusty', output: 'Study' },
      { input: 'Night', output: 'Thing' },
      { input: 'Inch', output: 'Chin' },
      { input: 'Brag', output: 'Grab' },
      { input: 'Cat', output: 'Act' },
      { input: 'Bored', output: 'Robed' },
      { input: 'Save', output: 'Vase' },
      { input: 'Angel', output: 'Glean' }
    ],
    emoji: '🔀'
  },
  {
    id: 'antigram',
    term: '2. Antigram',
    category: 'spelling',
    definition: 'An anagram that means the opposite (antonym) of the original word!',
    examples: [
      { input: 'Violence', output: 'Nice Love' },
      { input: 'United', output: 'Untied' },
      { input: 'Harmfulness', output: 'Harmless fun' },
      { input: 'Filled', output: 'Ill-fed' },
      { input: 'Forty five', output: 'Over fifty' },
      { input: 'Santa', output: 'Satan' },
      { input: 'Evil', output: 'Live' },
      { input: 'Restful', output: 'Fluster' },
      { input: 'Admirer', output: 'Married' },
      { input: 'Funeral', output: 'Real fun' }
    ],
    emoji: '😈'
  },
  {
    id: 'capitonym',
    term: '3. Capitonym',
    category: 'spelling',
    definition: 'A word that changes meaning (and sometimes pronunciation) when capitalized.',
    examples: [
      { input: 'turkey (bird)', output: 'Turkey (country)' },
      { input: 'polish (shiny)', output: 'Polish (from Poland)' },
      { input: 'march (walk)', output: 'March (month)' },
      { input: 'august (noble)', output: 'August (month)' },
      { input: 'china (plates)', output: 'China (country)' },
      { input: 'mosaic (art)', output: 'Mosaic (Biblical)' },
      { input: 'job (work)', output: 'Job (Biblical figure)' },
      { input: 'herb (plant)', output: 'Herb (name)' },
      { input: 'reading (books)', output: 'Reading (city)' },
      { input: 'nice (kind)', output: 'Nice (city)' }
    ],
    emoji: '🏛️'
  },
  {
    id: 'isogram',
    term: '4. Isogram',
    category: 'spelling',
    definition: 'A word where no letter appears more than once.',
    examples: [
      { input: 'No repeating letters:', output: 'Background' },
      { input: 'Short one:', output: 'Fly' },
      { input: 'Long one:', output: 'Dermatoglyphics' },
      { input: 'Common object:', output: 'Switch' },
      { input: 'Animal:', output: 'Dog' },
      { input: 'Color:', output: 'Black' },
      { input: 'Action:', output: 'Jump' },
      { input: 'Place:', output: 'Camp' },
      { input: 'Body part:', output: 'Mouth' },
      { input: 'Furniture:', output: 'Desk' }
    ],
    emoji: '🔠'
  },
  {
    id: 'kangaroo',
    term: '5. Kangaroo Word',
    category: 'spelling',
    definition: 'A word carrying its own synonym inside it (in order)!',
    examples: [
      { input: 'Masculine', output: 'Male' },
      { input: 'Chicken', output: 'Hen' },
      { input: 'Observe', output: 'See' },
      { input: 'Blossom', output: 'Bloom' },
      { input: 'Calends', output: 'Ads' },
      { input: 'Container', output: 'Can' },
      { input: 'Deceased', output: 'Dead' },
      { input: 'Exhilaration', output: 'Elation' },
      { input: 'Honorable', output: 'Noble' },
      { input: 'Instructor', output: 'Tutor' }
    ],
    emoji: '🦘'
  },
  {
    id: 'lipogram',
    term: '6. Lipogram',
    category: 'spelling',
    definition: 'Writing that intentionally avoids a specific letter (like E).',
    examples: [
      { input: 'No "E":', output: 'Bold old fox' },
      { input: 'No "A":', output: 'Big dogs run' },
      { input: 'No "T":', output: 'Big black bear' },
      { input: 'No "O":', output: 'Fat cat sat' },
      { input: 'No "I":', output: 'Fat cat ran' },
      { input: 'No "S":', output: 'The dog barked' },
      { input: 'No "H":', output: 'A big cat' },
      { input: 'No "R":', output: 'The cat sat' },
      { input: 'No "L":', output: 'A big dog' },
      { input: 'No "D":', output: 'A cat ran' }
    ],
    emoji: '🚫'
  },
  {
    id: 'palindrome',
    term: '7. Palindrome',
    category: 'spelling',
    definition: 'A word or phrase that reads the same backward as forward.',
    examples: [
      { input: 'Check this word:', output: 'Racecar' },
      { input: 'Forward & Back:', output: 'Level' },
      { input: 'A lady name:', output: 'Madam' },
      { input: 'Midday:', output: 'Noon' },
      { input: 'A small vehicle:', output: 'Kayak' },
      { input: 'A family member:', output: 'Mom' },
      { input: 'Another family member:', output: 'Dad' },
      { input: 'Body part:', output: 'Eye' },
      { input: 'Rotation:', output: 'Rotator' },
      { input: 'Funny Phrase:', output: 'Taco Cat' }
    ],
    emoji: '🔁'
  },
  {
    id: 'pangram',
    term: '8. Pangram',
    category: 'spelling',
    definition: 'A sentence containing every letter of the alphabet at least once.',
    examples: [
      { input: 'Famous one:', output: 'The quick brown fox jumps over the lazy dog.' },
      { input: 'Short one:', output: 'Pack my box with five dozen liquor jugs.' },
      { input: 'Another one:', output: 'Sphinx of black quartz, judge my vow.' },
      { input: 'Food one:', output: 'Jinxed wizards pluck ivy from the big quilt.' },
      { input: 'Animal one:', output: 'The five boxing wizards jump quickly.' },
      { input: 'Nature one:', output: 'Two driven jocks help fax my big quiz.' },
      { input: 'Crazy one:', output: 'How vexingly quick daft zebras jump!' },
      { input: 'Classic:', output: 'Bright vixens jump; dozy fowl quack.' },
      { input: 'Odd:', output: 'Five quacking zephyrs jolt my wax bed.' },
      { input: 'Simple:', output: 'Cozy lummox gives smart squid who asks for job pen.' }
    ],
    emoji: '🦊'
  },
  {
    id: 'semordnilap',
    term: '9. Semordnilap',
    category: 'spelling',
    definition: 'A word that spells a different word when read backward.',
    examples: [
      { input: 'Desserts', output: 'Stressed' },
      { input: 'Diaper', output: 'Repaid' },
      { input: 'Gateman', output: 'Nametag' },
      { input: 'Star', output: 'Rats' },
      { input: 'Drawer', output: 'Reward' },
      { input: 'Deliver', output: 'Reviled' },
      { input: 'Smart', output: 'Trams' },
      { input: 'Mood', output: 'Doom' },
      { input: 'Maps', output: 'Spam' },
      { input: 'Stop', output: 'Pots' }
    ],
    emoji: '🔙'
  },
  {
    id: 'ananym',
    term: '10. Ananym',
    category: 'spelling',
    definition: 'A word or name created by reversing the letters of an existing name.',
    examples: [
      { input: 'Oprah', output: 'Harpo' },
      { input: 'Dracula', output: 'Alucard' },
      { input: 'Robert', output: 'Trebor' },
      { input: 'Heaven', output: 'Nevaeh' },
      { input: 'Kramer', output: 'Remark' },
      { input: 'Enid', output: 'Dine' },
      { input: 'Reed', output: 'Deer' },
      { input: 'Ward', output: 'Draw' },
      { input: 'Leon', output: 'Noel' },
      { input: 'Agnes', output: 'Senga' }
    ],
    emoji: '🙃'
  },

  // --- SOUND & MEANING (9 + 1 new = 10) ---
  {
    id: 'aptronym',
    term: '11. Aptronym',
    category: 'sound',
    definition: 'A name that perfectly fits the person\'s job or character.',
    examples: [
      { input: 'Usain Bolt', output: 'Fast runner' },
      { input: 'William Wordsworth', output: 'Poet' },
      { input: 'Margaret Court', output: 'Tennis player' },
      { input: 'Tiger Woods', output: 'Golfer' },
      { input: 'Storm Field', output: 'Meteorologist' },
      { input: 'Larry Speakes', output: 'Spokesperson' },
      { input: 'Dr. Tooth', output: 'Dentist' },
      { input: 'Chip Stone', output: 'Geologist' },
      { input: 'Sue Yu', output: 'Lawyer' },
      { input: 'Bill Board', output: 'Advertiser' }
    ],
    emoji: '🏃'
  },
  {
    id: 'autoantonym',
    term: '12. Auto-antonym',
    category: 'sound',
    definition: 'A word that can mean the opposite of itself.',
    examples: [
      { input: 'Dust', output: 'Remove dust OR Add dust' },
      { input: 'Left', output: 'Remained OR Departed' },
      { input: 'Off', output: 'Activated OR Deactivated' },
      { input: 'Oversight', output: 'Supervision OR Neglect' },
      { input: 'Sanction', output: 'Approve OR Penalize' },
      { input: 'Screen', output: 'Show OR Hide' },
      { input: 'Seed', output: 'Add seeds OR Remove seeds' },
      { input: 'Trim', output: 'Add (decorate) OR Cut away' },
      { input: 'Wear', output: 'Last long OR Erode' },
      { input: 'Wind', output: 'Wrap up OR Start up' }
    ],
    emoji: '🎭'
  },
  {
    id: 'homograph',
    term: '13. Homograph',
    category: 'sound',
    definition: 'Words spelled the same but with different meanings (and sometimes sounds).',
    examples: [
      { input: 'Lead (to guide)', output: 'Lead (metal)' },
      { input: 'Bass (fish)', output: 'Bass (guitar)' },
      { input: 'Bow (arrow)', output: 'Bow (bend)' },
      { input: 'Tear (cry)', output: 'Tear (rip)' },
      { input: 'Close (near)', output: 'Close (shut)' },
      { input: 'Live (alive)', output: 'Live (concert)' },
      { input: 'Wind (air)', output: 'Wind (clock)' },
      { input: 'Minute (time)', output: 'Minute (tiny)' },
      { input: 'Read (now)', output: 'Read (past)' },
      { input: 'Content (happy)', output: 'Content (inside)' }
    ],
    emoji: '🎸'
  },
  {
    id: 'homophone',
    term: '14. Homophone',
    category: 'sound',
    definition: 'Words that sound the same but have different meanings and spellings.',
    examples: [
      { input: 'To (Direction)', output: 'Two (Number)' },
      { input: 'Flour (Baking)', output: 'Flower (Plant)' },
      { input: 'Knight (Armor)', output: 'Night (Dark)' },
      { input: 'Sea (Ocean)', output: 'See (Eyes)' },
      { input: 'Pair (Two)', output: 'Pear (Fruit)' },
      { input: 'Right (Correct)', output: 'Write (Pen)' },
      { input: 'Sun (Star)', output: 'Son (Child)' },
      { input: 'Blue (Color)', output: 'Blew (Wind)' },
      { input: 'Meat (Food)', output: 'Meet (Hello)' },
      { input: 'Hair (Head)', output: 'Hare (Rabbit)' }
    ],
    emoji: '👂'
  },
  {
    id: 'mondegreen',
    term: '15. Mondegreen',
    category: 'sound',
    definition: 'A mishearing of a phrase (usually lyrics) that creates a new meaning.',
    examples: [
      { input: 'Gladly the cross I\'d bear', output: 'Gladly the cross-eyed bear' },
      { input: 'Purple Haze', output: 'Purple Hays' },
      { input: 'Bad Moon Rising', output: 'Bathroom on the right' },
      { input: 'Tiny Dancer', output: 'Tony Danza' },
      { input: 'Secret Agent Man', output: 'Secret Asian Man' },
      { input: 'Sweet Dreams', output: 'Sweet streams' },
      { input: 'Like a Virgin', output: 'Like a Wizard' },
      { input: 'Bohemian Rhapsody', output: 'Saving his life from this warm sausage tea' },
      { input: 'Dancing Queen', output: 'Dancing Green' },
      { input: 'Take a Chance', output: 'Take a Chant' }
    ],
    emoji: '🐻'
  },
  {
    id: 'onomatopoeia',
    term: '16. Onomatopoeia',
    category: 'sound',
    definition: 'Words that imitate the actual sound they describe.',
    examples: [
      { input: 'A Bee goes:', output: 'Buzz' },
      { input: 'Water goes:', output: 'Splash' },
      { input: 'A Cat goes:', output: 'Meow' },
      { input: 'A Gun goes:', output: 'Bang' },
      { input: 'A Clock goes:', output: 'Tick Tock' },
      { input: 'A Cow goes:', output: 'Moo' },
      { input: 'A Dog goes:', output: 'Woof' },
      { input: 'A Snake goes:', output: 'Hiss' },
      { input: 'A Duck goes:', output: 'Quack' },
      { input: 'A Bomb goes:', output: 'Boom' }
    ],
    emoji: '💥'
  },
  {
    id: 'phantonym',
    term: '17. Phantonym',
    category: 'sound',
    definition: 'Words that look like they mean one thing but mean another (or the opposite).',
    examples: [
      { input: 'Inflammable', output: 'Flammjable (NOT fireproof)' },
      { input: 'Noisome', output: 'Smelly (NOT noisy)' },
      { input: 'Enormity', output: 'Evil act (NOT big size)' },
      { input: 'Pulchritudinous', output: 'Beautiful (Sounds ugly)' },
      { input: 'Restive', output: 'Restless (NOT restful)' },
      { input: 'Fulsome', output: 'Excessive/Insincere (NOT full)' },
      { input: 'Bemused', output: 'Confused (NOT amused)' },
      { input: 'Disinterested', output: 'Unbiased (NOT bored)' },
      { input: 'Fortuitous', output: 'Accidental (NOT lucky)' },
      { input: 'Factoid', output: 'Unverified info (NOT small fact)' }
    ],
    emoji: '👻'
  },
  {
    id: 'portmanteau',
    term: '18. Portmanteau',
    category: 'sound',
    definition: 'A new word formed by fusing parts of two existing words.',
    examples: [
      { input: 'Breakfast + Lunch', output: 'Brunch' },
      { input: 'Smoke + Fog', output: 'Smog' },
      { input: 'Spoon + Fork', output: 'Spork' },
      { input: 'Motor + Hotel', output: 'Motel' },
      { input: 'Web + Log', output: 'Blog' },
      { input: 'Emotion + Icon', output: 'Emoticon' },
      { input: 'Spanish + English', output: 'Spanglish' },
      { input: 'Hungry + Angry', output: 'Hangry' },
      { input: 'Medical + Care', output: 'Medicare' },
      { input: 'Camera + Recorder', output: 'Camcorder' }
    ],
    emoji: '🧩'
  },

  // --- UNIQUE / OTHER (6 + 2 new = 8) ---
  {
    id: 'neologism',
    term: '19. Neologism',
    category: 'unique',
    definition: 'Newly invented words that are entering common use.',
    examples: [
      { input: 'Selfie', output: 'Photo of self' },
      { input: 'Binge-watch', output: 'Watch many eps' },
      { input: 'Hangry', output: 'Hungry + Angry' },
      { input: 'Ghosting', output: 'Ignoring texts' },
      { input: 'Mansplain', output: 'Condescending explain' },
      { input: 'Photobomb', output: 'Ruining a photo' },
      { input: 'Crowdfunding', output: 'Raising money online' },
      { input: 'Staycation', output: 'Vacation at home' },
      { input: 'Troll', output: 'Internet pest' },
      { input: 'Meme', output: 'Viral joke' }
    ],
    emoji: '🆕'
  },
  {
    id: 'oxymoron',
    term: '20. Oxymoron',
    category: 'unique',
    definition: 'A figure of speech combining contradictory terms.',
    examples: [
      { input: 'Jumbo', output: 'Shrimp' },
      { input: 'Deafening', output: 'Silence' },
      { input: 'Old', output: 'News' },
      { input: 'Living', output: 'Dead' },
      { input: 'Pretty', output: 'Ugly' },
      { input: 'Seriously', output: 'Funny' },
      { input: 'Virtual', output: 'Reality' },
      { input: 'Act', output: 'Naturally' },
      { input: 'Awfully', output: 'Good' },
      { input: 'Small', output: 'Crowd' }
    ],
    emoji: '🍤'
  },
  {
    id: 'retronym',
    term: '21. Retronym',
    category: 'unique',
    definition: 'A new name for an old object to differentiate it from a newer version.',
    examples: [
      { input: 'Guitar', output: 'Acoustic Guitar' },
      { input: 'Mail', output: 'Snail Mail' },
      { input: 'Phone', output: 'Landline' },
      { input: 'Clock', output: 'Analog Clock' },
      { input: 'Film', output: 'Silent Film' },
      { input: 'War', output: 'First World War' },
      { input: 'TV', output: 'Black & White TV' },
      { input: 'Book', output: 'Hardcover Book' },
      { input: 'Milk', output: 'Whole Milk' },
      { input: 'Camera', output: 'Film Camera' }
    ],
    emoji: '📼'
  },
  {
    id: 'spoonerism',
    term: '22. Spoonerism',
    category: 'unique',
    definition: 'Swapping the starting sounds of words for a funny effect.',
    examples: [
      { input: 'Lighting a fire', output: 'Fighting a liar' },
      { input: 'Bunny phone', output: 'Funny bone' },
      { input: 'Tease my ears', output: 'Ease my tears' },
      { input: 'Wave the sails', output: 'Save the whales' },
      { input: 'Know your blows', output: 'Blow your nose' },
      { input: 'Bedding wells', output: 'Wedding bells' },
      { input: 'Belly jeans', output: 'Jelly beans' },
      { input: 'Cattle ships', output: 'Battle ships' },
      { input: 'Lack of pies', output: 'Pack of lies' },
      { input: 'Go and shake a tower', output: 'Go and take a shower' }
    ],
    emoji: '🥄'
  },
  {
    id: 'tautogram',
    term: '23. Tautogram',
    category: 'unique',
    definition: 'A sentence where every word starts with the same letter.',
    examples: [
      { input: 'P', output: 'Peter Piper picked a peck...' },
      { input: 'B', output: 'Big black bears bleed blue blood.' },
      { input: 'S', output: 'Seven slippery snails slid slowly.' },
      { input: 'C', output: 'Crazy cats can catch cold.' },
      { input: 'D', output: 'Dirty dogs dig deep ditches.' },
      { input: 'F', output: 'Five fat frogs fly fast.' },
      { input: 'G', output: 'Green grass grows gradually.' },
      { input: 'H', output: 'Happy hippos hop high.' },
      { input: 'M', output: 'Many mice make much music.' },
      { input: 'W', output: 'Wild wolves wander west.' }
    ],
    emoji: '🅱️'
  },
  {
    id: 'tautonym',
    term: '24. Tautonym',
    category: 'unique',
    definition: 'A word or name made up of two identical parts.',
    examples: [
      { input: 'Mediocre', output: 'So-so' },
      { input: 'Drum', output: 'Tom-tom' },
      { input: 'Soft sound', output: 'Murmur' },
      { input: 'Dance skirt', output: 'Tutu' },
      { input: 'Fruit', output: 'Pawpaw' },
      { input: 'Candy', output: 'Bonbon' },
      { input: 'Food grain', output: 'Couscous' },
      { input: 'Dog breed', output: 'Chow chow' },
      { input: 'Disease', output: 'Beriberi' },
      { input: 'Jelly substance', output: 'Agar-agar' }
    ],
    emoji: '👯'
  }
];

// --- Helper Component: Universal Flip Card ---
const UniversalFlipCard = ({ examples }) => {
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
        className="cursor-pointer perspective-1000 w-full max-w-xs h-48 relative mb-4 group"
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`w-full h-full transition-all duration-500 transform preserve-3d relative ${flipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-slate-50 rounded-2xl border-2 border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:shadow-md transition-shadow p-4 text-center">
            <span className="text-slate-400 text-xs uppercase tracking-widest mb-2 font-bold">Question / Prompt</span>
            <span className="text-2xl font-bold text-slate-800">{current.input}</span>
            <div className="mt-4 text-blue-500 text-sm flex items-center gap-1 font-semibold animate-pulse">Tap to Reveal <RefreshCcw size={12}/></div>
          </div>
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden bg-indigo-600 rounded-2xl rotate-y-180 flex flex-col items-center justify-center text-white shadow-lg p-4 text-center">
            <span className="text-indigo-200 text-xs uppercase tracking-widest mb-2 font-bold">Answer</span>
            <span className="text-2xl font-bold">{current.output}</span>
          </div>
        </div>
      </div>
      <button 
        onClick={handleNext}
        className="px-6 py-2 bg-white border-2 border-slate-200 rounded-full text-sm font-bold text-slate-600 hover:border-blue-400 hover:text-blue-500 transition-all shadow-sm hover:shadow-md"
      >
        Next Example ({idx + 1}/{examples.length})
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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-yellow-200 pb-20">
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
                Spell<span className="text-yellow-500">bound</span>
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
                    Tap to play <RefreshCcw size={12} className="ml-1" />
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

              {/* Interactive Section - UNIFIED FLIP CARD FOR EVERYTHING */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Puzzle size={20} className="text-purple-500" />
                  See it in action!
                </h3>

                <div className="flex justify-center">
                  <UniversalFlipCard examples={selectedWord.examples} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}