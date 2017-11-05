import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';

import Controller from '../components/Controller';
import MenuBar from '../components/MenuBar';
import { BehaviorSubject } from 'rxjs/Rx';

export default class Main extends Component {
  static propTypes = {
    transport: PropTypes.shape({
      state$: PropTypes.instanceOf(BehaviorSubject).isRequired,
    }).isRequired, 
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      transportState: null,
    }
  }

  componentDidMount() {
    const {transport} = this.props;

    this.transportStateSub = transport.state$.subscribe(this.onTransportStateChange);
  }

  componentWillUnmount() { 
    this.transportStateSub.unsubscribe();
  }

  onTransportStateChange = (transportState) => {
    this.setState({
      transportState,
    });
  }
  
  onDriveBtnPress = () => {
    const { navigation } = this.props;

    navigation.navigate('Drive');
  };

  render() {

    const {transportState} = this.state;
    
    return [ (
      <View key="main" style={styles.container}>
        <MenuBar navigation={this.props.navigation}/>
        <View style={styles.imageContainer}> 
          <Image source={require('../img/pacer_logo.png')} style={{width:100, height:100}}></Image> 
        </View>
        {transportState === 1 ? (
          <View style={{flex:1}}>
            <TouchableOpacity style={styles.driveBtn} onPress={this.onDriveBtnPress}> 
              <Text style={styles.driveBtnText}>Drive</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={{flex:3}}>
          <Text style={styles.headerText}>Getting Started</Text>
          <Text style={styles.text}>1. Enable AIRPLANE MODE on your device.</Text>
          <Text style={styles.text}>2. Turn on the Wi-Fi and connect to your vehicle.</Text>
          <Text style={styles.text}>3. Put on your safety gear.</Text>
          <Text style={styles.text}>4. Go, go, go!</Text>
        </View>
      </View>
    ), 
    this.props.connectionToast
    ];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  imageContainer: {
    flex: 2, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  driveBtn: {
    backgroundColor: 'steelblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    width: 150,
    height: 50,
  },
  driveBtnText: {
    color: 'white',
    fontWeight: 'bold'
  },
  headerText: {
    color: "#555",
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:'center'
  },
  text: {
    color: "#555",
    fontSize: 16,
    textAlign:'center',
    marginTop: 8
  }
});
