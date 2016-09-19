// Minimum Viable Routes :)

// Inspired by: How to decouple state and UI by Michel Weststrate
// https://medium.com/@mweststrate/how-to-decouple-state-and-ui-a-k-a-you-dont-need-componentwillmount-cc90b787aa37

import Decks from './components/Decks';
import NewCard from './components/NewCard';
import Review from './components/Review';

// Return the route scene component for the `status` property of application state.
// See ./reducers/status.js using string literals instead of constants :)
export default function ({ status }) {
  switch (status) {

  case 'CREATING_CARDS':
  case 'CREATING_CARD_FAILED':
    return NewCard;

  case 'REVIEWING_CARDS':
    return Review;

  default:
    return Decks;

  }
}
