export type EntryGetResponsePayload = {
  readonly userName: string;
  readonly retryCount: number;
  readonly recordLifeCycles: number;
};
export type EntryCreateRequestPayload = {
  readonly userName: string;
  readonly retryCount: number;
  readonly recordLifeCycles: number;
};
