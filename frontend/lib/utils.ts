export function shuffleArray<T>(arr: T[]): T[] {
  const newArr = [...arr];
  let currIdx = newArr.length;
  while (currIdx !== 0) {
    let randIdx = Math.floor(Math.random() * currIdx);
    currIdx--;
    [newArr[currIdx], newArr[randIdx]] = [newArr[randIdx], newArr[currIdx]];
  }
  return newArr;
}

export const getPartOfSpeechColor = (pos: string, defaultColor: string) => {
  switch (pos.toLowerCase()) {
    case "noun":
      return "#4285F4"; // Blue
    case "verb":
      return "#EA4335"; // Red
    case "adjective":
      return "#FBBC05"; // Yellow
    case "adverb":
      return "#34A853"; // Green
    case "pronoun":
      return "#8E44AD"; // Purple
    case "preposition":
      return "#F39C12"; // Orange
    case "conjunction":
      return "#1ABC9C"; // Teal
    case "interjection":
      return "#E74C3C"; // Bright Red
    case "determiner":
      return "#3498DB"; // Light Blue
    default:
      return defaultColor; // Default theme color
  }
};

export const getColorWithOpacity = (color: string, opacity: number) => {
  // Convert opacity to a value between 0 and 1
  const alpha = opacity / 100;

  // If color is already in rgba format, we need to parse it
  if (color.startsWith("rgba")) {
    const rgbaMatch = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/);
    if (rgbaMatch) {
      return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${alpha})`;
    }
  }

  // If color is in hex format
  if (color.startsWith("#")) {
    // Convert hex to RGB
    let r = 0,
      g = 0,
      b = 0;
    if (color.length === 4) {
      // #RGB format
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else if (color.length === 7) {
      // #RRGGBB format
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return color;
};

/**
 * List of common timezones for user selection
 */
export const timezones = [
  "Africa/Abidjan",
  "Africa/Accra",
  "Africa/Algiers",
  "Africa/Cairo",
  "Africa/Casablanca",
  "Africa/Johannesburg",
  "Africa/Lagos",
  "Africa/Nairobi",
  "America/Argentina/Buenos_Aires",
  "America/Bogota",
  "America/Chicago",
  "America/Denver",
  "America/Edmonton",
  "America/Halifax",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/New_York",
  "America/Phoenix",
  "America/Santiago",
  "America/Sao_Paulo",
  "America/St_Johns",
  "America/Toronto",
  "America/Vancouver",
  "Asia/Almaty",
  "Asia/Baghdad",
  "Asia/Bangkok",
  "Asia/Beirut",
  "Asia/Dhaka",
  "Asia/Dubai",
  "Asia/Hong_Kong",
  "Asia/Jakarta",
  "Asia/Jerusalem",
  "Asia/Karachi",
  "Asia/Kolkata",
  "Asia/Kuala_Lumpur",
  "Asia/Manila",
  "Asia/Qatar",
  "Asia/Seoul",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Asia/Taipei",
  "Asia/Tehran",
  "Asia/Tokyo",
  "Australia/Adelaide",
  "Australia/Brisbane",
  "Australia/Darwin",
  "Australia/Melbourne",
  "Australia/Perth",
  "Australia/Sydney",
  "Europe/Amsterdam",
  "Europe/Athens",
  "Europe/Belgrade",
  "Europe/Berlin",
  "Europe/Brussels",
  "Europe/Bucharest",
  "Europe/Budapest",
  "Europe/Copenhagen",
  "Europe/Dublin",
  "Europe/Helsinki",
  "Europe/Istanbul",
  "Europe/Kiev",
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Madrid",
  "Europe/Moscow",
  "Europe/Oslo",
  "Europe/Paris",
  "Europe/Prague",
  "Europe/Rome",
  "Europe/Stockholm",
  "Europe/Vienna",
  "Europe/Warsaw",
  "Europe/Zurich",
  "Pacific/Auckland",
  "Pacific/Fiji",
  "Pacific/Honolulu",
  "Pacific/Midway",
  "UTC",
];
