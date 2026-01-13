'use client';

import { useState, useEffect } from 'react';
import { MockAIService, VoiceCallLog } from '../../services/mockAi';

export default function VoiceAgentPage() {
    const [callLogs, setCallLogs] = useState<VoiceCallLog[]>([]);
    const [activeTab, setActiveTab] = useState<'logs' | 'calendar' | 'config'>('logs');

    useEffect(() => {
        MockAIService.getRecentCalls().then(res => {
            if (res.data) setCallLogs(res.data);
        });
    }, []);

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Voice Receptionist</h1>
                    <p style={{ color: '#666' }}>Manage your AI phone agent, view live calls, and check the appointment calendar.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></div>
                        <span style={{ fontWeight: 'bold', color: '#15803d' }}>Agent Active</span>
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('logs')}
                    style={{ padding: '1rem 2rem', border: 'none', background: 'none', borderBottom: activeTab === 'logs' ? '2px solid #3b82f6' : 'none', fontWeight: activeTab === 'logs' ? 'bold' : 'normal', cursor: 'pointer', color: activeTab === 'logs' ? '#3b82f6' : '#64748b' }}
                >
                    Live Call Logs
                </button>
                <button
                    onClick={() => setActiveTab('calendar')}
                    style={{ padding: '1rem 2rem', border: 'none', background: 'none', borderBottom: activeTab === 'calendar' ? '2px solid #3b82f6' : 'none', fontWeight: activeTab === 'calendar' ? 'bold' : 'normal', cursor: 'pointer', color: activeTab === 'calendar' ? '#3b82f6' : '#64748b' }}
                >
                    Appointment Calendar
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    style={{ padding: '1rem 2rem', border: 'none', background: 'none', borderBottom: activeTab === 'config' ? '2px solid #3b82f6' : 'none', fontWeight: activeTab === 'config' ? 'bold' : 'normal', cursor: 'pointer', color: activeTab === 'config' ? '#3b82f6' : '#64748b' }}
                >
                    Agent Configuration
                </button>
            </div>

            {/* Tab Content */}
            <div className="card">
                {activeTab === 'logs' && (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Time</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Caller</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Duration</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Intent</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Summary</th>
                                <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {callLogs.map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem', fontWeight: 'bold' }}>{log.timestamp}</td>
                                    <td style={{ padding: '1rem' }}>{log.callerName}</td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>{log.duration}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            background: '#eff6ff', color: '#1d4ed8', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 500
                                        }}>
                                            {log.intent}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#334155' }}>{log.summary}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            color: log.status === 'Booked' ? '#16a34a' : log.status === 'Resolved' ? '#64748b' : '#ca8a04',
                                            fontWeight: 'bold'
                                        }}>
                                            {log.status === 'Booked' ? '✅ Booked' : log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'calendar' && (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px', border: '2px dashed #e2e8f0' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                            <h3 style={{ color: '#64748b' }}>Calendar View</h3>
                            <p style={{ color: '#94a3b8' }}>Syncing with Google Calendar...</p>
                        </div>
                    </div>
                )}

                {activeTab === 'config' && (
                    <div style={{ maxWidth: '800px' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Agent Persona Name</label>
                            <input type="text" defaultValue="Jessica" className="input" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>Greeting Prompt</label>
                            <textarea defaultValue="Hi, thanks for calling Contractor AI. I'm Jessica, the virtual assistant. How can I help you today?" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '100px' }}></textarea>
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '0.5rem' }}>After Hours Behavior</label>
                            <select style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                <option>Take a message</option>
                                <option>Forward to emergency line</option>
                                <option>Schedule callback</option>
                            </select>
                        </div>
                        <button className="btn btn-primary">Save Configuration</button>
                    </div>
                )}
            </div>
        </div>
    );
}
