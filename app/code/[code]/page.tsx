'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Link as LinkType } from '@/lib/types';
import { formatDate, copyToClipboard } from '@/lib/utils';

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [link, setLink] = useState<LinkType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/links/${code}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError('Link not found');
        } else {
          setError('Failed to fetch link stats');
        }
        return;
      }

      const data = await response.json();
      setLink(data);
    } catch (err) {
      setError('Failed to fetch link stats');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Failed to delete link');
      }
    } catch (err) {
      alert('Failed to delete link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Link not found'}
          </h1>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${link.code}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Link Statistics
          </h1>

          <div className="space-y-6">
            {/* Short Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Code
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-lg font-mono">
                  {link.code}
                </code>
              </div>
            </div>

            {/* Short URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => handleCopy(shortUrl)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Target URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target URL
              </label>
              <a
                href={link.target_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-blue-600 hover:text-blue-700 break-all"
              >
                {link.target_url}
              </a>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Total Clicks
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {link.total_clicks}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Created At
                </p>
                <p className="text-sm font-semibold text-green-700">
                  {formatDate(link.created_at)}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Last Clicked
                </p>
                <p className="text-sm font-semibold text-purple-700">
                  {formatDate(link.last_clicked_at)}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
