// Data consists of modules with plain objects instead of classes.
// Reducers call pure functions to merge changes into new objects,
// because they cannot call impure methods to mutate instances directly.

// Components and reducers access properties directly, without selectors :)

import md5 from 'md5';

// deck object

// Default state when no deck is selected to review or create cards.
export const deckIDInitial = ''; // deck.id is a string of 32 hexadecimal digits

// Return a deck object. Also known as a virtual constructor function.
export const deckObject = (name) => ({
  name,
  id: md5(name), // pure
});

// decks array

// Conversions to and from internal collection and stored array.
// Return a collection, given an array read from storage as JSON.
export const decksCollection = (decks) => decks;
// Return an array written to storage as JSON, given a collection.
export const decksArray = (decks) => decks;

// Initial state of the decks:
// before they have been read from storage
// or when Zebreto runs the first time.
export const decksInitial = decksCollection([]);

// Return whether a deck with name already exists.
export const deckExists = (decks, name) =>
  decks.some((deck) => deck.name === name);

// Return the new state of the decks when a deck is added.
export const addDeck = (decks, deck) =>
  decks.concat(deck);

// Return the new state of the decks when a deck is removed.
export const removeDeck = (decks, id) =>
  decks.filter((deck) => deck.id !== id);
