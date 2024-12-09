import React, { useEffect, useState } from "react";
import load from '../assets/load.gif';


export default function Cve() {
  const [cveData, setCveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://cve.circl.lu/api/last");
        const data = await response.json();
        // console.log(data);
        setCveData(data.slice(1)); // Skip the first row
      } catch (error) {
        console.error("Error fetching CVE data:", error);
      } finally{
        setLoading(false);
      }
    };
    

    fetchData();
  }, []);

  // Create filtered data based on search term
  const filteredData = cveData
    .filter(item => item.id.includes(searchTerm)) // Filter based on ID
    .map(item => ({
      id: item.id,
      cvss: item.cvss || 'N/A',
      summary: item.summary,
      lastModified: item["last-modified"],
      publishedDate: item.Published,
    }));

  // Pagination logic
  const currentRows = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return(
  <div className="overflow-x-auto">
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded p-2 w-1/2 text-black"
        />
      </div>
      
      {loading ? ( // Check loading state
        <div className="flex justify-center">
          <img src={load} alt="Loading..." /> {/* Display loading GIF */}
        </div>
      ) : (
        <>
          <table className="min-w-full bg-gray-200 border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-black">ID</th>
                <th className="px-4 py-2 text-left text-black">CVSS</th>
                <th className="px-4 py-2 text-left text-black">Summary</th>
                <th className="px-4 py-2 text-left text-black">Last Modified</th>
                <th className="px-4 py-2 text-left text-black">Published</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-black">{row.id}</td>
                  <td className="border px-4 py-2 text-black">{row.cvss}</td>
                  <td className="border px-4 py-2 text-black">{row.summary}</td>
                  <td className="border px-4 py-2 text-black">{row.lastModified}</td>
                  <td className="border px-4 py-2 text-black">{row.publishedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 space-x-2">
            {[...Array(Math.ceil(filteredData.length / rowsPerPage)).keys()].map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number + 1)}
                className={`px-3 py-1 border rounded ${currentPage === number + 1 ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
              >
                {number + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}