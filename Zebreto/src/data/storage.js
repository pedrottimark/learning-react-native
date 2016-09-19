import { AsyncStorage } from 'react-native';

import {
  cardsCollection,
  cardsInitial,
} from './cards';
import {
  decksCollection,
  decksInitial,
} from './decks';

const CARDS_KEY = 'zebreto-cards';
const DECKS_KEY = 'zebreto-decks';

const keysStorage = [CARDS_KEY, DECKS_KEY];
const keysReducer = ['cards', 'decks']; // see ../reducers
const valuesCollection = [cardsCollection, decksCollection];
const valuesInitial = [cardsInitial, decksInitial];
const writers = [writeCards, writeDecks];

// Aynchronous function to get cards and decks data after Zebreto starts.
export function readData(callback) {
  AsyncStorage.multiGet(keysStorage, function (errors, results) {
    const data = {};

    if (errors) {
      errors.forEach(function (error) {
        console.error('AsyncStorage readData error', error.message);
      });
    }
    else {
      results.forEach(function ([, value], i) {
        if (value === null) {
          // Write the initial state when Zebreto runs the first time.
          writers[i](valuesInitial[i]);
        }
        else {
          data[keysReducer[i]] = valuesCollection[i](JSON.parse(value));
        }
      });
    }

    callback(data);
  });
}

// Asynchronous function to set cards data after it has changed.
export function writeCards(cards) {
  AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cards), function (error) {
    if (error) {
      console.error('AsyncStorage writeCards error: ', error.message);
    }
  });
}

// Asynchronous function to set decks data after it has changed.
export function writeDecks(decks) {
  AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decks), function (error) {
    if (error) {
      console.error('AsyncStorage writeDecks error: ', error.message);
    }
  });
}
