import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthView } from './components/AuthView';
import { Navbar } from './components/Navbar';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { LeadTable } from './components/LeadTable';
import { Pagination } from './components/Pagination';
import { LeadModal } from './components/LeadModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { useToast } from './components/Toast';
import { leadApi } from './services/api';
import { Lead, LeadStats, LeadStatus, PaginationMeta } from './types';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  // Leads and Stats Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Query & Filter States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState<string>('All');
  const [source, setSource] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  // Loading States
  const [isLeadsLoading, setIsLeadsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1); // Reset to page 1 on new search
    }, 350);
  };

  // Fetch Leads List
  const fetchLeads = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLeadsLoading(true);
    try {
      const data = await leadApi.getLeads({
        search: debouncedSearch.trim() || undefined,
        status: status !== 'All' ? status : undefined,
        source: source !== 'All' ? source : undefined,
        sortBy: sortBy as any,
        sortOrder,
        page,
        limit,
      });
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (error: any) {
      console.error('Failed to fetch leads:', error);
      showToast('Failed to load leads from server.', 'error');
    } finally {
      setIsLeadsLoading(false);
    }
  }, [isAuthenticated, debouncedSearch, status, source, sortBy, sortOrder, page, limit, showToast]);

  // Fetch KPI Stats
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsStatsLoading(true);
    try {
      const data = await leadApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsStatsLoading(false);
    }
  }, [isAuthenticated]);

  // Load data on query change
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [fetchLeads, isAuthenticated]);

  // Load stats initially or when lead count changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [fetchStats, isAuthenticated]);

  // Handle Sort Change
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  // Filter Reset
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('All');
    setSource('All');
    setPage(1);
  };

  // Create Lead
  const handleCreateLead = async (leadData: Partial<Lead>) => {
    await leadApi.createLead(leadData);
    showToast(`Lead "${leadData.name}" created successfully!`, 'success');
    fetchLeads();
    fetchStats();
  };

  // Update Lead
  const handleUpdateLead = async (leadData: Partial<Lead>) => {
    if (!editingLead) return;
    await leadApi.updateLead(editingLead.id, leadData);
    showToast(`Lead "${leadData.name || editingLead.name}" updated!`, 'success');
    setEditingLead(null);
    fetchLeads();
    fetchStats();
  };

  // Quick Status Change from Table dropdown
  const handleQuickStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    try {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
      );
      await leadApi.updateLead(lead.id, { status: newStatus });
      showToast(`Status updated to ${newStatus} for ${lead.name}`, 'info');
      fetchStats();
    } catch (error) {
      showToast('Failed to update status', 'error');
      fetchLeads(); // rollback
    }
  };

  // Delete Lead
  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await leadApi.deleteLead(deletingLead.id);
      showToast(`Lead "${deletingLead.name}" removed successfully.`, 'success');
      setDeletingLead(null);
      fetchLeads();
      fetchStats();
    } catch (error) {
      showToast('Failed to delete lead.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-600">
            Initializing LeadFlow...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* KPI Dashboard */}
        <StatsDashboard
          stats={stats}
          selectedStatus={status}
          onSelectStatus={(newStatus) => {
            setStatus(newStatus);
            setPage(1);
          }}
          isLoading={isStatsLoading}
        />

        {/* Filter & Search Bar */}
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          status={status}
          onStatusChange={(newStatus) => {
            setStatus(newStatus);
            setPage(1);
          }}
          source={source}
          onSourceChange={(newSource) => {
            setSource(newSource);
            setPage(1);
          }}
          onResetFilters={handleResetFilters}
          onRefresh={() => {
            fetchLeads();
            fetchStats();
          }}
          isLoading={isLeadsLoading}
          totalResults={pagination.total}
        />

        {/* Leads Table */}
        <LeadTable
          leads={leads}
          isLoading={isLeadsLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={(lead) => setEditingLead(lead)}
          onDelete={(lead) => setDeletingLead(lead)}
          onStatusChange={handleQuickStatusChange}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />

        {/* Pagination Controls */}
        {pagination.total > 0 && (
          <Pagination
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        )}
      </main>

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
        title="Add New Lead"
      />

      {/* Edit Lead Modal */}
      <LeadModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdateLead}
        initialData={editingLead}
        title="Edit Lead Details"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingLead}
        lead={deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
