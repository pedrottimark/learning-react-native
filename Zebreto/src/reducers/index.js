import { combineReducers } from 'redux';

// child reducers
import cards from './cards';
import decks from './decks';
import deckID from './deckID';
import status from './status';

// root reducer
export default combineReducers({
  cards,
  decks,
  deckID,
  status,
});
