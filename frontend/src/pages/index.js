"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs?page=${page}&limit=10`);
      const newJobs = [...jobs, ...data.jobs];

      setJobs(newJobs);
      setFilteredJobs(newJobs); 
      setHasMore(page < data.totalPages);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const lastJobRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
    });

    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    if (!searchQuery) {
      setFilteredJobs(jobs); 
    } else {
      const filtered = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">🚀 Job Board</h1>
<input
  type="text"
  placeholder="Search jobs..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full max-w-2xl p-3 mb-6 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

      <div className="w-full max-w-4xl grid gap-6">
        {filteredJobs.map((job, index) => (
          <div
            key={index}
            ref={index === filteredJobs.length - 1 ? lastJobRef : null}
            className="bg-[#1E293B] p-6 rounded-lg shadow-md border border-gray-700 hover:scale-[1.02] transition-transform duration-300"
          >
            <h2 className="text-xl font-semibold text-white">{job.title}</h2>
            <p className="text-gray-300">{job.company} - {job.location}</p>
            <a
              href={`/job/${job._id}`}
              className="text-blue-400 mt-2 inline-block hover:underline"
            >
              View Details →
            </a>
          </div>
        ))}
      </div>

      {loading && <p className="mt-6 text-gray-400">Loading more jobs...</p>}
    </div>
  );
}
