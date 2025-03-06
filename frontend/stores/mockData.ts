import { WordCategory, Word } from "./types";
import { DIFFICULTY_LEVELS, PARTS_OF_SPEECH } from "./enums";

export const categories: WordCategory[] = [
  {
    id: "1",
    icon: "book-open-variant",
    name: "Books",
    description: "Books",
    category: "Books",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    icon: "movie-open",
    name: "Movies",
    description: "Movies",
    category: "Movies",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    icon: "brain",
    name: "Philosophy",
    description: "Philosophy",
    category: "Philosophy",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    icon: "flask",
    name: "Science",
    description: "Science",
    category: "Science",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    icon: "laptop",
    name: "Technology",
    description: "Technology",
    category: "Technology",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    icon: "music",
    name: "Music",
    description: "Music",
    category: "Music",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    icon: "gamepad-variant",
    name: "Games",
    description: "Games",
    category: "Games",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    icon: "food",
    name: "Food",
    description: "Food",
    category: "Food",
    difficultyLevel: "beginner",
    words: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const wordData: Word[] = [
  {
    id: "1",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "ephemeral",
    definition: "lasting for a very short time",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "The ephemeral beauty of cherry blossoms makes them special.",
      "Social media fame can be ephemeral and fleeting.",
    ],
    synonyms: ["temporary", "fleeting", "transient", "momentary"],
    antonyms: ["permanent", "lasting", "eternal"],
    etymology: "From Greek 'ephemeros' meaning 'lasting only one day'",
    usageNotes: "Often used to describe natural phenomena or temporary states",
    tags: ["time", "nature", "description"],
    options: ["temporary", "delicate", "beautiful", "rare"],
    correctAnswer: "temporary",
  },
  {
    id: "2",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "ubiquitous",
    definition: "present, appearing, or found everywhere",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "Smartphones have become ubiquitous in modern society.",
      "Coffee shops are ubiquitous in most major cities.",
    ],
    synonyms: ["omnipresent", "universal", "widespread"],
    antonyms: ["rare", "scarce", "uncommon"],
    etymology: "From Latin 'ubique' meaning 'everywhere'",
    usageNotes: "Commonly used to describe technology and modern phenomena",
    tags: ["presence", "technology", "society"],
    options: ["omnipresent", "unique", "sporadic", "innovative"],
    correctAnswer: "omnipresent",
  },
  {
    id: "3",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "serendipity",
    definition:
      "the occurrence of finding pleasant or valuable things by chance",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.NOUN,
    exampleSentences: [
      "Meeting his future wife at the airport was pure serendipity.",
      "Many scientific discoveries happened through serendipity.",
    ],
    synonyms: ["chance", "fortune", "luck"],
    antonyms: ["misfortune", "design", "plan"],
    etymology:
      "Coined by Horace Walpole in 1754 from the Persian fairy tale 'The Three Princes of Serendip'",
    usageNotes:
      "Often used in contexts of discovery and fortunate coincidences",
    tags: ["luck", "discovery", "chance"],
    options: ["chance", "destiny", "intention", "effort"],
    correctAnswer: "chance",
  },
  {
    id: "4",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "meticulous",
    definition: "showing great attention to detail; very careful and precise",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "The surgeon was meticulous in her preparation for the operation.",
      "His meticulous research led to a groundbreaking discovery.",
    ],
    synonyms: ["thorough", "precise", "fastidious", "scrupulous"],
    antonyms: ["careless", "sloppy", "negligent"],
    etymology: "From Latin 'meticulosus' meaning 'fearful, timid'",
    usageNotes:
      "Often used to describe people's work habits or attention to detail",
    tags: ["precision", "detail", "care"],
    options: ["thorough", "creative", "efficient", "quick"],
    correctAnswer: "thorough",
  },
  {
    id: "5",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "eloquent",
    definition: "fluent or persuasive in speaking or writing",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "She gave an eloquent speech that moved the entire audience.",
      "His eloquent writing style made complex topics accessible.",
    ],
    synonyms: ["articulate", "fluent", "expressive", "persuasive"],
    antonyms: ["inarticulate", "awkward", "halting"],
    etymology: "From Latin 'eloquens' meaning 'speaking out'",
    usageNotes:
      "Describes effective communication that is both clear and impactful",
    tags: ["communication", "speech", "writing"],
    options: ["articulate", "emotional", "loud", "lengthy"],
    correctAnswer: "articulate",
  },
  {
    id: "6",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "juxtapose",
    definition: "to place or deal with close together for contrasting effect",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.VERB,
    exampleSentences: [
      "The film juxtaposes scenes from the past and present.",
      "The artist juxtaposed bright colors against a dark background.",
    ],
    synonyms: ["contrast", "compare", "place side by side"],
    antonyms: ["separate", "isolate", "disconnect"],
    etymology:
      "From French 'juxtaposer', from Latin 'juxta' (next to) + French 'poser' (to place)",
    usageNotes: "Commonly used in artistic, literary, and academic contexts",
    tags: ["comparison", "contrast", "arrangement"],
    options: ["contrast", "blend", "separate", "align"],
    correctAnswer: "contrast",
  },
  {
    id: "7",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "ambivalent",
    definition: "having mixed feelings or contradictory ideas about something",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "She felt ambivalent about moving to a new city.",
      "Many voters remain ambivalent about both candidates.",
    ],
    synonyms: ["conflicted", "uncertain", "indecisive", "undecided"],
    antonyms: ["decided", "certain", "unequivocal"],
    etymology:
      "From German 'Ambivalenz', coined by psychologist Eugen Bleuler in 1910",
    usageNotes: "Used to describe emotional or mental states of uncertainty",
    tags: ["emotion", "psychology", "uncertainty"],
    options: ["conflicted", "opposed", "supportive", "indifferent"],
    correctAnswer: "conflicted",
  },
  {
    id: "8",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "egregious",
    definition: "outstandingly bad; shocking",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "The report revealed egregious human rights violations.",
      "His behavior at the ceremony was particularly egregious.",
    ],
    synonyms: ["flagrant", "outrageous", "shocking", "appalling"],
    antonyms: ["mild", "minor", "negligible"],
    etymology: "From Latin 'egregius' meaning 'distinguished, eminent'",
    usageNotes:
      "Originally meant 'remarkably good' but has evolved to mean the opposite",
    tags: ["negative", "extreme", "behavior"],
    options: ["flagrant", "minor", "excellent", "unusual"],
    correctAnswer: "flagrant",
  },
  {
    id: "9",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "pernicious",
    definition:
      "having a harmful effect, especially in a gradual or subtle way",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "The pernicious effects of pollution can take years to become evident.",
      "The article discussed the pernicious influence of misinformation.",
    ],
    synonyms: ["harmful", "destructive", "injurious", "malicious"],
    antonyms: ["beneficial", "constructive", "advantageous"],
    etymology: "From Latin 'perniciosus' meaning 'destructive'",
    usageNotes:
      "Often used to describe long-term or insidious negative effects",
    tags: ["harmful", "negative", "subtle"],
    options: ["harmful", "beneficial", "neutral", "obvious"],
    correctAnswer: "harmful",
  },
  {
    id: "10",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "pragmatic",
    definition: "dealing with things sensibly and realistically",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "We need a pragmatic approach to solving this problem.",
      "She's known for her pragmatic leadership style.",
    ],
    synonyms: ["practical", "realistic", "sensible", "rational"],
    antonyms: ["idealistic", "impractical", "unrealistic"],
    etymology: "From Greek 'pragma' meaning 'deed' or 'action'",
    usageNotes:
      "Often used to describe approaches that focus on practicality over theory",
    tags: ["practical", "approach", "philosophy"],
    options: ["practical", "theoretical", "emotional", "traditional"],
    correctAnswer: "practical",
  },
  {
    id: "11",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "innocuous",
    definition: "not harmful or offensive",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "His comment was meant to be innocuous, but she took offense.",
      "The medicine may cause some innocuous side effects.",
    ],
    synonyms: ["harmless", "inoffensive", "benign", "innocent"],
    antonyms: ["harmful", "offensive", "dangerous"],
    etymology: "From Latin 'innocuus' meaning 'harmless'",
    usageNotes:
      "Often used to describe something that appears more harmless than it might actually be",
    tags: ["harmless", "safety", "mild"],
    options: ["harmless", "dangerous", "significant", "medicinal"],
    correctAnswer: "harmless",
  },
  {
    id: "12",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "scrutinize",
    definition: "examine or inspect closely and thoroughly",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.VERB,
    exampleSentences: [
      "Experts scrutinized the painting to determine its authenticity.",
      "The committee will scrutinize all applications carefully.",
    ],
    synonyms: ["examine", "inspect", "analyze", "investigate"],
    antonyms: ["ignore", "overlook", "disregard"],
    etymology: "From Latin 'scrutari' meaning 'to search'",
    usageNotes: "Implies a level of thoroughness and attention to detail",
    tags: ["examination", "detail", "investigation"],
    options: ["examine", "approve", "ignore", "summarize"],
    correctAnswer: "examine",
  },
  {
    id: "13",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "quintessential",
    definition: "representing the most perfect or typical example of something",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "The small cafe is the quintessential Parisian experience.",
      "He is the quintessential New Yorker, always in a hurry.",
    ],
    synonyms: ["archetypal", "typical", "classic", "exemplary"],
    antonyms: ["atypical", "uncharacteristic", "unusual"],
    etymology: "From Medieval Latin 'quinta essentia' meaning 'fifth essence'",
    usageNotes:
      "Often used to describe something that embodies the essence of a category",
    tags: ["typical", "essence", "example"],
    options: ["typical", "unique", "rare", "moderate"],
    correctAnswer: "typical",
  },
  {
    id: "14",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "assimilate",
    definition:
      "take in and understand information or ideas; absorb and integrate",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.VERB,
    exampleSentences: [
      "It takes time to assimilate new concepts in mathematics.",
      "Immigrants often struggle to assimilate into a new culture.",
    ],
    synonyms: ["absorb", "integrate", "incorporate", "digest"],
    antonyms: ["reject", "exclude", "expel"],
    etymology: "From Latin 'assimilare' meaning 'to make similar'",
    usageNotes:
      "Used both for mental processing of information and cultural integration",
    tags: ["learning", "integration", "adaptation"],
    options: ["absorb", "reject", "forget", "confuse"],
    correctAnswer: "absorb",
  },
  {
    id: "15",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "verbose",
    definition: "using or containing more words than are necessary",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "His verbose explanation confused rather than clarified the issue.",
      "The manual was unnecessarily verbose and difficult to follow.",
    ],
    synonyms: ["wordy", "long-winded", "prolix", "garrulous"],
    antonyms: ["concise", "succinct", "terse"],
    etymology: "From Latin 'verbosus' meaning 'full of words'",
    usageNotes:
      "Generally has a negative connotation suggesting inefficiency in communication",
    tags: ["communication", "writing", "speech"],
    options: ["wordy", "concise", "eloquent", "technical"],
    correctAnswer: "wordy",
  },
  {
    id: "16",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "fastidious",
    definition: "very attentive to and concerned about accuracy and detail",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "She is fastidious about keeping her workspace clean and organized.",
      "The chef was fastidious in the preparation of each dish.",
    ],
    synonyms: ["meticulous", "particular", "exacting", "demanding"],
    antonyms: ["careless", "sloppy", "negligent"],
    etymology: "From Latin 'fastidiosus' meaning 'disdainful'",
    usageNotes:
      "Can describe both positive attention to detail and excessive fussiness",
    tags: ["detail", "precision", "careful"],
    options: ["meticulous", "relaxed", "creative", "ambitious"],
    correctAnswer: "meticulous",
  },
  {
    id: "17",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "lucid",
    definition: "expressed clearly; easy to understand",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "She gave a lucid explanation of the complex scientific concept.",
      "Even in his old age, he maintained a lucid mind.",
    ],
    synonyms: ["clear", "intelligible", "comprehensible", "articulate"],
    antonyms: ["unclear", "confusing", "vague"],
    etymology: "From Latin 'lucidus' meaning 'bright, clear'",
    usageNotes:
      "Can refer to both clarity of expression and clarity of thought",
    tags: ["clarity", "understanding", "expression"],
    options: ["clear", "complex", "emotional", "detailed"],
    correctAnswer: "clear",
  },
  {
    id: "18",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "procrastinate",
    definition: "delay or postpone action; put off doing something",
    difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
    partOfSpeech: PARTS_OF_SPEECH.VERB,
    exampleSentences: [
      "Students often procrastinate when they have difficult assignments.",
      "Don't procrastinate on making that doctor's appointment.",
    ],
    synonyms: ["delay", "postpone", "defer", "stall"],
    antonyms: ["act", "advance", "expedite"],
    etymology:
      "From Latin 'procrastinatus', from 'pro' (forward) + 'crastinus' (of tomorrow)",
    usageNotes:
      "Usually has a negative connotation suggesting poor time management",
    tags: ["time", "behavior", "delay"],
    options: ["delay", "hurry", "organize", "complete"],
    correctAnswer: "delay",
  },
  {
    id: "19",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "benevolent",
    definition: "well-meaning and kindly",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "The benevolent donor wished to remain anonymous.",
      "She was known for her benevolent attitude toward her employees.",
    ],
    synonyms: ["kind", "charitable", "generous", "altruistic"],
    antonyms: ["malevolent", "cruel", "unkind"],
    etymology:
      "From Latin 'benevolens', from 'bene' (well) + 'volens' (wishing)",
    usageNotes:
      "Often used to describe people in positions of power who use that power kindly",
    tags: ["kindness", "character", "positive"],
    options: ["kind", "strict", "powerful", "ambitious"],
    correctAnswer: "kind",
  },
  {
    id: "20",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "resilient",
    definition:
      "able to withstand or recover quickly from difficult conditions",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "Children are often more resilient than adults when facing adversity.",
      "The resilient economy bounced back after the recession.",
    ],
    synonyms: ["tough", "adaptable", "hardy", "flexible"],
    antonyms: ["fragile", "vulnerable", "weak"],
    etymology:
      "From Latin 'resiliens', present participle of 'resilire' (to rebound)",
    usageNotes:
      "Used to describe both physical materials and emotional/psychological strength",
    tags: ["strength", "recovery", "adaptation"],
    options: ["tough", "fragile", "rigid", "cautious"],
    correctAnswer: "tough",
  },
  {
    id: "21",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "inundate",
    definition: "overwhelm with things or people to be dealt with",
    difficultyLevel: DIFFICULTY_LEVELS.INTERMEDIATE,
    partOfSpeech: PARTS_OF_SPEECH.VERB,
    exampleSentences: [
      "After the announcement, they were inundated with applications.",
      "The charity was inundated with donations following the disaster.",
    ],
    synonyms: ["flood", "overwhelm", "swamp", "deluge"],
    antonyms: ["trickle", "deprive", "drain"],
    etymology:
      "From Latin 'inundatus', past participle of 'inundare' (to flood)",
    usageNotes:
      "Often used hyperbolically to describe being overwhelmed with tasks or information",
    tags: ["overwhelming", "quantity", "excess"],
    options: ["overwhelm", "organize", "reduce", "manage"],
    correctAnswer: "overwhelm",
  },
  {
    id: "22",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "capricious",
    definition: "given to sudden and unaccountable changes of mood or behavior",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "Her capricious nature made it difficult to predict her reaction.",
      "The weather in the mountains can be capricious and dangerous.",
    ],
    synonyms: ["fickle", "unpredictable", "whimsical", "erratic"],
    antonyms: ["consistent", "stable", "reliable"],
    etymology: "From Italian 'capriccioso', from 'capriccio' (whim)",
    usageNotes:
      "Often used to describe people's temperament or natural phenomena",
    tags: ["unpredictable", "temperament", "change"],
    options: ["fickle", "consistent", "deliberate", "careful"],
    correctAnswer: "fickle",
  },
  {
    id: "23",
    createdAt: new Date(),
    updatedAt: new Date(),
    word: "voracious",
    definition: "having a very eager approach to an activity; extremely hungry",
    difficultyLevel: DIFFICULTY_LEVELS.ADVANCED,
    partOfSpeech: PARTS_OF_SPEECH.ADJECTIVE,
    exampleSentences: [
      "She is a voracious reader who finishes several books a week.",
      "The voracious animal devoured its prey in seconds.",
    ],
    synonyms: ["ravenous", "insatiable", "greedy", "hungry"],
    antonyms: ["moderate", "temperate", "satiated"],
    etymology: "From Latin 'vorax', from 'vorare' (to devour)",
    usageNotes:
      "Can be used both literally for appetite and figuratively for enthusiasm",
    tags: ["appetite", "enthusiasm", "consumption"],
    options: ["ravenous", "moderate", "selective", "occasional"],
    correctAnswer: "ravenous",
  },
];

export const wordLists = [
  {
    id: "1",
    title: "100 Words Every Middle Schooler Should Know",
    description:
      "This comprehensive vocabulary list helps middle school students build essential language skills and prepare for academic success.",
    imageUrl:
      "https://images.unsplash.com/photo-1588072432836-e100327743c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Education",
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    wordCount: 100,
  },
  {
    id: "2",
    title: "SAT Vocabulary Essentials",
    description:
      "Master the most frequently appearing words in SAT exams with this carefully curated list.",
    imageUrl:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Education",
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    wordCount: 500,
  },
  {
    id: "3",
    title: "Business Professional Vocabulary",
    description:
      "Essential vocabulary for business professionals, including common terms used in meetings, emails, and presentations.",
    imageUrl:
      "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Business",
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    wordCount: 200,
  },
  {
    id: "4",
    title: "Medical Terminology Basics",
    description:
      "A foundational list of medical terms and vocabulary essential for healthcare professionals and students.",
    imageUrl:
      "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Medical",
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    wordCount: 300,
  },
  {
    id: "5",
    title: "Technology and Computing Terms",
    description:
      "Stay up-to-date with essential technology vocabulary used in software development and IT.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Technology",
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    wordCount: 150,
  },
  {
    id: "6",
    title: "Literary Terms and Devices",
    description:
      "Explore the language of literature with this comprehensive list of literary terms and devices.",
    imageUrl:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Literature",
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    wordCount: 120,
  },
  {
    id: "7",
    title: "Common Legal Terms",
    description:
      "Essential legal vocabulary for law students, paralegals, and anyone interested in legal terminology.",
    imageUrl:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Legal",
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    wordCount: 250,
  },
  {
    id: "8",
    title: "Everyday Conversation Skills",
    description:
      "Improve your daily communication with this collection of commonly used phrases and expressions.",
    imageUrl:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "General",
    difficulty: DIFFICULTY_LEVELS.BEGINNER,
    wordCount: 100,
  },
  {
    id: "9",
    title: "Academic Writing Vocabulary",
    description:
      "Enhance your academic writing with sophisticated vocabulary commonly used in research papers and essays.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Academic",
    difficulty: DIFFICULTY_LEVELS.ADVANCED,
    wordCount: 200,
  },
  {
    id: "10",
    title: "Creative Writing Words",
    description:
      "Expand your creative writing vocabulary with descriptive words and phrases for storytelling.",
    imageUrl:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-1.2.1&auto=format&fit=crop&w=600",
    category: "Creative",
    difficulty: DIFFICULTY_LEVELS.INTERMEDIATE,
    wordCount: 150,
  },
];

export const globalLeaderboard = [
  { id: "1", name: "Alice", points: 1500 },
  { id: "2", name: "Bob", points: 1400 },
  { id: "3", name: "You", points: 1200, isCurrentUser: true },
  { id: "4", name: "Charlie", points: 1100 },
];

export const friendsLeaderboard = [
  { id: "1", name: "Friend 1", points: 1300 },
  { id: "2", name: "You", points: 1200, isCurrentUser: true },
  { id: "3", name: "Friend 2", points: 1000 },
];

export const personalStats = {
  highestScore: 350,
  averageScore: 200,
  gamesPlayed: 20,
  wordsLearned: 150,
  accuracy: 85,
};
