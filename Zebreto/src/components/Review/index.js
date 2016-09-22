import React, { Component, PropTypes } from 'react';
import {
  View,
} from 'react-native';

import Button from './../Button';
import InterfaceText from './../InterfaceText';
import ViewCard from './ViewCard';

import { connect } from 'react-redux';

import moment from 'moment';

import {
  stopReviewing,
  updateCard,
} from './../../actions';
import {
  cardQuestionCurrent,
  cardResultMostRecentlyAnswered,
  finishedReviewing,
  getInitialStateReviewing,
  percentCorrect,
  progressAnswered,
} from './../../data/reviewing';

import colors from './../../styles/colors';
import layout from './../../styles/layout';

// The route scene component to review cards that are due in a deck.
class Review extends Component {
  static displayName = 'Review';
  static propTypes = {
    cards: PropTypes.array.isRequired,
    deckID: PropTypes.string.isRequired,
    updateCard: PropTypes.func.isRequired,
    stopReviewing: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    // https://facebook.github.io/react/tips/props-in-getInitialState-as-anti-pattern.html
    // Props in getInitialState is an anti-pattern. However, it's not an anti-pattern
    // if the prop is only seed data for internally-controlled state of the component.
    const { cards, deckID } = this.props;
    const { cardQuestions, progress } = getInitialStateReviewing(cards, deckID, moment()); // impure

    this._cardQuestions = cardQuestions; // internal data that does not change
    this.state = {
      progress, // internal data that does change
      feedback: this._feedbackUnanswered(), // external interface that does change
    };
  }

  // Show the next question (or the percent answered correctly at the end).
  _feedbackUnanswered() {
    return {
      showingAnswer: false,
      correctlyAnswered: true,
    };
  }

  // Show feedback for an answer to a question.
  _feedbackAnswered(correctlyAnswered) {
    return {
      showingAnswer: true,
      correctlyAnswered,
    };
  }

  _answerQuestion = (correct) => {
    // TODO
    // Is it safer to use setState function argument to update progress?
    // If yes, how to dispatch updateCard action according to the updated value?
    // Or instead, think differently about how component state relates to application state?
    const progress = progressAnswered(this.state.progress, this._cardQuestions, correct);

    // Update application state when the last question for a card is answered.
    const cardResult = cardResultMostRecentlyAnswered(progress, this._cardQuestions);
    if (cardResult.nUnanswered === 0) {
      this.props.updateCard(cardResult.cardID, cardResult.correct);
    }

    // Update component state and show feedback for every answer.
    this.setState({
      progress,
      feedback: this._feedbackAnswered(correct),
    });
  }

  // Click to acknowledge the feedback.
  _continueReviewing = () => {
    this.setState({
      feedback: this._feedbackUnanswered(),
    });
  }

  render() {
    const { feedback: { showingAnswer, correctlyAnswered }, progress } = this.state;

    return (
      <View style={layout.scene}>
        {
          finishedReviewing(progress, this._cardQuestions, showingAnswer)
            ? (
                <View>
                  <InterfaceText style={layout.normal}>
                    {`${percentCorrect(progress)}% correct`}
                  </InterfaceText>
                  <Button style={colors.continue} onPress={this.props.stopReviewing}>
                    <InterfaceText>Return to Decks</InterfaceText>
                  </Button>
                </View>
              )
            : (
                <ViewCard
                  answerQuestion={this._answerQuestion}
                  cardQuestion={cardQuestionCurrent(progress, this._cardQuestions, showingAnswer)}
                  continueReviewing={this._continueReviewing}
                  correctlyAnswered={correctlyAnswered}
                  showingAnswer={showingAnswer}
                  stopReviewing={this.props.stopReviewing}
                />
             )
        }
      </View>
    );
  }
}

// A container component subscribes to relevant parts of state in the Redux store.
const mapStateToProps = ({ cards, deckID }) => ({
  cards,
  deckID,
});
const mapDispatchToProps = {
  stopReviewing,
  updateCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(Review);
