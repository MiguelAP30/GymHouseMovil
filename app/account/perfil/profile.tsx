import { View, Text, ScrollView } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthStore';
import {
  perfilContainer,
  perfilHeader,
  perfilNombre,
  perfilUsername,
  perfilEmail,
  perfilCard,
  perfilTitulo,
  perfilRow,
  perfilLabel,
  perfilValue,
  perfilLoading,
  perfilError
} from '../../../components/tokens';

const Profile = () => {
  const { profile, fetchUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View className={perfilContainer}>
        <Text className={perfilLoading}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className={perfilContainer}>
      {profile ? (
        <View className="p-4">
          <View className={perfilHeader}>
            <Text className={perfilNombre}>{profile.name}</Text>
            <Text className={perfilUsername}>{profile.user_name}</Text>
            <Text className={perfilEmail}>{profile.email}</Text>
          </View>

          <View className={perfilCard}>
            <Text className={perfilTitulo}>Información Personal</Text>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Documento:</Text>
              <Text className={perfilValue}>{profile.id_number}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Teléfono:</Text>
              <Text className={perfilValue}>{profile.phone}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Dirección:</Text>
              <Text className={perfilValue}>{profile.address}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Fecha de Nacimiento:</Text>
              <Text className={perfilValue}>{profile.birth_date}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Género:</Text>
              <Text className={perfilValue}>{profile.gender}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className={perfilError}>
          No se pudo cargar la información del usuario
        </Text>
      )}
    </ScrollView>
  );
};

export default Profile;