'use client';

import { useState, useEffect } from 'react';
import { Issue } from '@/types/issue';
import { issuesApi } from '@/lib/api';
import { Search, Tag, Calendar, ExternalLink } from 'lucide-react';

interface IssueListProps {
  refreshTrigger?: number;
}

export default function IssueList({ refreshTrigger = 0 }: IssueListProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [expandedIssueId, setExpandedIssueId] = useState<string | null>(null);
  const limit = 10;

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [search, selectedTags, page, refreshTrigger]);

  const fetchTags = async () => {
    try {
      const tags = await issuesApi.getAllTags();
      setAllTags(tags);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
    }
  };

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await issuesApi.getAll({
        search: search || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        page,
        limit,
      });

      setIssues(response.data);
      setTotal(response.total);
    } catch (err: any) {
      setError('Failed to fetch issues. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toggleExpand = (issueId: string) => {
    setExpandedIssueId(expandedIssueId === issueId ? null : issueId);
  };

  const totalPages = Math.ceil(total / limit);

  if (loading && issues.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading issues...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search issues by error or description..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Tag size={16} />
            Filter by tags:
          </h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Issues list */}
      {issues.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No issues found. {search || selectedTags.length > 0 ? 'Try adjusting your filters.' : 'Create your first issue!'}
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue) => {
            const isExpanded = expandedIssueId === issue.id;
            return (
              <div key={issue.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.error}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      {isExpanded ? (
                        <p className="whitespace-pre-wrap">{issue.description}</p>
                      ) : (
                        <p className="line-clamp-2">{issue.description}</p>
                      )}
                    </div>

                    {isExpanded && issue.screenshots && issue.screenshots.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Screenshots:</h4>
                        <div className="space-y-2">
                          {issue.screenshots.map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink size={14} />
                              Screenshot {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-2">
                      {issue.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(issue.id)}
                    className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isExpanded ? 'Show less' : 'Show more'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
