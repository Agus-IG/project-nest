import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('usuarios')
export class Usuarios {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    nombre: string;

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ type: 'bool', default: true })
    isActive: boolean;

    @Column({ type: 'varchar', nullable: false, length: 225 })
    avatar: string;
}