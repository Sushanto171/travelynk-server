export interface TErrorSource {
  path: string;
  message: string;
}

export interface TGenericErrorTypes {
  statusCode: number;
  message: string;
  errorSource?: TErrorSource[];
}
