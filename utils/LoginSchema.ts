import { z } from "zod";


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("El formato del correo no es válido"),
  
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});


export type LoginData = z.infer<typeof loginSchema>;


