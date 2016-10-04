// Data consists of modules with plain objects instead of classes.
// Reducers call pure functions to merge changes into new objects,
// because they cannot call impure methods to mutate instances directly.

// Components and reducers access properties directly, without selectors :)

import md5 from 'md5';

import dateDue from './dateDue';

// card object

// Return a card object. Also known as a virtual constructor function.
export const cardObject = (front, back, deckID, date) => ({
  front,
  back,
  deckID,
  strength: 0, // increases with correct answers to review questions
  dueDate: date.toISOString(), // pure, for a given moment object
  id: md5(front + back + deckID), // pure, for given arguments
});

// The keys for the two sides of a card.
export const sideKeys = [
  'front',
  'back',
];

// Return the key for the opposite side of a card.
export const sideOpposite = (side) => sideKeys.find((sideKey) => sideKey !== side);

// Return whether the card due date (ISO string) <= date arg (moment object).
export const dueForReview = (card, date) => date.isSameOrAfter(card.dueDate);

// Return the changes to card properties when both sides have been reviewed.
function cardChangesReviewed(card, correct, date) {
  // Prevent strength from becoming negative: Math.max(0, 0 - 1) === 0
  const strengthNext = Math.max(0, card.strength + (correct ? 1 : -1));

  // The next due date always changes.
  const cardChanges = {
    dueDate: dateDue(date, strengthNext), // pure, for a given moment object
  };

  // The strength changes except when it is zero and an answer is incorrect.
  if (card.strength !== strengthNext) {
    cardChanges.strength = strengthNext;
  }

  return cardChanges;
}

// cards array

// Conversions to and from internal collection and stored array.
// Return a collection, given an array read from storage as JSON.
export const cardsCollection = (cards) => cards;
// Return an array written to storage as JSON, given a collection.
export const cardsArray = (cards) => cards;

// Initial state of the cards:
// before they have been read from storage
// or when Zebreto runs the first time.
export const cardsInitial = cardsCollection([]);

// Return whether a card with front and back already exists in the deck.
export const cardExists = (cards, front, back, deckID) =>
  cards.some((card) => card.front === front && card.back === back && card.deckID === deckID);

// Return the new state of the cards when a card is added.
export const addCard = (cards, card) =>
  cards.concat(card);

// Return the new state of the cards when a card is removed.
export const removeCard = (cards, id) =>
  cards.filter((card) => card.id !== id);

// Return the new state of the cards when a deck is removed.
export const removeCardsInDeck = (cards, deckID) =>
  cards.filter((card) => card.deckID !== deckID);

// Return a particular card.
const findCard = (cards, id) =>
  cards.find((card) => card.id === id);

// Return the new state of the cards when a card has changes.
const replaceCard = (cards, cardPrev, cardChanges) =>
  cards.map((card) => card.id === cardPrev.id
    ? Object.assign({}, cardPrev, cardChanges)
    : card
  );

// Return the new state of the cards when the last question for a card is answered.
export function replaceCardReviewed(cards, id, correct, date) {
  const card = findCard(cards, id);

  return replaceCard(cards, card, cardChangesReviewed(card, correct, date));
}

// Return the cards in a deck.
export const filterCardsInDeck = (cards, deckID) =>
  cards.filter((card) => card.deckID === deckID);

// Return the cards that are due for reviewing.
export const filterCardsDueForReview = (cards, date) =>
  cards.filter((card) => dueForReview(card, date));

// derived data about cards, decks, and reviewing

// Return whether at least one card in the deck is due for review.
export const someCardDueForReview = (cards, deckID, date) =>
  cards.some((card) => card.deckID === deckID && dueForReview(card, date));

// Return a function that returns the number of cards due, given a deck id.
export function nCardsDueForReview(cards, decks, date) {
  const nCardsDue = new Map(decks.map((deck) => [deck.id, 0]));

  cards.forEach((card) => {
    const n = nCardsDue.get(card.deckID);
    if (typeof n === 'number' && dueForReview(card, date)) {
      nCardsDue.set(card.deckID, n + 1);
    }
  });

  return (id) => nCardsDue.get(id);
}
