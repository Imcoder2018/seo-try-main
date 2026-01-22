"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ExternalLink,
  Edit,
  Image as ImageIcon,
  FileText,
  MapPin,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Globe,
  TrendingUp,
} from "lucide-react";

interface WordPressPublish {
  id: string;
  title: string;
  wordpressPostId: number;
  permalink: string;
  wordpressEditUrl: string | null;
  status: string;
  location: string | null;
  contentType: string | null;
  imageUrl: string | null;
  imageDownloaded: boolean;
  publishedAt: string;
  wordCount: number | null;
  excerpt: string | null;
  primaryKeywords: string[] | null;
  publishError: string | null;
}

interface WordPressPublishHistoryProps {
  className?: string;
}

export default function WordPressPublishHistory({ className = "" }: WordPressPublishHistoryProps) {
  const [publishes, setPublishes] = useState<WordPressPublish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const fetchPublishHistory = async (reset = false) => {
    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;
      
      const response = await fetch(
        `/api/wordpress/history?limit=10&offset=${currentOffset}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch publishing history");
      }
      
      const data = await response.json();
      
      if (reset) {
        setPublishes(data.publishes);
      } else {
        setPublishes(prev => [...prev, ...data.publishes]);
      }
      
      setHasMore(data.hasMore);
      setTotal(data.total);
      setOffset(currentOffset + data.publishes.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishHistory(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "publish":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "pending":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "publish":
        return <CheckCircle className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadMore = () => {
    fetchPublishHistory(false);
  };

  if (loading && publishes.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-slate-600 dark:text-slate-400">Loading publishing history...</span>
      </div>
    );
  }

  if (error && publishes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          Failed to load history
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => fetchPublishHistory(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (publishes.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
          No publishing history yet
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Start publishing content to see your WordPress history here.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            WordPress Publishing History
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {total} total publishes • {publishes.filter(p => p.status === "publish").length} published
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <TrendingUp className="w-4 h-4" />
          <span>{Math.round((publishes.filter(p => p.status === "publish").length / total) * 100)}% success rate</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total Published</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{total}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Published</p>
              <p className="text-2xl font-bold text-green-600">{publishes.filter(p => p.status === "publish").length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Drafts</p>
              <p className="text-2xl font-bold text-yellow-600">{publishes.filter(p => p.status === "draft").length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">With Images</p>
              <p className="text-2xl font-bold text-purple-600">{publishes.filter(p => p.imageDownloaded).length}</p>
            </div>
            <ImageIcon className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Publish List */}
      <div className="space-y-4">
        {publishes.map((publish) => (
          <div
            key={publish.id}
            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                      {publish.title}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(publish.status)}`}>
                      {getStatusIcon(publish.status)}
                      {publish.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(publish.publishedAt)}
                    </span>
                    {publish.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {publish.location}
                      </span>
                    )}
                    {publish.contentType && (
                      <span className="flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {publish.contentType}
                      </span>
                    )}
                    {publish.wordCount && (
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {publish.wordCount.toLocaleString()} words
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-2 ml-4">
                  {publish.permalink && (
                    <a
                      href={publish.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                  )}
                  {publish.wordpressEditUrl && (
                    <a
                      href={publish.wordpressEditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </a>
                  )}
                </div>
              </div>

              {/* Content Preview */}
              {publish.excerpt && (
                <div className="mb-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">
                    {publish.excerpt}
                  </p>
                </div>
              )}

              {/* Image and Keywords */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {publish.imageUrl && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <ImageIcon className="w-4 h-4" />
                      <span className={publish.imageDownloaded ? "text-green-600" : "text-yellow-600"}>
                        {publish.imageDownloaded ? "Image downloaded" : "Image pending"}
                      </span>
                    </div>
                  )}
                  
                  {publish.primaryKeywords && publish.primaryKeywords.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <div className="flex flex-wrap gap-1">
                        {publish.primaryKeywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 rounded"
                          >
                            {keyword}
                          </span>
                        ))}
                        {publish.primaryKeywords.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-xs text-slate-500 dark:text-slate-400 rounded">
                            +{publish.primaryKeywords.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-sm text-slate-500 dark:text-slate-400">
                  WordPress Post ID: {publish.wordpressPostId}
                </div>
              </div>

              {/* Error Display */}
              {publish.publishError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Publishing failed: {publish.publishError}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>Load More</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
