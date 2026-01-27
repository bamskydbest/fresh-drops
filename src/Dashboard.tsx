import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { CashRequest } from './types/CashRequest';
import { API_URL } from './config/api';
import { FiSearch, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';




const Dashboard = () => {
  const [requests, setRequests] = useState<CashRequest[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
const [showExport, setShowExport] = useState(false);

const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 10;
const exportRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchData = async () => {
    try {
      const statusQuery = filter === 'all' ? '' : `?status=${filter}`;
      const [requestsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/requests${statusQuery}`),
        fetch(`${API_URL}/requests/stats`),
      ]);

      const requestsData = await requestsRes.json();
      const statsData = await statsRes.json();

      if (requestsData.success) setRequests(requestsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'approved' | 'rejected') => {
    const comment = action === 'rejected' 
      ? prompt('Please provide a reason for rejection:')
      : prompt('Add a comment (optional):');

    if (action === 'rejected' && !comment) {
      alert('Rejection reason is required');
      return;
    }

    try {
      const token = localStorage.getItem('approver_token');
      const response = await fetch(`${API_URL}/requests/${requestId}/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ comment }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Request ${action} successfully!`);
        fetchData(); // Refresh data
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      alert('Failed to process request');
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };
  const filteredRequests = requests.filter((req) => {
  const matchesStatus =
    filter === 'all' || req.status === filter;

  const search = searchTerm.toLowerCase();

  const matchesSearch =
    req.requestId?.toLowerCase().includes(search) ||
    req.requestingOfficer?.toLowerCase().includes(search) ||
    String(req.amountRequested).includes(search) ||
    new Date(req.dateOfRequest).toLocaleDateString().includes(search);

  return matchesStatus && matchesSearch;
});

// Pagination logic
const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

const paginatedRequests = filteredRequests.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages || 1); // fallback to 1 if no data
  }
}, [currentPage, totalPages]);

  const handleExport = (type: 'pdf' | 'excel') => {
  setShowExport(false);

  if (filteredRequests.length === 0) {
  alert('No data to export');
  return;
}


  const data = filteredRequests.map((r) => ({
    ID: r.requestId,
    Officer: r.requestingOfficer,
    Amount: r.amountRequested,
    Status: r.status,
    Date: new Date(r.dateOfRequest).toLocaleDateString(),
  }));

  if (type === 'excel') {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requests');
    XLSX.writeFile(wb, 'requests.xlsx');
  }

  if (type === 'pdf') {
    const doc = new jsPDF();
    doc.text('Cash Requests Report', 14, 10);
    (doc as any).autoTable({
      head: [Object.keys(data[0])],
      body: data.map(Object.values),
    });
    doc.save('requests.pdf');
  }
};
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
      setShowExport(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900">
  Fresh Drops Water Factory
</h1>

            <p className="text-gray-600">Cash Request Dashboard</p>
          </div>
          <Link
  to="/request"
  className="bg-blue-600 text-white px-3 sm:px-5 py-2 rounded-lg 
             text-sm sm:text-base whitespace-nowrap 
             hover:bg-blue-700"
>
  + New Request
</Link>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Requests</p>
            <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </div>
        </div>

{/* Filters + Search + Export */}
{/* Filters + Search + Export */}
<div className="bg-white rounded-lg shadow p-4 mb-6">
  <div className="flex flex-wrap items-center justify-between gap-3">

    {/* Filters */}
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setFilter('all')}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full
          ${filter === 'all'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        All
      </button>
      <button
        onClick={() => setFilter('pending')}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full
          ${filter === 'pending'
            ? 'bg-yellow-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        Pending
      </button>
      <button
        onClick={() => setFilter('approved')}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full
          ${filter === 'approved'
            ? 'bg-green-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        Approved
      </button>
      <button
        onClick={() => setFilter('rejected')}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-full
          ${filter === 'rejected'
            ? 'bg-red-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
      >
        Rejected
      </button>
    </div>

    {/* Search */}
    <div className="relative flex-1 min-w-[180px] max-w-sm">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search by ID, officer, amount or date"
        className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

{/* Export */}
<div className="relative" ref={exportRef}>
  <button
    onClick={() => setShowExport(!showExport)}
    className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg bg-white hover:bg-gray-50"
  >
    Export
    {showExport ? <FiChevronUp /> : <FiChevronDown />}
  </button>

  {showExport && (
    <div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow z-10">
      <button
        onClick={() => handleExport('pdf')}
        className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
      >
        PDF
      </button>
      <button
        onClick={() => handleExport('excel')}
        className="w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
      >
        Excel
      </button>
    </div>
  )}
</div>


  </div>

  {/* Search indicator */}
  {searchTerm && (
    <p className="mt-2 text-xs text-gray-500">
      Searching for: <span className="font-medium">{searchTerm}</span>
    </p>
  )}
</div>





        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No requests found</div>
          ) : (
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">

              <table className="w-full min-w-[900px]">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requesting Officer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">
                        <Link to={`/request/${req.requestId}`}>{req.requestId}</Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{req.requestingOfficer}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.purposeOfExpense.substring(0, 50)}...</td>
                      <td className="px-6 py-4 text-sm text-gray-900">GH₵ {req.amountRequested.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                          {req.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(req.dateOfRequest).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAction(req.requestId, 'approved')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(req.requestId, 'rejected')}
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-6  mb-4">
    <button
      disabled={currentPage === 1 || totalPages === 0}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="px-3 py-1 text-sm border rounded disabled:opacity-40"
    >
      Prev
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 text-sm rounded ${
          currentPage === i + 1
            ? 'bg-blue-600 text-white'
            : 'border hover:bg-gray-100'
        }`}
      >
        {i + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages || totalPages === 0}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="px-3 py-1 text-sm border rounded disabled:opacity-40"
    >
      Next
    </button>
  </div>
)}

            </div>


          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;