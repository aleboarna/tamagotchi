export type EntryGetResponsePayload = {
  readonly userName: string;
  readonly age: string;
  readonly health: string;
  readonly happiness: string;
  readonly retryCount: number;
  readonly maxLifeCycles: number;
};
export type EntryCreateRequestPayload = {
  readonly userName: string;
  readonly age: string;
  readonly health: string;
  readonly happiness: string;
  readonly retryCount: number;
  readonly maxLifeCycles: number;
};
