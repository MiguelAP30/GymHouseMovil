import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterData } from '../../utils/RegisterSchema';  
import { 
  tituloForm, labelForm, parrafoForm, inputForm, 
  botonGeneral, textoBotonGeneral, letraPequeñaForm, fondoTotal 
} from '../../components/tokens';
import { useNetwork } from '../../contexts/NetworkProvider';

export default function Register() {
  const { isConnected } = useNetwork();
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: ""
    }
  });

  const onSubmit = (data: RegisterData) => {
    if(!isConnected){
      Alert.alert("Error", "No tienes conexión a Internet");
      return;
    }else{
      Alert.alert("Registro exitoso", JSON.stringify(data, null, 2));
    }
    
  };

  return (
    <View className={`${fondoTotal} flex-1 px-6`}>
      
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
      {isConnected === false && (
        <View className="w-full items-center mb-4">
          <Text className="text-red-500">No tienes conexión a Internet</Text>
        </View>
      )}
        <Image source={require('../../assets/logo.png')} className="w-32 h-32 mt-8 mb-6" />

        <Text className={tituloForm}>Regístrate en GymHouse</Text>
        <Text className={parrafoForm}>Crea una cuenta para acceder a entrenamientos personalizados</Text>

        {/* Campo: Nombre */}
        <View className="w-full mt-6">
          <Text className={labelForm}>Nombre</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={inputForm} placeholder="Tu nombre completo" placeholderTextColor="gray" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          {errors.name && <Text className="text-red-500">{errors.name.message}</Text>}
        </View>

        {/* Campo: Correo */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Correo electrónico</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={inputForm} placeholder="tucorreo@ejemplo.com" placeholderTextColor="gray" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
        </View>

        {/* Campo: Contraseña */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={inputForm} placeholder="********" placeholderTextColor="gray" secureTextEntry value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
        </View>

        {/* Campo: Teléfono */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Número de teléfono</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={inputForm} placeholder="1234567890" placeholderTextColor="gray" keyboardType="phone-pad" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          {errors.phone && <Text className="text-red-500">{errors.phone.message}</Text>}
        </View>

        {/* Campo: Dirección */}
        <View className="w-full mt-4">
          <Text className={labelForm}>Dirección</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput className={inputForm} placeholder="Calle 123 # 45-67" placeholderTextColor="gray" value={value} onChangeText={onChange} onBlur={onBlur} />
            )}
          />
          {errors.address && <Text className="text-red-500">{errors.address.message}</Text>}
        </View>

        {/* Botón de registro */}
        <TouchableOpacity className={botonGeneral} onPress={handleSubmit(onSubmit)}>
          <Text className={textoBotonGeneral}>Registrarse</Text>
        </TouchableOpacity>

        {/* Enlace a inicio de sesión */}
        <Text className={letraPequeñaForm}>
          ¿Ya tienes una cuenta?  
          <Link href="/login" className="text-blue-400"> Iniciar sesión</Link>
        </Text>
      </ScrollView>
    </View>
  );
}