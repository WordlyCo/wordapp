import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';

const HelpCenterScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>
      
      <List.Section>
        <List.Item
          title="Frequently Asked Questions"
          left={props => <List.Icon {...props} icon="frequently-asked-questions" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Contact Support"
          left={props => <List.Icon {...props} icon="message" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Report a Problem"
          left={props => <List.Icon {...props} icon="alert" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default HelpCenterScreen;