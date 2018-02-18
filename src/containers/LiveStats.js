import React, { Component } from 'react';
import { Linking, Button, Image, Text, View, ScrollView, StyleSheet } from 'react-native';
import FeedChart from '../components/FeedChart';
import { BehaviorSubject } from 'rxjs/Rx';
import PropTypes from 'prop-types';


export default class LiveStats extends Component {
  static propTypes = {
    transport: PropTypes.shape({
      state$: PropTypes.instanceOf(BehaviorSubject).isRequired,
    }).isRequired, 
  }

  constructor(props) {
    super(props);
    this.state = {
      'data': [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
  }

  parseDriveLog = (driveLog) => {
    var log = {
      vescs: [],
      control: {
        accel: driveLog.accel, 
        brake: driveLog.brake, 
        left:  driveLog.left,
        right: driveLog.right,
        dead: driveLog.dead,
      }
    } 
  }  

  update = (driveLog) => {
    if (driveLog.accel != undefined) {
      var newData = this.state.data;
      let val = parseInt(driveLog.accel); 
      newData.shift();
      newData.push(val);
      this.setState({'data': newData});
    }

    newData = this.parse(driveLog);
  }

  parse = (driveLog) => {
    var log = {};
    log.control = {
      accel: driveLog.accel != undefined ? driveLog.accel : 0,
      brake: driveLog.Brake != undefined ? driveLog.Brake : 0,
      left:  driveLog.Left  != undefined ? driveLog.Left  : 0,
      right: driveLog.Right != undefined ? driveLog.Right : 0,
      dead:  driveLog.dead  != undefined ? driveLog.dead  : 0 
    }

    var fake_vesc = {
      "vesc_0_v_in"        : Math.random() * (100 - 1) + 1,
      "vesc_0_t_pcb"       : Math.random() * (100 - 1) + 1,
      "vesc_0_rpm"         : Math.random() * (100 - 1) + 1,
      "vesc_0_c_mot"       : Math.random() * (100 - 1) + 1,
      "vesc_0_c_in"        : Math.random() * (100 - 1) + 1,
      "vesc_0_duty"        : Math.random() * (100 - 1) + 1,
      "vesc_0_a_hours"     : Math.random() * (100 - 1) + 1,
      "vesc_0_a_charged"   : Math.random() * (100 - 1) + 1,
      "vesc_0_w_hours"     : Math.random() * (100 - 1) + 1,
      "vesc_0_w_charged"   : Math.random() * (100 - 1) + 1,
      "vesc_0_tacho"       : Math.random() * (100 - 1) + 1,
      "vesc_0_techo_abs"   : Math.random() * (100 - 1) + 1,
      "vesc_0_fault"       : Math.random() * (100 - 1) + 1
    }

    this.extractVescs(fake_vesc);

    return log;
  }

  extractVescs = (driveLog) => {

    var vesc_values = Object.keys(driveLog).filter(function(k) {
        return k.indexOf('vesc_') == 0;
    }).reduce(function(newData, k) {
        newData[k] = driveLog[k];
        return newData;
    }, {}); 
      
    vescs = [];
    for (let key in vesc_values) {
      index = key.split('_')[1];
      entry = {}
      
      if (vescs[index] == undefined) {
        vescs[index] = {};
      } 
      vescs[index][key.split('vesc_' + index + "_").pop()] = vesc_values[key];
    }
  }

  componentDidMount()  {
    const { transport } = this.props;
    this.subscription = transport.driveLog$.subscribe(this.update);
  }

  componentWillUnmount() {
   clearTimeout(this.updateTimer);
  }

  render() {
    var {data} = this.state;
    return (
        <ScrollView style={{paddingLeft:10,paddingRight:10}}>
          <View>
            <Text style={styles.headerText}>Speed</Text>
            <FeedChart data={data}/>
          </View>
          <View>
            <Text style={styles.headerText}>Charge Level</Text>
            <FeedChart data={data}/>
          </View>
        </ScrollView>
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 200,
    width: 300
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 16,

  },
  titleText: {
    color: "#555",
    fontSize: 32,
    fontWeight: 'bold',
    textAlign:'center',
    marginBottom: 12
  },

  headerText: {
    color: "#555",
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:'center',
    marginTop: 16,
    textAlign:'center'
  },

  text: {
    color: "#555",
    fontSize: 16,
    marginTop: 8,
    textAlign:'center',
  }

});