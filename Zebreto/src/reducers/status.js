// The reducer must be pure.
// Given the same arguments, it should calculate the next state and return it.
// No surprises. No side effects. No API calls. No mutations. Just a calculation.

// Inspired by: A Finite State Machine Helper for Redux by Max Heiber
// https://hackernoon.com/a-finite-state-machine-helper-for-redux-c18519643719

// Routes and reducer use string literals for status instead of constants :)

const statusInitial = '';

export default function (status = statusInitial, action) {
  switch (action.type) {

  case 'CREATE_CARD_REQUESTED':
    return 'CREATING_CARD_REQUESTED';

  case 'CREATE_CARD_FAILED':
    return 'CREATING_CARD_FAILED';

  case 'CREATE_CARD_SUCCEEDED':
    return 'CREATING_CARD_SUCCEEDED';

  case 'CREATE_DECK_FAILED':
    return 'CREATING_DECK_FAILED';

  case 'CREATE_CARDS':
  case 'CREATE_DECK_SUCCEEDED': // let a person start creating cards in a new deck
    return 'CREATING_CARDS';

  case 'REVIEW_DECK':
    return 'REVIEWING_CARDS';

  case 'STOP_CREATING':
  case 'STOP_REVIEWING':
    return statusInitial;

  default:
    return status;

  }
}
