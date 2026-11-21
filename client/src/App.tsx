import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthView } from './components/AuthView';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GreetingHero } from './components/GreetingHero';
import { KPISparklineCards } from './components/KPISparklineCards';
import { PipelineHealthAndDonut } from './components/PipelineHealthAndDonut';
import { FilterBar } from './components/FilterBar';
import { LeadTable } from './components/LeadTable';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadDrawer } from './components/LeadDrawer';
import { Pagination } from './components/Pagination';
import { LeadModal } from './components/LeadModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { useToast } from './components/Toast';
import { leadApi } from './services/api';
import { Lead, LeadStats, LeadStatus, PaginationMeta, ViewMode } from './types';
import { Loader2 } from 'lucide-react';

export const App: React.FC = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { showToast } = useToast();

  // Navigation tab state
  const [currentNavTab, setCurrentNavTab] = useState('dashboard');

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

  // View Mode: Table or Kanban Pipeline
  const [viewMode, setViewMode] = useState<ViewMode>('table');

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

  // Modal & Drawer States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState<Lead | null>(null);
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
      setPage(1);
    }, 300);
  };

  // Keyboard shortcut listener for '⌘K' or '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === '/' &&
          (e.target as HTMLElement).tagName !== 'INPUT' &&
          (e.target as HTMLElement).tagName !== 'TEXTAREA')
      ) {
        e.preventDefault();
        const searchInput = document.getElementById('global-lead-search') as HTMLInputElement | null;
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Leads List
  const fetchLeads = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLeadsLoading(true);
    try {
      const queryLimit = viewMode === 'kanban' ? 100 : limit;
      const data = await leadApi.getLeads({
        search: debouncedSearch.trim() || undefined,
        status: status !== 'All' ? status : undefined,
        source: source !== 'All' ? source : undefined,
        sortBy: sortBy as any,
        sortOrder,
        page: viewMode === 'kanban' ? 1 : page,
        limit: queryLimit,
      });
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch (error: any) {
      console.error('Failed to fetch leads:', error);
      showToast('Failed to load leads from server.', 'error');
    } finally {
      setIsLeadsLoading(false);
    }
  }, [isAuthenticated, debouncedSearch, status, source, sortBy, sortOrder, page, limit, viewMode, showToast]);

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [fetchLeads, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [fetchStats, isAuthenticated]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatus('All');
    setSource('All');
    setPage(1);
  };

  const handleCreateLead = async (leadData: Partial<Lead>) => {
    await leadApi.createLead(leadData);
    showToast(`Lead "${leadData.name}" captured successfully!`, 'success');
    fetchLeads();
    fetchStats();
  };

  const handleUpdateLead = async (leadData: Partial<Lead>) => {
    if (!editingLead) return;
    await leadApi.updateLead(editingLead.id, leadData);
    showToast(`Lead "${leadData.name || editingLead.name}" updated!`, 'success');
    setEditingLead(null);
    if (selectedLeadForDrawer && selectedLeadForDrawer.id === editingLead.id) {
      setSelectedLeadForDrawer((prev) => (prev ? ({ ...prev, ...leadData } as Lead) : null));
    }
    fetchLeads();
    fetchStats();
  };

  const handleQuickStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    try {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
      );
      if (selectedLeadForDrawer?.id === lead.id) {
        setSelectedLeadForDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      await leadApi.updateLead(lead.id, { status: newStatus });
      showToast(`Stage updated to ${newStatus} for ${lead.name}`, 'info');
      fetchStats();
    } catch (error) {
      showToast('Failed to update stage', 'error');
      fetchLeads();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await leadApi.deleteLead(deletingLead.id);
      showToast(`Lead "${deletingLead.name}" removed successfully.`, 'success');
      if (selectedLeadForDrawer?.id === deletingLead.id) {
        setSelectedLeadForDrawer(null);
      }
      setDeletingLead(null);
      fetchLeads();
      fetchStats();
    } catch (error) {
      showToast('Failed to delete lead.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      showToast('No leads to export in the current view.', 'info');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Source', 'Status', 'Notes', 'Created At'];
    const rows = leads.map((l) => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${leads.length} leads to CSV`, 'success');
  };

  const total = stats?.total ?? 0;
  const qualified = stats?.byStatus?.Qualified ?? 0;
  const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;

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
    <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentNavTab}
        onTabChange={(tab) => setCurrentNavTab(tab)}
        viewMode={viewMode}
        onViewModeChange={(m) => setViewMode(m)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          search={search}
          onSearchChange={handleSearchChange}
        />

        {/* Dashboard Canvas */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-8">
          {/* Greeting Hero Section */}
          <GreetingHero
            totalLeads={total}
            conversionRate={conversionRate}
          />

          {/* 4 KPI Sparkline Cards */}
          <KPISparklineCards
            stats={stats}
            selectedStatus={status}
            onSelectStatus={(st) => {
              setStatus(st);
              setPage(1);
            }}
            isLoading={isStatsLoading}
          />

          {/* Pipeline Health Chevron Flow & Donut Chart */}
          <PipelineHealthAndDonut stats={stats} />

          {/* Leads Filter Bar */}
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
          />

          {/* View Switching: Table vs Kanban Pipeline */}
          {viewMode === 'table' ? (
            <>
              <LeadTable
                leads={leads}
                isLoading={isLeadsLoading}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                onEdit={(lead) => setEditingLead(lead)}
                onDelete={(lead) => setDeletingLead(lead)}
                onSelectLead={(lead) => setSelectedLeadForDrawer(lead)}
                onStatusChange={handleQuickStatusChange}
                onOpenCreateModal={() => setIsCreateModalOpen(true)}
                viewMode={viewMode}
                onViewModeChange={(m) => setViewMode(m)}
                onExportCSV={handleExportCSV}
                totalCount={pagination.total}
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
            </>
          ) : (
            <KanbanBoard
              leads={leads}
              isLoading={isLeadsLoading}
              onSelectLead={(lead) => setSelectedLeadForDrawer(lead)}
              onStatusChange={handleQuickStatusChange}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Slide-Over Lead Dossier Drawer */}
      <LeadDrawer
        lead={selectedLeadForDrawer}
        isOpen={!!selectedLeadForDrawer}
        onClose={() => setSelectedLeadForDrawer(null)}
        onEdit={(lead) => {
          setSelectedLeadForDrawer(null);
          setEditingLead(lead);
        }}
        onDelete={(lead) => {
          setSelectedLeadForDrawer(null);
          setDeletingLead(lead);
        }}
        onStatusChange={handleQuickStatusChange}
      />

      {/* Add Lead Modal */}
      <LeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
        title="Capture New Lead"
      />

      {/* Edit Lead Modal */}
      <LeadModal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        onSubmit={handleUpdateLead}
        initialData={editingLead}
        title="Modify Lead Details"
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
