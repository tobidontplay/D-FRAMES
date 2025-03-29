import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors rounded-full bg-purple-600/20 backdrop-blur-sm hover:bg-purple-600/30"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Admin Dashboard</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Manage your D-FRAMES application settings and data.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-900/30 border border-purple-500/20 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Orders Overview</h2>
            <p className="text-gray-300 mb-6">
              This is a placeholder for the admin dashboard. In a real application, you would see order statistics and management tools here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-800/30 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-medium mb-2">Total Orders</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-medium mb-2">Pending</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
              <div className="bg-purple-800/30 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-xl font-medium mb-2">Completed</h3>
                <p className="text-3xl font-bold">0</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-900/30 border border-purple-500/20 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            <p className="text-gray-300 mb-6">
              Configure your application settings here.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-800/30 rounded-lg border border-purple-500/30">
                <span className="font-medium">Maintenance Mode</span>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
                  Enable
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-800/30 rounded-lg border border-purple-500/30">
                <span className="font-medium">Clear Cache</span>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
