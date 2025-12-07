'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { issuesApi } from '@/lib/api';
import { X } from 'lucide-react';

const issueSchema = z.object({
  error: z.string().min(1, 'Error is required').max(500, 'Error must be 500 characters or less'),
  description: z.string().min(1, 'Description is required'),
  screenshots: z.array(z.string()).optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
});

type IssueFormData = z.infer<typeof issueSchema>;

interface IssueFormProps {
  onSuccess: () => void;
}

export default function IssueForm({ onSuccess }: IssueFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screenshotInput, setScreenshotInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      error: '',
      description: '',
      screenshots: [],
      tags: [],
    },
  });

  const screenshots = watch('screenshots') || [];
  const tags = watch('tags') || [];

  const addScreenshot = () => {
    if (screenshotInput.trim()) {
      setValue('screenshots', [...screenshots, screenshotInput.trim()]);
      setScreenshotInput('');
    }
  };

  const removeScreenshot = (index: number) => {
    setValue('screenshots', screenshots.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue('tags', [...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setValue('tags', tags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: IssueFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await issuesApi.create(data);
      reset();
      onSuccess();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create issue. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="error" className="block text-sm font-medium text-gray-700 mb-1">
          Error *
        </label>
        <input
          id="error"
          {...register('error')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., TypeError: Cannot read property 'map' of undefined"
        />
        {errors.error && (
          <p className="mt-1 text-sm text-red-600">{errors.error.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe the issue, what caused it, and how you fixed it..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="screenshots" className="block text-sm font-medium text-gray-700 mb-1">
          Screenshots (URLs)
        </label>
        <div className="flex gap-2">
          <input
            id="screenshots"
            type="url"
            value={screenshotInput}
            onChange={(e) => setScreenshotInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addScreenshot())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/screenshot.png"
          />
          <button
            type="button"
            onClick={addScreenshot}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Add
          </button>
        </div>
        {screenshots.length > 0 && (
          <div className="mt-2 space-y-2">
            {screenshots.map((url, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                <span className="flex-1 text-sm truncate">{url}</span>
                <button
                  type="button"
                  onClick={() => removeScreenshot(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags *
        </label>
        <div className="flex gap-2">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., React, TypeScript, API"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Add
          </button>
        </div>
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>
        )}
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:text-blue-900"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Issue'}
      </button>
    </form>
  );
}
