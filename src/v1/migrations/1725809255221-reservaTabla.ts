import { MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ReservaTabla1725809255221 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'reserva',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'fechaReserva',
                    type: 'timestamp',
                },
                {
                    name: 'fechaNotificacion',
                    type: 'timestamp',
                    isNullable: true,
                },
                {
                    name: 'isDeleted',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'usuarioId',
                    type: 'int',
                },
                {
                    name: 'libroId',
                    type: 'int',
                },
                {
                    name: 'prestamoId',
                    type: 'int',
                    isNullable: true,
                },
            ],
        }));

        await queryRunner.createForeignKey('reserva', new TableForeignKey({
            columnNames: ['usuarioId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'usuario',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('reserva', new TableForeignKey({
            columnNames: ['libroId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'libro',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('reserva', new TableForeignKey({
            columnNames: ['prestamoId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'prestamo',
            onDelete: 'SET NULL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('reserva');
        const foreignKeys = table.foreignKeys.filter(fk => fk.columnNames.indexOf('usuarioId') !== -1 || 
                                                        fk.columnNames.indexOf('libroId') !== -1 ||
                                                        fk.columnNames.indexOf('prestamoId') !== -1);
        await queryRunner.dropForeignKeys('reserva', foreignKeys);
        await queryRunner.dropTable('reserva');
    }
}