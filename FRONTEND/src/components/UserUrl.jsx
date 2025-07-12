import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUserUrls } from "../api/user.api";
import { useSelector } from "react-redux";

const UserUrl = () => {
  const {
    data: urls,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userUrls"],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state.auth);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredUrls =
    urls?.urls?.filter(
      (url) =>
        url.full_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.short_url.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600">Loading your URLs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 m-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg
              className="w-6 h-6 text-red-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-red-800 font-medium">Error loading URLs</h3>
              <p className="text-red-700 text-sm mt-1">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!urls?.urls || urls.urls.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No URLs yet
        </h3>
        <p className="text-gray-600 mb-6">
          Create your first shortened URL to get started!
        </p>
        <div className="flex justify-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
            💡 Tip: Use the form on the left to create your first short URL
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Usage Statistics for Free Users */}
      {user && user.plan === "free" && urls?.urls && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <div>
                <h3 className="text-blue-800 font-medium text-sm">
                  Free Plan Usage
                </h3>
                <p className="text-blue-700 text-xs mt-1">
                  {urls.urls.length} of 5 URLs created
                  {urls.urls.length >= 5 && (
                    <span className="ml-2 text-red-600 font-medium">
                      (Limit Reached)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-blue-600 text-xs">
              <div className="flex items-center">
                <div className="w-20 bg-blue-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${Math.min((urls.urls.length / 5) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <span className="text-blue-700 font-medium">
                  {Math.round((urls.urls.length / 5) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search URLs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="ml-4 text-sm text-gray-600">
            {filteredUrls.length} of {urls.urls.length} URLs
          </div>
        </div>
      </div>

      {/* URLs List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredUrls.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-gray-500">No URLs match your search</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUrls.reverse().map((url) => (
              <div
                key={url._id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Original URL */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Original URL
                      </label>
                      <p className="text-sm text-gray-900 break-all bg-gray-50 px-3 py-2 rounded-lg border">
                        {url.full_url}
                      </p>
                    </div>

                    {/* Short URL */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                        Shortened URL
                      </label>
                      <div className="flex items-center space-x-2">
                        <a
                          href={`http://localhost:3000/${url.short_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-mono text-sm bg-blue-50 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors duration-200 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                          localhost:3000/{url.short_url}
                        </a>
                        <button
                          onClick={() =>
                            handleCopy(
                              `http://localhost:3000/${url.short_url}`,
                              url._id,
                            )
                          }
                          className={`inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg shadow-sm transition-all duration-200 transform hover:scale-105 ${
                            copiedId === url._id
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {copiedId === url._id ? (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                          />
                        </svg>
                        <span className="text-gray-600">
                          <span className="font-semibold text-gray-900">
                            {url.clicks}
                          </span>
                          {url.click_limit ? (
                            <>
                              {" / "}
                              <span className="font-semibold text-gray-900">
                                {url.click_limit}
                              </span>
                              {" clicks"}
                              {url.clicks >= url.click_limit && (
                                <span className="ml-2 text-red-600 font-medium">
                                  (Limit Reached)
                                </span>
                              )}
                            </>
                          ) : (
                            " clicks"
                          )}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 text-gray-400 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-gray-600">
                          Created{" "}
                          {new Date(
                            url.createdAt || Date.now(),
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Click Badge */}
                  <div className="ml-4 flex-shrink-0">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        url.click_limit && url.clicks >= url.click_limit
                          ? "bg-red-100 text-red-800"
                          : url.click_limit &&
                              url.clicks > url.click_limit * 0.8
                            ? "bg-yellow-100 text-yellow-800"
                            : url.clicks > 10
                              ? "bg-green-100 text-green-800"
                              : url.clicks > 5
                                ? "bg-yellow-100 text-yellow-800"
                                : url.clicks > 0
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {url.clicks}
                      {url.click_limit ? ` / ${url.click_limit}` : ""}{" "}
                      {url.clicks === 1 ? "click" : "clicks"}
                      {url.click_limit && url.clicks >= url.click_limit && (
                        <span className="ml-1">🔒</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserUrl;
