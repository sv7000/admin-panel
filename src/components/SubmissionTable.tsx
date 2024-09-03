import React, { useState, useEffect } from 'react';
import apiClient from '../services/api-client';

interface Submission {
  id: number;
  user_id: string;
  created_at: string;
  step1_data: string;
  step2_files: string;
  step3_options: string;
  submission_date: string;
  status: string;
}

const SubmissionTable: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await apiClient.get('/submissions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
  
        const loggedInUserId = parseInt(localStorage.getItem('user_id') || '', 10);
  
        // Filter submissions by user_id
        const userSubmissions = response.data.filter(
          (submission: Submission) => submission.user_id === loggedInUserId.toString()
        );
        
  
        setSubmissions(userSubmissions);
        setFilteredSubmissions(userSubmissions);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      }
    };
  
    fetchSubmissions();
  }, []);
  
  useEffect(() => {
    filterSubmissions();
  }, [searchQuery, startDate, endDate]);

  const filterSubmissions = () => {
    let filtered = submissions;

   
    if (searchQuery) {
      filtered = filtered.filter(submission =>
        submission.step1_data.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.step2_files.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.step3_options.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

   
    if (startDate && endDate) {
      filtered = filtered.filter(submission => {
        const submissionDate = new Date(submission.submission_date).getTime();
        return submissionDate >= new Date(startDate).getTime() &&
               submissionDate <= new Date(endDate).getTime();
      });
    }

    setFilteredSubmissions(filtered);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Submissions</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search submissions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <div className="flex space-x-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Submission Date</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Step 1 Data</th>
            <th className="px-4 py-2">Step 2 Files</th>
            <th className="px-4 py-2">Step 3 Options</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubmissions.map(submission => (
            <tr key={submission.id}>
              <td className="border px-4 py-2">{submission.id}</td>
              <td className="border px-4 py-2">{new Date(submission.submission_date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{submission.status}</td>
              <td className="border px-4 py-2">{submission.step1_data}</td>
              <td className="border px-4 py-2">{submission.step2_files}</td>
              <td className="border px-4 py-2">{submission.step3_options}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionTable;
