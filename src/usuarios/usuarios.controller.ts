import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuarioDto } from './usuarios.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PaginationQueryDto } from 'src/common/paginator/pagination.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post('auth/register')
  async register(@Body() usuario: UsuarioDto, @Res() response: Response) {
    const result = await this.service.register(usuario);
    response.status(HttpStatus.CREATED).json({
      ok: true,
      result,
      msg: 'Usuario creado',
    });
  }

  @Post('auth/login')
  async login(
    @Body() usuario: { email: string; pass: string },
    @Res() res: Response,
  ) {
    const token = await this.service.login(usuario.email, usuario.pass);
    res.status(HttpStatus.OK).json({ ok: true, token, msg: 'approved' });
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async updateUser(
    @Param('id') id: number,
    @Body() user: Partial<UsuarioDto>,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    const result = await this.service.updateUser(id, user, files);
    [
      {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
      },
    ];

    res.status(HttpStatus.OK).json({ ok: true, result });
  }

  @Get(':id')
  async getOne(@Param('id') id: number) {
    return await this.service.getOne(id);
  }

  @Get()
  async getAll(@Query() paginationQuery: PaginationQueryDto) {
    return await this.service.getAll(paginationQuery);
  }
}
