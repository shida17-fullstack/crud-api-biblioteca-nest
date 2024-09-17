import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class LibroTabla1725809216389 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'libro',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'titulo', type: 'varchar' },
                { name: 'autor', type: 'varchar' },
                { name: 'nacionalidadAutor', type: 'varchar' },
                { name: 'tematica', type: 'varchar' },
                { name: 'anioPublicacion', type: 'int' },
                { name: 'extracto', type: 'varchar', length: '1000' },
                { name: 'editorial', type: 'varchar' },
                { name: 'disponible', type: 'boolean', default: true },
                { name: 'isDeleted', type: 'boolean', default: false },
            ],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('libro');
    }
}