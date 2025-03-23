import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthStore';

const Profile = () => {
  const { user, fetchUserData, getProfileByEmail } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
      setLoading(false);
    };
    loadData();
    getProfileByEmail(user?.email || '');
    
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {user ? (
        <View style={styles.content}>
          <View style={styles.header}>
            {/* <Image
              style={styles.profileImage}
              source={require('../../../assets/default-profile.png')}
            /> */}
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.user_name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Personal</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Documento:</Text>
              <Text style={styles.value}>{user.id_number}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Teléfono:</Text>
              <Text style={styles.value}>{user.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Dirección:</Text>
              <Text style={styles.value}>{user.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha de Nacimiento:</Text>
              <Text style={styles.value}>{user.birth_date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Género:</Text>
              <Text style={styles.value}>{user.gender}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.errorText}>No se pudo cargar la información del usuario</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2d3a61',
    borderRadius: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  username: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  email: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Profile;