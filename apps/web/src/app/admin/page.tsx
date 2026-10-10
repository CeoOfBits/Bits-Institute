'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  DollarSign,
  Receipt,
  PhoneCall,
  Clock,
  Filter,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'courses'
    | 'batches'
    | 'students'
    | 'service-requests'
    | 'financials'
    | 'inquiries'
    | 'certificates'
    | 'services-catalog'
  >('overview');

  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [servicesCatalog, setServicesCatalog] = useState<any[]>([]);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Transfer Student Modal State
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferStudentId, setTransferStudentId] = useState('');
  const [fromBatchId, setFromBatchId] = useState('');
  const [toBatchId, setToBatchId] = useState('');
  const [transferReason, setTransferReason] = useState('Schedule shift to evening batch');

  // Service Request Details / Status Modal
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [newReqStatus, setNewReqStatus] = useState<string>('IN_PROGRESS');
  const [statusNote, setStatusNote] = useState<string>('');

  // Service Commercials & Quotation Modal
  const [commercialsModalOpen, setCommercialsModalOpen] = useState(false);
  const [commQuoted, setCommQuoted] = useState<number>(150000);
  const [commApproved, setCommApproved] = useState<number>(135000);
  const [commAssignedTo, setCommAssignedTo] = useState<string>('Engr. Ahmed Khan');
  const [commNotes, setCommNotes] = useState<string>('');

  // Payment Recording Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(50000);
  const [payMethod, setPayMethod] = useState<string>('BANK_TRANSFER');
  const [payType, setPayType] = useState<string>('ADVANCE');
  const [payRef, setPayRef] = useState<string>('FT-98214-MEEZAN');
  const [payNotes, setPayNotes] = useState<string>('Advance payment confirmed in account');

  // Expense Recording Modal
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [expTitle, setExpTitle] = useState<string>('Cloud Server & Staging Environment');
  const [expAmount, setExpAmount] = useState<number>(12000);
  const [expCategory, setExpCategory] = useState<string>('HOSTING');
  const [expRef, setExpRef] = useState<string>('REC-AWS-842');

  // Issue Certificate Modal
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [certStudentId, setCertStudentId] = useState('');
  const [certCourseId, setCertCourseId] = useState('');
  const [certGrade, setCertGrade] = useState('A+ (Distinction)');

  // Revoke Certificate Modal
  const [revokeCertId, setRevokeCertId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState('');

  // CMS Service Catalog Edit Modal
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

  useEffect(() => {
    loadAllData();
  }, []);

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('bits_access_token') || '' : '';
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const loadAllData = async () => {
    setLoading(true);
    const headers = getAuthHeaders();
    try {
      const [
        cRes,
        bRes,
        sRes,
        servRes,
        srRes,
        finRes,
        inqRes,
        certRes,
      ] = await Promise.all([
        fetch('http://localhost:4000/api/public/courses?pageSize=50'),
        fetch('http://localhost:4000/api/batches?pageSize=50', { headers }),
        fetch('http://localhost:4000/api/students?pageSize=50', { headers }),
        fetch('http://localhost:4000/api/public/services'),
        fetch('http://localhost:4000/api/admin/services/requests?pageSize=50', { headers }),
        fetch('http://localhost:4000/api/admin/services/financial-summary', { headers }),
        fetch('http://localhost:4000/api/admin/inquiries', { headers }),
        fetch('http://localhost:4000/api/certificates?pageSize=50', { headers }),
      ]);

      if (cRes.ok) {
        const c = await cRes.json();
        setCourses(c.items || []);
        if (c.items?.[0]) setCertCourseId(c.items[0].id);
      }
      if (bRes.ok) {
        const b = await bRes.json();
        setBatches(b.items || []);
      }
      if (sRes.ok) {
        const s = await sRes.json();
        setStudents(s.items || []);
        if (s.items?.[0]) setCertStudentId(s.items[0].id);
      }
      if (servRes.ok) {
        const serv = await servRes.json();
        setServicesCatalog(serv || []);
      }
      if (srRes.ok) {
        const sr = await srRes.json();
        setServiceRequests(sr.items || []);
      }
      if (finRes.ok) {
        const fin = await finRes.json();
        setFinancialSummary(fin);
      }
      if (inqRes.ok) {
        const inq = await inqRes.json();
        setInquiries(inq || []);
      }
      if (certRes.ok) {
        const cert = await certRes.json();
        setCertificates(cert.items || []);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // ── Batch Transfer ──
  const handleTransferBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/enrollments/transfer-batch', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          studentId: transferStudentId,
          fromBatchId,
          toBatchId,
          reason: transferReason,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification('Student transferred successfully with non-destructive history preserved!');
        setTransferModalOpen(false);
        loadAllData();
      } else {
        alert(data.message || 'Transfer failed');
      }
    } catch (err) {
      alert('Error during batch transfer');
    }
  };

  // ── IT Service Request Status Update ──
  const handleUpdateReqStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/services/requests/${selectedRequest.id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status: newReqStatus,
          notes: statusNote || undefined,
        }),
      });
      if (res.ok) {
        showNotification(`Project status updated to ${newReqStatus}!`);
        setSelectedRequest(null);
        loadAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to update status');
      }
    } catch (err) {
      alert('Error updating request status');
    }
  };

  // ── IT Service Commercials & Quotation ──
  const handleUpdateCommercials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/services/requests/${selectedRequest.id}/quotation`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          quotedAmountMinor: Math.round(commQuoted * 100),
          approvedAmountMinor: Math.round(commApproved * 100),
          assignedTo: commAssignedTo,
          internalNotes: commNotes || undefined,
        }),
      });
      if (res.ok) {
        showNotification('Project commercials & assigned engineer updated!');
        setCommercialsModalOpen(false);
        loadAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to update commercials');
      }
    } catch (err) {
      alert('Error updating commercials');
    }
  };

  // ── Record Payment ──
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/services/requests/${selectedRequest.id}/payments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          amountMinor: Math.round(payAmount * 100),
          method: payMethod,
          type: payType,
          reference: payRef,
          notes: payNotes,
        }),
      });
      if (res.ok) {
        showNotification(`Payment of PKR ${payAmount.toLocaleString()} recorded and ledger updated!`);
        setPaymentModalOpen(false);
        loadAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to record payment');
      }
    } catch (err) {
      alert('Error recording payment');
    }
  };

  // ── Record Project Expense ──
  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/services/requests/${selectedRequest.id}/expenses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: expTitle,
          amountMinor: Math.round(expAmount * 100),
          category: expCategory,
          receiptRef: expRef,
        }),
      });
      if (res.ok) {
        showNotification(`Project expense of PKR ${expAmount.toLocaleString()} recorded!`);
        setExpenseModalOpen(false);
        loadAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to record expense');
      }
    } catch (err) {
      alert('Error recording expense');
    }
  };

  // ── Inquiry Status Update & Deletion ──
  const handleUpdateInquiryStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showNotification(`Inquiry lead status updated to ${status}!`);
        loadAllData();
      }
    } catch (err) {}
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/inquiries/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showNotification('Inquiry record deleted.');
        loadAllData();
      }
    } catch (err) {}
  };

  // ── Certificate Issue & Revoke ──
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/certificates', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          studentId: certStudentId,
          courseId: certCourseId,
          grade: certGrade,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showNotification(`Certificate issued successfully with Code: ${data.code}!`);
        setCertModalOpen(false);
        loadAllData();
      } else {
        alert(data.message || 'Failed to issue certificate');
      }
    } catch (err) {
      alert('Error issuing certificate');
    }
  };

  const handleRevokeCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeCertId) return;
    try {
      const res = await fetch(`http://localhost:4000/api/certificates/${revokeCertId}/revoke`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason: revokeReason || 'Administrative revocation' }),
      });
      if (res.ok) {
        showNotification('Certificate successfully revoked.');
        setRevokeCertId(null);
        setRevokeReason('');
        loadAllData();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to revoke certificate');
      }
    } catch (err) {
      alert('Error revoking certificate');
    }
  };

  // ── Services Catalog CRUD ──
  const handleSaveCatalogService = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: srvTitle,
      slug: srvSlug || srvTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: srvCategory,
      iconName: srvIconName,
      shortDescription: srvShortDesc,
      description: srvDesc,
      features: srvFeatures.split('\n').filter((f) => f.trim().length > 0),
      deliverables: srvDeliverables.split('\n').filter((d) => d.trim().length > 0),
      pricingStartingAt: srvPrice,
      turnaroundTime: srvTurnaround,
      featured: srvFeatured,
      status: srvStatus,
    };

    try {
      const method = editingServiceId ? 'PATCH' : 'POST';
      const url = editingServiceId
        ? `http://localhost:4000/api/admin/services/${editingServiceId}`
        : 'http://localhost:4000/api/admin/services';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showNotification('IT Service offering saved successfully!');
        setServiceModalOpen(false);
        loadAllData();
      } else {
        alert('Failed to save service');
      }
    } catch (err) {
      alert('Error saving service');
    }
  };

  const handleDeleteCatalogService = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service offering?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showNotification('Service offering deleted.');
        loadAllData();
      }
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.removeItem('bits_access_token');
    localStorage.removeItem('bits_refresh_token');
    localStorage.removeItem('bits_user');
    router.push('/login');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0056D2] text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0056D2]" />
                  <span>INSTITUTE HEADQUARTERS</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">LMS & ENTERPRISE HUB</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Admin Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Live oversight of students, course deliveries, batch rosters, IT service projects, verified credentials, and ledger financials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 shadow-2xs transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#0056D2]' : ''}`} />
                <span>Sync Data</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {actionSuccess && (
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-slate-100 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'overview' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Executive Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'students' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Students ({students.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'batches' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Batches ({batches.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'courses' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Courses ({courses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('service-requests')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'service-requests' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>IT Service Requests ({serviceRequests.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('financials')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'financials' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Project Financials & Ledger</span>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'inquiries' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Admissions & Inquiries ({inquiries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'certificates' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificates ({certificates.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('services-catalog')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'services-catalog' ? 'bg-[#0056D2] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Public Service Offerings ({servicesCatalog.length})</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: EXECUTIVE OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Enrolled Cadets</span>
                  <Users className="w-5 h-5 text-[#0056D2]" />
                </div>
                <div className="text-3xl font-black text-slate-900">{students.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Registered in institute database</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Active Batches</span>
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{batches.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Across networking, cyber & AI tracks</div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">IT Client Projects</span>
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-slate-900">{serviceRequests.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {serviceRequests.filter((r) => ['APPROVED', 'IN_PROGRESS'].includes(r.status)).length} currently active in progress
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Net Project Revenue</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-emerald-600">
                  PKR {(((financialSummary?.totalPaymentsReceivedMinor || 0)) / 100).toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Outstanding: PKR {(((financialSummary?.outstandingBalancesMinor || 0)) / 100).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Quick overview rows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent IT Service Requests */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Recent Service Project Inquiries</h3>
                  <button onClick={() => setActiveTab('service-requests')} className="text-xs text-[#0056D2] font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {serviceRequests.slice(0, 4).map((r: any) => (
                    <div key={r.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-mono text-[#0056D2] font-bold text-[11px]">{r.ticketNumber}</div>
                        <div className="font-bold text-slate-900">{r.title}</div>
                        <div className="text-slate-500 text-[11px]">{r.clientName} ({r.category})</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-100 text-[#0056D2]">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admissions Inquiries */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Recent Admissions Leads</h3>
                  <button onClick={() => setActiveTab('inquiries')} className="text-xs text-[#0056D2] font-bold hover:underline">
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {inquiries.slice(0, 4).map((inq: any) => (
                    <div key={inq.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900">{inq.name}</div>
                        <div className="text-slate-500 text-[11px]">{inq.email} • {inq.phone || 'No phone'}</div>
                        <div className="text-slate-600 text-[11px] italic">"{inq.message?.slice(0, 50)}..."</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800">
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: STUDENTS MANAGEMENT ── */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student Profiles & Enrollment Lifecycle</h2>
                <p className="text-xs text-slate-500">Live roster of enrolled students, registration numbers, and batch transfers.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">Registration ID</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Enrolled Course & Batch</th>
                    <th className="p-3.5">XP & Level</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {students.map((st: any) => {
                    const activeEnrollment = st.courseEnrollments?.[0];
                    const activeBatch = st.batchEnrollments?.[0]?.batch;
                    return (
                      <tr key={st.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-mono font-bold text-[#0056D2]">{st.registrationNo}</td>
                        <td className="p-3.5 font-bold text-slate-900">{st.user?.firstName} {st.user?.lastName}</td>
                        <td className="p-3.5 text-slate-500">{st.user?.email}</td>
                        <td className="p-3.5">
                          {activeEnrollment ? (
                            <div>
                              <div className="font-semibold text-slate-900">{activeEnrollment.course?.title}</div>
                              <div className="text-[11px] text-slate-400">{activeBatch?.name || 'No assigned batch'}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400">Not enrolled</span>
                          )}
                        </td>
                        <td className="p-3.5 font-semibold text-slate-800">
                          {st.xp || 0} XP • Lvl {st.level || 1}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setTransferStudentId(st.id);
                              if (activeBatch) setFromBatchId(activeBatch.id);
                              setTransferModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#0056D2] hover:bg-[#0056D2] hover:text-white font-bold text-[11px] transition-all inline-flex items-center gap-1"
                          >
                            <ArrowRightLeft className="w-3 h-3" />
                            <span>Transfer Batch</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: BATCHES MANAGEMENT ── */}
        {activeTab === 'batches' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Academic Batches & Capacities</h2>
                <p className="text-xs text-slate-500">Track batch enrollment limits, delivery modes, and schedules.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">Batch Code & Name</th>
                    <th className="p-3.5">Course</th>
                    <th className="p-3.5">Mode & Shift</th>
                    <th className="p-3.5">Enrolled / Capacity</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Start Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {batches.map((b: any) => (
                    <tr key={b.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{b.name}</div>
                        <div className="font-mono text-[11px] text-[#0056D2]">Code: {b.code}</div>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{b.course?.title}</td>
                      <td className="p-3.5">
                        <div>{b.mode}</div>
                        <div className="text-[11px] text-slate-400">{b.scheduleNote}</div>
                      </td>
                      <td className="p-3.5 font-bold">
                        <span className="text-[#0056D2]">{b.enrollments?.length || 0}</span> / {b.capacity} Seats
                      </td>
                      <td className="p-3.5">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-[#0056D2] border border-blue-200">
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{new Date(b.startDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 4: COURSES CATALOG ── */}
        {activeTab === 'courses' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Permanent Educational Course Products</h2>
              <p className="text-xs text-slate-500">Official technical curriculum, modules, pricing and learning outcomes.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">Course Title</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Duration</th>
                    <th className="p-3.5">Fee (PKR)</th>
                    <th className="p-3.5">Level</th>
                    <th className="p-3.5 text-right">Public Page</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {courses.map((c: any) => (
                    <tr key={c.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="font-mono text-[11px] text-slate-400">/{c.slug}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">{c.category?.name || 'Technical'}</td>
                      <td className="p-3.5 text-slate-600">{c.durationLabel}</td>
                      <td className="p-3.5 font-bold text-[#0056D2]">
                        PKR {(c.priceMinor / 100).toLocaleString()}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {c.level}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/courses/${c.slug}`}
                          target="_blank"
                          className="text-[#0056D2] hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <span>View Public</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 5: IT SERVICE REQUESTS & PIPELINE ── */}
        {activeTab === 'service-requests' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">IT Enterprise Client Service Requests</h2>
                <p className="text-xs text-slate-500">Manage client proposals, status lifecycle, commercial quotes, and deliverables.</p>
              </div>
            </div>

            {serviceRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs space-y-2">
                <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
                <p>No service project requests submitted yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3.5">Ticket & Client</th>
                      <th className="p-3.5">Service Category & Title</th>
                      <th className="p-3.5">Quoted / Approved (PKR)</th>
                      <th className="p-3.5">Total Paid / Balance</th>
                      <th className="p-3.5">Current Status</th>
                      <th className="p-3.5 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {serviceRequests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-[#0056D2]">{req.ticketNumber}</div>
                          <div className="font-bold text-slate-900">{req.clientName}</div>
                          <div className="text-slate-400 text-[11px]">{req.clientPhone} • {req.clientEmail}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900">{req.title}</div>
                          <div className="text-[11px] text-slate-500">{req.category}</div>
                          {req.assignedTo && (
                            <div className="text-[10px] text-emerald-700 font-bold">Assigned: {req.assignedTo}</div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div>Quoted: <strong>PKR {((req.financials?.quotedAmountMinor || 0) / 100).toLocaleString()}</strong></div>
                          <div className="text-[#0056D2]">Approved: <strong>PKR {((req.financials?.approvedAmountMinor || 0) / 100).toLocaleString()}</strong></div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-emerald-700 font-bold">Paid: PKR {((req.financials?.totalPaidMinor || 0) / 100).toLocaleString()}</div>
                          <div className="text-rose-600 font-bold">Balance: PKR {((req.financials?.outstandingBalanceMinor || 0) / 100).toLocaleString()}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-50 text-[#0056D2] border border-blue-200">
                            {req.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setNewReqStatus(req.status);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px]"
                          >
                            Status
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setCommQuoted((req.quotedAmountMinor || 0) / 100);
                              setCommApproved((req.approvedAmountMinor || 0) / 100);
                              setCommAssignedTo(req.assignedTo || '');
                              setCommNotes(req.internalNotes || '');
                              setCommercialsModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-[#0056D2] text-[#0056D2] hover:text-white font-bold text-[11px]"
                          >
                            Commercials
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setPayAmount(Math.round(((req.financials?.outstandingBalanceMinor || 0) / 100) || 25000));
                              setPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-[11px]"
                          >
                            + Pay
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: PROJECT FINANCIALS & LEDGER ── */}
        {activeTab === 'financials' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Service Project Financial Tracking & Ledger</h2>
              <p className="text-xs text-slate-500">Calculated revenue, recognized payments, direct project expenses, and net margins.</p>
            </div>

            {/* Financial Ledger Big Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Approved Contracts</span>
                <div className="text-2xl font-black text-slate-900">
                  PKR {(((financialSummary?.totalApprovedRevenueMinor || 0)) / 100).toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Agreed customer commercial volume</span>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-700">Confirmed Payments Received</span>
                <div className="text-2xl font-black text-emerald-700">
                  PKR {(((financialSummary?.totalPaymentsReceivedMinor || 0)) / 100).toLocaleString()}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">Recorded via verified banking & cash</span>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-700">Direct Project Expenses</span>
                <div className="text-2xl font-black text-rose-700">
                  PKR {(((financialSummary?.totalExpensesMinor || 0)) / 100).toLocaleString()}
                </div>
                <span className="text-[11px] text-rose-600 font-medium">Hardware, licenses, hosting & infrastructure</span>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#0056D2]">Outstanding Balance To Collect</span>
                <div className="text-2xl font-black text-[#0056D2]">
                  PKR {(((financialSummary?.outstandingBalancesMinor || 0)) / 100).toLocaleString()}
                </div>
                <span className="text-[11px] text-blue-700 font-medium">Approved contracts minus received payments</span>
              </div>
            </div>

            {/* Projects Financial Breakdown */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Project-By-Project Financial Breakdown</h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                    <tr>
                      <th className="p-3.5">Project Ticket & Client</th>
                      <th className="p-3.5">Contract Fee (PKR)</th>
                      <th className="p-3.5">Received Payments (PKR)</th>
                      <th className="p-3.5">Recorded Expenses (PKR)</th>
                      <th className="p-3.5">Outstanding Balance</th>
                      <th className="p-3.5">Project Net Profit</th>
                      <th className="p-3.5 text-right">Ledger Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {serviceRequests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-slate-50/70">
                        <td className="p-3.5 font-medium">
                          <div className="font-bold text-slate-900">{req.title}</div>
                          <div className="text-[11px] text-[#0056D2] font-mono">{req.ticketNumber} • {req.clientName}</div>
                        </td>
                        <td className="p-3.5 font-bold">
                          PKR {((req.financials?.approvedAmountMinor || 0) / 100).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-bold text-emerald-700">
                          PKR {((req.financials?.totalPaidMinor || 0) / 100).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-bold text-rose-600">
                          PKR {((req.financials?.totalExpensesMinor || 0) / 100).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-bold text-amber-700">
                          PKR {((req.financials?.outstandingBalanceMinor || 0) / 100).toLocaleString()}
                        </td>
                        <td className="p-3.5 font-black text-slate-900">
                          PKR {((req.financials?.netProfitMinor || 0) / 100).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right space-x-1">
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-bold text-[11px]"
                          >
                            + Payment
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              setExpenseModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white font-bold text-[11px]"
                          >
                            + Expense
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 7: ADMISSIONS & INQUIRIES ── */}
        {activeTab === 'inquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Admissions & Contact Inquiry Leads</h2>
              <p className="text-xs text-slate-500">Captured inquiries from the public website contact and course consultation forms.</p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">Inquirer Name & Contact</th>
                    <th className="p-3.5">Type & Subject</th>
                    <th className="p-3.5">Message / Requirements</th>
                    <th className="p-3.5">Lead Status</th>
                    <th className="p-3.5">Received Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {inquiries.map((inq: any) => (
                    <tr key={inq.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{inq.name}</div>
                        <div className="text-slate-500 text-[11px]">{inq.email}</div>
                        <div className="text-slate-500 text-[11px]">{inq.phone || 'No phone provided'}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-[#0056D2] border border-blue-200">
                          {inq.type}
                        </span>
                        <div className="text-slate-700 font-semibold mt-1">{inq.subject || 'General Inquiry'}</div>
                      </td>
                      <td className="p-3.5 max-w-sm">
                        <p className="text-slate-600 line-clamp-2">{inq.message}</p>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-800 font-bold text-[11px]"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-slate-500">{new Date(inq.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 8: CERTIFICATES & CREDENTIALS ── */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Certificate Generation & Credential Registry</h2>
                <p className="text-xs text-slate-500">Cryptographically verifiable certificates issued by BITS Institute.</p>
              </div>
              <button
                onClick={() => setCertModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <Award className="w-4 h-4" />
                <span>Issue New Certificate</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase text-slate-500">
                  <tr>
                    <th className="p-3.5">Certificate Code</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">Course Program</th>
                    <th className="p-3.5">Grade</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Issued Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {certificates.map((cert: any) => (
                    <tr key={cert.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-mono font-bold text-[#0056D2]">{cert.code}</td>
                      <td className="p-3.5 font-bold text-slate-900">
                        {cert.student?.user?.firstName} {cert.student?.user?.lastName}
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{cert.course?.title}</td>
                      <td className="p-3.5 font-bold text-emerald-700">{cert.grade || 'Certified'}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                            cert.status === 'VALID'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {cert.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <Link
                          href={`/verify?code=${encodeURIComponent(cert.code)}`}
                          target="_blank"
                          className="text-[#0056D2] hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                        >
                          <span>Public Verification</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                        {cert.status === 'VALID' && (
                          <button
                            onClick={() => {
                              setRevokeCertId(cert.id);
                              setRevokeReason('Administrative revocation');
                            }}
                            className="text-rose-600 hover:text-rose-800 font-bold text-[11px]"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 9: PUBLIC SERVICES CATALOG ── */}
        {activeTab === 'services-catalog' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Public Website IT Service Offerings</h2>
                <p className="text-xs text-slate-500">Manage client-facing services presented on the official institute portal.</p>
              </div>
              <button
                onClick={() => {
                  setEditingServiceId(null);
                  setSrvTitle('');
                  setSrvSlug('');
                  setSrvCategory('Networking & Infrastructure');
                  setSrvShortDesc('');
                  setSrvDesc('');
                  setSrvFeatures('');
                  setSrvDeliverables('');
                  setSrvPrice('PKR 85,000');
                  setSrvTurnaround('3 – 7 Days');
                  setSrvFeatured(false);
                  setSrvStatus('ACTIVE');
                  setServiceModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#0056D2] hover:bg-[#0041a8] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service Offering</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicesCatalog.map((s: any) => (
                <div key={s.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#0056D2]">{s.category}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{s.title}</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {s.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{s.shortDescription}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-200/80 text-xs">
                    <span className="font-bold text-[#0056D2]">{s.pricingStartingAt}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingServiceId(s.id);
                          setSrvTitle(s.title);
                          setSrvSlug(s.slug);
                          setSrvCategory(s.category);
                          setSrvShortDesc(s.shortDescription);
                          setSrvDesc(s.description);
                          setSrvFeatures(Array.isArray(s.features) ? s.features.join('\n') : '');
                          setSrvDeliverables(Array.isArray(s.deliverables) ? s.deliverables.join('\n') : '');
                          setSrvPrice(s.pricingStartingAt);
                          setSrvTurnaround(s.turnaroundTime);
                          setSrvFeatured(Boolean(s.featured));
                          setSrvStatus(s.status);
                          setServiceModalOpen(true);
                        }}
                        className="text-slate-600 hover:text-[#0056D2] font-bold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCatalogService(s.id)}
                        className="text-slate-400 hover:text-rose-600 font-bold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODALS ── */}

        {/* 1. Batch Transfer Modal */}
        {transferModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Transfer Student Batch</h3>
                <button onClick={() => setTransferModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleTransferBatch} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Destination Batch</label>
                  <select
                    value={toBatchId}
                    onChange={(e) => setToBatchId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="">Select target batch...</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.course?.title})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Transfer Reason</label>
                  <input
                    type="text"
                    value={transferReason}
                    onChange={(e) => setTransferReason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-[#0056D2] text-white rounded-xl text-xs font-bold">
                    Confirm Transfer
                  </button>
                  <button type="button" onClick={() => setTransferModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2. IT Service Request Status Modal */}
        {selectedRequest && !commercialsModalOpen && !paymentModalOpen && !expenseModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Update Project Status</h3>
                  <p className="text-xs text-slate-500">{selectedRequest.ticketNumber} • {selectedRequest.title}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleUpdateReqStatus} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Lifecycle Status</label>
                  <select
                    value={newReqStatus}
                    onChange={(e) => setNewReqStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="NEW">NEW</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="QUOTATION_SENT">QUOTATION_SENT</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="ON_HOLD">ON_HOLD</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Internal Audit Note</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Scope finalized and handed over to technical lead"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-[#0056D2] text-white rounded-xl text-xs font-bold">
                    Update Status
                  </button>
                  <button type="button" onClick={() => setSelectedRequest(null)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. Service Commercials & Quotation Modal */}
        {commercialsModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Project Commercials</h3>
                  <p className="text-xs text-slate-500">{selectedRequest.ticketNumber}</p>
                </div>
                <button onClick={() => setCommercialsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleUpdateCommercials} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Quoted Amount (PKR)</label>
                    <input
                      type="number"
                      value={commQuoted}
                      onChange={(e) => setCommQuoted(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Approved Fee (PKR)</label>
                    <input
                      type="number"
                      value={commApproved}
                      onChange={(e) => setCommApproved(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Assigned Engineer / Lead</label>
                  <input
                    type="text"
                    value={commAssignedTo}
                    onChange={(e) => setCommAssignedTo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Internal Project Notes</label>
                  <textarea
                    rows={3}
                    value={commNotes}
                    onChange={(e) => setCommNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-[#0056D2] text-white rounded-xl text-xs font-bold">
                    Save Commercials
                  </button>
                  <button type="button" onClick={() => setCommercialsModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 4. Payment Recording Modal */}
        {paymentModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Project Payment</h3>
                  <p className="text-xs text-slate-500">{selectedRequest.ticketNumber} • {selectedRequest.clientName}</p>
                </div>
                <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Amount (PKR)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={payAmount}
                      onChange={(e) => setPayAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Payment Type</label>
                    <select
                      value={payType}
                      onChange={(e) => setPayType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      <option value="ADVANCE">Advance (50%)</option>
                      <option value="MILESTONE">Milestone</option>
                      <option value="FINAL">Final Settlement</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Payment Method</label>
                    <select
                      value={payMethod}
                      onChange={(e) => setPayMethod(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      <option value="BANK_TRANSFER">Bank Transfer (IBFT)</option>
                      <option value="JAZZCASH">JazzCash</option>
                      <option value="EASYPAISA">EasyPaisa</option>
                      <option value="CASH">Cash at Desk</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Reference / TID</label>
                    <input
                      type="text"
                      value={payRef}
                      onChange={(e) => setPayRef(e.target.value)}
                      placeholder="e.g. FT-28491-HBL"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Notes</label>
                  <input
                    type="text"
                    value={payNotes}
                    onChange={(e) => setPayNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                    Confirm & Record Payment
                  </button>
                  <button type="button" onClick={() => setPaymentModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 5. Expense Recording Modal */}
        {expenseModalOpen && selectedRequest && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Record Project Expense</h3>
                  <p className="text-xs text-slate-500">{selectedRequest.ticketNumber}</p>
                </div>
                <button onClick={() => setExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleRecordExpense} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Expense Title</label>
                  <input
                    type="text"
                    required
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Cost (PKR)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={expAmount}
                      onChange={(e) => setExpAmount(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Category</label>
                    <select
                      value={expCategory}
                      onChange={(e) => setExpCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    >
                      <option value="HARDWARE">Hardware / Equipment</option>
                      <option value="HOSTING">Cloud Hosting / VPS</option>
                      <option value="DOMAIN">Domain & DNS</option>
                      <option value="SOFTWARE_LICENSE">Software License</option>
                      <option value="LABOR">Engineering Labor</option>
                      <option value="MISC">Miscellaneous</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Receipt Reference</label>
                  <input
                    type="text"
                    value={expRef}
                    onChange={(e) => setExpRef(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold">
                    Record Expense
                  </button>
                  <button type="button" onClick={() => setExpenseModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 6. Issue Certificate Modal */}
        {certModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Issue Verifiable Certificate</h3>
                <button onClick={() => setCertModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleIssueCertificate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Student</label>
                  <select
                    value={certStudentId}
                    onChange={(e) => setCertStudentId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    {students.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.registrationNo} — {st.user?.firstName} {st.user?.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Course Program</label>
                  <select
                    value={certCourseId}
                    onChange={(e) => setCertCourseId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Academic Grade</label>
                  <input
                    type="text"
                    value={certGrade}
                    onChange={(e) => setCertGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-[#0056D2] text-white rounded-xl text-xs font-bold">
                    Issue Certificate
                  </button>
                  <button type="button" onClick={() => setCertModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 7. Revoke Certificate Modal */}
        {revokeCertId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-slate-200 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-rose-600">Revoke Credential</h3>
                <button onClick={() => setRevokeCertId(null)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleRevokeCertificate} className="space-y-4">
                <p className="text-xs text-slate-600">
                  Are you sure you want to revoke this certificate? The public verification page will permanently display this credential as Revoked.
                </p>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Revocation Reason</label>
                  <input
                    type="text"
                    required
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    placeholder="e.g. Incomplete lab requirement or academic violation"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold">
                    Confirm Revocation
                  </button>
                  <button type="button" onClick={() => setRevokeCertId(null)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 8. CMS Services Catalog Modal */}
        {serviceModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {editingServiceId ? 'Edit IT Service Offering' : 'Publish New IT Service Offering'}
                </h3>
                <button onClick={() => setServiceModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <form onSubmit={handleSaveCatalogService} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Service Title</label>
                    <input
                      type="text"
                      required
                      value={srvTitle}
                      onChange={(e) => setSrvTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Category</label>
                    <input
                      type="text"
                      required
                      value={srvCategory}
                      onChange={(e) => setSrvCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-700">Short Summary</label>
                  <textarea
                    rows={2}
                    value={srvShortDesc}
                    onChange={(e) => setSrvShortDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Pricing Starting At</label>
                    <input
                      type="text"
                      value={srvPrice}
                      onChange={(e) => setSrvPrice(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-slate-700">Turnaround Time</label>
                    <input
                      type="text"
                      value={srvTurnaround}
                      onChange={(e) => setSrvTurnaround(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 py-2.5 bg-[#0056D2] text-white rounded-xl text-xs font-bold">
                    Save Service Offering
                  </button>
                  <button type="button" onClick={() => setServiceModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold">
                    Cancel
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
