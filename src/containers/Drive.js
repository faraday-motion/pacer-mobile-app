import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Controller from '../components/Controller';
import MenuBar from '../components/MenuBar';

export default class Drive extends Component {
  static propTypes = {
    motionController: PropTypes.shape({
      start: PropTypes.func.isRequired,
      stop: PropTypes.func.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  onStart = () => {
    const { motionController } = this.props;

    motionController.start();
  };

  onStop = () => {
    const { motionController } = this.props;

    motionController.stop();
  };

  onHomeBtnPress = () => {
    const { navigation } = this.props;

    navigation.navigate('Drive');
  };

  render() {
    return (
      <View style={styles.container}>
        <Controller onStart={this.onStart} onStop={this.onStop} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  }
});
