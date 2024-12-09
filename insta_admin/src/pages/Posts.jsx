import { useState, useEffect } from "react";
import axios from "axios";
import PostTable from "../components/PostTable";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Image,
  Loader2,
} from "lucide-react";
const VITE_API_URL = import.meta.env.VITE_API_URL;
import { Search, X } from "lucide-react";

const columns = [
  { key: "id", label: "ID" },
  { key: "image_url", label: "Post" },
  { key: "caption", label: "Caption" },
  { key: "Likes", label: "Likes" },
  { key: "Comments", label: "Comments" },
  { key: "createdAt", label: "Created at" },
];

const Posts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState("user_id");
  const [sortDirection, setSortDirection] = useState("desc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(6);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [searchQuery]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("insta_admin");
      if (!token) {
        setError("Authorization token missing");
        return;
      }
      const response = await axios.get(
        `${VITE_API_URL}/admin/posts/get-posts`,
        {
          headers: {
            insta_admin: token,
          },
          params: {
            page: currentPage,
            limit: itemsPerPage,
            sortColumn,
            sortDirection,
            search: debouncedSearchQuery,
          },
        }
      );

      if (response.data) {
        setData(response.data.users);
        setTotalPages(
          response.data.totalPages ||
            Math.ceil(response.data.total / itemsPerPage)
        );
        setTotalUsers(response.data.count || 0);
      } else {
        setError("No users found");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (columnKey) => {
    const newDirection =
      sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(columnKey);
    setSortDirection(newDirection);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, sortColumn, sortDirection, debouncedSearchQuery]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  // handle delete post
  const handleDeletePost = async (post) => {
    const token = localStorage.getItem("insta_admin");
    try {
      await axios.delete(`${VITE_API_URL}/admin/posts/delete/${post.id}`, {
        headers: {
          insta_admin: token,
        },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="container mx-auto lg:p-6">
      <div className="w-full mb-6">
        <div className="bg-zinc-800 p-6 flex  items-center justify-between flex-row rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center mb-2">
            <Image className="mr-2 h-8 w-8 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Posts
            </span>
          </h1>
          <span className="text-4xl font-bold text-green-400">
            {totalUsers}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder="Search post by caption, date, or user"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-zinc-400 hover:text-zinc-200" />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-lg mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          <PostTable
            columns={columns}
            data={data}
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onDeletePost={(post) => {
              handleDeletePost(post);
            }}
          />

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="text-sm text-zinc-400">
              Showing{" "}
              {Math.min((currentPage - 1) * itemsPerPage + 1, totalUsers)} to{" "}
              {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers}{" "}
              Posts
            </div>

            <div className="flex items-center space-x-2">
              {/* First Page */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Posts;
