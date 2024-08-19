export interface JwtPayload {
  sub: number; // El ID del usuario (usuario.id) // El ID del usuario (o cualquier identificador único)
  nombreUsuario: string; // El nombre de usuario o cualquier otro dato adicional
}
