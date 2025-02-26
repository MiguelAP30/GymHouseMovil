import { z } from "zod";



export const registerSchema = z.object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
    email: z.string().min(1, "El correo es obligatorio").email("Correo inválido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    phone: z.string()
      .min(10, "El teléfono debe tener al menos 10 dígitos")
      .regex(/^\d+$/, "Solo se permiten números"),
    address: z.string().min(1, "La dirección es obligatoria"),
  });
  
  export type RegisterData = z.infer<typeof registerSchema>;