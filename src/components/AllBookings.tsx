import React, { useState, useEffect } from 'react';

// Define TypeScript interfaces
interface Booking {
    id: string;
    userId: string;
    userName: string;
    orgId: string;
    orgName: string;
    service: string;
    date: string;
    time: string;
    status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
    createdAt: string;
}

interface FilterOptions {
    timeFrame: 'all' | 'current' | 'past';
    orgId?: string;
    userId?: string;
    status?: Booking['status'];
}

// Sample data
const mockBookings: Booking[] = [
    {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        orgId: 'org1',
        orgName: 'Organization A',
        service: 'Meeting Room',
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'confirmed',
        createdAt: '2024-01-10'
    },
    {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        orgId: 'org2',
        orgName: 'Organization B',
        service: 'Conference Hall',
        date: '2024-01-12',
        time: '2:00 PM',
        status: 'completed',
        createdAt: '2024-01-08'
    },
    {
        id: '3',
        userId: 'user1',
        userName: 'John Doe',
        orgId: 'org1',
        orgName: 'Organization A',
        service: 'Workshop Space',
        date: '2024-01-20',
        time: '9:00 AM',
        status: 'pending',
        createdAt: '2024-01-14'
    }
];

const BookingManager: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>(mockBookings);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        timeFrame: 'all',
        orgId: '',
        userId: '',
        status: undefined
    });
    const [selectedOrg, setSelectedOrg] = useState<string>('');

    // Get unique organizations for filter dropdown
    const organizations = Array.from(new Set(bookings.map(booking => booking.orgId)));

    // Filter bookings based on criteria
    useEffect(() => {
        let filtered = bookings;

        // Filter by time frame
        const currentDate = new Date();
        if (filterOptions.timeFrame === 'current') {
            filtered = filtered.filter(booking => new Date(booking.date) >= currentDate);
        } else if (filterOptions.timeFrame === 'past') {
            filtered = filtered.filter(booking => new Date(booking.date) < currentDate);
        }

        // Filter by organization
        if (filterOptions.orgId) {
            filtered = filtered.filter(booking => booking.orgId === filterOptions.orgId);
        }

        // Filter by user
        if (filterOptions.userId) {
            filtered = filtered.filter(booking => booking.userId === filterOptions.userId);
        }

        // Filter by status
        if (filterOptions.status) {
            filtered = filtered.filter(booking => booking.status === filterOptions.status);
        }

        setFilteredBookings(filtered);
    }, [bookings, filterOptions]);

    const handleFilterChange = (key: keyof FilterOptions, value: any) => {
        setFilterOptions(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilterOptions({
            timeFrame: 'all',
            orgId: '',
            userId: '',
            status: undefined
        });
    };

    const getStatusColor = (status: Booking['status']) => {
        switch (status) {
            case 'confirmed': return '#38B000'; // primary color
            case 'completed': return '#6C584C'; // 5th color
            case 'cancelled': return '#dc3545';
            case 'pending': return '#ffc107';
            default: return '#6C584C';
        }
    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#EBF2FA', // 3rd color
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                {/* Header */}
                <h1 style={{
                    color: '#141414', // 4th color
                    marginBottom: '20px',
                    borderBottom: `2px solid #38B000`, // primary color
                    paddingBottom: '10px'
                }}>
                    Booking Management
                </h1>

                {/* Filter Section */}
                <div style={{
                    backgroundColor: '#F0EAD2', // secondary color
                    padding: '15px',
                    borderRadius: '6px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{ color: '#141414', marginBottom: '15px' }}>Filters</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#6C584C' }}>Time Frame</label>
                            <select
                                value={filterOptions.timeFrame}
                                onChange={(e) => handleFilterChange('timeFrame', e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid #6C584C`,
                                    borderRadius: '4px',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="all">All Bookings</option>
                                <option value="current">Current Bookings</option>
                                <option value="past">Past Bookings</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#6C584C' }}>Organization</label>
                            <select
                                value={filterOptions.orgId || ''}
                                onChange={(e) => handleFilterChange('orgId', e.target.value || undefined)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid #6C584C`,
                                    borderRadius: '4px',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">All Organizations</option>
                                {organizations.map(orgId => (
                                    <option key={orgId} value={orgId}>
                                        {bookings.find(b => b.orgId === orgId)?.orgName || orgId}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#6C584C' }}>Status</label>
                            <select
                                value={filterOptions.status || ''}
                                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid #6C584C`,
                                    borderRadius: '4px',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', color: '#6C584C' }}>User ID</label>
                            <input
                                type="text"
                                value={filterOptions.userId || ''}
                                onChange={(e) => handleFilterChange('userId', e.target.value || undefined)}
                                placeholder="Enter user ID"
                                style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid #6C584C`,
                                    borderRadius: '4px',
                                    backgroundColor: 'white'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={clearFilters}
                        style={{
                            marginTop: '15px',
                            padding: '8px 16px',
                            backgroundColor: '#6C584C',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Results Count */}
                <div style={{ marginBottom: '15px', color: '#6C584C' }}>
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </div>

                {/* Bookings Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#38B000', color: 'white' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Organization</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Service</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Date & Time</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map(booking => (
                                <tr key={booking.id} style={{
                                    borderBottom: '1px solid #F0EAD2',
                                    ':hover': { backgroundColor: '#EBF2FA' }
                                } as React.CSSProperties}>
                                    <td style={{ padding: '12px' }}>
                                        <div>{booking.userName}</div>
                                        <small style={{ color: '#6C584C' }}>ID: {booking.userId}</small>
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <div>{booking.orgName}</div>
                                        <small style={{ color: '#6C584C' }}>ID: {booking.orgId}</small>
                                    </td>
                                    <td style={{ padding: '12px' }}>{booking.service}</td>
                                    <td style={{ padding: '12px' }}>
                                        {new Date(booking.date).toLocaleDateString()} at {booking.time}
                                    </td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: getStatusColor(booking.status),
                                            color: 'white',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', color: '#6C584C' }}>
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            color: '#6C584C',
                            backgroundColor: 'white'
                        }}>
                            No bookings found matching your criteria
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingManager;