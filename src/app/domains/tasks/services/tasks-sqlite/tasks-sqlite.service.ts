import { Injectable } from '@angular/core';
import { PlatformService, SqliteService } from '@app/core';
import { Task } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TasksSqliteService {
  private readonly database = 'tasks';
  private readonly table = 'tasks';

  constructor(
    private readonly sqliteService: SqliteService,
    private readonly platformService: PlatformService,
  ) {
    void this.setUpgradeStatements();
  }

  public async deleteTask(id: Task['id']): Promise<void> {
    await this.sqliteService.run({
      database: this.database,
      statement: `DELETE FROM ${this.table} WHERE id = ?`,
      values: [id],
    });
  }

  public async insertTask(options: Task): Promise<void> {
    await this.sqliteService.run({
      database: this.database,
      statement: `INSERT INTO ${this.table} (id, title, description, dueDate, createdAt, updateAt) VALUES (?, ?, ?, ?, ?, ?)`,
      values: [
        options.id,
        options.title,
        options.description,
        options.dueDate,
        options.createdAt,
        options.updatedAt,
      ],
    });
  }

  public async selectTasks(): Promise<Task[]> {
    const result = await this.sqliteService.query({
      database: this.database,
      statement: `SELECT * FROM ${this.table}`,
    });
    return result.values as Task[];
  }

  public async selectTaskById(id: Task['id']): Promise<Task | null> {
    const result = await this.sqliteService.query({
      database: this.database,
      statement: `SELECT * FROM ${this.table} WHERE id = ?`,
      values: [id],
    });
    if (result.values.length === 0) {
      return null;
    }
    return result.values[0] as Task;
  }

  public async updateTask(
    id: Task['id'],
    options: Omit<Task, 'id'>,
  ): Promise<void> {
    await this.sqliteService.run({
      database: this.database,
      statement: `UPDATE ${this.table} SET title = ?, description = ?, dueDate = ?, updateAt = ? WHERE id = ?`,
      values: [
        options.title,
        options.description,
        options.dueDate,
        options.updatedAt,
        id,
      ],
    });
  }

  private async setUpgradeStatements(): Promise<void> {
    const isNative = this.platformService.isNative();
    if (!isNative) {
      return;
    }
    await this.sqliteService.addUpgradeStatement({
      database: this.database,
      upgrade: [
        {
          toVersion: 1,
          statements: [
            `CREATE TABLE ${this.table} (id TEXT PRIMARY KEY, title TEXT, description TEXT, dueDate TEXT, createdAt TEXT, updateAt TEXT)`,
          ],
        },
      ],
    });
  }
}
