import React, { Component } from 'react';
import { Button, KeyboardAvoidingView, View, TextInput } from 'react-native';
import PropTypes from 'prop-types';

import ConsoleHistory from '../components/ConsoleHistory';

export default class Console extends Component {
  static propTypes = {
    console: PropTypes.shape({
      sendCommand: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      waiting: false,
      inputCommand: '',
      history: [],
    };
  }

  onCommandChange = (value) => {
    this.setState({ inputCommand: value });
  };

  onCommandSubmit = () => {
    const { console } = this.props;
    const inputCommand = this.state.inputCommand.trim();

    if (inputCommand === '') {
      return;
    }

    const historyBefore = this.state.history;

    const historyEntry = {
      command: this.state.inputCommand,
      response: 'Waiting...',
    };

    this.setState({
      waiting: true,
      history: historyBefore.concat(historyEntry),
    });

    console
      .sendCommand(this.state.inputCommand)
      .then((response) => {
        historyEntry.response = response;

        this.setState({
          waiting: false,
          history: historyBefore.concat(historyEntry),
        });
      })
      .catch((err) => {
        historyEntry.response = err;

        this.setState({
          waiting: false,
          history: historyBefore.concat(historyEntry),
        });
      });
  };

  render() {
    const { inputCommand, waiting, history } = this.state;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={65}
        style={styles.consoleScreen}
      >
        <TextInput
          value={inputCommand}
          style={styles.input}
          onChangeText={this.onCommandChange}
          autoFocus
          spellCheck={false}
          autoCorrect={false}
          autoCapitalize="none"
          onSubmitEditing={this.onCommandSubmit}
        />

        <Button title="Send" onPress={this.onCommandSubmit} disabled={waiting} />

        <ConsoleHistory history={history} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  consoleScreen: {
    flex: 1,
    padding: 20,
  },
  input: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
  },
};
