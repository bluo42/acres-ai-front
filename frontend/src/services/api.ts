import axios from 'axios';
import { PropertySummary, UnderwritingInput, UnderwritingResult } from '../types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyApi = {
  getProperties: async (): Promise<PropertySummary[]> => {
    const response = await api.get('/properties');
    return response.data;
  },

  calculateUnderwriting: async (input: UnderwritingInput): Promise<UnderwritingResult> => {
    const response = await api.post('/underwriting', input);
    return response.data;
  },
};