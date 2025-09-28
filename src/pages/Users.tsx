import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/appConstants';
import './Users.styles.css';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    email: string;
    phone_number: string | null;
    is_email_verified: boolean;
    is_phone_verified: boolean;
    login_method: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface UsersResponse {
    items: User[];
    total: number;
}

interface UserFilters {
    email_verified: boolean | null;
    phone_number_verified: boolean | null;
    login_method: string | null;
    limit: number;
    offset: number;
}

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<UserFilters>({
        email_verified: null,
        phone_number_verified: null,
        login_method: null,
        limit: 50,
        offset: 0
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const navigate = useNavigate();

    const loginMethods = ['magic_link', 'oauth_google', 'oauth_facebook'];

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const requestBody = {
                email_verified: filters.email_verified,
                phone_number_verified: filters.phone_number_verified,
                login_method: filters.login_method,
                limit: filters.limit,
                offset: filters.offset
            };

            const response = await fetch(`${API_BASE_URL}/admin/app-users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch users: ${response.statusText}`);
            }

            const data: UsersResponse = await response.json();
            setUsers(data.items);
            setTotal(data.total);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const handleFilterChange = (key: keyof UserFilters, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            offset: 0 // Reset to first page when filters change
        }));
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        const newOffset = (newPage - 1) * filters.limit;
        setFilters(prev => ({
            ...prev,
            offset: newOffset
        }));
        setCurrentPage(newPage);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getLoginMethodBadge = (method: string) => {
        const badgeClass = {
            'magic_link': 'badge-magic',
            'oauth_google': 'badge-google',
            'oauth_facebook': 'badge-facebook'
        }[method] || 'badge-default';

        return `login-method-badge ${badgeClass}`;
    };

    const totalPages = Math.ceil(total / filters.limit);

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="user-management">
            {/* Go Back Button */}
            <button
                onClick={goBack}
                className="back-button mb-4 btn d-flex align-items-center gap-2"
                type="button"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
                Back
            </button>
            <div className="header">
                <h1>User Management</h1>
                <p className="subtitle">Manage and view all registered users</p>
            </div>

            {/* Filters Section */}
            <div className="filters-container">
                <div className="filters-grid">
                    <div className="filter-group">
                        <label htmlFor="email-verified">Email Status</label>
                        <select
                            id="email-verified"
                            value={filters.email_verified === null ? '' : filters.email_verified.toString()}
                            onChange={(e) => handleFilterChange('email_verified',
                                e.target.value === '' ? null : e.target.value === 'true'
                            )}
                        >
                            <option value="">All</option>
                            <option value="true">Verified</option>
                            <option value="false">Unverified</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="phone-verified">Phone Status</label>
                        <select
                            id="phone-verified"
                            value={filters.phone_number_verified === null ? '' : filters.phone_number_verified.toString()}
                            onChange={(e) => handleFilterChange('phone_number_verified',
                                e.target.value === '' ? null : e.target.value === 'true'
                            )}
                        >
                            <option value="">All</option>
                            <option value="true">Verified</option>
                            <option value="false">Unverified</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="login-method">Login Method</label>
                        <select
                            id="login-method"
                            value={filters.login_method || ''}
                            onChange={(e) => handleFilterChange('login_method',
                                e.target.value === '' ? null : e.target.value
                            )}
                        >
                            <option value="">All Methods</option>
                            {loginMethods.map(method => (
                                <option key={method} value={method}>
                                    {method.replace('_', ' ').replace('oauth', 'OAuth')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="limit">Per Page</label>
                        <select
                            id="limit"
                            value={filters.limit}
                            onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                        >
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchUsers}
                    disabled={loading}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Results Summary */}
            <div className="results-summary">
                <span className="total-count">Total: {total} users</span>
                <span className="current-showing">
                    Showing {filters.offset + 1}-{Math.min(filters.offset + filters.limit, total)} of {total}
                </span>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading users...</p>
                </div>
            )}

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            {/* Users Table */}
            {!loading && !error && (
                <div className="table-container">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Email Status</th>
                                <th>Phone Status</th>
                                <th>Login Method</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className={user.deleted_at ? 'deleted-user' : ''}>
                                    <td className="user-id">{user.id}</td>
                                    <td className="username">{user.username}</td>
                                    <td className="email">{user.email}</td>
                                    <td className="phone">
                                        {user.phone_number || <span className="no-data">—</span>}
                                    </td>
                                    <td className="verification-status">
                                        <span className={`status-badge ${user.is_email_verified ? 'verified' : 'unverified'}`}>
                                            {user.is_email_verified ? '✓' : '✗'}
                                        </span>
                                    </td>
                                    <td className="verification-status">
                                        <span className={`status-badge ${user.is_phone_verified ? 'verified' : 'unverified'}`}>
                                            {user.is_phone_verified ? '✓' : '✗'}
                                        </span>
                                    </td>
                                    <td className="login-method">
                                        <span className={getLoginMethodBadge(user.login_method)}>
                                            {user.login_method.replace('_', ' ').replace('oauth', 'OAuth')}
                                        </span>
                                    </td>
                                    <td className="date">{formatDate(user.created_at)}</td>
                                    <td className="actions">
                                        <button
                                            className="info-btn"
                                            onClick={() => {
                                                // Handle info button click
                                                console.log('User info:', user);
                                                // You can open a modal or navigate to user details
                                            }}
                                        >
                                            ℹ️ Info
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Advanced Pagination */}
            {!loading && !error && users.length > 0 && (
                <div className="advanced-pagination">
                    <div className="pagination-info">
                        <div className="page-stats">
                            <span className="current-page">Page {currentPage} of {totalPages}</span>
                            <span className="total-info">Total: {total.toLocaleString()} users</span>
                        </div>
                        <div className="range-info">
                            Showing {(filters.offset + 1).toLocaleString()} - {Math.min(filters.offset + filters.limit, total).toLocaleString()}
                        </div>
                    </div>

                    <div className="pagination-controls">
                        <button
                            className="nav-btn first-btn"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            title="First page"
                        >
                            ⏮️
                        </button>

                        <button
                            className="nav-btn prev-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            title="Previous page"
                        >
                            ◀️ Prev
                        </button>

                        <div className="page-numbers-advanced">
                            {(() => {
                                const pages = [];
                                const maxVisible = 5;
                                let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                                let end = Math.min(totalPages, start + maxVisible - 1);

                                if (end - start < maxVisible - 1) {
                                    start = Math.max(1, end - maxVisible + 1);
                                }

                                // First page + ellipsis
                                if (start > 1) {
                                    pages.push(
                                        <button
                                            key={1}
                                            className="page-number"
                                            onClick={() => handlePageChange(1)}
                                        >
                                            1
                                        </button>
                                    );
                                    if (start > 2) {
                                        pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
                                    }
                                }

                                // Visible page numbers
                                for (let i = start; i <= end; i++) {
                                    pages.push(
                                        <button
                                            key={i}
                                            className={`page-number ${currentPage === i ? 'active' : ''}`}
                                            onClick={() => handlePageChange(i)}
                                        >
                                            {i}
                                        </button>
                                    );
                                }

                                // Ellipsis + last page
                                if (end < totalPages) {
                                    if (end < totalPages - 1) {
                                        pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
                                    }
                                    pages.push(
                                        <button
                                            key={totalPages}
                                            className="page-number"
                                            onClick={() => handlePageChange(totalPages)}
                                        >
                                            {totalPages}
                                        </button>
                                    );
                                }

                                return pages;
                            })()}
                        </div>

                        <button
                            className="nav-btn next-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            title="Next page"
                        >
                            Next ▶️
                        </button>

                        <button
                            className="nav-btn last-btn"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            title="Last page"
                        >
                            ⏭️
                        </button>
                    </div>

                    <div className="pagination-jump">
                        <span>Jump to:</span>
                        <input
                            type="number"
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= totalPages) {
                                    handlePageChange(page);
                                }
                            }}
                            className="page-input"
                        />
                        <button
                            className="go-btn"
                            onClick={() => {
                                const input = document.querySelector('.page-input') as HTMLInputElement;
                                const page = parseInt(input.value);
                                if (page >= 1 && page <= totalPages) {
                                    handlePageChange(page);
                                }
                            }}
                        >
                            Go
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && users.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">👥</div>
                    <h3>No users found</h3>
                    <p>Try adjusting your filters or check back later.</p>
                </div>
            )}
        </div>
    );
};

export default UserManagement;