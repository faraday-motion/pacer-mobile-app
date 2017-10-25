import React, { Component } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

import Drive from '../components/Drive';

export default class Main extends Component {
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

  onAboutBtnPress = () => {
    const { navigation } = this.props;

    navigation.navigate('About');
  };

  onSettingsBtnPress = () => {
    const { navigation } = this.props;

    navigation.navigate('Settings');
  };

  render() {
    return (
      <View style={styles.container}>
        <Drive onStart={this.onStart} onStop={this.onStop} />
        <View style={styles.aboutBtnWrapper}>
          <Button title="About" onPress={this.onAboutBtnPress} />
        </View>

        <View style={styles.settingsBtnWrapper}>
          <Button title="Settings" onPress={this.onSettingsBtnPress} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  aboutBtnWrapper: {
    position: 'absolute',
    top: 50,
    left: 30,
  },
  settingsBtnWrapper: {
    position: 'absolute',
    top: 50,
    right: 30,
  },
});
