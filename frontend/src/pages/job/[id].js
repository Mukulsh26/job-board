import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function JobDetails() {
  const router = useRouter();
  const { id } = router.query; // Get job ID from URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function fetchJobDetails() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch job details");
        }
        const data = await response.json();
        setJob(data);
      } catch (err) {
        setError("Failed to load job details");
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobDetails();
  }, [id]);

  if (!id) return <div className="text-center mt-10 text-red-500">⚠️ Invalid Job ID</div>;
  if (loading) return <div className="text-center mt-10 text-gray-300">Loading job details...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-6">🚀 Job Board</h1>
      
      {job ? (
        <div className="bg-[#1E293B] shadow-lg rounded-lg p-6 w-full max-w-3xl border border-gray-700">
          <h1 className="text-3xl font-bold text-white">{job.title}</h1>
          <p className="text-lg text-gray-300 mt-2">
            <strong>🏢 Company:</strong> {job.company}
          </p>
          <p className="text-lg text-gray-300">
            <strong>📍 Location:</strong> {job.location}
          </p>
          <p className="text-lg text-gray-300">
            <strong>Experience Required:</strong> {job.experience}
          </p>
          <a
            href={job.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
          >
            🔗 View Job Posting
          </a>
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-400">No job details found.</div>
      )}
    </div>
  );
}
