import axios, { AxiosError, isAxiosError } from 'axios';
import type {
  SimulationRequestPayload,
  SimulationResponse,
} from '../types/simulation';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface ErrorResponseBody {
  detail?: string;
}

export async function runSimulation(
  payload: SimulationRequestPayload,
): Promise<SimulationResponse> {
  try {
    const { data } = await apiClient.post<SimulationResponse>(
      '/simulate',
      payload,
    );
    return data;
  } catch (error) {
    let message = 'Simulation failed. Please try again.';

    if (isAxiosError<ErrorResponseBody>(error)) {
      const axiosError = error as AxiosError<ErrorResponseBody>;
      if (axiosError.response?.data?.detail) {
        message = axiosError.response.data.detail;
      } else if (axiosError.code === 'ECONNABORTED') {
        message = 'Request timed out. Please try again.';
      } else if (axiosError.message) {
        message = axiosError.message;
      }
    } else if (error instanceof Error && error.message) {
      message = error.message;
    }

    throw new Error(message);
  }
}

