import axios from 'axios';
import { HttpAdapter } from './http.adapter.interface';

export class Http implements HttpAdapter {
  async post<T>(props: {
    url: string;
    headers?: any;
    body?: unknown;
  }): Promise<{ statusCode: number; data: T }> {
    const { url, headers, body } = props;

    try {
      const response = await axios.post<T>(url, body, { headers });

      return {
        statusCode: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          statusCode: error.response?.status || 500,
          data: error.response?.data || ({} as T),
        };
      }

      return {
        statusCode: 500,
        data: {} as T,
      };
    }
  }
}
