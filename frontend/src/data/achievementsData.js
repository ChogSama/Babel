// Sprint 6 — Achievement definitions with unlock conditions
// Each achievement has a `check(player, sessionResults)` function that returns true when earned.

export const ACHIEVEMENTS = [
  {
    id: 'first_question',
    name: 'First Steps',
    description: 'Answer your first question',
    icon: '🎯',
    rarity: 'Common',
    xpReward: 50,
    check: (player) => player.questionsCompleted >= 1,
  },
  {
    id: 'streak_5',
    name: 'On Fire',
    description: 'Maintain a 5-day streak',
    icon: '🔥',
    rarity: 'Uncommon',
    xpReward: 150,
    check: (player) => player.streak >= 5,
  },
  {
    id: 'linguist',
    name: 'Linguist',
    description: 'Explore 3 languages',
    icon: '🌍',
    rarity: 'Rare',
    xpReward: 300,
    check: (player) => player.languagesExplored >= 3,
  },
  {
    id: 'vocabulary_50',
    name: 'Word Collector',
    description: 'Discover 50 vocabulary words',
    icon: '📚',
    rarity: 'Uncommon',
    xpReward: 200,
    check: (player) => player.wordsDiscovered >= 50,
  },
  {
    id: 'perfect_round',
    name: 'Perfect Round',
    description: 'Complete an Expedition without using any hints',
    icon: '⭐',
    rarity: 'Epic',
    xpReward: 500,
    check: (player, sessionResults) =>
      sessionResults &&
      sessionResults.length >= 3 &&
      sessionResults.every(r => r.hintsUsed === 0 && r.correct),
  },
  {
    id: 'accuracy_ace',
    name: 'Accuracy Ace',
    description: 'Reach 80% overall accuracy',
    icon: '🎯',
    rarity: 'Rare',
    xpReward: 350,
    check: (player) => player.accuracyRate >= 80,
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Answer 100 questions correctly',
    icon: '🎓',
    rarity: 'Rare',
    xpReward: 400,
    check: (player) => player.correctAnswers >= 100,
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Explore all 5 languages',
    icon: '👑',
    rarity: 'Legendary',
    xpReward: 1000,
    check: (player) => player.languagesExplored >= 5,
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Answer 5 questions in a single session with no hints',
    icon: '⚡',
    rarity: 'Epic',
    xpReward: 500,
    check: (player, sessionResults) =>
      sessionResults &&
      sessionResults.length >= 5 &&
      sessionResults.every(r => r.hintsUsed === 0),
  },
  {
    id: 'centurion',
    name: 'Centurion',
    description: 'Complete 100 questions total',
    icon: '🏛️',
    rarity: 'Rare',
    xpReward: 400,
    check: (player) => player.questionsCompleted >= 100,
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Reach a total score of 10,000 points',
    icon: '💫',
    rarity: 'Uncommon',
    xpReward: 250,
    check: (player) => player.totalScore >= 10000,
  },
  {
    id: 'level_10',
    name: 'Rising Star',
    description: 'Reach Level 10',
    icon: '🌟',
    rarity: 'Rare',
    xpReward: 500,
    check: (player) => player.level >= 10,
  },
];

// Rarity display colours (mirrors DashboardScreen)
export const RARITY_COLORS = {
  Common:       'var(--clr-text-muted)',
  Uncommon:     'var(--clr-success)',
  Rare:         'var(--clr-accent)',
  Epic:         'var(--clr-primary-light)',
  Legendary:    'var(--clr-gold)',
};

/**
 * Evaluate which achievements are newly unlocked after a session.
 * @param {object}   player         – current player state (post-update)
 * @param {string[]} alreadyEarned  – achievement ids already in player.achievements
 * @param {Array}    sessionResults – array of { correct, hintsUsed } per question
 * @returns {Array} newly unlocked achievement objects
 */
export function evaluateAchievements(player, alreadyEarned, sessionResults) {
  return ACHIEVEMENTS.filter(ach => {
    if (alreadyEarned.includes(ach.id)) return false;
    return ach.check(player, sessionResults);
  });
}
