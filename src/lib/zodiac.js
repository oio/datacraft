export const ZODIAC_SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
];

export const ZODIAC_INFO = {
  aries: {
    emoji: "♈",
    element: "Fire",
    traits: ["Bold", "Energetic", "Direct"],
    description: "Energetic and bold - this fridge has fire energy!"
  },
  taurus: {
    emoji: "♉", 
    element: "Earth",
    traits: ["Reliable", "Grounded", "Practical"],
    description: "Reliable and grounded - a steady companion for your kitchen."
  },
  gemini: {
    emoji: "♊",
    element: "Air", 
    traits: ["Versatile", "Adaptable", "Curious"],
    description: "Versatile and adaptable - this fridge has dual personality."
  },
  cancer: {
    emoji: "♋",
    element: "Water",
    traits: ["Nurturing", "Protective", "Intuitive"], 
    description: "Nurturing and protective - perfect for family meals."
  },
  leo: {
    emoji: "♌",
    element: "Fire",
    traits: ["Bold", "Dramatic", "Confident"],
    description: "Bold and dramatic - this fridge demands attention!"
  },
  virgo: {
    emoji: "♍",
    element: "Earth", 
    traits: ["Organized", "Precise", "Analytical"],
    description: "Organized and precise - everything has its place."
  },
  libra: {
    emoji: "♎",
    element: "Air",
    traits: ["Balanced", "Elegant", "Harmonious"],
    description: "Balanced and elegant - harmony in the kitchen."
  },
  scorpio: {
    emoji: "♏",
    element: "Water",
    traits: ["Mysterious", "Intense", "Transformative"], 
    description: "Mysterious and intense - deep and transformative energy."
  },
  sagittarius: {
    emoji: "♐",
    element: "Fire",
    traits: ["Adventurous", "Optimistic", "Free-spirited"],
    description: "Adventurous and spacious - ready for culinary journeys."
  },
  capricorn: {
    emoji: "♑",
    element: "Earth",
    traits: ["Structured", "Reliable", "Ambitious"],
    description: "Structured and reliable - built to last."
  },
  aquarius: {
    emoji: "♒",
    element: "Air", 
    traits: ["Innovative", "Unique", "Independent"],
    description: "Innovative and unique - ahead of its time."
  },
  pisces: {
    emoji: "♓",
    element: "Water",
    traits: ["Intuitive", "Flowing", "Empathetic"],
    description: "Intuitive and flowing - goes with the flow of your needs."
  }
};

export function getZodiacEmoji(sign) {
  return ZODIAC_INFO[sign]?.emoji || "⭐";
}

export function getZodiacDescription(sign) {
  return ZODIAC_INFO[sign]?.description || "A mysterious cosmic fridge energy.";
}