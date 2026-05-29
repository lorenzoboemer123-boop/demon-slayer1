export const DIFFICULTIES = {
  easy: {
    label: 'Easy',
    retriesAllowed: true,
    description: 'Retries allowed. A retry clear pays 40% coins later; combat stats are unchanged for this prototype.',
  },
  medium: {
    label: 'Medium',
    retriesAllowed: true,
    description: 'Retries allowed. Future retries only reward a better rank; combat stats are unchanged for now.',
  },
  hard: {
    label: 'Hard',
    retriesAllowed: true,
    description: 'Retries allowed. Later fights will enforce stricter canon character choices.',
  },
  hardcore: {
    label: 'Hardcore',
    retriesAllowed: false,
    description: 'No retries. Future F ranks restart the whole run; this tutorial currently keeps combat stats unchanged.',
  },
};
