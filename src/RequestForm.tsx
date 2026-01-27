import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { API_URL } from './config/api';

const RequestForm = () => {
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  
  const initialFormData = {
    requestingOfficer: '',
    requesterPhone: '',
    position: '',
    department: '',
    purposeOfExpense: '',
    amountRequested: '',
    paymentDay: 'Wednesday' as 'Wednesday' | 'Friday',
    supportingDocuments: {
      invoice: null as File | null,
      quotation: null as File | null,
      bill: null as File | null,
      proforma: null as File | null,
      other: '',
    },
    operationalJustification: '',
    impactIfNotApproved: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    return () => {
      Object.values(formData.supportingDocuments).forEach(file => {
        if (file instanceof File && file.type.startsWith('image/')) {
          URL.revokeObjectURL(file.name);
        }
      });
    };
  }, [formData.supportingDocuments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formToSend = new FormData();

      // Append text fields
      formToSend.append('requestingOfficer', formData.requestingOfficer);
      formToSend.append('requesterPhone', formData.requesterPhone);
      formToSend.append('position', formData.position);
      formToSend.append('department', formData.department);
      formToSend.append('purposeOfExpense', formData.purposeOfExpense);
      formToSend.append('amountRequested', formData.amountRequested);
      formToSend.append('paymentDay', formData.paymentDay);
      formToSend.append('operationalJustification', formData.operationalJustification);
      formToSend.append('impactIfNotApproved', formData.impactIfNotApproved);

      // Append supporting documents
      Object.entries(formData.supportingDocuments).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'string' && key === 'other') {
            formToSend.append('supportingDocuments', value); // text
          } else {
            formToSend.append('supportingDocuments', value as File, key + '-' + (value as File).name); // file
          }
        }
      });

      const response = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        body: formToSend, 
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Request submitted successfully!\nRequest ID: ${data.data.requestId}\n\nApprovers have been notified via WhatsApp.`);

        
        setFormData(initialFormData);
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (key: 'invoice' | 'quotation' | 'bill' | 'proforma') => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*/*'; 
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          supportingDocuments: { ...formData.supportingDocuments, [key]: file },
        });
      }
    };
    fileInput.click();
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900">Fresh Drops Water Factory</h1>
            <p className="text-xl text-gray-600 mt-2">Cash Request Form</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date of Request */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Request
              </label>
              <input
                type="text"
                value={new Date().toLocaleDateString('en-GB')}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            {/* Requesting Officer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requesting Officer (Full Name) *
              </label>
              <input
                type="text"
                required
                value={formData.requestingOfficer}
                onChange={(e) => setFormData({ ...formData, requestingOfficer: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Requester Phone Number (WhatsApp) *
  </label>
  <input
    type="tel"
    required
    value={formData.requesterPhone || ''}
    onChange={(e) =>
      setFormData({ ...formData, requesterPhone: e.target.value })
    }
    placeholder="e.g., 024xxxxxxx"
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  />
</div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Position */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Position/Role *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department/Section *
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Purpose of Expense (be clear and specific) *
              </label>
              <textarea
                required
                rows={3}
                value={formData.purposeOfExpense}
                onChange={(e) => setFormData({ ...formData, purposeOfExpense: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount Requested (GH₵) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amountRequested}
                onChange={(e) => setFormData({ ...formData, amountRequested: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Payment Day */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Requested Payment Day *
              </label>
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Wednesday"
                    checked={formData.paymentDay === 'Wednesday'}
                    onChange={(e) => setFormData({ ...formData, paymentDay: e.target.value as 'Wednesday' | 'Friday' })}
                    className="mr-2"
                  />
                  <span>Wednesday</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="Friday"
                    checked={formData.paymentDay === 'Friday'}
                    onChange={(e) => setFormData({ ...formData, paymentDay: e.target.value as 'Wednesday' | 'Friday' })}
                    className="mr-2"
                  />
                  <span>Friday</span>
                </label>
              </div>
            </div>

            {/* Supporting Documents */}
           <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Supporting Document Attached
  </label>
  <div className="space-y-4">
    {(['invoice','quotation','bill','proforma'] as const).map((doc) => (
      <div key={doc}>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!formData.supportingDocuments[doc]}
            onChange={(e) => {
              if (e.target.checked) handleFileSelect(doc);
              else setFormData({
                ...formData,
                supportingDocuments: { ...formData.supportingDocuments, [doc]: null },
              });
            }}
          />
          <span>{doc.charAt(0).toUpperCase() + doc.slice(1)}</span>
        </label>

        {/* Preview */}
        {formData.supportingDocuments[doc] && (
          <div className="mt-2 ml-6">
            <p className="text-sm font-medium">{formData.supportingDocuments[doc]?.name}</p>
            {formData.supportingDocuments[doc]?.type.startsWith('image/') && (
              <img
                src={URL.createObjectURL(formData.supportingDocuments[doc] as File)}
                alt={`${doc} preview`}
                className="h-24 w-24 object-cover border rounded mt-1"
              />
            )}
          </div>
        )}
      </div>
    ))}

    {/* Other */}
    <div>
      <label className="block text-sm text-gray-600 mb-1">Other (specify):</label>
      <input
        type="text"
        placeholder="Specify other document"
        value={formData.supportingDocuments.other}
        onChange={(e) =>
          setFormData({
            ...formData,
            supportingDocuments: { ...formData.supportingDocuments, other: e.target.value },
          })
        }
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</div>


            {/* Operational Justification */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Operational Justification *
              </label>
              <textarea
                required
                rows={4}
                value={formData.operationalJustification}
                onChange={(e) => setFormData({ ...formData, operationalJustification: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Impact */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Impact if Not Approved *
              </label>
              <textarea
                required
                rows={4}
                value={formData.impactIfNotApproved}
                onChange={(e) => setFormData({ ...formData, impactIfNotApproved: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Important Notes:</p>
              <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                <li>Verbal requests are not acceptable</li>
                <li>Incomplete forms will not be processed</li>
                <li>Payments are processed on Wednesdays and Fridays only</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default RequestForm;