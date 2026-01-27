import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { CashRequest } from './types/CashRequest';
import { API_URL } from './config/api';
const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState<CashRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      const response = await fetch(`${API_URL}/requests/${id}`);
      const data = await response.json();
      if (data.success) setRequest(data.data);
    } catch (error) {
      console.error('Failed to fetch request');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  if (!request) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Request not found</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link to="/dashboard" className="text-blue-600 hover:underline mb-4 inline-block">← Back to Dashboard</Link>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Request Details</h1>
              <p className="text-gray-600">Request ID: {request.requestId}</p>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded-full border-2 ${getStatusColor(request.status)}`}>
              {request.status.toUpperCase()}
            </span>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600">Date of Request</p>
                <p className="text-gray-900">{new Date(request.dateOfRequest).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Payment Day</p>
                <p className="text-gray-900">{request.paymentDay}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-600">Requesting Officer</p>
                <p className="text-gray-900">{request.requestingOfficer}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Position</p>
                <p className="text-gray-900">{request.position}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Department</p>
              <p className="text-gray-900">{request.department}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Amount Requested</p>
              <p className="text-2xl font-bold text-blue-900">GH₵ {request.amountRequested.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Purpose of Expense</p>
              <p className="text-gray-900">{request.purposeOfExpense}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Operational Justification</p>
              <p className="text-gray-900">{request.operationalJustification}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Impact if Not Approved</p>
              <p className="text-gray-900">{request.impactIfNotApproved}</p>
            </div>

            {request.approvedBy && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-green-800 mb-2">✅ Approved By</p>
                <p className="text-gray-900">{request.approvedBy.approverName}</p>
                <p className="text-sm text-gray-600">{new Date(request.approvedBy.approvedAt).toLocaleString()}</p>
                {request.approvedBy.comment && (
                  <p className="text-sm text-gray-700 mt-2">Comment: {request.approvedBy.comment}</p>
                )}
              </div>
            )}

            {request.rejectedBy && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-800 mb-2">❌ Rejected By</p>
                <p className="text-gray-900">{request.rejectedBy.approverName}</p>
                <p className="text-sm text-gray-600">{new Date(request.rejectedBy.rejectedAt).toLocaleString()}</p>
                <p className="text-sm text-red-700 mt-2">Reason: {request.rejectedBy.reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RequestDetails;
