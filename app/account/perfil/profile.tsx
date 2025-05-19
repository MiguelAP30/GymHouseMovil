import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/AuthStore';
import { changePassword, updateUserData } from '../../../lib/user';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
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
  perfilError,
  botonGeneral,
  textoBotonGeneral,
  inputForm,
  labelForm,
  inputFormPicker
} from '../../../components/tokens';
import { router } from 'expo-router';

const Profile = () => {
  const { profile, fetchUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    id_number: '',
    user_name: '',
    name: '',
    phone: '',
    address: '',
    birth_date: '',
    gender: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    const loadData = async () => {
      await fetchUserData();
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (profile) {
      const birthDate = profile.birth_date ? new Date(profile.birth_date + 'T00:00:00') : '';
      
      setFormData({
        id_number: profile.id_number || '',
        user_name: profile.user_name || '',
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        birth_date: birthDate ? formatDate(birthDate) : '',
        gender: profile.gender === 'Masculino' ? 'm' : 'f'
      });
    }
  }, [profile]);

  const formatDate = (date: Date): string => {
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    
    const year = adjustedDate.getFullYear();
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    return date;
  };

  const validateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age >= 10;
  };

  const handleUpdateProfile = async () => {
    try {
      // Validar id_number (obligatorio, min_length=6, max_length=20)
      if (!formData.id_number || formData.id_number.trim() === '') {
        Alert.alert('Error', 'El número de identificación es obligatorio');
        return;
      }
      if (formData.id_number.length < 6) {
        Alert.alert('Error', 'El número de identificación debe tener al menos 6 caracteres');
        return;
      }
      if (formData.id_number.length > 20) {
        Alert.alert('Error', 'El número de identificación no puede exceder los 20 caracteres');
        return;
      }

      // Validar user_name (opcional, min_length=6, max_length=50)
      if (formData.user_name && formData.user_name.trim() !== '') {
        if (formData.user_name.length < 6) {
          Alert.alert('Error', 'El nombre de usuario debe tener al menos 6 caracteres');
          return;
        }
        if (formData.user_name.length > 50) {
          Alert.alert('Error', 'El nombre de usuario no puede exceder los 50 caracteres');
          return;
        }
      }

      // Validar name (obligatorio, min_length=2, max_length=50)
      if (!formData.name || formData.name.trim() === '') {
        Alert.alert('Error', 'El nombre es obligatorio');
        return;
      }
      if (formData.name.length < 2) {
        Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
        return;
      }
      if (formData.name.length > 50) {
        Alert.alert('Error', 'El nombre no puede exceder los 50 caracteres');
        return;
      }

      // Validar phone (obligatorio, min_length=8, max_length=20)
      if (!formData.phone || formData.phone.trim() === '') {
        Alert.alert('Error', 'El teléfono es obligatorio');
        return;
      }
      if (formData.phone.length < 8) {
        Alert.alert('Error', 'El teléfono debe tener al menos 8 caracteres');
        return;
      }
      if (formData.phone.length > 20) {
        Alert.alert('Error', 'El teléfono no puede exceder los 20 caracteres');
        return;
      }

      // Validar address (opcional, min_length=8, max_length=150)
      if (formData.address && formData.address.trim() !== '') {
        if (formData.address.length < 8) {
          Alert.alert('Error', 'La dirección debe tener al menos 8 caracteres');
          return;
        }
        if (formData.address.length > 150) {
          Alert.alert('Error', 'La dirección no puede exceder los 150 caracteres');
          return;
        }
      }

      // Validar birth_date (obligatorio)
      if (!formData.birth_date || formData.birth_date.trim() === '') {
        Alert.alert('Error', 'La fecha de nacimiento es obligatoria');
        return;
      }

      // Validar gender (obligatorio, min_length=1, max_length=1)
      if (!formData.gender || formData.gender.trim() === '') {
        Alert.alert('Error', 'El género es obligatorio');
        return;
      }
      if (!['m', 'f'].includes(formData.gender.toLowerCase())) {
        Alert.alert('Error', 'El género debe ser "m" o "f"');
        return;
      }

      // Validar la edad mínima
      if (formData.birth_date) {
        if (!validateAge(formData.birth_date)) {
          Alert.alert('Error', 'Debes ser mayor de 10 años');
          return;
        }
      }

      await updateUserData(profile!.email, formData);
      await fetchUserData();
      setIsEditing(false);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al actualizar los datos');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (passwordData.new_password.length < 6) {
      Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (passwordData.new_password.length > 60) {
      Alert.alert('Error', 'La contraseña no puede exceder los 60 caracteres');
      return;
    }

    try {
      await changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setIsChangingPassword(false);
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al cambiar la contraseña');
    }
  };

  if (loading) {
    return (
      <View className={perfilContainer}>
        <Text className={perfilLoading}>Cargando...</Text>
      </View>
    );
  }

  if (isChangingPassword) {
    return (
      <ScrollView className={perfilContainer}>
        <View className="p-4">
          <Text className={perfilTitulo}>Cambiar Contraseña</Text>
          
          <View className="mt-4 bg-white p-4 rounded-lg">
            <View className="mt-4">
              <Text className="text-gray-600 font-medium mb-1">Contraseña Actual</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg p-2 text-gray-800"
                secureTextEntry
                value={passwordData.current_password}
                onChangeText={(text) => setPasswordData({ ...passwordData, current_password: text })}
                placeholder="Tu contraseña actual"
                placeholderTextColor="#9CA3AF"
                maxLength={60}
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-600 font-medium mb-1">Nueva Contraseña</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg p-2 text-gray-800"
                secureTextEntry
                value={passwordData.new_password}
                onChangeText={(text) => setPasswordData({ ...passwordData, new_password: text })}
                placeholder="Tu nueva contraseña"
                placeholderTextColor="#9CA3AF"
                maxLength={60}
              />
            </View>

            <View className="mt-4">
              <Text className="text-gray-600 font-medium mb-1">Confirmar Nueva Contraseña</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-lg p-2 text-gray-800"
                secureTextEntry
                value={passwordData.confirm_password}
                onChangeText={(text) => setPasswordData({ ...passwordData, confirm_password: text })}
                placeholder="Confirma tu nueva contraseña"
                placeholderTextColor="#9CA3AF"
                maxLength={60}
              />
            </View>

            <TouchableOpacity 
              className={`${botonGeneral} mt-6`}
              onPress={handleChangePassword}
            >
              <Text className={textoBotonGeneral}>Cambiar Contraseña</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => setIsChangingPassword(false)}
            className="mt-4"
          >
            <Text className="text-blue-400">Volver al perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={perfilContainer}>
      {profile ? (
        <View className="p-4">

          <View className="relative">
            <TouchableOpacity 
              className="absolute right-3 top-2 z-10"
              onPress={() => router.push('/account/perfil/settings')}
            >
              <Ionicons name="settings" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View className={perfilHeader}>
              <Text className={perfilNombre}>{profile.name}</Text>
              <Text className={perfilUsername}>{profile.user_name}</Text>
              <Text className={perfilEmail}>{profile.email}</Text>
            </View>
          </View>

          <View className={perfilCard}>
            <View className="flex-row justify-between items-center">
              <Text className={perfilTitulo}>Información Personal</Text>
              <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                <Text className="text-blue-400">{isEditing ? 'Cancelar' : 'Editar'}</Text>
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <>
                <View className="mt-4">
                  <Text className="text-gray-700 font-semibold mb-1">Nombre *</Text>
                  <TextInput
                    className="bg-white border border-gray-400 rounded-lg p-2 text-gray-800"
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Tu nombre completo"
                    placeholderTextColor="gray"
                    maxLength={50}
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-gray-700 font-semibold mb-1">Nombre de Usuario</Text>
                  <TextInput
                    className="bg-white border border-gray-400 rounded-lg p-2 text-gray-800"
                    value={formData.user_name}
                    onChangeText={(text) => setFormData({ ...formData, user_name: text })}
                    placeholder="Tu nombre de usuario"
                    placeholderTextColor="gray"
                    maxLength={50}
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-gray-700 font-semibold mb-1">Documento *</Text>
                  <TextInput
                    className="bg-white border border-gray-400 rounded-lg p-2 text-gray-800"
                    value={formData.id_number}
                    onChangeText={(text) => setFormData({ ...formData, id_number: text })}
                    placeholder="Tu número de documento"
                    placeholderTextColor="gray"
                    maxLength={20}
                    keyboardType="numeric"
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-gray-700 font-semibold mb-1">Teléfono *</Text>
                  <TextInput
                    className="bg-white border border-gray-400 rounded-lg p-2 text-gray-800"
                    value={formData.phone}
                    onChangeText={(text) => setFormData({ ...formData, phone: text })}
                    placeholder="Tu número de teléfono"
                    placeholderTextColor="gray"
                    maxLength={20}
                    keyboardType="phone-pad"
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-gray-700 font-semibold mb-1">Dirección</Text>
                  <TextInput
                    className="bg-white border border-gray-400 rounded-lg p-2 text-gray-800"
                    value={formData.address}
                    onChangeText={(text) => setFormData({ ...formData, address: text })}
                    placeholder="Tu dirección"
                    placeholderTextColor="gray"
                    maxLength={150}
                  />
                </View>

                <View className="mt-4">
                  <Text className="text-gray-700 font-semibold mb-1">Fecha de Nacimiento *</Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="bg-white border border-gray-400 rounded-lg p-2"
                  >
                    <Text style={{ color: formData.birth_date ? '#1F2937' : 'gray' }}>
                      {formData.birth_date || 'YYYY-MM-DD'}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={formData.birth_date ? new Date(formData.birth_date) : new Date(getMaxDate())}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate) {
                          setFormData({ ...formData, birth_date: formatDate(selectedDate) });
                        }
                      }}
                      maximumDate={getMaxDate()}
                    />
                  )}
                </View>

                <View className="mt-4">
                  <Text className="text-gray-700 font-semibold mb-1">Género *</Text>
                  <View className="bg-white border border-gray-400 rounded-lg">
                    <Picker
                      selectedValue={formData.gender}
                      onValueChange={(itemValue) => setFormData({ ...formData, gender: itemValue })}
                      style={{ color: '#1F2937' }}
                    >
                      <Picker.Item label="Selecciona un género" value="" enabled={false} style={{ color: 'gray' }} />
                      <Picker.Item label="Masculino" value="m" style={{ color: '#1F2937' }} />
                      <Picker.Item label="Femenino" value="f" style={{ color: '#1F2937' }} />
                    </Picker>
                  </View>
                </View>

                <TouchableOpacity 
                  className={`${botonGeneral} mt-4`}
                  onPress={handleUpdateProfile}
                >
                  <Text className={textoBotonGeneral}>Guardar Cambios</Text>
                </TouchableOpacity>
              </>
            ) : (
              
              <>
              
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
                  <Text className={perfilValue}>{profile.birth_date ? new Date(profile.birth_date).toLocaleDateString() : 'No especificada'}</Text>
                </View>
                <View className={perfilRow}>
                  <Text className={perfilLabel}>Género:</Text>
                  <Text className={perfilValue}>{profile.gender}</Text>
                </View>

                <TouchableOpacity 
                  className={`${botonGeneral} mt-4`}
                  onPress={() => setIsChangingPassword(true)}
                >
                  <Text className={textoBotonGeneral}>Cambiar Contraseña</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                className={`${botonGeneral} mt-4`}
                onPress={() => router.push('account/perfil/processPersonal')}
              >
                  <Text className={textoBotonGeneral}>Progreso</Text>
              </TouchableOpacity>
              </>
            )}
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