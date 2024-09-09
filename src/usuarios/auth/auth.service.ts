import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioDto } from '../usuarios.dto';

@Injectable()
export class AuthService {
  /**
   * @param password new user password
   * @returns hashed password
   */

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * @param password input password
   * @param hashedPassword hashed user password
   * @returns boolean
   */
  async validateUserPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  constructor(private jwtService: JwtService) {}

  /**
   * @param payload
   * @returns access token
   */
  async verifyJwt(jwt: string): Promise<any> {
    return await this.jwtService.verifyAsync(jwt);
  }

  /**
   * @param Usuario
   * @returns token generado
   */

  async generateJwt(user: UsuarioDto): Promise<string> {
    /**
     * @description
     * Creamos el payload con la información del usuario
     */

    const payload = {
      sub: user.id,
      email: user.email,
      name: user.nombre,
    };
    //* Retornamos el token
    return this.jwtService.signAsync(payload);
  }
}
