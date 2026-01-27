import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from './config/api';

const ApproverLogin = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    if (!phone) return alert('Enter phone number');

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert('✅ OTP sent to WhatsApp');
      setStep('otp');
    } catch (err: any) {
      alert(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert('Enter OTP');

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem('approver_token', data.token);

      alert('✅ Login successful');
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Approver Login
        </h2>

        {step === 'phone' && (
          <>
            <label className="block mb-2 text-sm font-semibold">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="0XXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />

            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              {loading ? 'Sending OTP...' : 'Request OTP'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <label className="block mb-2 text-sm font-semibold">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
            />

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ApproverLogin;
