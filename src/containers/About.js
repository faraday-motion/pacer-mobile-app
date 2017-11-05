import React from 'react';
import { Linking, Button, Image, Text, View, ScrollView, StyleSheet } from 'react-native';

const About = () => (
  <View style={styles.container}>
    <ScrollView style={{paddingLeft:10,paddingRight:10}}>
      
      <View style={styles.imageContainer}> 
        <Image source={require('../img/pacer_logo.png')} style={{width:100, height:100}}></Image> 
      </View>

      <Text style={styles.titleText}>What is Pacer?</Text>
      <Image source={require('../img/vehicles.jpg')} resizeMode="contain" style={{width: 325, height: 150}} ></Image> 
      <Text style={styles.text}>Pacer is a development platform that enables fast and cheap development of light electric vehicles.</Text>
      <Text style={styles.text}>Pacer bundles open source software with modular hardware components.</Text>

      <Text style={styles.headerText}>Community</Text>
      <Text style={styles.text}>Pacer is an open source project and we have a place were we all contribute to its development.</Text>
      <View style={{marginTop:8, alignItems:'center'}}>
       <Button title="Join the Forum" onPress={ ()=>{ Linking.openURL('http://forum.faradaymotion.com')}} />
      </View>

      <Text style={styles.headerText}>Useful Links</Text>
      <View style={{marginTop:8, alignItems:'center'}}>
       <Button title="Web Shop" onPress={ ()=>{ Linking.openURL('http://shop.faradaymotion.com')}} />
      </View>          
      <View style={{marginTop:8, alignItems:'center'}}>
       <Button title="GitHub" onPress={ ()=>{ Linking.openURL('https://github.com/faraday-motion')}} />
      </View>        
      <View style={{marginTop:8, alignItems:'center'}}>
       <Button title="YouTube" onPress={ ()=>{ Linking.openURL('https://youtube.com/faradaymotion')}} />
      </View>            
      <View style={{marginTop:8, alignItems:'center'}}>
       <Button title="Facebook" onPress={ ()=>{ Linking.openURL('https://facebook.com/faradaymotion')}} />
      </View>      
      <View style={{marginTop:8, alignItems:'center'}}>
       <Button title="Instagram" onPress={ ()=>{ Linking.openURL('https://instagram.com/faradaymotion')}} />
      </View>         
      <View style={{marginTop:8, alignItems:'center'}}>
       <Button title="Twitter" onPress={ ()=>{ Linking.openURL('https://twitter.com/faradaymotion')}} />
      </View>      


      <Text style={styles.headerText}>Powered By Faraday Motion</Text>
      <Text style={styles.text}>Pacer was developed by the community along with Faraday Motion.</Text>
      <View style={{marginTop:8, marginBottom: 30, alignItems:'center'}}>
       <Button title="Official Website" onPress={ ()=>{ Linking.openURL('http://faradaymotion.com')}} />
      </View>   
    </ScrollView>
  </View>
);

export default About;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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