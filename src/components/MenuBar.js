import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, View, Image} from 'react-native';
import PropTypes from 'prop-types';

export default class MenuBar extends Component {

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
  }

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
        <View style={{flex:1}}>
          <TouchableOpacity style={styles.menuBtn} onPress={this.onAboutBtnPress}> 
            <Text style={styles.btnText}>About</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1}}>
          <TouchableOpacity style={styles.menuBtn} onPress={this.onSettingsBtnPress}> 
            <Text style={styles.btnText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginTop: 10,
    flexDirection:'row',
    justifyContent: 'space-between',
    backgroundColor: '#F5FCFF',

  },
  menuBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    height: 50
  },
  btnText: {
    color: 'steelblue',
    fontWeight: 'bold',
    fontSize: 15
  }
});
