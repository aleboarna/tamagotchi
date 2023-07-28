import { config, DynamoDB } from 'aws-sdk';
import { IEntry } from '../interfaces';
export interface IStorage {
  addEntry(payload: IEntry): Promise<void>;
  getEntry(userName: string): Promise<IEntry | undefined>;
}
export class StorageService {
  private storage: IStorage;
  constructor() {
    this.storage = new DynamoDbStorage();
  }
  async addEntry(payload: IEntry): Promise<void> {
    return await this.storage.addEntry(payload);
  }
  async getEntry(userName: string): Promise<IEntry | undefined> {
    return await this.storage.getEntry(userName);
  }
}
export class DynamoDbStorage implements IStorage {
  private connection;
  private tableName = `empowher-users-` + process.env.ENV || 'prod';

  constructor() {
    config.update({ region: process.env.AWS_REGION || 'eu-central-1' });
    this.connection = new DynamoDB();
  }
  addEntry(payload: IEntry): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.connection.putItem(
        {
          TableName: this.tableName,
          Item: {
            userName: { S: payload.userName },
            retryCount: { N: `${payload.retryCount}` },
            recordLifeCycles: { N: `${payload.recordLifeCycles}` },
          },
        },
        (err: Error, data: any) => {
          if (err) {
            console.log(err);
            return reject(Promise.reject(err));
          } else {
            console.log('Entry added', data);
            return resolve();
          }
        }
      );
    });
  }
  getEntry(userName: string): Promise<IEntry | undefined> {
    return new Promise<IEntry | undefined>((resolve, reject) => {
      try {
        this.connection.getItem(
          {
            TableName: this.tableName,
            Key: { userName: { S: userName } },
          },
          function (err: Error, data: any) {
            if (err) {
              console.log('Error', err, userName);
            } else {
              if (!data.Item) {
                return resolve(undefined);
              }
              return resolve({
                userName: data.Item.userName.S,
                retryCount: data.Item.retryCount.N,
                recordLifeCycles: data.Item.recordLifeCycles.N,
              });
            }
          }
        );
      } catch (e) {
        console.log(e);
        return reject(Promise.reject(e));
      }
    });
  }
}
