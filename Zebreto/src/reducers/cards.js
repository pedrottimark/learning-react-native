// The reducer must be pure.
// Given the same arguments, it should calculate the next state and return it.
// No surprises. No side effects. No API calls. No mutations. Just a calculation.

import {
  addCard,
  cardsInitial,
  removeCard,
  removeCardsInDeck,
  replaceCardReviewed,
} from './../data/cards';

export default function (cards = cardsInitial, action) {
  switch (action.type) {

  // Update from storage after Zebreto starts, unless this is the first time.
  case 'RECEIVE_DATA':
    return action.cards || cards;

  case 'CREATE_CARD_SUCCEEDED':
    return addCard(cards, action.card);

  case 'DELETE_CARD':
    return removeCard(cards, action.cardID);

  case 'DELETE_DECK':
    return removeCardsInDeck(cards, action.deckID);

  case 'DELETE_ALL':
    return cardsInitial;

  case 'UPDATE_CARD':
    return replaceCardReviewed(cards, action.cardID, action.correct, action.date);

  default:
    return cards;

  }
}
