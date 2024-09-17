import { MigrationInterface, QueryRunner, Table} from "typeorm";

export class UsuarioTabla1725809190680 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Crear tabla Usuario
        await queryRunner.createTable(new Table({
            name: 'usuario',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'nombre', type: 'varchar' },
                { name: 'nombreUsuario', type: 'varchar', isNullable: true },
                { name: 'email', type: 'varchar', isUnique: true },
                { name: 'password', type: 'varchar' },
                { name: 'edad', type: 'int' },
                { name: 'carreraOProfesion', type: 'varchar' },
                { name: 'direccion', type: 'json' },
                { name: 'isDeleted', type: 'boolean', default: false },
                { name: 'rol', type: 'enum', enum: ['BIBLIOTECARIO', 'DIRECTOR', 'AUXILIAR', 'USUARIO'], default: 'USUARIO' },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('usuario');
    }
}