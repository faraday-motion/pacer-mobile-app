import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { BehaviorSubject } from 'rxjs/Rx';

import Toast from '../components/Toast';

import { TransportState } from '../packages/fm-board';

export default class ConnectionToast extends Component {
  static propTypes = {
    transport: PropTypes.shape({
      state$: PropTypes.instanceOf(BehaviorSubject).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      transportState: null,
    };
  }

  componentDidMount() {
    const { transport } = this.props;

    this.transportStateSub = transport.state$.subscribe(this.onTransportStateChange);
  }

  componentWillUnmount() {
    this.transportStateSub.unsubscribe();
  }

  onTransportStateChange = (transportState) => {
    this.setState({
      transportState,
    });
  };

  renderStateText() {
    const { transportState } = this.state;

    switch (transportState) {
      case TransportState.CONNECTING:
        return <Text>Connecting...</Text>;
      case TransportState.DISCONNECTED:
        return <Text>Disconnected</Text>;
      default:
        return <Text>Unknown status</Text>;
    }
  }

  render() {
    const { transportState } = this.state;

    if (transportState === TransportState.CONNECTED) {
      return null;
    }

    return (
      <Toast>
        {this.renderStateText()}
      </Toast>
    );
  }
}
