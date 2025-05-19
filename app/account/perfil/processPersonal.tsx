import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, TouchableOpacity,
  Modal, Pressable, TextInput, Alert
} from 'react-native';
import { deleteProfile, getProfileByEmail, postProfile, updateProfile } from '../../../lib/user';
import { useAuth } from '../../../context/AuthStore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker';
import { ProfileDAO, ProfileDTO, ProfileWithId } from '../../../interfaces/user';



const ProcessPersonal = () => {
  const [profiles, setProfiles] = useState<ProfileWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithId | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newProfile, setNewProfile] = useState<Omit<ProfileDTO, 'email'>>({
    height: 0,
    weight: 0,
    fat: 0,
    muscle: 0,
    chest: 0,
    biceps: 0,
    waist: 0,
    hips: 0,
    thigh: 0,
    physical_activity: 0,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const { user } = useAuth();
  const router = useRouter();
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredProfiles, setFilteredProfiles] = useState<ProfileWithId[]>([]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const fetchProfiles = async () => {
    try {
      if (!user?.email) throw new Error('No hay usuario autenticado');
      const data = await getProfileByEmail(user.email);
      setProfiles(data);
    } catch (error) {
      console.error('Error al obtener los perfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async (id: number) => {
    Alert.alert(
      "Eliminar Perfil",
      "¿Estás seguro que deseas eliminar este perfil? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProfile(id);
              await fetchProfiles();
            } catch (error) {
              console.error('Error al eliminar el perfil:', error);
              Alert.alert("Error", "No se pudo eliminar el perfil. Por favor, intenta de nuevo.");
            }
          }
        }
      ]
    );
  };
  

  useEffect(() => {
    fetchProfiles();
  }, [user?.email, refreshTrigger]);

  const resetForm = () => {
    setNewProfile({
      height: 0,
      weight: 0,
      fat: 0,
      muscle: 0,
      chest: 0,
      biceps: 0,
      waist: 0,
      hips: 0,
      thigh: 0,
      physical_activity: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setSelectedProfile(null);
    setModalVisible(true);
  };

  const openEditModal = (profile: ProfileWithId) => {
    setSelectedProfile(profile);
    setNewProfile({
      height: profile.height,
      weight: profile.weight,
      fat: profile.fat,
      muscle: profile.muscle,
      chest: profile.chest,
      biceps: profile.biceps,
      waist: profile.waist,
      hips: profile.hips,
      thigh: profile.thigh,
      physical_activity: profile.physical_activity,
      date: profile.date,
      notes: profile.notes,
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleCreateProfile = async () => {
    try {
      const perfil = { 
        ...newProfile, 
        user_email: user?.email,
        date: new Date().toISOString().split('T')[0]
      };
      console.log("Perfil a guardar:", perfil);
      
      await postProfile(perfil);
      setModalVisible(false);
      resetForm();
      await fetchProfiles();
      
    } catch (error) {
      console.error('Error al crear el perfil:', error);
    }
  };

  const handleEditProfile = async () => {
    Alert.alert(
      "Actualizar Perfil",
      "¿Estás seguro que deseas guardar los cambios?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Actualizar",
          onPress: async () => {
            try {
              if (!selectedProfile?.id) return;
              
              const updatedProfile = { ...newProfile, user_email: user?.email };
              await updateProfile(selectedProfile.id, updatedProfile);
              
              setModalVisible(false);
              setIsEditing(false);
              setSelectedProfile(null);
              resetForm();
              await fetchProfiles();
            } catch (error) {
              console.error('Error al actualizar el perfil:', error);
              Alert.alert("Error", "No se pudo actualizar el perfil. Por favor, intenta de nuevo.");
            }
          }
        }
      ]
    );
  };

  const filterProfiles = async () => {
    setFilterLoading(true);
    try {
      const today = new Date();
      let startDate: Date;

      switch (selectedFilter) {
        case 'week':
          startDate = new Date(today.setDate(today.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(today.setMonth(today.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(today.setFullYear(today.getFullYear() - 1));
          break;
        default:
          setFilteredProfiles(profiles);
          setFilterLoading(false);
          return;
      }

      const filtered = profiles.filter(profile => {
        const profileDate = new Date(profile.date);
        return profileDate >= startDate && profileDate <= new Date();
      });

      setFilteredProfiles(filtered);
    } catch (error) {
      console.error('Error al filtrar perfiles:', error);
      Alert.alert('Error', 'No se pudieron filtrar los perfiles');
    } finally {
      setFilterLoading(false);
    }
  };

  useEffect(() => {
    setFilteredProfiles(profiles);
  }, [profiles]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#00bcd4" />
        <Text className="mt-2 text-gray-600">Cargando datos personales...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="p-4 bg-gray-50">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">📋 Registros</Text>
          <View className='flex-row'>
            <TouchableOpacity
              className="bg-blue-600 rounded-full px-4 mr-3 py-2 shadow-lg"
              onPress={()=>router.push('/account/perfil/stats')}
            >
              <Text className="text-white font-semibold">Estadisticas</Text>
            </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-600 rounded-full px-4 py-2 shadow-lg"
            onPress={openCreateModal}
          >
            <Text className="text-white font-semibold">Crear</Text>
          </TouchableOpacity>


          </View>



        </View>

        {/* Filtro */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
          <View className="flex-row items-center gap-2">
            <View className="flex-1 bg-gray-100 rounded-lg">
              <Picker
                selectedValue={selectedFilter}
                onValueChange={(value: string) => setSelectedFilter(value)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Todos los registros" value="all" />
                <Picker.Item label="Última semana" value="week" />
                <Picker.Item label="Último mes" value="month" />
                <Picker.Item label="Último año" value="year" />
              </Picker>
            </View>
            <TouchableOpacity
              className="bg-blue-500 px-3 py-2 rounded-lg"
              onPress={filterProfiles}
              disabled={filterLoading}
            >
              {filterLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">Buscar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {filterLoading ? (
          <View className="flex-1 justify-center items-center py-8">
            <ActivityIndicator size="large" color="#00bcd4" />
            <Text className="mt-2 text-gray-600">Filtrando registros...</Text>
          </View>
        ) : (
          filteredProfiles.map((profile) => (
            <View key={profile.id} className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-lg font-bold text-gray-900">📅 Fecha: {formatDate(profile.date)}</Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    className="pr-4"
                    onPress={() => openEditModal(profile)}
                  >
                  <Ionicons name="pencil" size={24} color="#007AFF" />

                  </TouchableOpacity>
                  <TouchableOpacity
                    className=""
                    onPress={() => handleDeleteProfile(profile.id)}
                  >
                    <Ionicons name="trash" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="space-y-1">
                <Text className="text-gray-800">📏 Altura: {profile.height} cm</Text>
                <Text className="text-gray-800">⚖️ Peso: {profile.weight} kg</Text>
                <Text className="text-gray-800">💪 Masa muscular: {profile.muscle}%</Text>
                <Text className="text-gray-800">🔥 Grasa corporal: {profile.fat}%</Text>
                <Text className="text-gray-800">🏋️ Actividad física: nivel {profile.physical_activity}</Text>
              </View>

              <TouchableOpacity
                className="mt-3 bg-gray-200 p-2 rounded"
                onPress={() => {
                  setSelectedProfile(profile);
                  setDetailModalVisible(true);
                }}
              >
                <Text className="text-center text-blue-700">📊 Ver medidas detalladas</Text>
              </TouchableOpacity>

              {profile.notes ? (
                <View className="border-t border-gray-200 mt-3 pt-2">
                  <Text className="text-gray-700 italic">📝 {profile.notes}</Text>
                </View>
              ) : null}
            </View>
          ))
        )}


      </ScrollView>

      {/* Modal para crear/editar perfil */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setIsEditing(false);
          setSelectedProfile(null);
          resetForm();
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <Text className="text-2xl font-bold text-center mb-4">
              {isEditing ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
            </Text>

            {/* Campos numéricos en pares */}
            <View className="flex-row flex-wrap justify-between">
              {[
                ['📏 Altura (cm)', 'height'],
                ['⚖️ Peso (kg)', 'weight'],
                ['🔥 Grasa corporal (%)', 'fat'],
                ['💪 Masa muscular (%)', 'muscle'],
                ['📍 Pecho (cm)', 'chest'],
                ['💪 Bíceps (cm)', 'biceps'],
                ['🏃‍♂️ Cintura (cm)', 'waist'],
                ['🍑 Caderas (cm)', 'hips'],
                ['🦵 Muslo (cm)', 'thigh'],
                ['🏋️ Nivel actividad (1-7)', 'physical_activity'],
              ].map(([label, key]) => (
                <View key={key} className="w-[48%] mb-3">
                  <Text className="text-gray-700 font-semibold mb-1">{label}</Text>
                  <TextInput
                    keyboardType="decimal-pad"
                    className="border border-gray-300 p-2 rounded"
                    value={
                      (newProfile as any)[key] === 0
                        ? ''
                        : String((newProfile as any)[key] || '')
                    }
                    onChangeText={text => {
                      // Si el texto está vacío, establecer 0
                      if (text === '') {
                        setNewProfile({
                          ...newProfile,
                          [key]: 0
                        });
                        return;
                      }

                      // Si el texto termina en punto, mantenerlo
                      if (text.endsWith('.')) {
                        setNewProfile({
                          ...newProfile,
                          [key]: text
                        });
                        return;
                      }

                      // Validar que sea un número válido
                      const validText = text.replace(/[^0-9.]/g, '');
                      const parts = validText.split('.');
                      
                      // Si hay más de un punto decimal, mantener solo el primero
                      const formattedText = parts.length > 2 
                        ? parts[0] + '.' + parts.slice(1).join('')
                        : validText;

                      // Solo convertir a número si no termina en punto
                      const parsed = parseFloat(formattedText);
                      if (!isNaN(parsed)) {
                        let value: number | string = formattedText;
                    
                        // Restricción especial para physical_activity
                        if (key === 'physical_activity') {
                          const num = parseInt(formattedText);
                          if (!isNaN(num)) {
                            const bounded = Math.max(1, Math.min(7, num));
                            value = bounded;
                          }
                        }
                    
                        setNewProfile({
                          ...newProfile,
                          [key]: value
                        });
                      }
                    }}
                  />
                </View>
              ))}
            </View>

            {/* Notas */}
            <Text className="text-gray-700 font-semibold mb-1">📝 Notas</Text>
            <TextInput
              placeholder="Observaciones adicionales"
              className="border border-gray-300 p-2 rounded mb-4"
              value={newProfile.notes}
              onChangeText={text => setNewProfile({ ...newProfile, notes: text })}
              maxLength={255}
            />

            {/* Botones */}
            <Pressable 
              className="bg-green-600 p-3 rounded mb-2" 
              onPress={isEditing ? handleEditProfile : handleCreateProfile}
            >
              <Text className="text-white text-center font-semibold">
                {isEditing ? 'Actualizar Perfil' : 'Guardar Perfil'}
              </Text>
            </Pressable>
            <Pressable 
              className="bg-gray-300 p-3 rounded" 
              onPress={() => {
                setModalVisible(false);
                setIsEditing(false);
                setSelectedProfile(null);
              }}
            >
              <Text className="text-center text-gray-800 font-semibold">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Modal para ver medidas detalladas */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <Text className="text-2xl font-bold text-center mb-4">
              📊 Medidas Corporales
            </Text>

            {selectedProfile && (
              <View className="space-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-semibold">📍 Pecho:</Text>
                  <Text className="text-gray-800">{selectedProfile.chest} cm</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-semibold">💪 Bíceps:</Text>
                  <Text className="text-gray-800">{selectedProfile.biceps} cm</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-semibold">🏃‍♂️ Cintura:</Text>
                  <Text className="text-gray-800">{selectedProfile.waist} cm</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-semibold">🍑 Caderas:</Text>
                  <Text className="text-gray-800">{selectedProfile.hips} cm</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-700 font-semibold">🦵 Muslo:</Text>
                  <Text className="text-gray-800">{selectedProfile.thigh} cm</Text>
                </View>
              </View>
            )}

            <Pressable 
              className="bg-blue-500 p-3 rounded mt-6" 
              onPress={() => setDetailModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold">Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProcessPersonal;
