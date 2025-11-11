/**
 * Offline word dictionaries organized by category
 * This provides fast, offline word validation
 */

// General words dictionary (common English words)
export const GENERAL_WORDS = new Set([
  // 3-letter words
  'cat', 'dog', 'bat', 'rat', 'hat', 'mat', 'sat', 'pat', 'fat', 'vat',
  'car', 'bar', 'tar', 'far', 'jar', 'war', 'man', 'can', 'fan', 'pan',
  'run', 'sun', 'fun', 'gun', 'bun', 'nun', 'pun', 'day', 'way', 'say',
  'bay', 'hay', 'jay', 'may', 'pay', 'ray', 'the', 'and', 'but', 'not',
  'for', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'are',

  // 4-letter words
  'word', 'game', 'play', 'time', 'work', 'year', 'back', 'call', 'come', 'give',
  'good', 'hand', 'high', 'keep', 'last', 'long', 'make', 'most', 'move', 'over',
  'same', 'take', 'tell', 'than', 'that', 'them', 'then', 'they', 'this', 'very',
  'want', 'well', 'what', 'when', 'will', 'with', 'your', 'book', 'cool', 'down',
  'each', 'find', 'fish', 'food', 'from', 'grow', 'here', 'home', 'into', 'just',

  // 5-letter words
  'about', 'above', 'after', 'again', 'below', 'could', 'every', 'first', 'found', 'great',
  'house', 'large', 'learn', 'never', 'other', 'place', 'plant', 'point', 'right', 'small',
  'sound', 'spell', 'still', 'study', 'their', 'there', 'these', 'thing', 'think', 'three',
  'under', 'water', 'where', 'which', 'world', 'would', 'write', 'years', 'beach', 'brain',
  'bread', 'brown', 'chair', 'chest', 'clean', 'clear', 'climb', 'close', 'cloud', 'dance',

  // 6+ letter words
  'animal', 'answer', 'before', 'better', 'between', 'change', 'create', 'differ', 'follow', 'friend',
  'important', 'interest', 'letter', 'little', 'mother', 'number', 'people', 'picture', 'school', 'second',
  'should', 'system', 'through', 'together', 'another', 'because', 'become', 'before', 'behind', 'believe',
  'building', 'business', 'children', 'community', 'computer', 'continue', 'country', 'develop', 'different', 'example',
]);

// Countries
export const COUNTRY_WORDS = new Set([
  'usa', 'japan', 'china', 'india', 'spain', 'italy', 'france', 'germany', 'canada', 'mexico',
  'brazil', 'russia', 'turkey', 'poland', 'sweden', 'norway', 'greece', 'egypt', 'chile', 'peru',
  'argentina', 'australia', 'portugal', 'belgium', 'austria', 'denmark', 'finland', 'ireland', 'thailand', 'vietnam',
  'philippines', 'indonesia', 'malaysia', 'singapore', 'pakistan', 'bangladesh', 'nigeria', 'kenya', 'morocco', 'tunisia',
  'southafrica', 'newzealand', 'iceland', 'luxembourg', 'switzerland', 'netherlands', 'czechia', 'hungary', 'romania', 'ukraine',
]);

// Animals
export const ANIMAL_WORDS = new Set([
  'cat', 'dog', 'bat', 'rat', 'fox', 'cow', 'pig', 'hen', 'bee', 'ant',
  'bear', 'deer', 'duck', 'fish', 'frog', 'goat', 'hawk', 'lion', 'mole', 'moth',
  'seal', 'swan', 'toad', 'wolf', 'worm', 'eagle', 'horse', 'mouse', 'otter', 'panda',
  'shark', 'sheep', 'snake', 'snail', 'tiger', 'whale', 'zebra', 'beaver', 'camel', 'cobra',
  'dolphin', 'donkey', 'ferret', 'giraffe', 'gorilla', 'hamster', 'jaguar', 'kitten', 'leopard', 'lizard',
  'monkey', 'parrot', 'penguin', 'rabbit', 'racoon', 'salmon', 'spider', 'squirrel', 'turtle', 'vulture',
  'elephant', 'kangaroo', 'hedgehog', 'crocodile', 'butterfly', 'alligator', 'chimpanzee', 'rhinoceros', 'hippopotamus',
]);

// Food
export const FOOD_WORDS = new Set([
  'pie', 'tea', 'egg', 'ham', 'jam', 'nut', 'bun', 'fig', 'yam', 'oat',
  'beef', 'bean', 'bread', 'cake', 'corn', 'crab', 'fish', 'grape', 'lamb', 'lime',
  'meat', 'milk', 'mint', 'olive', 'pasta', 'peach', 'pizza', 'plum', 'rice', 'roll',
  'salad', 'salt', 'soup', 'steak', 'sugar', 'sushi', 'taco', 'toast', 'bacon', 'berry',
  'butter', 'carrot', 'celery', 'cheese', 'cherry', 'chicken', 'cookie', 'garlic', 'ginger', 'honey',
  'lemon', 'mango', 'melon', 'muffin', 'onion', 'orange', 'pepper', 'pickle', 'potato', 'pretzel',
  'pumpkin', 'radish', 'raisin', 'salmon', 'tomato', 'waffle', 'walnut', 'yogurt', 'avocado', 'banana',
  'biscuit', 'burrito', 'cabbage', 'cashew', 'coconut', 'cracker', 'cupcake', 'lettuce', 'noodles', 'oatmeal',
  'pancake', 'peanut', 'popcorn', 'spinach', 'vanilla', 'zucchini', 'almond', 'apple', 'apricot',
]);

// Technology
export const TECHNOLOGY_WORDS = new Set([
  'app', 'bot', 'cpu', 'web', 'wifi', 'chip', 'code', 'data', 'disk', 'file',
  'game', 'icon', 'link', 'mail', 'menu', 'mouse', 'pixel', 'port', 'scan', 'tech',
  'cloud', 'debug', 'email', 'input', 'laser', 'logic', 'modem', 'pixel', 'power', 'print',
  'robot', 'screen', 'server', 'signal', 'software', 'system', 'tablet', 'upload', 'video', 'virus',
  'backup', 'battery', 'browser', 'button', 'camera', 'circuit', 'computer', 'digital', 'display', 'download',
  'firmware', 'gadget', 'graphics', 'hardware', 'internet', 'keyboard', 'laptop', 'memory', 'monitor', 'network',
  'operate', 'process', 'program', 'router', 'scanner', 'sensor', 'silicon', 'storage', 'terminal', 'touchpad',
  'algorithm', 'bluetooth', 'database', 'firewall', 'interface', 'microchip', 'processor', 'software', 'wireless',
]);

// Sports
export const SPORTS_WORDS = new Set([
  'run', 'ski', 'box', 'ball', 'base', 'bat', 'goal', 'game', 'golf', 'jump',
  'kick', 'pass', 'race', 'ring', 'shot', 'swim', 'team', 'win', 'archery', 'boxing',
  'cricket', 'cycling', 'diving', 'fencing', 'fitness', 'football', 'hockey', 'jogging', 'karate', 'polo',
  'racing', 'rugby', 'running', 'sailing', 'skating', 'skiing', 'soccer', 'sprint', 'surfing', 'tennis',
  'track', 'volley', 'yoga', 'baseball', 'basketball', 'bowling', 'climbing', 'gymnast', 'handball', 'marathon',
  'skateboard', 'swimming', 'wrestling', 'badminton', 'volleyball', 'athletics', 'triathlon',
]);

// Science
export const SCIENCE_WORDS = new Set([
  'atom', 'cell', 'gene', 'ion', 'mass', 'acid', 'base', 'bond', 'data', 'dose',
  'force', 'heat', 'light', 'phase', 'power', 'pulse', 'solar', 'space', 'speed', 'steam',
  'theory', 'virus', 'wave', 'biology', 'carbon', 'charge', 'chemistry', 'circuit', 'climate', 'crystal',
  'density', 'ecology', 'electron', 'element', 'energy', 'enzyme', 'formula', 'fusion', 'galaxy', 'genetic',
  'geology', 'gravity', 'habitat', 'hydrogen', 'isotope', 'kinetic', 'magnet', 'matter', 'molecule', 'neutron',
  'nitrogen', 'nucleus', 'organic', 'oxygen', 'particle', 'photon', 'physics', 'planet', 'plasma', 'polymer',
  'protein', 'proton', 'quantum', 'radiation', 'reaction', 'research', 'science', 'species', 'spectrum', 'stellar',
  'temperature', 'thermal', 'tissue', 'universe', 'vaccine', 'velocity', 'voltage', 'volume',
]);

// Arts
export const ARTS_WORDS = new Set([
  'art', 'draw', 'film', 'show', 'song', 'act', 'ballet', 'brush', 'canvas', 'choir',
  'color', 'craft', 'dance', 'drama', 'easel', 'frame', 'gallery', 'image', 'jazz', 'mural',
  'music', 'opera', 'paint', 'photo', 'piano', 'play', 'poem', 'sculpture', 'shade', 'sketch',
  'stage', 'still', 'stroke', 'studio', 'style', 'theatre', 'tone', 'violin', 'vocal', 'acting',
  'artist', 'ballad', 'carving', 'ceramic', 'classical', 'concert', 'creative', 'design', 'drawing', 'exhibit',
  'fiction', 'gallery', 'graphic', 'harmony', 'literature', 'melody', 'modern', 'mosaic', 'musical', 'novel',
  'painting', 'palette', 'perform', 'photograph', 'picture', 'poetry', 'portrait', 'rhythm', 'sculpture', 'symphony',
  'theater', 'visual', 'watercolor', 'abstract', 'animation', 'architecture', 'choreography',
]);

/**
 * Get word list for a specific category
 */
export function getWordListByCategory(category: string): Set<string> {
  switch (category.toLowerCase()) {
    case 'countries':
      return COUNTRY_WORDS;
    case 'animals':
      return ANIMAL_WORDS;
    case 'food':
      return FOOD_WORDS;
    case 'technology':
      return TECHNOLOGY_WORDS;
    case 'sports':
      return SPORTS_WORDS;
    case 'science':
      return SCIENCE_WORDS;
    case 'arts':
      return ARTS_WORDS;
    case 'general':
    default:
      return GENERAL_WORDS;
  }
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  return ['general', 'countries', 'animals', 'food', 'technology', 'sports', 'science', 'arts'];
}
