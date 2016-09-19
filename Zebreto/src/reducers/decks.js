// The reducer must be pure.
// Given the same arguments, it should calculate the next state and return it.
// No surprises. No side effects. No API calls. No mutations. Just a calculation.

import {
  addDeck,
  decksInitial,
  removeDeck,
} from './../data/decks';

export default function (decks = decksInitial, action) {
  switch (action.type) {

  // Update from storage after Zebreto starts, unless this is the first time.
  case 'RECEIVE_DATA':
    return action.decks || decks;

  case 'CREATE_DECK_SUCCEEDED':
    return addDeck(decks, action.deck);

  case 'DELETE_DECK':
    return removeDeck(decks, action.deckID);

  case 'DELETE_ALL':
    return decksInitial;

  default:
    return decks;

  }
}
