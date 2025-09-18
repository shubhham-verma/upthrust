"use client";

import React, { useState } from 'react';
import { Send, Bot, Cloud, Github, Newspaper, Loader2, History, Clock, MapPin } from 'lucide-react';

const WorkflowAutomation = () => {
  const [prompt, setPrompt] = useState('');
  const [action, setAction] = useState('weather');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const actionOptions = [
    { value: 'weather', label: 'Weather', icon: Cloud, color: 'text-blue-500' },
    { value: 'github', label: 'GitHub Trending', icon: Github, color: 'text-gray-800' },
    { value: 'news', label: 'News', icon: Newspaper, color: 'text-red-500' }
  ];

  const requiresLocation = action === 'weather' || action === 'news';

  const handleSubmit = async (e) => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const payload = {
        prompt: prompt.trim(),
        action
      };

      // Add location if required and provided
      if (requiresLocation && location.trim()) {
        payload.location = location.trim();
      }

      const response = await fetch(`/api/run_workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      fetchHistory();

    } catch (error) {
      console.error('Error:', error);
      setResult({
        error: true,
        message: `Failed to run workflow: ${error.message}.`
      });
    } finally {
      setLoading(false);
      setPrompt("");
      setAction("weather");
      setLocation("");
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/history`);
      if (response.ok) {
        const data = await response.json();
        const historyData = data.runs;
        // console.log(data);
        setHistory(historyData);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
    setShowHistory(true);
  };

  const ActionIcon = actionOptions.find(opt => opt.value === action)?.icon || Bot;
  const actionColor = actionOptions.find(opt => opt.value === action)?.color || 'text-gray-500';

  return (
    <div className="min-h-screen bg-blue-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-8 h-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">AI Workflow Automation</h1>
          </div>
          <p className="text-gray-600">Create automated workflows with AI agents and third-party APIs</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl  p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <Send className="w-5 h-5 mr-2 text-indigo-600" />
              Create Workflow
            </h2>

            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your prompt (e.g., 'Write a tweet about today's weather')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none h-24
                  text-gray-500"
                  required
                />
              </div>

              {/* Action Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <div className="relative">
                  <select
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-colors 
                    text-gray-500"
                  >
                    {actionOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ActionIcon className={`absolute right-3 top-3 w-5 h-5 ${actionColor} pointer-events-none`} />
                </div>
              </div>

              {/* Location Input (conditional) */}
              {requiresLocation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location {action === 'weather' ? '(optional)' : '(optional - defaults to global news)'}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={action === 'weather' ? 'e.g., Delhi, London, New York' : 'e.g., US, UK, India'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-500"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className="w-full  bg-indigo-600  text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Running Workflow...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Run Workflow
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Bot className="w-5 h-5 mr-2 text-indigo-600" />
                Results
              </h2>
              <button
                onClick={fetchHistory}
                className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center text-sm cursor-pointer"
              >
                <History className="w-4 h-4 mr-1" />
                View History
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                <span className="ml-3 text-gray-600">Processing your workflow...</span>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {result.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-600 text-sm mt-1">{result.message}</p>
                  </div>
                ) : (
                  <>
                    {/* AI Response */}
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                      <p className="text-indigo-800 font-medium text-sm mb-2">AI Agent Response</p>
                      <p className="text-indigo-900">{result.ai_response}</p>
                    </div>

                    {/* API Response */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-medium text-sm mb-2">
                        {action === 'weather' ? 'Weather Data' :
                          action === 'github' ? 'GitHub Trending' : 'Latest News'}
                      </p>
                      <p className="text-green-900">{result.api_response}</p>
                    </div>

                    {/* Final Result */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800 font-medium text-sm mb-2">Final Combined Result</p>
                      <p className="text-purple-900 font-medium">{result.final_result}</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-12 text-gray-500">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Run a workflow to see results here</p>
              </div>
            )}
          </div>
        </div>

        {/* History Modal/Section */}
        {showHistory && (
          <div className="mt-8 bg-white rounded-2xl shadow p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Workflow History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>

            {history.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No workflow history available</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                  <div key={item.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-gray-800 text-sm">{item.prompt}</p>
                      <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
                        {item.action}
                      </span>
                    </div>
                    {item.location && (
                      <p className="text-xs text-gray-600 mb-2">📍 {item.location}</p>
                    )}
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {item.final_result}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(item.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowAutomation;