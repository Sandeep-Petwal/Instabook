import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Table from "../components/Table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  Search,
  UserPlus,
  Users as UsersIcon,
  X,
} from "lucide-react";

const VITE_API_URL = import.meta.env.VITE_API_URL;

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Users = () => {
  const columns = useMemo(
    () => [
      { key: "user_id", label: "User ID" },
      { key: "profile_url", label: "Profile Image" },
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "Posts", label: "Posts" },
      { key: "status", label: "Status" },
      { key: "login_count", label: "Login`s" },
      { key: "createdAt", label: "Joined" },
    ],
    []
  );

  const [state, setState] = useState({
    data: [],
    loading: false,
    error: null,
    totalPages: 1,
    totalUsers: 0,
  });

  const [filters, setFilters] = useState({
    sortColumn: "user_id",
    sortDirection: "desc",
    currentPage: 1,
    itemsPerPage: 6,
    searchQuery: "",
  });

  const debouncedSearchQuery = useDebounce(filters.searchQuery, 500);

  // Memoize fetchData to prevent recreation on every render
  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const token = localStorage.getItem("insta_admin");
      if (!token) {
        setState((prev) => ({
          ...prev,
          error: "Authorization token missing",
          loading: false,
        }));
        return;
      }

      const response = await axios.get(`${VITE_API_URL}/admin/users/getall`, {
        headers: { insta_admin: token },
        params: {
          page: filters.currentPage,
          limit: filters.itemsPerPage,
          sortColumn: filters.sortColumn,
          sortDirection: filters.sortDirection,
          search: debouncedSearchQuery,
        },
      });

      if (response.data) {
        setState((prev) => ({
          ...prev,
          data: response.data.users,
          totalPages:
            response.data.totalPages ||
            Math.ceil(response.data.total / filters.itemsPerPage),
          totalUsers: response.data.count || 0,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: "No users found",
          loading: false,
        }));
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setState((prev) => ({
        ...prev,
        error: "Failed to load users. Please try again later.",
        loading: false,
      }));
    }
  }, [
    filters.currentPage,
    filters.itemsPerPage,
    filters.sortColumn,
    filters.sortDirection,
    debouncedSearchQuery,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize handlers to prevent recreation on every render
  const handleSort = useCallback((columnKey) => {
    setFilters((prev) => ({
      ...prev,
      sortColumn: columnKey,
      sortDirection:
        prev.sortColumn === columnKey && prev.sortDirection === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const handleSearchChange = useCallback((e) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: e.target.value,
      currentPage: 1,
    }));
  }, []);

  const clearSearch = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: "",
      currentPage: 1,
    }));
  }, []);

  // Memoize page numbers calculation
  const pageNumbers = useMemo(() => {
    const numbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      filters.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(state.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i);
    }

    return numbers;
  }, [filters.currentPage, state.totalPages]);

  return (
    <div className="container mx-auto lg:p-6">

      <div className="w-full mb-6">
        <div className="bg-zinc-800 p-6 flex  items-center justify-between flex-row rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center mb-2">
            <UsersIcon className="mr-2 h-8 w-8 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Users
            </span>
          </h1>
            <span className="text-4xl font-bold text-green-400">
              {state.totalUsers}
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
          placeholder="Search users by name, email, or user ID..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {filters.searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-zinc-400 hover:text-zinc-200" />
          </button>
        )}
      </div>

      {state.error && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 p-4 rounded-lg mb-6">
          <strong>Error:</strong> {state.error}
        </div>
      )}

      {state.loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <>
          <Table
            columns={columns}
            data={state.data}
            onSort={handleSort}
            sortColumn={filters.sortColumn}
            sortDirection={filters.sortDirection}
            onDeleteUser={(user) => {
              console.log("Deleting user:", user);
            }}
          />

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between px-2">
            <div className="text-sm text-zinc-400">
              Showing{" "}
              {Math.min(
                (filters.currentPage - 1) * filters.itemsPerPage + 1,
                state.totalUsers
              )}{" "}
              to{" "}
              {Math.min(
                filters.currentPage * filters.itemsPerPage,
                state.totalUsers
              )}{" "}
              of {state.totalUsers} users
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={filters.currentPage === 1}
                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-5 w-5" />
              </button>

              <button
                onClick={() => handlePageChange(filters.currentPage - 1)}
                disabled={filters.currentPage === 1}
                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center space-x-1">
                {pageNumbers.map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      filters.currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(filters.currentPage + 1)}
                disabled={filters.currentPage === state.totalPages}
                className="p-2 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <button
                onClick={() => handlePageChange(state.totalPages)}
                disabled={filters.currentPage === state.totalPages}
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

export default Users;
