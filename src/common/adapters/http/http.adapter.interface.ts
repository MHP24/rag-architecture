export interface HttpAdapter {
  post<T>(props: {
    url: string;
    headers?: any;
    body?: unknown;
  }): Promise<{ statusCode: number; data: T }>;
}
