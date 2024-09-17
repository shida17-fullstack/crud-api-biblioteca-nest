import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class PrestamoTabla1725809236357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'prestamo',
            columns: [
                { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
                { name: 'fechaPrestamo', type: 'date' },
                { name: 'fechaDevolucion', type: 'date' },
                { name: 'usuarioId', type: 'int' },
                { name: 'libroId', type: 'int' }, // Clave foránea para la relación con la tabla libro
            ],
        }));

        // Clave foránea hacia la tabla 'usuario'
        await queryRunner.createForeignKey('prestamo', new TableForeignKey({
            columnNames: ['usuarioId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuario',
            onDelete: 'CASCADE',
        }));

        // Clave foránea hacia la tabla 'libro'
        await queryRunner.createForeignKey('prestamo', new TableForeignKey({
            columnNames: ['libroId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'libro',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar las claves foráneas primero
        await queryRunner.dropForeignKey('prestamo', 'usuarioId');
        await queryRunner.dropForeignKey('prestamo', 'libroId');
        // Luego eliminar la tabla
        await queryRunner.dropTable('prestamo');
    }
}