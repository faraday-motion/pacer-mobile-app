import React, { Component } from 'react';
import { Button, Text, View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { SettingsController } from '../packages/fm-board';
import { BehaviorSubject } from 'rxjs/Rx';

import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField
} from 'react-native-form-generator';

export default class Settings extends Component {
  static propTypes = {
    transport: PropTypes.shape({
      state$: PropTypes.instanceOf(BehaviorSubject).isRequired,
    }).isRequired, 
    settingsController: PropTypes.instanceOf(SettingsController).isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      settings: null,
      saving: false,
      transportState: null,
    };
  }

  componentDidMount() {
    this.mounted = true;
    const {transport} = this.props;
    this.transportStateSub = transport.state$.subscribe(this.onTransportStateChange);

    if (this.state.transportState === 1) {
      this.getSettings(); 
    } 
  }

  componentWillUnmount() {
    this.mounted = false;
    this.transportStateSub.unsubscribe();
  }

  onTransportStateChange = (transportState) => {
    this.setState({
      transportState,
    });

    if (transportState === 1) {
      this.getSettings();
    }
  }

  getSettings() {
   this.props.settingsController
    .getSettings()
    .then((settings) => {
      if (this.mounted) {
        this.setState({ settings: settings });
        this.initSettingsForm();            
      }
    });
  }

  onSave = () => {
    this.setState({ saving: true });
    this.serializeSettings();

    this.props.settingsController
      .saveSettings(this.state.settings)
      .then(() => {
        this.setState({ saving: false });
      });
  };

  serializeSettings() {
    let settings = this.state.settings;
    let formData = this.state.formData;
    settings.wifi.ssid = formData.wifi_ssid;
    settings.wifi.pass = formData.wifi_pass;
    settings.wifi.ip = formData.wifi_ip.split('.');
    settings.wifi.subnet = formData.wifi_subnet.split('.');

    settings.motorCount = parseInt(formData.motorCount);
    settings.modules.radio = formData.radioModule * 1; // js hack to convert bool to int
    settings.modules.webSocketServer = formData.webSocketModule * 1; // js hack to convert bool to int
    settings.modules.webServer = formData.webServerModule * 1; // js hack to convert bool to int
    
    settings.authorizedControllers = []; // Clear all
    if (formData.wifiCtrl) settings.authorizedControllers.push(1);
    if (formData.radioCtrl) settings.authorizedControllers.push(2);
    if (formData.i2cCtrl) settings.authorizedControllers.push(3);
    if (formData.analogCtrl) settings.authorizedControllers.push(4);
    if (formData.websocketCtrl) settings.authorizedControllers.push(5);
    this.setState({settings: settings});
  }

  onConsoleBtnPress = () => {
    const { navigation } = this.props;
    navigation.navigate('Console');
  };  

  handleFormChange(formData){
    this.setState({formData:formData})
    this.props.onFormChange && this.props.onFormChange(formData);
  }

  initSettingsForm() {
    let formData = this.refs.settingsForm.refs;
    let settings = this.state.settings;

    formData.motorCount.setValue(String(settings.motorCount));
    
    // Modules
    formData.webServerModule.setValue(Boolean(settings.modules.webServer));
    formData.webSocketModule.setValue(Boolean(settings.modules.webSocketServer));
    formData.radioModule.setValue(Boolean(settings.modules.radio));
    
    // Authorized Controllers 
    this.state.settings.authorizedControllers.forEach( type => {
      if (type == 1)  formData.wifiCtrl.setValue(true)
      if (type == 2)  formData.radioCtrl.setValue(true)
      if (type == 3)  formData.i2cCtrl.setValue(true)
      if (type == 4)  formData.analogCtrl.setValue(true)
      if (type == 5)  formData.websocketCtrl.setValue(true)
    });

    // Wifi
    formData.wifi_ssid.setValue(settings.wifi.ssid);
    formData.wifi_pass.setValue(settings.wifi.pass);
    formData.wifi_ip.setValue(String(settings.wifi.ip[0] + "." + settings.wifi.ip[1] + "." + settings.wifi.ip[2] + "." + settings.wifi.ip[3]));
    formData.wifi_subnet.setValue(settings.wifi.subnet[0] + "." + settings.wifi.subnet[1] + "." + settings.wifi.subnet[2] + "." + settings.wifi.subnet[3]);
    formData.wifi_channel.setValue(String(settings.wifi.channel));
  }

  renderSettings() {
    if (this.state.settings === null && this.state.transportState === 1) {
      return (<Text style={{textAlign:'center', marginTop:20}}>Loading current settings</Text>);
    }

    if (this.state.transportState !== 1) {
      return (<Text style={{textAlign:'center', marginTop:20}}>Cannot get Settings. Connect to vehicle.</Text>);
    }

    return (
      <View style={{flex:2}} >
      <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10}}>
        <View style={{marginTop:32}}>
          <Button title="Open Console" onPress={this.onConsoleBtnPress} style={{marginTop:24,marginBottom:24}} />
        </View>
        <Form
          ref='settingsForm'
          style={{marginBottom:24}}
          onChange={this.handleFormChange.bind(this)}
          label="Faraday Motion Vehicle Settings">         
          
          <Text style={styles.formHeader}>Vehicle </Text>
          <Text style={styles.formLabel}>Motor Count </Text>
          <PickerField ref='motorCount' options={{ 1: "One", 2: "Two", 4: "Four"}}/>
          
          <Text style={styles.formHeader}>Authorize Controller Types</Text>
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='Radio Controllers'  ref="radioCtrl"/>
          <Text style={styles.helpText}>Controllers that use the NRF24 module</Text>
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='Wifi Controllers' ref="wifiCtrl"/>
          <Text style={styles.helpText}>Controllers that use the WiFi TCP/UDP protocols</Text>
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='WebSocket Controllers' ref="websocketCtrl"/>
          <Text style={styles.helpText}>Controllers that use the WeobSocket protocol.</Text>
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='I2C Controllers'    ref="i2cCtrl"    />
          <Text style={styles.helpText}>Controllers that use the I2C communication protocol (e.g. accelerometers)</Text>
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='Analog Controllers' ref="analogCtrl"/>
          <Text style={styles.helpText}>Controllers that use the analog pins (e.g. wired joystick/ sensor pads)</Text>

          <Text style={styles.formHeader}>Modules</Text>
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='WebServer'  ref="webServerModule"/>
          <Text style={styles.helpText}>Required for remote configuration and logging. Also used by the mobile application for controlling the vehicle.</Text>          
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='WebSocket Server'  ref="webSocketModule"/>
          <Text style={styles.helpText}>Serves web page that allows you to remotely configure and update firmware.</Text>
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='Radio RF24'  ref="radioModule"/>
          <Text style={styles.helpText}>Used for the Faraday Motion Remote Controller (Nunchuck).</Text>          


          <Text style={styles.formHeader}>WiFi Network</Text>
          <Text style={styles.formLabel}>SSID</Text>
          <InputField ref='wifi_ssid'/>
          <Text style={styles.formLabel}>Password</Text>
          <InputField ref='wifi_pass' secureTextEntry={true} />          
          <Text style={styles.formLabel}>IP Address</Text>
          <InputField ref='wifi_ip' />          
          <Text style={styles.formLabel}>Subnet Address</Text>
          <InputField ref='wifi_subnet'  />
          <Text style={styles.formLabel}>Channel</Text>
          <InputField ref='wifi_channel' />
        </Form>
        <View style={{marginBottom:32}}>
          <Button title="Save Settings" onPress={this.onSave} disabled={this.state.saving || this.state.settings === null} />
        </View>
      </ScrollView>
      </View>
    );
  }


  render() {
    return [(
      <View key='settings' style={{ flex:1 }}>
        {this.renderSettings()}        
      </View>
    ), 
    this.props.connectionToast
    ];
  }
}


const styles = StyleSheet.create({

  formHeader: {
    paddingTop: 16,
    fontSize: 22
  },

  formSubHeader: {
    paddingTop: 8,
    fontSize: 16,
  },

  formLabel: {
    paddingTop: 8,
    fontWeight: "bold"
  }, 

  switchContainer: {
    marginTop:16,
    paddingTop:14, 
    paddingLeft: 8
  },

  switchLabel: {
    fontSize: 14,
  },

  helpText: {
    fontSize: 12,
    color: '#7a7a7a'
  }

});


const defaultSettings = {
  "modules" : {
    "radio" : 0,
    "webSocketServer" : 1,
    "webServer" : 1
  },

  "wifi" : {
    "ssid"     : "FARADAY200",
    "port"     : 8899,
    "ip"       : [10, 10, 100, 254],
    "subnet"   : [255, 255, 255, 0],
    "channel"  : 11,
    "pass"     : "faraday200"
  },

  "websocket" : {
    "port" : 81
  },

  "controller" : {
    "defaultSmoothAlpha"          : 0.5 ,
    "defaultInputNeutral"         : 50  ,
    "defaultInputMinBrake"        : 48  ,
    "defaultInputMaxBrake"        : 0   ,
    "defaultInputMinAcceleration" : 52  ,
    "defaultInputMaxAcceleration" : 100
  },

  "currentControl" : {
    "defaultCurrentNeutral"         : 0   ,
    "defaultCurrentBrakeMin"        : 0   ,
    "defaultCurrentBrakeMax"        : 60  ,
    "defaultCurrentAccelerationMin" : 0.25,
    "defaultCurrentAccelerationMax" : 30
  },

  "motorCount" : 1,

  "authorizedControllers" : [1, 2, 3, 4, 5],

  "registeredControllers" : [
    {
      "id" : "ACCE1",
      "type" : 3,
      "priority" : 1,
      "enabled" : 0,
      "constraints" : {
        "brake" : 200,
        "accel" : 650
      }
    },
    {
      "id" : "JOYS1",
      "type" : 4,
      "priority" : 1,
      "enabled" : 0,
      "constraints" : {
        "brake" : 190,
        "accel" : 840
      }
    }
  ]
};