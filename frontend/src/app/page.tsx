'use client';

import { useState } from 'react';
import IssueForm from '@/components/IssueForm';
import IssueList from '@/components/IssueList';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Beans 🫘</h1>
          <p className="text-gray-600">
            Track technical issues and their solutions
          </p>
        </header>

        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            {showForm ? 'Cancel' : 'Add New Issue'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Submit New Issue</h2>
            <IssueForm onSuccess={handleSuccess} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Issues</h2>
          <IssueList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
