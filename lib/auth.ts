import { getEnvironment } from '../config/env';
import { LoginDAO, RegisterDAO, VerifyEmailDAO, ResendVerificationDAO, ResetPasswordDAO } from '../interfaces/auth';
import { UserDAO } from '../interfaces/user';

const API = getEnvironment().API_URL;

export const postRegister = async (data: RegisterDAO) => {
  try {
    console.log('Intentando registrar con URL:', `${API}/register`);
    const response = await fetch(`${API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de registro:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error en el registro');
    }

    const responseData = await response.json();
    
    return {
      status: 201,
      message: responseData.message || 'Registro exitoso. Por favor verifica tu email.',
      data: responseData.data
    };
  } catch (error) {
    console.error('Error en el registro:', error);
    throw error;
  }
}

export const postLogin = async (data: LoginDAO) => {
  try {
    console.log('Intentando login con URL:', `${API}/login`);
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de login:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error en el inicio de sesión');
    }

    const rawData = await response.json();
    console.log('Respuesta raw del servidor:', rawData);
    
    if (!rawData.access_token) {
      console.error('Respuesta del servidor inválida:', rawData);
      throw new Error('La respuesta del servidor no tiene el formato esperado');
    }

    const tokenParts = rawData.access_token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    console.log('Payload del token:', payload);
    
    const user = {
      email: payload.sub,
      name: payload['user.name'],
      id_number: payload['user.id_number'],
      role_id: payload['user.role'],
      status: payload['user.status'],
      user_name: payload['user.name'],
      phone: '',
      birth_date: 0,
      gender: '',
      address: '',
      password: '',
      start_date: null,
      final_date: null,
      is_verified: payload['user.is_verified'] === true
    };

    console.log('Usuario construido:', user);

    return {
      access_token: rawData.access_token,
      user: user,
      status: 200,
      message: 'Login exitoso'
    };
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    throw error;
  }
};

export const verifyEmail = async (data: VerifyEmailDAO) => {
  try {
    console.log('Intentando verificar email con URL:', `${API}/verify_email`);
    const response = await fetch(`${API}/verify_email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error en verificación de email:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error en la verificación de email');
    }

    const responseData = await response.json();
    return {
      status: 200,
      message: responseData.message || 'Email verificado exitosamente',
      data: responseData.data
    };
  } catch (error) {
    console.error('Error en verificación de email:', error);
    throw error;
  }
}

export const resendVerificationCode = async (data: ResendVerificationDAO) => {
  try {
    console.log('Intentando reenviar código de verificación con URL:', `${API}/resend-verification`);
    const response = await fetch(`${API}/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data.email)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al reenviar código de verificación:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error al reenviar código de verificación');
    }

    const responseData = await response.json();
    return {
      status: 200,
      message: responseData.message || 'Código de verificación reenviado exitosamente',
      data: responseData.data
    };
  } catch (error) {
    console.error('Error al reenviar código de verificación:', error);
    throw error;
  }
}

export const forgotPassword = async (email: string) => {
  try {
    console.log('Intentando solicitar recuperación de contraseña para:', email);
    const response = await fetch(`${API}/forgot_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(email)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error en la respuesta:', errorData);
      throw new Error(errorData.message || 'Error al solicitar recuperación de contraseña');
    }

    const data = await response.json();
    console.log('Respuesta exitosa:', data);
    return data;
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    throw error;
  }
}

export const resetPassword = async (data: ResetPasswordDAO) => {
  try {
    console.log('Intentando restablecer contraseña con URL:', `${API}/reset_password`);
    const response = await fetch(`${API}/reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error al restablecer contraseña:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData.message || 'Error al restablecer contraseña');
    }

    const responseData = await response.json();
    return {
      status: 200,
      message: responseData.message || 'Contraseña restablecida exitosamente',
      data: responseData.data
    };
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    throw error;
  }
} 