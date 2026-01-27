import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">
          Fresh Drops Water Factory
        </h1>
        <p className="text-gray-600 mb-8">
          Cash Request & Approval System
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/request')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            🧾 Submit Cash Request
          </button>

          <button
            onClick={() => navigate('/approver-login')}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            🔐 Approver Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
