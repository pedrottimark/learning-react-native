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
  cardResultMostRecentlyAnswered,
  getInitialStateReviewing,
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

    this.state = {
      cardQuestions, // internal data that does not change
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
    const { cardQuestions } = this.state;
    const progress = progressAnswered(this.state.progress, cardQuestions, correct);

    // Update application state when the last question for a card is answered.
    const cardResult = cardResultMostRecentlyAnswered(progress, cardQuestions);
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

  _contents() {
    const { cardQuestions, feedback, progress } = this.state;
    const { showingAnswer, correctlyAnswered } = feedback;
    const { nAnswered, nCorrect } = progress;

    if (showingAnswer || nAnswered < cardQuestions.length) {
      const index = showingAnswer
        ? nAnswered - 1 // show feedback for answer to the last question
        : nAnswered; // show the next question

      return (
        <ViewCard
          answerQuestion={this._answerQuestion}
          cardQuestion={cardQuestions[index]}
          continueReviewing={this._continueReviewing}
          correctlyAnswered={correctlyAnswered}
          showingAnswer={showingAnswer}
          stopReviewing={this.props.stopReviewing}
        />
      );
    }

    // Show the percent answered correctly after all questions have been answered.
    // Although review deck buttons should be disabled if no cards are due:
    // make sure not to divide by zero!
    // make sure to display a button to leave this scene!
    return (
      <View>
        {nAnswered !== 0 &&
          <InterfaceText style={layout.normal}>
            {`${Math.round(100 * nCorrect / nAnswered)}% correct`}
          </InterfaceText>
        }
        <Button style={colors.continue} onPress={this.props.stopReviewing}>
          <InterfaceText>Return to Decks</InterfaceText>
        </Button>
      </View>
    );
  }

  render() {
    return (
      <View style={layout.scene}>
        {this._contents()}
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
