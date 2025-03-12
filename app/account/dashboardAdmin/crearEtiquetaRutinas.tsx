import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const CrearEtiquetaRutinas = () => {
  const [etiqueta, setEtiqueta] = useState('');
  const [etiquetas, setEtiquetas] = useState(['Cardio', 'Fuerza', 'eeee']);

  const agregarEtiqueta = () => {
    if (etiqueta.trim()) {
      setEtiquetas([...etiquetas, etiqueta]);
      setEtiqueta('');
    }
  };

  const eliminarEtiqueta = (index:any) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>

      <View style={styles.card}>
        <Text style={styles.title}>Agregar nueva etiqueta</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la etiqueta"
          value={etiqueta}
          onChangeText={setEtiqueta}
        />
        <TouchableOpacity style={styles.button} onPress={agregarEtiqueta}>
          <Text style={styles.buttonText}>Agregar etiqueta</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.card}>
        <Text style={styles.title}>Lista de etiquetas</Text>
        <FlatList
          data={etiquetas}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.etiquetaRow}>
              <Text style={styles.etiquetaText}>{item}</Text>
              <View style={styles.icons}>
                <TouchableOpacity>
                  <Ionicons name="pencil" size={20} color="gold" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => eliminarEtiqueta(index)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', 
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  etiquetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  etiquetaText: {
    fontSize: 16,
  },
  icons: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default CrearEtiquetaRutinas;
