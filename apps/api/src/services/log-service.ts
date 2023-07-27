import { StorageService } from './storage-service';
import { IEntry } from '../interfaces';

export class LogService {
  private storageService: StorageService;
  constructor() {
    this.storageService = new StorageService();
  }

  async addEntry(payload: IEntry): Promise<void> {
    return await this.storageService.addEntry(payload);
  }

  async getEntry(userName: string): Promise<IEntry | undefined> {
    return await this.storageService.getEntry(userName);
  }
}
