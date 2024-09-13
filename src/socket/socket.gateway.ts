import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { AuthService } from 'src/usuarios/auth/auth.service';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(
    private readonly socketService: SocketService,
    private readonly auth: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  clients: { [key: string]: { socket: Socket } } = {};

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      try {
        //! Verificamos el token, para obtener la información del usuario
        const payload = await this.auth.verifyJwt(
          socket.handshake.headers.authorization,
        );

        const socketUsuario = this.socketService.getSocket(
          +socket.handshake.headers['usuario'],
        );

        if (socketUsuario) {
          socketUsuario.socket.emit(
            `El usuario: ${payload.nombre} estableció una conexión`,
          );
        }

        console.log(payload);

        console.log(`Usuario conectado con id: ${socket.id}`);

        // /**
        //  * @description
        //  * Almacenamos el socket del usuario, identificado por el id unico generado
        //  */
        // this.clients[socket.id] = { socket: socket };

        //! Emitimos el mensaje de bienvenida
        this.server.emit(
          'welcome-message',
          `Bienvenidos a nuestro servidor, usuario ${socket.id}`,
        );

        //! Mandamos la información del usuario al servicio
        this.socketService.onConnection(socket, payload);

        // console.log(this.clients);

        socket.on('disconnect', () => {
          console.log(`Usuario desconectado con id: ${socket.id}`);
          //! Una vez desconectado, se elimina el socket del usuario de la lista
          this.socketService.onDisconnect(socket);
          // delete this.clients[socket.id];
          // console.log(this.clients);
        });
      } catch (error) {
        //! En caso de error, se desconecta el socket
        socket.disconnect();
        //! Lanzamos una excepción
        throw new UnauthorizedException('Información incorrecta');
      }
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
