import { View } from 'react-native';
import { RegisterForm } from '../components/organisms/RegisterForm';
import { useNetInfo } from '@react-native-community/netinfo';

export default function Register() {
  const netInfo = useNetInfo();
  const isConnected = netInfo.isConnected ?? false;

  return (
    <View className="flex-1">
      <RegisterForm isConnected={isConnected} />
    </View>
  );
}
