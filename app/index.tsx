import { useContext } from 'react';
import { ConnectivityContext } from './_layout';
import { LoginForm } from '../components/organisms/LoginForm';

export default function Index() {
  const { isConnected } = useContext(ConnectivityContext);

  return <LoginForm isConnected={isConnected ?? false} />;
}