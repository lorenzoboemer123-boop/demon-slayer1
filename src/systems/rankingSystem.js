import { coinsForRank } from './rewardSystem.js';

const RANKS = ['F', 'D', 'C', 'B', 'A', 'S'];

export function calculateRank({ won, clearTime, damageTaken }) {
  if (!won) return { rank: 'F', coins: 0, score: 0 };

  let score = 1000;
  score -= clearTime * 13;
  score -= damageTaken * 8;

  let rank = 'D';
  if (score >= 860 && damageTaken <= 10 && clearTime <= 30) rank = 'S';
  else if (score >= 720 && damageTaken <= 22 && clearTime <= 42) rank = 'A';
  else if (score >= 560 && damageTaken <= 38 && clearTime <= 55) rank = 'B';
  else if (score >= 390) rank = 'C';

  return { rank, coins: coinsForRank(rank), score: Math.max(0, Math.round(score)) };
}

export { RANKS };
