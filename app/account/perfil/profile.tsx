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
      <View className={perfilContainer}>
        <Text className={perfilLoading}>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView className={perfilContainer}>
      {user ? (
        <View className="p-4">
          <View className={perfilHeader}>
            <Text className={perfilNombre}>{user.name}</Text>
            <Text className={perfilUsername}>{user.user_name}</Text>
            <Text className={perfilEmail}>{user.email}</Text>
          </View>

          <View className={perfilCard}>
            <Text className={perfilTitulo}>Información Personal</Text>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Documento:</Text>
              <Text className={perfilValue}>{user.id_number}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Teléfono:</Text>
              <Text className={perfilValue}>{user.phone}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Dirección:</Text>
              <Text className={perfilValue}>{user.address}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Fecha de Nacimiento:</Text>
              <Text className={perfilValue}>{user.birth_date}</Text>
            </View>
            <View className={perfilRow}>
              <Text className={perfilLabel}>Género:</Text>
              <Text className={perfilValue}>{user.gender}</Text>
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