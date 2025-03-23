import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { UserDAO, ROLES } from '../../../interfaces/interfaces'
import { Picker } from '@react-native-picker/picker'
import { tarjetaForm, tituloForm, parrafoForm, botonGuardar } from '../../../components/tokens'
import { getAllUsers, updateUserRole } from '../../../lib/api_gymhouse'

const Roles = () => {
  const [users, setUsers] = useState<UserDAO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers()
      setUsers(response.data.filter((user: UserDAO) => user.role_id !== ROLES.admin))
      setError(null)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al cargar los usuarios. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (email: string, newRoleId: number) => {
    try {
      await updateUserRole(email, newRoleId)
      setUsers(users.map(user => 
        user.email === email ? { ...user, role_id: newRoleId } : user
      ))
      setError(null)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al actualizar el rol. Por favor, intenta de nuevo.')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className={parrafoForm}>Cargando usuarios...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className={parrafoForm}>{error}</Text>
        <TouchableOpacity 
          className={botonGuardar}
          onPress={fetchUsers}
        >
          <Text className="text-black text-center">Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 p-4 bg-black">
      <Text className={tituloForm}>Gestión de Roles</Text>
      
      {users.length === 0 ? (
        <Text className={parrafoForm}>No hay usuarios para mostrar</Text>
      ) : (
        users.map((user) => (
          <View key={user.email} className={`${tarjetaForm} mb-4`}>
            <Text className={parrafoForm}>Email: {user.email}</Text>
            <Text className={parrafoForm}>Usuario: {user.user_name}</Text>
            <Text className={parrafoForm}>Nombre: {user.name}</Text>
            
            <View className="mt-4">
              <Picker
                selectedValue={user.role_id}
                onValueChange={(itemValue: number) => handleRoleUpdate(user.email, itemValue)}
                style={{ backgroundColor: '#374151', color: 'white' }}
              >
                <Picker.Item label="Usuario Registrado" value={ROLES.logued} />
                <Picker.Item label="Usuario Premium" value={ROLES.premium} />
                <Picker.Item label="Gimnasio" value={ROLES.gym} />
              </Picker>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  )
}

export default Roles