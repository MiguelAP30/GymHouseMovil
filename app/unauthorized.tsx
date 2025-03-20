import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function Unauthorized() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acceso No Autorizado</Text>
      <Text style={styles.message}>
        No tienes permisos para acceder a esta página.
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F2937',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#37A4DF',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 