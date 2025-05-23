import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { UserDAO, ROLES } from '../../../interfaces/user'
import { Picker } from '@react-native-picker/picker'
import { tarjetaForm, tituloForm, parrafoForm, botonGuardar, tituloFormRoles } from '../../../components/tokens'
import { getAllUsers, updateUserRole } from '../../../lib/user'
import { useAuth } from '../../../context/AuthStore'
import { router, useFocusEffect } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker'
import Pagination from '../../../components/organisms/paginacion'

const Roles = () => {
  const { checkAuth } = useAuth()
  const [users, setUsers] = useState<UserDAO[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserDAO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserDAO | null>(null)
  const [newRole, setNewRole] = useState<number>(ROLES.logued)
  const [finalDate, setFinalDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<number | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) return

      const response = await getAllUsers()
      if (!response || !response.data) {
        setError('Formato de respuesta inválido')
        return
      }

      const filteredData = response.data.filter((user: UserDAO) => user.role_id !== ROLES.admin)
      setUsers(filteredData)
      setFilteredUsers(filteredData)
      setError(null)
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      setError('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  // Usar useFocusEffect para actualizar los datos cuando se navega a la pantalla
  useFocusEffect(
    React.useCallback(() => {
      fetchUsers()
    }, [])
  )

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
      Alert.alert('Éxito', 'Rol actualizado correctamente')
      // Actualizar la lista filtrada también
      setFilteredUsers(prevUsers => 
        prevUsers.map(user => 
          user.email === selectedUser.email ? { ...user, role_id: newRole } : user
        )
      )
    } catch (error) {
      console.error('Error al actualizar rol:', error)
      Alert.alert('Error', 'No se pudo actualizar el rol del usuario')
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

  // Función para filtrar usuarios
  const filterUsers = () => {
    let filtered = [...users]
    
    // Filtrar por búsqueda de texto
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Filtrar por rol
    if (selectedRoleFilter !== null) {
      filtered = filtered.filter(user => user.role_id === selectedRoleFilter)
    }
    
    setFilteredUsers(filtered)
    setCurrentPage(1) // Resetear a la primera página al filtrar
  }

  // Efecto para aplicar filtros cuando cambian los criterios
  useEffect(() => {
    filterUsers()
  }, [searchQuery, selectedRoleFilter])

  // Calcular usuarios para la página actual
  const indexOfLastUser = currentPage * itemsPerPage
  const indexOfFirstUser = indexOfLastUser - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

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
      
      {/* Barra de búsqueda y filtros */}
      <View className="mt-4 flex-row space-x-4">
        <View className="w-1/2">
          <TextInput
            className="border-2 border-gray-400 rounded-lg p-2"
            placeholder="Buscar por email, nombre o usuario..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View className="w-1/2 border-2 border-gray-400 rounded-lg">
          <Picker
            selectedValue={selectedRoleFilter}
            onValueChange={(itemValue) => setSelectedRoleFilter(itemValue)}
            style={{ height: 50 }}
          >
            <Picker.Item label="Todos los roles" value={null} />
            <Picker.Item label="Usuario Registrado" value={ROLES.logued} />
            <Picker.Item label="Usuario Premium" value={ROLES.premium} />
            <Picker.Item label="Gimnasio" value={ROLES.gym} />
          </Picker>
        </View>
      </View>
      
      {filteredUsers.length === 0 ? (
        <Text className={`${parrafoForm} mt-8`}>No hay usuarios para mostrar</Text>
      ) : (
        <View className="mt-8">
          {currentUsers.map((user) => (
            <View key={user.email} className="bg-white rounded-lg p-4 mb-4 border border-gray-300 shadow-lg">
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <Text className="text-gray-800 text-lg font-semibold">{user.name}</Text>
                    <View className="bg-blue-100 px-2 py-1 rounded-full">
                      <Text className="text-blue-800 text-sm">{getRoleName(user.role_id)}</Text>
                    </View>
                  </View>
                  <View className="space-y-1">
                    <Text className="text-gray-600">
                      <Text className="font-medium">Email:</Text> {user.email}
                    </Text>
                    <Text className="text-gray-600">
                      <Text className="font-medium">Usuario:</Text> {user.user_name || 'No especificado'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  className="bg-blue-500 px-4 py-2 rounded-lg ml-4"
                  onPress={() => openEditModal(user)}
                >
                  <Text className="text-white font-medium">Editar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Paginación */}
      {filteredUsers.length > 0 && (
        <View className="mt-4 mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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