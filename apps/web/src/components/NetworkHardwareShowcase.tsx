'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Server,
  Cpu,
  Activity,
  Terminal,
  ShieldCheck,
  Zap,
  Radio,
  Layers,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Wifi,
  ExternalLink,
} from 'lucide-react';

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  badge: string;
  description: string;
  metric: string;
  metricLabel: string;
}

const SWITCH_HOTSPOTS: Hotspot[] = [
  {
    id: 'catalyst-switch',
    x: 64,
    y: 38,
    title: 'Cisco Catalyst 2960-X Switch',
    badge: 'Enterprise Layer 2/3',
    description: '24-Port Gigabit Ethernet with 802.3at PoE+, 80 Gbps FlexStack, hardware ASICs for wire-speed line rate switching.',
    metric: '48 Gbps',
    metricLabel: 'Backplane Capacity',
  },
  {
    id: 'asr-router',
    x: 32,
    y: 65,
    title: 'Cisco ASR 1001-X Core Router',
    badge: 'Enterprise Core Gateway',
    description: 'Hardware Flow Processor (ESP), line-rate BGP, OSPFv3 & IPsec encryption. Real physical routing tables for CCNA/CCNP.',
    metric: '2.5 - 20 Gbps',
    metricLabel: 'Forwarding Rate',
  },
  {
    id: 'patch-loom',
    x: 82,
    y: 46,
    title: 'Cat6 Structured Cabling Pod',
    badge: 'Hands-on Cabling',
    description: 'Organized high-density Cat6 patch cords. Students crimp, test, label and configure trunk ports hands-on in physical labs.',
    metric: '100% Copper',
    metricLabel: 'Zero Loss Tested',
  },
  {
    id: 'fiber-uplink',
    x: 48,
    y: 68,
    title: 'SFP+ 10G Optical Uplink',
    badge: 'Fiber Backbone',
    description: 'Dual SFP+ optical transceiver ports connecting campus distribution to enterprise ISP edge gateway.',
    metric: '< 0.15 ms',
    metricLabel: 'Ultra-low Latency',
  },
];

const RACK_HOTSPOTS: Hotspot[] = [
  {
    id: 'core-switches',
    x: 65,
    y: 44,
    title: 'High-Density Switch Array',
    badge: '48-Port PoE+ Density',
    description: 'Multi-tiered Cisco switches stacked in active-active redundancy with IEEE 802.1Q VLAN trunking and Spanning Tree Protocol (STP).',
    metric: '192 Ports',
    metricLabel: 'Total Lab Density',
  },
  {
    id: 'fiber-optics',
    x: 58,
    y: 62,
    title: 'Aqua OM4 Multimode Fiber Loom',
    badge: 'Fiber Infrastructure',
    description: 'Laser-optimized OM4 fiber optic jumpers terminating on high-density LC patch panels. Real data center physical layer.',
    metric: '40 Gbps',
    metricLabel: 'Trunk Aggregation',
  },
  {
    id: 'chassis-management',
    x: 62,
    y: 22,
    title: 'Modular Cisco ISR Gateway',
    badge: 'ISR Enterprise Edge',
    description: 'Modular enterprise gateway with redundant hot-swappable power supplies and dedicated out-of-band management console.',
    metric: '99.999%',
    metricLabel: 'Hardware Uptime',
  },
  {
    id: 'server-bay',
    x: 35,
    y: 60,
    title: 'Virtualization & EVE-NG Pod',
    badge: 'Bare-Metal Compute',
    description: 'High-performance compute nodes hosting virtualized EVE-NG & GNS3 topologies alongside physical hardware testbeds.',
    metric: '128 GB RAM',
    metricLabel: 'Topology Simulation',
  },
];

export function NetworkHardwareShowcase() {
  const [activeTab, setActiveTab] = useState<'bench' | 'rack' | 'cli'>('bench');
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(SWITCH_HOTSPOTS[0]);
  const [packetCount, setPacketCount] = useState(4829100);
  const [trafficRate, setTrafficRate] = useState(8.42);
  const [activeCliCommand, setActiveCliCommand] = useState<string>('show-ip-int');

  // Subtle live packet counter simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setPacketCount((prev) => prev + Math.floor(Math.random() * 320) + 180);
      setTrafficRate((prev) => {
        const delta = (Math.random() - 0.5) * 0.15;
        const next = Math.max(7.8, Math.min(9.6, prev + delta));
        return parseFloat(next.toFixed(2));
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const currentHotspots = activeTab === 'rack' ? RACK_HOTSPOTS : SWITCH_HOTSPOTS;

  // Change default hotspot when tab switches
  const handleTabChange = (tab: 'bench' | 'rack' | 'cli') => {
    setActiveTab(tab);
    if (tab === 'bench') {
      setSelectedHotspot(SWITCH_HOTSPOTS[0]);
    } else if (tab === 'rack') {
      setSelectedHotspot(RACK_HOTSPOTS[0]);
    } else {
      setSelectedHotspot(null);
    }
  };

  return (
    <div className="w-full relative select-none">
      {/* Outer Glow Halo */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-indigo-600/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

      {/* Main 3D Hardware Enclosure Box */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-slate-950/85 backdrop-blur-xl border border-cyan-500/30 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.15)] overflow-hidden">
        {/* Top Hardware Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-slate-900/90 border-b border-slate-800">
          {/* Status & Lab Rack Identifier */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-400">
                  RACK-POD-04 ONLINE
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/60">
                  REAL HARDWARE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Cisco 2960-X & ASR 1001-X Enterprise Topology
              </p>
            </div>
          </div>

          {/* Quick View Switcher Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleTabChange('bench')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                activeTab === 'bench'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>3D Switch & Router</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('rack')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                activeTab === 'rack'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>42U Data Rack</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('cli')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 text-xs ${
                activeTab === 'cli'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Cisco IOS CLI</span>
            </button>
          </div>
        </div>

        {/* ── VIEW 1 & 2: 3D PHOTOREALISTIC HARDWARE WITH INTERACTIVE HOTSPOTS ── */}
        {(activeTab === 'bench' || activeTab === 'rack') && (
          <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] w-full overflow-hidden bg-slate-950 group/stage">
            {/* 3D Hardware Image Asset */}
            <div className="relative w-full h-full transition-transform duration-700 ease-out group-hover/stage:scale-[1.02]">
              <Image
                src={
                  activeTab === 'bench'
                    ? '/images/hardware/cisco-switch-router-3d.jpg'
                    : '/images/hardware/cisco-rack-3d.jpg'
                }
                alt={
                  activeTab === 'bench'
                    ? '3D Cisco Catalyst Switch and Core Router Hardware'
                    : '3D Cisco Enterprise Data Center Server Rack'
                }
                fill
                priority
                className="object-cover object-center filter contrast-105"
              />

              {/* Realistic Cyber Grid & Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-slate-950/70 pointer-events-none" />
            </div>

            {/* Interactive Hardware Pins / Hotspots */}
            {currentHotspots.map((hotspot) => {
              const isSelected = selectedHotspot?.id === hotspot.id;
              return (
                <div
                  key={hotspot.id}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedHotspot(hotspot)}
                    className="relative group/pin focus:outline-hidden"
                    title={hotspot.title}
                  >
                    {/* Glowing Radar Waves */}
                    <span
                      className={`absolute -inset-2.5 rounded-full animate-ping opacity-60 ${
                        isSelected ? 'bg-cyan-400' : 'bg-blue-400'
                      }`}
                    />
                    <span
                      className={`absolute -inset-1 rounded-full blur-xs ${
                        isSelected ? 'bg-cyan-400 opacity-90' : 'bg-blue-500 opacity-60'
                      }`}
                    />

                    {/* Central Target Dot */}
                    <span
                      className={`relative flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all transform ${
                        isSelected
                          ? 'bg-cyan-500 border-white text-slate-950 scale-125 shadow-[0_0_15px_#06b6d4]'
                          : 'bg-slate-900/90 border-cyan-400 text-cyan-300 hover:scale-110 shadow-md'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                    </span>
                  </button>
                </div>
              );
            })}

            {/* Floating Top Floating Live Telemetry Pills */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <div className="bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-mono text-slate-300">Throughput:</span>
                <span className="text-xs font-mono font-bold text-cyan-300">{trafficRate} Gbps</span>
              </div>
              <div className="bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1 rounded-xl shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-300">
                  {packetCount.toLocaleString()} pkts/s
                </span>
              </div>
            </div>

            {/* Interactive Selected Component Detail Card (Bottom Float Overlay) */}
            {selectedHotspot && (
              <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 z-20">
                <div className="bg-slate-900/92 backdrop-blur-xl border border-cyan-500/40 rounded-xl p-3.5 sm:p-4 shadow-2xl text-left space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                          {selectedHotspot.title}
                        </span>
                        <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {selectedHotspot.badge}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-normal">
                        {selectedHotspot.description}
                      </p>
                    </div>

                    {/* Metric pill */}
                    <div className="shrink-0 text-right bg-slate-950/90 px-3 py-1.5 rounded-lg border border-slate-800">
                      <div className="text-xs sm:text-sm font-mono font-bold text-cyan-400">
                        {selectedHotspot.metric}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">
                        {selectedHotspot.metricLabel}
                      </div>
                    </div>
                  </div>

                  {/* Hotspot Switcher Helper */}
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Click any glowing target to inspect hardware specs</span>
                    </span>
                    <span className="text-cyan-400 font-mono">CCNA Physical Lab Gear</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── VIEW 3: INTERACTIVE CISCO IOS CLI CONSOLE ── */}
        {activeTab === 'cli' && (
          <div className="p-4 sm:p-6 bg-slate-950 font-mono text-left space-y-4 min-h-[360px] sm:min-h-[400px]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-400 font-mono ml-2 text-[11px]">
                  BITS-Console — ttyS0 (115200 8N1)
                </span>
              </div>
              <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Cisco IOS XE 17.6.3a
              </span>
            </div>

            {/* Quick CLI Command Buttons */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => setActiveCliCommand('show-ip-int')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                  activeCliCommand === 'show-ip-int'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                # show ip int brief
              </button>
              <button
                type="button"
                onClick={() => setActiveCliCommand('show-vlan')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                  activeCliCommand === 'show-vlan'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                # show vlan brief
              </button>
              <button
                type="button"
                onClick={() => setActiveCliCommand('ping')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                  activeCliCommand === 'ping'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                # ping 8.8.8.8
              </button>
              <button
                type="button"
                onClick={() => setActiveCliCommand('show-cdp')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                  activeCliCommand === 'show-cdp'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                # show cdp neighbors
              </button>
            </div>

            {/* CLI Output Screen */}
            <div className="bg-black/90 p-3 sm:p-4 rounded-xl border border-slate-800/90 text-[11px] sm:text-xs leading-relaxed space-y-2 text-slate-300 font-mono overflow-x-auto max-h-64 overflow-y-auto">
              <div className="text-emerald-400 font-bold">
                BITS-Core-Switch# {activeCliCommand === 'show-ip-int' && 'show ip interface brief'}
                {activeCliCommand === 'show-vlan' && 'show vlan brief'}
                {activeCliCommand === 'ping' && 'ping 8.8.8.8 source Gi0/1'}
                {activeCliCommand === 'show-cdp' && 'show cdp neighbors detail'}
              </div>

              {activeCliCommand === 'show-ip-int' && (
                <div className="space-y-1 text-slate-300">
                  <div className="text-slate-400">
                    Interface              IP-Address      OK? Method Status                Protocol
                  </div>
                  <div>GigabitEthernet0/1     192.168.10.1    YES NVRAM  <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></div>
                  <div>GigabitEthernet0/2     192.168.20.1    YES NVRAM  <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></div>
                  <div>GigabitEthernet0/3     unassigned      YES unset  down                  down</div>
                  <div>TenGigabitE1/0/1       10.0.100.1      YES NVRAM  <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up (10Gbps Fiber)</span></div>
                  <div>Vlan10 [Cyber-Lab]     172.16.10.254   YES NVRAM  <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></div>
                  <div>Vlan20 [Servers-DMZ]   172.16.20.254   YES NVRAM  <span className="text-emerald-400 font-bold">up</span>                    <span className="text-emerald-400 font-bold">up</span></div>
                </div>
              )}

              {activeCliCommand === 'show-vlan' && (
                <div className="space-y-1 text-slate-300">
                  <div className="text-slate-400">
                    VLAN Name                             Status    Ports
                  </div>
                  <div>---- -------------------------------- --------- -------------------------------</div>
                  <div>1    default                          active    Gi0/13-24</div>
                  <div>10   STUDENT_HARDWARE_LAB             <span className="text-emerald-400">active</span>    Gi0/1, Gi0/2, Gi0/3, Gi0/4</div>
                  <div>20   CYBER_SECURITY_RANGE             <span className="text-emerald-400">active</span>    Gi0/5, Gi0/6, Gi0/7, Gi0/8</div>
                  <div>99   MGMT_CORE_INFRASTRUCTURE         <span className="text-emerald-400">active</span>    Te1/0/1, Te1/0/2</div>
                </div>
              )}

              {activeCliCommand === 'ping' && (
                <div className="space-y-1 text-slate-300">
                  <div>Type escape sequence to abort.</div>
                  <div>Sending 5, 100-byte ICMP Echos to 8.8.8.8, timeout is 2 seconds:</div>
                  <div className="text-emerald-400 text-sm font-bold tracking-widest">
                    !!!!!
                  </div>
                  <div className="text-cyan-300">
                    Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms
                  </div>
                  <div className="text-slate-400 pt-1">
                    Route validated through BITS Enterprise Core Gateway (ASR 1001-X).
                  </div>
                </div>
              )}

              {activeCliCommand === 'show-cdp' && (
                <div className="space-y-1 text-slate-300">
                  <div>Device ID: BITS-ASR1001X-CORE</div>
                  <div>Entry address(es): IP address: 10.0.100.2</div>
                  <div>Platform: cisco ASR1001-X, Capabilities: Router Switch IGMP</div>
                  <div>Interface: TenGigabitEthernet1/0/1, Port ID (outgoing port): TenGigE0/0/0</div>
                  <div>Holdtime : 142 sec</div>
                  <div className="text-cyan-300">Hardware Link established • Full Duplex 10000Base-SR</div>
                </div>
              )}

              <div className="flex items-center gap-1 text-emerald-400 font-bold pt-2">
                <span>BITS-Core-Switch#</span>
                <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="text-slate-400">
                Students practice directly on raw Cisco IOS CLI via hardware console cables.
              </span>
              <span className="text-cyan-400 font-semibold">Zero Simulators • 100% Real Gear</span>
            </div>
          </div>
        )}

        {/* Bottom Hardware Spec Strip */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Active Ethernet Port Indicators (12 LEDs) */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Port Activity:
            </span>
            <div className="flex items-center gap-1">
              {[true, true, true, false, true, true, true, false, true, true, false, true].map((active, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-xs transition-colors duration-500 ${
                    active ? 'bg-emerald-400 shadow-[0_0_6px_#10b981]' : 'bg-slate-700'
                  }`}
                  style={{ animation: active ? `pulse ${1.5 + (i % 3) * 0.4}s infinite` : 'none' }}
                />
              ))}
            </div>
          </div>

          {/* Quick Action Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-xs font-semibold group"
            >
              <span>Explore CCNA & Cyber Hardware Modules</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
