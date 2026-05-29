export const COIN_REWARDS = {
  F: 0,
  D: 15,
  C: 30,
  B: 50,
  A: 75,
  S: 110,
};

export function coinsForRank(rank) {
  return COIN_REWARDS[rank] ?? 0;
}
