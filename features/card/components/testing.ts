/* eslint-disable @typescript-eslint/no-shadow */
export {};

const attributes = {
  color: ['red', 'green', 'blue'],
  shape: ['circle', 'square', 'triangle'],
  fill: ['solid', 'hollow', 'lined'],
  dots: [1, 2, 3],
};

const keys: string[] = Object.keys(attributes);

const getDispenser = () => {
  const dispenser: {
    [key: string]: (string | number)[];
  } = {};

  keys.forEach(_ => {
    const key = _ as keyof typeof attributes;

    dispenser[key] = [...attributes[key]].sort(() => Math.random() - 0.5);
  });

  return dispenser;
};

interface ICard {
  color: string;
  shape: string;
  fill: string;
  dots: number;
}

// create 12 cards with random attributes
let cards: ICard[] = [];

/**
 *
 */
const generateDifferentSet = (): ICard[] => {
  const newCards: ICard[] = [];

  const dispenser = getDispenser();

  while (
    Object.keys(dispenser).reduce(
      (acc, key) => acc + dispenser[key as keyof typeof dispenser].length,
      0,
    )
  ) {
    // pop the value of each key into a card object and push to newCards
    newCards.push({
      ...Object.fromEntries(
        keys.map(_ => [_, dispenser[_ as keyof typeof dispenser].pop()]),
      ),
    } as unknown as ICard);
  }

  return newCards;
};

const generateCommonSet = (): ICard[] => {
  const newCards: ICard[] = [];

  const dispenser = getDispenser();

  // pick one of color, fill, shape, or dots randomly
  const randomAttribute = Object.keys(dispenser)[Math.floor(Math.random() * 4)];

  // choose a random value from the randomAttribute of the dispenser
  const randomValue =
    dispenser[randomAttribute as keyof typeof dispenser].pop()!;

  // empty the attribute from the dispenser
  dispenser[randomAttribute as keyof typeof dispenser] = [];

  // create a new card with the random value set to the random attribute
  // do this while there are still values in the dispenser from any attribute
  while (
    Object.keys(dispenser).reduce(
      (acc, key) => acc + dispenser[key as keyof typeof dispenser].length,
      0,
    )
  ) {
    // pop the value of each key into a card object and push to newCards
    newCards.push({
      ...Object.fromEntries(
        keys.map(_ => [
          _,
          randomAttribute === _
            ? randomValue
            : dispenser[_ as keyof typeof dispenser].pop(),
        ]),
      ),
    } as unknown as ICard);
  }

  return newCards;
};

const generateRandomSet = (): ICard[] => {
  const newCards: ICard[] = [];

  let dispenser: { [key: string]: (string | number)[] } = {};

  for (let i = 0; i < 3; i++) {
    dispenser = getDispenser();

    newCards.push({
      ...Object.fromEntries(
        keys.map(_ => [_, dispenser[_ as keyof typeof dispenser].pop()]),
      ),
    } as unknown as ICard);
  }

  return newCards;
};

// merge array of generateDifferentSet, generateCommonSet, and 2 random sets
cards = [
  ...generateDifferentSet(),
  ...generateCommonSet(),
  ...generateRandomSet(),
  ...generateRandomSet(),
];

// function to find different sets in an array of cards
const findDifferentSets = (cards: ICard[]): ICard[][] => {
  const differentSets: ICard[][] = [];

  const push = (i: number, j: number, k: number) => {
    const attributes = ['color', 'fill', 'shape', 'dots'];

    // accumulate condition for each attribute by comparing each card's attribute to the next card's attribute
    const conditions = attributes.map(_ => {
      const attr = _ as keyof ICard;

      return (
        cards[i][attr] !== cards[j][attr] && cards[i][attr] !== cards[k][attr]
      );
    });

    // if all conditions are true, add the cards to the differentSets array
    if (conditions.every(_ => _)) {
      const sortedCards = [cards[i], cards[j], cards[k]].sort(
        (a, b) => a.dots - b.dots,
      );

      differentSets.push(sortedCards);
    }
  };

  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      for (let k = j + 1; k < cards.length; k++) {
        push(i, j, k);
      }
    }
  }

  // remove duplicates from the differentSets array
  const uniqueDifferentSets = differentSets.filter(
    (set, index) =>
      differentSets.findIndex(
        s =>
          s[0].color === set[0].color &&
          s[0].fill === set[0].fill &&
          s[0].shape === set[0].shape &&
          s[0].dots === set[0].dots,
      ) === index,
  );

  return uniqueDifferentSets;
};

// function to find common sets in an array of cards
const findCommonSets = (cards: ICard[]): ICard[][] => {
  const commonSets: ICard[][] = [];

  const push = (i: number, j: number, k: number) => {
    const attributes = ['color', 'fill', 'shape', 'dots'];

    for (let l = 0; l < attributes.length; l++) {
      const attr = attributes[l] as keyof ICard;
      if (
        cards[i][attr] === cards[j][attr] &&
        cards[i][attr] === cards[k][attr]
      ) {
        const leftover = attributes.filter(_ => _ !== attr);
        let fail = false;

        for (let m = 0; m < leftover.length; m++) {
          const attr = leftover[m] as keyof ICard;
          if (
            cards[i][attr] === cards[j][attr] ||
            cards[i][attr] === cards[k][attr] ||
            cards[j][attr] === cards[k][attr]
          ) {
            fail = true;
          }
        }

        if (!fail) {
          // sort the cards by dots so that the sets are in order
          const sortedCards = [cards[i], cards[j], cards[k]].sort(
            (a, b) => a.dots - b.dots,
          );

          commonSets.push(sortedCards);
        }
      }
    }

    return commonSets;
  };

  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < cards.length; j++) {
      for (let k = 0; k < cards.length; k++) {
        push(i, j, k);
      }
    }
  }

  // remove duplicates from the commonSets array
  const uniqueCommonSets = commonSets.filter(
    (set, index) =>
      commonSets.findIndex(
        _set =>
          _set[0].color === set[0].color &&
          _set[0].fill === set[0].fill &&
          _set[0].shape === set[0].shape &&
          _set[0].dots === set[0].dots,
      ) === index,
  );

  return uniqueCommonSets;
};

// do while different sets and common sets are not found or are more than 2

do {
  cards = [
    ...generateRandomSet(),
    ...generateRandomSet(),
    ...generateRandomSet(),
    ...generateRandomSet(),
  ];
} while (
  findDifferentSets(cards).length < 1 ||
  findDifferentSets(cards).length > 2 ||
  findCommonSets(cards).length < 1 ||
  findCommonSets(cards).length > 2
);

console.log('all cards: ', cards);
console.log('different sets: ', findDifferentSets(cards));
console.log('common sets: ', findCommonSets(cards));
