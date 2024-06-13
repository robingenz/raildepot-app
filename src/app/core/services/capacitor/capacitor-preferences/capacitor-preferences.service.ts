import { Injectable } from '@angular/core';
import {
  GetOptions,
  GetResult,
  Preferences,
  RemoveOptions,
  SetOptions,
} from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class CapacitorPreferencesService {
  constructor() {}

  public get(options: GetOptions): Promise<GetResult> {
    return Preferences.get(options);
  }

  public remove(options: RemoveOptions): Promise<void> {
    return Preferences.remove(options);
  }

  public set(options: SetOptions): Promise<void> {
    return Preferences.set(options);
  }
}
