import React, { Component, createElement } from 'react';
import {
  View,
  Navigator,
} from 'react-native';

import Header from './Header';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { receiveData } from './../actions';
import { readData, writeCards, writeDecks } from './../data/storage';
import reducer from './../reducers';
import componentForState from './../scenes';
import layout from './../styles/layout';

// Redux middleware:
// Process thunk functions in addition to action objects.
const middleware = [thunk];
// In development, log to console: prev state, action, and next state.
if (process.env.NODE_ENV === 'development') {
  const createLogger = require('redux-logger');
  const logger = createLogger({
    actionTransformer: (action) => action.date // if action has a date property
      ? Object.assign({}, action, {
        date: action.date.toISOString(), // display its value as a string
      })
      : action,
  });
  middleware.push(logger);
}

// Redux is a predictable state container for JavaScript apps.
const store = createStore(reducer, applyMiddleware(...middleware));

// Zebreto is a flashcard application based on the Spaced Repetition System,
// a learning strategy for effective memorization.
class Zebreto extends Component {
  static displayName = 'Zebreto';

  constructor(props) {
    super(props);
    this._componentInitial = componentForState(store.getState());
  }

  componentDidMount() {
    // Write cards or decks whenever they have changes.
    let { cards: cardsPrev, decks: decksPrev } = store.getState();
    const writeData = () => {
      const { cards, decks } = store.getState();

      // Can test for changes by strict inequality because state is immutable :)
      if (cardsPrev !== cards) {
        writeCards(cards); // asynchronous
        cardsPrev = cards;
      }
      if (decksPrev !== decks) {
        writeDecks(decks); // asynchronous
        decksPrev = decks;
      }
    };

    // Cause navigator to render the scene whenever it changes.
    // Minimum Viable Router :)
    let componentPrev = this._componentInitial;
    const changeScene = () => {
      const component = componentForState(store.getState());

      // Can test for changes by strict inequality because component is a class :)
      if (componentPrev !== component) {
        if (this._componentInitial === component) {
          this._navigator.popToTop(); // Top = initialRoute of Navigator
        }
        else {
          this._navigator.push({ component });
        }
        componentPrev = component;
      }
    };

    // Redux listener
    this.unsubscribe = store.subscribe(() => {
      writeData();
      changeScene();
    });

    // After the Navigator rendered the component for the initial app state
    // and the listener subscribed to changes in the app state:
    // Read cards and decks from storage asynchronously, and then dispatch an action.
    readData((data) => {
      store.dispatch(receiveData(data));
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <View style={layout.app}>
        <Header/>
        <Navigator
          ref={(navigator) => {
            this._navigator = navigator;
          }}
          initialRoute={{ component: this._componentInitial }}
          renderScene={({ component }) => createElement(component)}
        />
      </View>
    );
  }
}

// Provide the store using react-redux to container components for route scenes.
// eslint-disable-next-line react/display-name
export default () => (
  <Provider store={store}>
    <Zebreto/>
  </Provider>
);
