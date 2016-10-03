// Data consists of modules with plain objects instead of classes.

import { Map } from 'immutable'; // shadow ECMAScript Map

import { sample, shuffle } from 'lodash';

import {
  filterCardsDueForReview,
  filterCardsInDeck,
  sideKeys,
  sideOpposite,
} from './../data/cards';

// Return the review question for one side of a card.
function cardQuestionObject(cards, card, sideQuestion, nOther) {
  const sideAnswer = sideOpposite(sideQuestion);
  const answerCorrect = card[sideAnswer];
  const cardsOther = sample(cards.filter((cardOther) => cardOther.id !== card.id), nOther); // impure
  const answersOther = cardsOther.map((cardOther) => cardOther[sideAnswer]);

  return {
    cardID: card.id,
    sideQuestion, // not used but could determine lang, dir, font, and so on
    question: card[sideQuestion],
    answerCorrect,
    answers: shuffle([answerCorrect, ...answersOther]), // impure
  };
}

// Return the initial results of the review questions for both sides of a card.
// By default, each card has a question for its front and back.
const cardResultObject = (card, nUnanswered) => ({
  cardID: card.id,
  nUnanswered,
  correct: true, // until answered incorrectly
});

// Return the changes to a card result when a question is answered.
const cardResultChangesAnswered = (cardResult, correct) => ({
  nUnanswered: cardResult.nUnanswered - 1,
  correct: cardResult.correct && correct,
});

// Return a map to access card result object by card id.
const cardResultsMap = (cards, sideKeys) =>
  new Map(cards.map((card) => [card.id, cardResultObject(card, sideKeys.length)]));

// reviewing properties

// Return initial state for reviewing the cards in a deck that are due.
// Not including the state of feedback from the user interface.
// Like an action creator, does not need to be pure.
export function getInitialStateReviewing(cards, deckID, date) {
  const cardsInDeck = filterCardsInDeck(cards, deckID);
  const cardsDue = filterCardsDueForReview(cardsInDeck, date);
  const nOther = 3; // Each card has up to 3 other answers.
  const cardQuestions = [];

  // There are two times as many elements as cards that are due.
  cardsDue.forEach((card) => {
    sideKeys.forEach((side) => {
      cardQuestions.push(cardQuestionObject(cardsInDeck, card, side, nOther)); // impure
    });
  });

  // cardQuestions are inherently unchanging
  // progress contains the changing properties
  return {
    cardQuestions: shuffle(cardQuestions), // impure
    progress: {
      cardResults: cardResultsMap(cardsDue, sideKeys),
      nAnswered: 0,
      nCorrect: 0,
    },
  };
}

// Return the next state of the current card result when a question is answered.
// This is the part of component state that directly affects application state.
export function cardResultAnswered(progress, cardQuestions, correct) {
  const { cardResults, nAnswered } = progress;
  const { cardID } = cardQuestions[nAnswered];
  const cardResult = cardResults.get(cardID);

  return Object.assign({}, cardResult, cardResultChangesAnswered(cardResult, correct));
}

// Return the next state of progress when a question is answered.
export function progressAnswered(progress, cardQuestions, correct) {
  const { cardResults, nAnswered, nCorrect } = progress;
  const { cardID } = cardQuestions[nAnswered];

  return {
    cardResults: cardResults.set(cardID, cardResultAnswered(progress, cardQuestions, correct)),
    nAnswered: nAnswered + 1,
    nCorrect: correct
      ? nCorrect + 1
      : nCorrect
  };
}

// Selectors

// Return the current review question given the state of progress and feedback.
export const cardQuestionCurrent = ({ nAnswered }, cardQuestions, showingAnswer) =>
  cardQuestions[showingAnswer
    ? nAnswered - 1 // showing feedback for answer to the last question
    : nAnswered // showing the next question
  ];

// Return whether a person has finished reviewing given the state of progress and feedback.
export const finishedReviewing = ({ nAnswered }, cardQuestions, showingAnswer) =>
  nAnswered === cardQuestions.length && !showingAnswer;

// Return the percent of correct answers given the state of progress.
// Although review deck buttons should be disabled if no cards are due,
// make sure not to divide by zero!
export const percentCorrect = ({ nAnswered, nCorrect }) => nAnswered === 0
  ? 0
  : Math.round(100 * nCorrect / nAnswered);
