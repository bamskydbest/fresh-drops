import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from './config/api';
import type { CashRequest } from './types/CashRequest';
 



const ApprovalPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<CashRequest | null>(null);
  const [approver, setApprover] = useState<{ name: string; position: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_URL}/approve/verify/${token}`);
      const data = await response.json();
      
      if (data.success) {
        setRequest(data.data.request);
        setApprover(data.data.approver);
      } else {
        alert('Invalid or expired approval link');
      }
    } catch (error) {
      alert('Failed to verify approval link');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/approve/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('✅ Request approved successfully!');
        navigate('/dashboard');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to approve request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/reject/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('❌ Request rejected successfully!');
        navigate('/dashboard');
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to reject request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Verifying...</div>;
  if (!request || !approver) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Invalid approval link</div>;

  if (request.status !== 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Already Processed</h2>
          <p className="text-gray-600">This request has already been {request.status}.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-900">Fresh Drops Water Factory</h1>
            <p className="text-xl text-gray-600 mt-2">Cash Request Approval</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800">Reviewing as:</p>
            <p className="text-lg text-blue-900">{approver.name}</p>
            <p className="text-sm text-blue-600">{approver.position}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-600">Request ID</p>
                <p className="text-gray-900">{request.requestId}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Date</p>
                <p className="text-gray-900">{new Date(request.dateOfRequest).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Requesting Officer</p>
              <p className="text-gray-900">{request.requestingOfficer} - {request.position}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Department</p>
              <p className="text-gray-900">{request.department}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Amount Requested</p>
              <p className="text-3xl font-bold text-blue-900">GH₵ {request.amountRequested.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-600">Payment Day</p>
              <p className="text-gray-900">{request.paymentDay}</p>
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
          </div>

          {!action && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setAction('approve')}
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => setAction('reject')}
                className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                ❌ Reject
              </button>
            </div>
          )}

          {action === 'approve' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add any comments or notes..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
                >
                  {submitting ? 'Processing...' : 'Confirm Approval'}
                </button>
                <button
                  onClick={() => setAction(null)}
                  disabled={submitting}
                  className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {action === 'reject' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejection..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleReject}
                  disabled={submitting || !reason.trim()}
                  className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 transition"
                >
                  {submitting ? 'Processing...' : 'Confirm Rejection'}
                </button>
                <button
                  onClick={() => setAction(null)}
                  disabled={submitting}
                  className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ApprovalPage;
