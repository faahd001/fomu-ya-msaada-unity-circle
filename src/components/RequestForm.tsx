import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RequestForm() {
  const [formData, setFormData] = useState({
    jina_kamili: '',
    aina_tatizo: '',
    aina_tatizo_nyingine: '',
    maelezo: '',
    kiasi: '',
    tarehe_tukio: '',
    ushahidi: [] as string[],
    mawasiliano: '',
    terms: false,
  });
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'terms') {
        setFormData({ ...formData, terms: checked });
      } else if (name === 'ushahidi') {
        let newUshahidi = [...formData.ushahidi];
        if (checked) {
          newUshahidi.push(value);
        } else {
          newUshahidi = newUshahidi.filter((item) => item !== value);
        }
        setFormData({ ...formData, ushahidi: newUshahidi });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Inatuma...');

    const finalAinaTatizo = formData.aina_tatizo === 'Nyingine' ? formData.aina_tatizo_nyingine : formData.aina_tatizo;

    const payload = {
      jina_kamili: formData.jina_kamili,
      aina_tatizo: finalAinaTatizo,
      maelezo: formData.maelezo,
      kiasi: formData.kiasi ? parseFloat(formData.kiasi) : null,
      tarehe_tukio: formData.tarehe_tukio,
      ushahidi: formData.ushahidi.join(', '),
      mawasiliano: formData.mawasiliano,
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('Ombi limepokelewa kwa mafanikio!');
        setFormData({
          jina_kamili: '',
          aina_tatizo: '',
          aina_tatizo_nyingine: '',
          maelezo: '',
          kiasi: '',
          tarehe_tukio: '',
          ushahidi: [],
          mawasiliano: '',
          terms: false,
        });
      } else {
        setStatus('Kuna tatizo kwenye kutuma ombi.');
      }
    } catch (error) {
      console.error(error);
      setStatus('Kuna tatizo kwenye mtandao.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Fomu ya Kuomba Msaada – Unity Circle</h2>
        <button 
          onClick={() => navigate('/requests')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Orodha ya Maombi
        </button>
      </div>

      {status && (
        <div className={'p-4 mb-6 rounded ' + (status.includes('mafanikio') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700')}>
          {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">1. Jina kamili:</label>
          <input
            type="text"
            name="jina_kamili"
            required
            value={formData.jina_kamili}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">2. Aina ya Tatizo:</label>
          <div className="space-y-2">
            {['Ugonjwa', 'Msiba', 'Dharura ya kifedha', 'Nyingine'].map((aina) => (
              <div key={aina} className="flex items-center">
                <input
                  type="radio"
                  name="aina_tatizo"
                  value={aina}
                  required
                  checked={formData.aina_tatizo === aina}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label className="ml-2 text-sm text-gray-700">{aina}</label>
              </div>
            ))}
          </div>
          {formData.aina_tatizo === 'Nyingine' && (
            <input
              type="text"
              name="aina_tatizo_nyingine"
              placeholder="Andika hapa ikiwa Nyingine"
              value={formData.aina_tatizo_nyingine}
              onChange={handleChange}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">3. Maelezo ya Tatizo:</label>
          <textarea
            name="maelezo"
            required
            rows={4}
            value={formData.maelezo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">4. Kiasi kinachohitajika (Tsh):</label>
          <input
            type="number"
            name="kiasi"
            step="0.01"
            value={formData.kiasi}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">5. Tarehe ya Tukio:</label>
          <input
            type="date"
            name="tarehe_tukio"
            value={formData.tarehe_tukio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">6. Ushahidi (ikiwa upo):</label>
          <div className="space-y-2">
            {['Hospitali', 'Picha', 'Nyingine'].map((ushahidiItem) => (
              <div key={ushahidiItem} className="flex items-center">
                <input
                  type="checkbox"
                  name="ushahidi"
                  value={ushahidiItem}
                  checked={formData.ushahidi.includes(ushahidiItem)}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">{ushahidiItem}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">7. Mawasiliano:</label>
          <textarea
            name="mawasiliano"
            rows={3}
            value={formData.mawasiliano}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="terms"
            required
            checked={formData.terms}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="ml-2 text-sm text-gray-700">Ninatangaza kuwa taarifa hii ni ya kweli.</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors"
        >
          Tuma Ombi
        </button>
      </form>
    </div>
  );
}
