/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RequestForm from './components/RequestForm';
import RequestsList from './components/RequestsList';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<RequestForm />} />
          <Route path="/requests" element={<RequestsList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
