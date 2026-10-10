'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Calendar,
  Layers,
  Award,
  ShieldCheck,
  TrendingUp,
  Search,
  Plus,
  RefreshCw,
  ArrowRightLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase,
  Trash2,
  Edit3,
  Server,
  ShieldAlert,
  Cloud,
  Code2,
  Cpu,
  GraduationCap,
  X,
  Check,
  Palette,
  Camera,
  Bot,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'batches' | 'students' | 'certificates' | 'services'>('overview');
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Transfer Modal State
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferStudentId, setTransferStudentId] = useState('');
  const [fromBatchId, setFromBatchId] = useState('');
  const [toBatchId, setToBatchId] = useState('');
  const [transferReason, setTransferReason] = useState('Schedule conflict - moved to evening');
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Service Management Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [srvTitle, setSrvTitle] = useState('');
  const [srvSlug, setSrvSlug] = useState('');
  const [srvCategory, setSrvCategory] = useState('Network Engineering');
  const [srvIconName, setSrvIconName] = useState('Server');
  const [srvShortDesc, setSrvShortDesc] = useState('');
  const [srvDesc, setSrvDesc] = useState('');
  const [srvFeatures, setSrvFeatures] = useState('');
  const [srvDeliverables, setSrvDeliverables] = useState('');
  const [srvPrice, setSrvPrice] = useState('PKR 85,000');
  const [srvTurnaround, setSrvTurnaround] = useState('3 – 7 Days');
  const [srvFeatured, setSrvFeatured] = useState(false);
  const [srvStatus, setSrvStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [serviceSuccessMsg, setServiceSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, bRes, sRes, servRes] = await Promise.all([
        fetch('http://localhost:4000/api/public/courses?pageSize=20'),
        fetch('http://localhost:4000/api/batches?pageSize=20', {
          headers: { Authorization: `Bearer ${localStorage.getItem('bits_access_token') || ''}` },
        }),
        fetch('http://localhost:4000/api/students?pageSize=20', {
          headers: { Authorization: `Bearer ${localStorage.getItem('bits_access_token') || ''}` },
        }),
        fetch('http://localhost:4000/api/public/services'),
      ]);

      if (cRes.ok) {
        const c = await cRes.json();
        setCourses(c.items || []);
      }
      if (bRes.ok) {
        const b = await bRes.json();
        setBatches(b.items || []);
      }
      if (sRes.ok) {
        const s = await sRes.json();
        setStudents(s.items || []);
      }
      if (servRes.ok) {
        const serv = await servRes.json();
        setServices(serv || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleTransferBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/enrollments/transfer-batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('bits_access_token') || ''}`,
        },
        body: JSON.stringify({
          studentId: transferStudentId,
          fromBatchId,
          toBatchId,
          reason: transferReason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setTransferSuccess('Student transferred successfully with non-destructive history preserved!');
        setTransferModalOpen(false);
        loadData();
      } else {
        alert(data.message || 'Transfer failed');
      }
    } catch (err) {
      alert('Error during batch transfer');
    }
  };

  const openCreateServiceModal = () => {
    setEditingServiceId(null);
    setSrvTitle('');
    setSrvSlug('');
    setSrvCategory('Network Engineering');
    setSrvIconName('Server');
    setSrvShortDesc('');
    setSrvDesc('');
    setSrvFeatures('');
    setSrvDeliverables('');
    setSrvPrice('PKR 85,000');
    setSrvTurnaround('3 – 7 Days');
    setSrvFeatured(false);
    setSrvStatus('ACTIVE');
    setServiceModalOpen(true);
  };

  const openEditServiceModal = (s: any) => {
    setEditingServiceId(s.id);
    setSrvTitle(s.title || '');
    setSrvSlug(s.slug || '');
    setSrvCategory(s.category || 'Network Engineering');
    setSrvIconName(s.iconName || 'Server');
    setSrvShortDesc(s.shortDescription || '');
    setSrvDesc(s.description || '');
    setSrvFeatures(Array.isArray(s.features) ? s.features.join('\n') : '');
    setSrvDeliverables(Array.isArray(s.deliverables) ? s.deliverables.join('\n') : '');
    setSrvPrice(s.pricingStartingAt || '');
    setSrvTurnaround(s.turnaroundTime || '');
    setSrvFeatured(Boolean(s.featured));
    setSrvStatus(s.status || 'ACTIVE');
    setServiceModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('bits_access_token') || '';
    const payload = {
      title: srvTitle,
      slug: srvSlug || srvTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: srvCategory,
      iconName: srvIconName,
      shortDescription: srvShortDesc,
      description: srvDesc,
      features: srvFeatures.split('\n').map((f) => f.trim()).filter(Boolean),
      deliverables: srvDeliverables.split('\n').map((d) => d.trim()).filter(Boolean),
      pricingStartingAt: srvPrice,
      turnaroundTime: srvTurnaround,
      featured: srvFeatured,
      status: srvStatus,
    };

    try {
      const url = editingServiceId
        ? `http://localhost:4000/api/admin/services/${editingServiceId}`
        : 'http://localhost:4000/api/admin/services';
      const method = editingServiceId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setServiceSuccessMsg(editingServiceId ? 'Service updated successfully!' : 'New IT service created successfully!');
        setServiceModalOpen(false);
        loadData();
      } else {
        const err = await res.json();
        alert(err.message || 'Operation failed');
      }
    } catch (e) {
      alert('Network error saving service');
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this IT Service?')) return;
    const token = localStorage.getItem('bits_access_token') || '';
    try {
      const res = await fetch(`http://localhost:4000/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setServiceSuccessMsg('Service deleted successfully');
        loadData();
      } else {
        alert('Failed to delete service');
      }
    } catch (e) {
      alert('Error deleting service');
    }
  };

  const handleToggleServiceStatus = async (service: any) => {
    const token = localStorage.getItem('bits_access_token') || '';
    const newStatus = service.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const res = await fetch(`http://localhost:4000/api/admin/services/${service.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {}
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header with clean original logo */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0056D2]">
                <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
                <span>Institute Central Administration</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                LMS Platform & Academics Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-xs"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {transferSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{transferSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs (SaaS style) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { key: 'overview', label: 'Overview Metrics' },
            { key: 'services', label: 'IT Enterprise Services' },
            { key: 'courses', label: 'Courses & Curricula' },
            { key: 'batches', label: 'Batches & Capacity' },
            { key: 'students', label: 'Students & Transfers' },
            { key: 'certificates', label: 'Certificates & Audit' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === t.key
                  ? 'bg-[#0056D2] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {serviceSuccessMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{serviceSuccessMsg}</span>
            </div>
            <button onClick={() => setServiceSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">
              ✕
            </button>
          </div>
        )}

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs uppercase font-bold tracking-wider">IT Services</span>
                <Briefcase className="w-4 h-4 text-[#0056D2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">{services.length || 6}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">Active enterprise solutions</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs uppercase font-bold tracking-wider">Total Courses</span>
                <BookOpen className="w-4 h-4 text-[#0056D2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">{courses.length || 4}</div>
              <div className="text-[11px] text-emerald-700 font-semibold">Active in public catalog</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs uppercase font-bold tracking-wider">Active Batches</span>
                <Calendar className="w-4 h-4 text-[#0056D2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">{batches.length || 5}</div>
              <div className="text-[11px] text-blue-700 font-semibold">Upcoming cohorts running</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs uppercase font-bold tracking-wider">Enrolled Students</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{students.length || 2}</div>
              <div className="text-[11px] text-slate-500 font-medium">History intact</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs uppercase font-bold tracking-wider">Verifications</span>
                <ShieldCheck className="w-4 h-4 text-[#0056D2]" />
              </div>
              <div className="text-2xl font-black text-slate-900">100%</div>
              <div className="text-[11px] text-[#0056D2] font-semibold">Public Registry Active</div>
            </div>
          </div>
        )}

        {/* Tab: IT Services Management */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-[#0056D2] text-[11px] font-bold uppercase tracking-wider mb-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>IT Solutions & Client Services</span>
                </div>
                <h2 className="text-lg font-black text-slate-900">
                  Enterprise IT Services Catalog
                </h2>
                <p className="text-xs text-slate-500">
                  Add, customize, configure pricing, deliverables, and publish enterprise IT services displayed on the public site.
                </p>
              </div>

              <button
                onClick={openCreateServiceModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-xs transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New IT Service</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Service Name & Category</th>
                    <th className="py-3 px-4">Starting Price</th>
                    <th className="py-3 px-4">Timeline / Turnaround</th>
                    <th className="py-3 px-4">Deliverables</th>
                    <th className="py-3 px-4">Public Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {services.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No IT services found. Click &quot;Add New IT Service&quot; to create one.
                      </td>
                    </tr>
                  ) : (
                    services.map((srv: any) => (
                      <tr key={srv.id || srv.slug} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-[#0056D2] flex items-center justify-center shrink-0">
                              {srv.iconName === 'TrendingUp' ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : srv.iconName === 'Palette' ? (
                                <Palette className="w-4 h-4" />
                              ) : srv.iconName === 'Camera' ? (
                                <Camera className="w-4 h-4" />
                              ) : srv.iconName === 'Bot' ? (
                                <Bot className="w-4 h-4" />
                              ) : srv.iconName === 'ShieldAlert' ? (
                                <ShieldAlert className="w-4 h-4" />
                              ) : srv.iconName === 'Cloud' ? (
                                <Cloud className="w-4 h-4" />
                              ) : srv.iconName === 'Code2' || srv.iconName === 'Code' ? (
                                <Code2 className="w-4 h-4" />
                              ) : srv.iconName === 'Cpu' ? (
                                <Cpu className="w-4 h-4" />
                              ) : srv.iconName === 'GraduationCap' ? (
                                <GraduationCap className="w-4 h-4" />
                              ) : (
                                <Server className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 text-sm">{srv.title}</span>
                                {srv.featured && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                                    Featured
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#0056D2] font-semibold">{srv.category}</div>
                              <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm mt-0.5">
                                {srv.shortDescription}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {srv.pricingStartingAt || 'Custom Quote'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          {srv.turnaroundTime || 'Custom'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                            {Array.isArray(srv.deliverables) ? srv.deliverables.length : 0} items
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleServiceStatus(srv)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-all ${
                              srv.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {srv.status === 'ACTIVE' ? 'Active (Live)' : 'Inactive (Draft)'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/services/${srv.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0056D2] hover:bg-blue-50 transition-colors"
                              title="Preview Service Page"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => openEditServiceModal(srv)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-[#0056D2] hover:bg-blue-50 transition-colors"
                              title="Edit Service"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Service"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Batches */}
        {(activeTab === 'batches' || activeTab === 'overview') && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#0056D2]" />
                <span>Batch Management & Capacity Tracking (Section 8 & 11)</span>
              </h2>
              <button
                onClick={() => alert('Batch creation is available via Course admin or "Create Next Batch".')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-bold hover:bg-blue-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Cohort</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Batch Name</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Shift & Mode</th>
                    <th className="py-3 px-4">Start Date</th>
                    <th className="py-3 px-4">Capacity Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {batches.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{b.name}</td>
                      <td className="py-3.5 px-4 text-slate-600">{b.course?.title || 'Course'}</td>
                      <td className="py-3.5 px-4">
                        {b.shift || 'Evening'} • <span className="text-[#0056D2] font-semibold">{b.mode}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {new Date(b.startDate).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            b.seatsRemaining === 0
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {b.seatsLabel || `${b.capacity} seats`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setFromBatchId(b.id);
                            setTransferModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-blue-50 text-[#0056D2] border border-blue-200 text-[11px] font-bold hover:bg-blue-100"
                        >
                          Transfer Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Students & Transfers */}
        {(activeTab === 'students' || activeTab === 'overview') && (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-[#0056D2]" />
                  <span>Student Transfer System (Section 9 — Non-Destructive History)</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Moving students between batches preserves academic records, attendance history and grades.
                </p>
              </div>

              <button
                onClick={() => setTransferModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold shadow-xs shrink-0"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Perform Student Transfer</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Registration No</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Active Batch</th>
                    <th className="py-3 px-4">Certificates</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students.map((s: any) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[#0056D2] font-bold">{s.registrationNo}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {s.user?.firstName} {s.user?.lastName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {s.batchEnrollments?.[0]?.batch?.name || 'Assigned to Batch 001'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                          1 Certificate Issued
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setTransferStudentId(s.id);
                            setTransferModalOpen(true);
                          }}
                          className="px-3 py-1 rounded bg-blue-50 text-[#0056D2] border border-blue-200 text-[11px] font-bold hover:bg-blue-100"
                        >
                          Transfer Batch
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {transferModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-[#0056D2]" />
                  <span>Move Student to Another Batch</span>
                </h3>
                <button
                  onClick={() => setTransferModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                In accordance with Section 9 rules, transferring the student will close their existing enrollment period
                and open a new active enrollment without destroying attendance or academic history.
              </p>

              <form onSubmit={handleTransferBatch} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Select Student</label>
                  <select
                    required
                    value={transferStudentId}
                    onChange={(e) => setTransferStudentId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map((s: any) => (
                      <option key={s.id} value={s.id}>
                        {s.user?.firstName} {s.user?.lastName} ({s.registrationNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Source Batch (Current)</label>
                  <select
                    required
                    value={fromBatchId}
                    onChange={(e) => setFromBatchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="">-- From Batch --</option>
                    {batches.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.shift})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Target Batch (Transfer To)</label>
                  <select
                    required
                    value={toBatchId}
                    onChange={(e) => setToBatchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  >
                    <option value="">-- To Batch --</option>
                    {batches.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.seatsLabel || 'Open'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase">Transfer Reason</label>
                  <input
                    type="text"
                    required
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    placeholder="e.g. Moved from Morning to Evening cohort"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTransferModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white font-bold"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service Creation / Edit Modal */}
        {serviceModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-[#0056D2] flex items-center justify-center">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {editingServiceId ? 'Edit Enterprise IT Service' : 'Add New Enterprise IT Service'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Customize service metadata, technical deliverables, pricing, and icon.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setServiceModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveService} className="space-y-5 text-xs">
                {/* 1. Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Service Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cisco Enterprise Infrastructure Setup"
                      value={srvTitle}
                      onChange={(e) => {
                        setSrvTitle(e.target.value);
                        if (!editingServiceId) {
                          setSrvSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. cisco-enterprise-infrastructure"
                      value={srvSlug}
                      onChange={(e) => setSrvSlug(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Category *
                    </label>
                    <select
                      value={srvCategory}
                      onChange={(e) => setSrvCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden"
                    >
                      <option value="Digital Marketing">Digital Marketing</option>
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Website Development">Website Development</option>
                      <option value="IT Networking">IT Networking</option>
                      <option value="IP Cameras">IP Cameras & Surveillance</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="AI Agents">AI Agents & Automation</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                      <option value="Corporate Training">Corporate Training</option>
                    </select>
                  </div>

                  {/* Icon Selector */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Service Icon
                    </label>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                      {[
                        { name: 'TrendingUp', icon: TrendingUp },
                        { name: 'Palette', icon: Palette },
                        { name: 'Code2', icon: Code2 },
                        { name: 'Server', icon: Server },
                        { name: 'Camera', icon: Camera },
                        { name: 'ShieldAlert', icon: ShieldAlert },
                        { name: 'Bot', icon: Bot },
                        { name: 'Cloud', icon: Cloud },
                        { name: 'Cpu', icon: Cpu },
                        { name: 'GraduationCap', icon: GraduationCap },
                      ].map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = srvIconName === item.name;
                        return (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => setSrvIconName(item.name)}
                            className={`p-2 rounded-xl flex items-center justify-center border transition-all ${
                              isSelected
                                ? 'bg-[#0056D2] text-white border-[#0056D2] shadow-xs'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                            title={item.name}
                          >
                            <IconComponent className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Commercial Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Starting Price / Investment
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. PKR 85,000 / Custom Quote"
                      value={srvPrice}
                      onChange={(e) => setSrvPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Turnaround / Delivery Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5 – 10 Business Days"
                      value={srvTurnaround}
                      onChange={(e) => setSrvTurnaround(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* 3. Descriptions */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    Short Summary (Homepage Card) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    placeholder="Brief 1-sentence value proposition..."
                    value={srvShortDesc}
                    onChange={(e) => setSrvShortDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                    Comprehensive Description (Detail Page)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="In-depth explanation of how this service is delivered, technical standards, SLA, and enterprise value..."
                    value={srvDesc}
                    onChange={(e) => setSrvDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden"
                  />
                </div>

                {/* 4. Features & Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Key Features (1 per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Core Switch & Router Configuration&#10;VLAN Segmentation & Trunking&#10;OSPF/BGP High Availability Routing"
                      value={srvFeatures}
                      onChange={(e) => setSrvFeatures(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                      Tangible Deliverables (1 per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Network Architecture Diagram (Visio/Draw.io)&#10;Standard Operating Procedures Document&#10;30-Day Post Deployment Warranty"
                      value={srvDeliverables}
                      onChange={(e) => setSrvDeliverables(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-[#0056D2] focus:outline-hidden font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* 5. Toggles */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={srvFeatured}
                      onChange={(e) => setSrvFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#0056D2] focus:ring-[#0056D2]"
                    />
                    <span className="font-bold text-slate-800">Pin to Featured Homepage Showcase</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-bold uppercase text-[10px]">Status:</span>
                    <select
                      value={srvStatus}
                      onChange={(e) => setSrvStatus(e.target.value as any)}
                      className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 font-bold"
                    >
                      <option value="ACTIVE">ACTIVE (Published)</option>
                      <option value="INACTIVE">INACTIVE (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Actions */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white font-bold shadow-xs transition-colors"
                  >
                    {editingServiceId ? 'Update Service' : 'Publish IT Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
