import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import { Accelerometer } from 'react-native-sensors';

import {
  Console as BoardConsole,
  MotionController,
  Transport,
} from './src/packages/fm-board';

import Main from './src/containers/Main';
import Drive from './src/containers/Drive';
import About from './src/containers/About';
import LiveStats from './src/containers/LiveStats';
import Console from './src/containers/Console';
import ConnectionToast from './src/containers/TransportState';

const ACCELEROMETER_UPDATE_INTERVAL = 10; // ms
// const WS_URL = 'ws://echo.websocket.org';
const WS_URL = 'ws://10.10.100.254:81';


export default class App extends Component {
  constructor(props) {
    super(props);

    const accelerometer = new Accelerometer({
      updateInterval: ACCELEROMETER_UPDATE_INTERVAL,
    });

    const transport = new Transport(WS_URL);
    const motionController = new MotionController(accelerometer, transport);
    const boardConsole = new BoardConsole(transport);

    transport.message$.retry().subscribe((x) => {
      console.log('0x', x);
    }, (y) => {
      console.log('0x', y);
    });

    this.connectionToast = <ConnectionToast key="connectionToast" transport={transport} />;

    this.nav = StackNavigator({
      Main: {
        screen: screenProps => (<Main
          {...screenProps}
          connectionToast={this.connectionToast}
          transport={transport}
        />),
        navigationOptions: () => ({
          header: null,
        }),
      },      
      Drive: {
        screen: screenProps => (<Drive
          {...screenProps}
          motionController={motionController}
        />),
        navigationOptions: () => ({
          title: 'Drive',
        }),
      },
      About: {
        screen: About,
        navigationOptions: () => ({
          title: 'About',
        }),
      },      
      LiveStats: {
        screen: screenProps => (<LiveStats
          {...screenProps}
          transport={transport}
        />),
        navigationOptions: () => ({
          title: 'Live Stats',
        }),
      },
      Console: {
        screen: screenProps => (<Console
          {...screenProps}
          console={boardConsole}
        />),
        navigationOptions: () => ({
          title: 'Console',
        }),
      },
    });
  }

  render() {
    // return [
    //   React.createElement(this.nav, {
    //     key: 'nav',
    //   }),
    //   this.connectionToast,
    // ];    

    return React.createElement(this.nav, {
        key: 'nav',
      });
  }
}
