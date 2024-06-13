import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  capAllConnectionsOptions,
  capConnectionOptions,
  capSQLiteChanges,
  capSQLiteOptions,
  capSQLiteQueryOptions,
  capSQLiteResult,
  capSQLiteRunOptions,
  capSQLiteUpgradeOptions,
  capSQLiteValues,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class CapacitorSqliteService {
  constructor() {}

  public addUpgradeStatement(options: capSQLiteUpgradeOptions): Promise<void> {
    return CapacitorSQLite.addUpgradeStatement(options);
  }

  public checkConnectionsConsistency(
    options: capAllConnectionsOptions,
  ): Promise<capSQLiteResult> {
    return CapacitorSQLite.checkConnectionsConsistency(options);
  }

  public createConnection(options: capConnectionOptions): Promise<void> {
    return CapacitorSQLite.createConnection(options);
  }

  public closeConnection(options: capSQLiteOptions): Promise<void> {
    return CapacitorSQLite.closeConnection(options);
  }

  public isDbOpen(options: capSQLiteOptions): Promise<capSQLiteResult> {
    return CapacitorSQLite.isDBOpen(options);
  }

  public open(options: capSQLiteOptions): Promise<void> {
    return CapacitorSQLite.open(options);
  }

  public async query(options: capSQLiteQueryOptions): Promise<capSQLiteValues> {
    const result = await CapacitorSQLite.query(options);
    if (!result.values) {
      return {};
    }
    let values = result.values;
    const isIos = Capacitor.getPlatform() === 'ios';
    if (isIos) {
      // On iOS, the first element of the array is an object with the column names
      values = values.slice(1);
    }
    return { values };
  }

  public run(options: capSQLiteRunOptions): Promise<capSQLiteChanges> {
    return CapacitorSQLite.run(options);
  }
}
