import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const DashboardAdmin = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenido</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2A4A', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DashboardAdmin;
