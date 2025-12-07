import axios from 'axios';
import { Issue, CreateIssueDto, UpdateIssueDto, IssuesResponse } from '@/types/issue';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const issuesApi = {
  async getAll(params?: {
    search?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }): Promise<IssuesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      queryParams.append('search', params.search);
    }
    
    if (params?.tags && params.tags.length > 0) {
      params.tags.forEach(tag => queryParams.append('tags', tag));
    }
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const response = await api.get<IssuesResponse>(`/issues?${queryParams}`);
    return response.data;
  },

  async getOne(id: string): Promise<Issue> {
    const response = await api.get<Issue>(`/issues/${id}`);
    return response.data;
  },

  async create(data: CreateIssueDto): Promise<Issue> {
    const response = await api.post<Issue>('/issues', data);
    return response.data;
  },

  async update(id: string, data: UpdateIssueDto): Promise<Issue> {
    const response = await api.patch<Issue>(`/issues/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/issues/${id}`);
  },

  async getAllTags(): Promise<string[]> {
    const response = await api.get<string[]>('/issues/tags');
    return response.data;
  },
};

export default api;
