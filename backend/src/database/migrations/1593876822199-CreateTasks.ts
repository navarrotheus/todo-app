import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTasks1593876822199 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tasks',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()'
          },
          {
            name: 'user_id',
            type: 'uuid'
          },
          {
            name: 'name',
            type: 'text',
            isUnique: true
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true
          },
          {
            name: 'done_at',
            type: 'timestamp with time zone',
            isNullable: true
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()'
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            isNullable: true
          }
        ],
        foreignKeys: [
          {
            name: 'TaskUser',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        ]
      })
    );
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tasks');
  }
}
