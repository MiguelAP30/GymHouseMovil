import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { UserDAO, ROLES } from '../../../interfaces/interfaces'
import { Picker } from '@react-native-picker/picker'
import { tarjetaForm, tituloForm, parrafoForm, botonGuardar, tituloFormRoles } from '../../../components/tokens'
import { getAllUsers, updateUserRole } from '../../../lib/api_gymhouse'
import { useAuth } from '../../../context/AuthStore'
import { router } from 'expo-router'

const Roles = () => {
  const { checkAuth } = useAuth()
  const [users, setUsers] = useState<UserDAO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const handleRoleUpdate = async (email: string, newRoleId: number) => {
    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) return

    await updateUserRole(email, newRoleId)
    setUsers(users.map(user => 
      user.email === email ? { ...user, role_id: newRoleId } : user
    ))
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
              <View className="items-center">
                <Text className="text-gray-800 text-base">Email: {user.email}</Text>
                <Text className="text-gray-800 text-base">Usuario: {user.user_name || 'No especificado'}</Text>
                <Text className="text-gray-800 text-base">Nombre: {user.name}</Text>
              </View>
              
              <View className="mt-4 border-2 border-gray-400 rounded-lg overflow-hidden">
                <Picker
                  selectedValue={user.role_id}
                  onValueChange={(itemValue: number) => handleRoleUpdate(user.email, itemValue)}
                  style={{ 
                    backgroundColor: 'white',
                    color: 'black',
                    height: 50
                  }}
                >
                  <Picker.Item label="Usuario Registrado" value={ROLES.logued} />
                  <Picker.Item label="Usuario Premium" value={ROLES.premium} />
                  <Picker.Item label="Gimnasio" value={ROLES.gym} />
                </Picker>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

export default Roles