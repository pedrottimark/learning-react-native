// Because reducers must be pure but action creators can have side-effects,
// action creators encapsulate getting the current time for action objects.

// Reducers and action creators use string literals for type instead of constants :)

import moment from 'moment';

import {
  cardExists,
  cardObject,
} from './data/cards';
import {
  deckExists,
  deckObject,
} from './data/decks';

// Action creators related to cards.

const createCardFailed = () => ({
  type: 'CREATE_CARD_FAILED',
});

const createCardSucceeded = (card) => ({
  type: 'CREATE_CARD_SUCCEEDED',
  card,
});

// Thunk: Create unless a card with front and back already exists in the deck.
// A thunk can be used to dispatch actions only if a certain condition is met.
export const createCard = (front, back, deckID) => (dispatch, getState) =>
  dispatch(cardExists(getState().cards, front, back, deckID)
    ? createCardFailed()
    : createCardSucceeded(cardObject(front, back, deckID, moment()))
  );


export const deleteCard = (cardID) => ({
  type: 'DELETE_CARD',
  cardID,
});

// Action creators related to decks.

const createDeckFailed = () => ({
  type: 'CREATE_DECK_FAILED',
});

const createDeckSucceeded = (deck) => ({
  type: 'CREATE_DECK_SUCCEEDED',
  deck,
});

// Thunk: Create unless a deck with name already exists.
// A thunk can be used to dispatch actions only if a certain condition is met.
export const createDeck = (name) => (dispatch, getState) =>
  dispatch(deckExists(getState().decks, name)
    ? createDeckFailed()
    : createDeckSucceeded(deckObject(name))
  );

export const deleteDeck = (deckID) => ({
  type: 'DELETE_DECK',
  deckID,
});

// Action creators related to cards and decks.

export const receiveData = ({ cards, decks }) => ({
  type: 'RECEIVE_DATA',
  cards, // undefined when Zebreto runs the first time
  decks, // undefined when Zebreto runs the first time
});

export const createCards = (deckID) => ({
  type: 'CREATE_CARDS',
  deckID,
});

export const stopCreating = () => ({
  type: 'STOP_CREATING',
});

export const deleteAll = () => ({
  type: 'DELETE_ALL',
});

// Action creators related to reviewing.

export const reviewDeck = (deckID) => ({
  type: 'REVIEW_DECK',
  deckID,
  date: moment(), // impure: current time
});

export const updateCard = (cardID, correct) => ({
  type: 'UPDATE_CARD',
  cardID,
  correct,
  date: moment(), // impure: current time
});

export const stopReviewing = () => ({
  type: 'STOP_REVIEWING',
});
