import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { UserDAO, ROLES } from '../../../interfaces/user'
import { Picker } from '@react-native-picker/picker'
import { tarjetaForm, tituloForm, parrafoForm, botonGuardar, tituloFormRoles } from '../../../components/tokens'
import { getAllUsers, updateUserRole } from '../../../lib/user'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'

const Roles = () => {
  const { checkAuth } = useAuth()
  const [users, setUsers] = useState<UserDAO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserDAO | null>(null)
  const [newRole, setNewRole] = useState<number>(ROLES.logued)
  const [finalDate, setFinalDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

  const fetchUsers = async () => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    const response = await getAllUsers()
    if (!response || !response.data) {
      setError('Formato de respuesta inválido')
      return
    }

    setUsers(response.data.filter((user: UserDAO) => user.role_id !== ROLES.admin))
    setError(null)
    setLoading(false)
  }

  const handleRoleUpdate = async () => {
    if (!selectedUser) return

    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    try {
      await updateUserRole(selectedUser.email, newRole, finalDate.toISOString().split('T')[0])
      setUsers(users.map(user => 
        user.email === selectedUser.email ? { ...user, role_id: newRole } : user
      ))
      setModalVisible(false)
    } catch (error) {
      setError('Error al actualizar el rol del usuario')
    }
  }

  const openEditModal = (user: UserDAO) => {
    setSelectedUser(user)
    setNewRole(user.role_id)
    setModalVisible(true)
  }

  const getRoleName = (roleId: number) => {
    switch (roleId) {
      case ROLES.logued:
        return 'Usuario Registrado'
      case ROLES.premium:
        return 'Usuario Premium'
      case ROLES.gym:
        return 'Gimnasio'
      default:
        return 'Desconocido'
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#1F2953]">
        <Text className={parrafoForm}>Cargando usuarios...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-[#1F2953]">
        <Text className={parrafoForm}>{error}</Text>
        <TouchableOpacity 
          className={botonGuardar}
          onPress={fetchUsers}
        >
          <Text className="text-white text-center">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className={tituloFormRoles}>Gestión de Roles</Text>
      
      {users.length === 0 ? (
        <Text className={`${parrafoForm} mt-8`}>No hay usuarios para mostrar</Text>
      ) : (
        <View className="mt-8">
          {users.map((user) => (
            <View key={user.email} className="bg-white rounded-lg p-4 mb-4 border border-gray-300 shadow-lg">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-gray-800 text-base">Email: {user.email}</Text>
                  <Text className="text-gray-800 text-base">Usuario: {user.user_name || 'No especificado'}</Text>
                  <Text className="text-gray-800 text-base">Nombre: {user.name}</Text>
                  <Text className="text-gray-800 text-base">Rol actual: {getRoleName(user.role_id)}</Text>
                </View>
                <TouchableOpacity 
                  className="bg-blue-500 px-4 py-2 rounded-lg"
                  onPress={() => openEditModal(user)}
                >
                  <Text className="text-white">Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">Editar Rol de Usuario</Text>
            
            <Text className="text-gray-800 mb-2">Nuevo Rol:</Text>
            <View className="border-2 border-gray-400 rounded-lg mb-4">
              <Picker
                selectedValue={newRole}
                onValueChange={(itemValue: number) => setNewRole(itemValue)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Usuario Registrado" value={ROLES.logued} />
                <Picker.Item label="Usuario Premium" value={ROLES.premium} />
                <Picker.Item label="Gimnasio" value={ROLES.gym} />
              </Picker>
            </View>

            <Text className="text-gray-800 mb-2">Fecha Final:</Text>
            <TouchableOpacity 
              className="border-2 border-gray-400 rounded-lg p-3 mb-4"
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{finalDate.toLocaleDateString()}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={finalDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false)
                  if (selectedDate) {
                    setFinalDate(selectedDate)
                  }
                }}
              />
            )}

            <View className="flex-row justify-end space-x-4">
              <TouchableOpacity 
                className="bg-gray-500 px-4 py-2 rounded-lg"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-white">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleRoleUpdate}
              >
                <Text className="text-white">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

export default Roles