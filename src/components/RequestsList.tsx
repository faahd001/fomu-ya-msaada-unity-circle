import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Request {
  id: number;
  jina_kamili: string;
  aina_tatizo: string;
  maelezo: string;
  kiasi: number | null;
  tarehe_tukio: string | null;
  ushahidi: string | null;
  mawasiliano: string | null;
  created_at: string;
}

export default function RequestsList() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/requests');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError('Kuna tatizo kwenye kupata orodha ya maombi.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Rudi nyuma"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Orodha ya Maombi ya Msaada</h2>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Inapakia...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded">Hakuna maombi yoyote yaliyotumwa bado.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jina</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tatizo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kiasi (Tsh)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarehe ya Tukio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mawasiliano</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarehe ya Ombi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{req.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{req.jina_kamili}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.aina_tatizo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.kiasi ? req.kiasi.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.tarehe_tukio ? new Date(req.tarehe_tukio).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.mawasiliano || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(req.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
