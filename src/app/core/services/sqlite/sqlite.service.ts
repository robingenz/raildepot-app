import { Injectable } from '@angular/core';
import { capSQLiteUpgradeOptions } from '@capacitor-community/sqlite';
import { CapacitorSqliteService } from '../capacitor';
import { ErrorParserService } from '../error';

export interface RunOptions {
  database: string;
  statement: string;
  values?: any[];
}

export interface QueryOptions {
  database: string;
  statement: string;
  values?: any[];
}
export interface QueryResult {
  values: any[];
}

@Injectable({
  providedIn: 'root',
})
export class SqliteService {
  private readonly openDatabases = new Set<string>();

  constructor(
    private readonly capacitorSqliteService: CapacitorSqliteService,
    private readonly errorParserService: ErrorParserService,
  ) {}

  public async addUpgradeStatement(
    options: capSQLiteUpgradeOptions,
  ): Promise<void> {
    await this.capacitorSqliteService.addUpgradeStatement(options);
  }

  public async query(options: QueryOptions): Promise<QueryResult> {
    await this.waitForDatabase(options.database);
    const result = await this.capacitorSqliteService.query({
      database: options.database,
      statement: options.statement,
      values: options.values || [],
    });
    return { values: result.values || [] };
  }

  public async run(options: RunOptions): Promise<void> {
    await this.waitForDatabase(options.database);
    await this.capacitorSqliteService.run({
      database: options.database,
      statement: options.statement,
      values: options.values || [],
    });
  }

  private async connectToDatabase(database: string): Promise<void> {
    try {
      await this.capacitorSqliteService.createConnection({
        database,
        encrypted: false,
        readonly: false,
      });
    } catch (error) {
      const message = this.errorParserService.getMessageFromUnknownError(error);
      if (message.includes('already exist')) {
        return;
      }
      throw new Error(message);
    }
  }

  private async openDatabase(database: string): Promise<void> {
    await this.capacitorSqliteService.open({
      database,
      readonly: false,
    });
    this.openDatabases.add(database);
  }

  private async waitForDatabase(database: string): Promise<void> {
    const isOpen = this.openDatabases.has(database);
    if (isOpen) {
      return;
    }

    await this.capacitorSqliteService.checkConnectionsConsistency({
      dbNames: [database],
      openModes: ['RW'],
    });

    await this.connectToDatabase(database);
    return this.openDatabase(database);
  }
}
