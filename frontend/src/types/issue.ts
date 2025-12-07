export interface Issue {
  id: string;
  error: string;
  description: string;
  screenshots: string[];
  tags: string[];
  contentHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIssueDto {
  error: string;
  description: string;
  screenshots?: string[];
  tags: string[];
}

export interface UpdateIssueDto {
  error?: string;
  description?: string;
  screenshots?: string[];
  tags?: string[];
}

export interface IssuesResponse {
  data: Issue[];
  total: number;
  page: number;
  limit: number;
}
