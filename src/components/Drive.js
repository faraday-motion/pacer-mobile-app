import React, { Component } from 'react';
import { TouchableWithoutFeedback, Text, View } from 'react-native';
import PropTypes from 'prop-types';

export default class Go extends Component {
  static propTypes = {
    onStart: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      active: false,
    };
  }

  onStart = () => {
    this.setState({ active: true });
    this.props.onStart();
  };

  onStop = () => {
    this.setState({ active: false });
    this.props.onStop();
  };

  render() {
    const { active } = this.state;

    return (
      <TouchableWithoutFeedback onPressIn={this.onStart} onPressOut={this.onStop}>
        {!active ? (
          <View style={[styles.base, styles.drive]}>
            <Text style={styles.text}>Drive</Text>
          </View>
        ) : (
          <View style={[styles.base, styles.release]}>
            <Text style={styles.text}>Release to stop</Text>
          </View>
        )}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = {
  base: {
    height: 200,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drive: {
    backgroundColor: 'green',
  },
  release: {
    backgroundColor: 'yellow',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 30,
  },
};
