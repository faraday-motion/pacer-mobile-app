import React, { Component } from 'react';
import { Button, Text, View, ScrollView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import { SettingsController } from '../packages/fm-board';

import { Form,
  Separator,InputField, LinkField,
  SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';

export default class Settings extends Component {
  static propTypes = {
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
    };
  }

  componentDidMount() {
    this.mounted = true;

    this.props.settingsController
      .getSettings()
      .then((settings) => {
        if (this.mounted) {
          //this.setState({ settings });
          this.setState({ settings: defaultSettings }); // TODO:: delete this.
          this.initSettingsForm();
        }
      });
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onSave = () => {
    this.setState({ saving: true });

    this.props.settingsController
      .saveSettings(this.state.settings)
      .then(() => {
        this.setState({ saving: false });
      });
  };

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
    formData.webSocketrModule.setValue(Boolean(settings.modules.webSocketServer));
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
    if (this.state.settings === null) {
      return (<Text>Loading current settings</Text>);
    }

    return (
      <View style={{flex:2}} >

      
      <ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10}}>
        <Form
          ref='settingsForm'
          style={{marginBottom:24}}
          onChange={this.handleFormChange.bind(this)}
          label="Faraday Motion Vehicle Settings">

          <Text style={styles.formHeader}>Vehicle Console</Text>
          <Button title="Open Console" onPress={this.onConsoleBtnPress} style={{marginTop:24,marginBottom:24}} />
          <Text style={styles.helpText}>Only use if you know what you're doing.</Text>          
          
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
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='WebSocket Server'  ref="webServerModule"/>
          <Text style={styles.helpText}>Required for remote configuration and logging. Also used by the mobile application for controlling the vehicle.</Text>          
          <SwitchField containerStyle={ styles.switchContainer } labelStyle={ styles.switchLabel } label='WebServer'  ref="webSocketrModule"/>
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
      </ScrollView>
      </View>
    );
  }


  render() {
    return (
      <View style={{ flex:1 }}>
        {this.renderSettings()}
        <Button title="Save" style={{height:100}} onPress={this.onSave} disabled={this.state.saving || this.state.settings === null} />
      </View>
    );
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


