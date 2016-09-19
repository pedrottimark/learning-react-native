// The reducer must be pure.
// Given the same arguments, it should calculate the next state and return it.
// No surprises. No side effects. No API calls. No mutations. Just a calculation.

import {
  deckIDInitial,
} from './../data/decks';

export default function (deckID = deckIDInitial, action) {
  switch (action.type) {

  case 'CREATE_CARDS':
  case 'REVIEW_DECK':
    return action.deckID;

  case 'CREATE_DECK_SUCCEEDED': // let people start creating cards in a new deck
    return action.deck.id;

  case 'STOP_CREATING':
  case 'STOP_REVIEWING':
  case 'DELETE_ALL':
    return deckIDInitial;

  default:
    return deckID;

  }
}
