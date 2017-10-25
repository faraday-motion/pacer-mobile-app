import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

const ConsoleHistory = ({ history }) => (
  <View style={styles.consoleHistory}>
    <Text>Console history ({history.length})</Text>
    <ScrollView style={styles.consoleHistoryEntries}>
      {
        history.slice(0).reverse().map((item, ix) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={ix} style={styles.historyEntry}>
            <Text>&rarr; {item.command}</Text>
            <Text>&larr; {item.response}</Text>
          </View>
        ))
      }
    </ScrollView>
  </View>
);

ConsoleHistory.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    command: PropTypes.text,
    response: PropTypes.response,
  })).isRequired,
};

export default ConsoleHistory;

const styles = {
  consoleHistory: {
    flex: 1,
  },
  consoleHistoryEntries: {
    marginTop: 20,
  },
  historyEntry: {
    paddingBottom: 5,
    marginBottom: 5,
    borderBottomColor: '#4b4eaa',
    borderBottomWidth: 3,
  },
};
