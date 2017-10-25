import React from 'react';
import { KeyboardAvoidingView, View } from 'react-native';
import PropTypes from 'prop-types';

const Toast = ({ children }) => (
  <KeyboardAvoidingView
    behavior="position"
    keyboardVerticalOffset={15}
    style={styles.container}
  >
    <View style={styles.content}>
      {children}
    </View>
  </KeyboardAvoidingView>
);

Toast.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Toast;

const styles = {
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 60,
  },
  content: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: 'rgba(152, 152, 152, 0.4)',
    borderRadius: 50,
  },
};
