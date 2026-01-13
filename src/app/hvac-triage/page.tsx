'use client';

import { useState } from 'react';
import { MockAIService, HvacDiagnosis } from '../../services/mockAi';

export default function HvacTriagePage() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [diagnosis, setDiagnosis] = useState<HvacDiagnosis | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setDiagnosis(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        const result = await MockAIService.diagnoseHvac(file);
        if (result.success && result.data) {
            setDiagnosis(result.data);
        }
        setIsAnalyzing(false);
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>HVAC Multimodal Triage</h1>
                <p style={{ color: '#666' }}>Upload video/audio of the failing unit for instant Gemini 1.5 Pro diagnostics.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Left Col: Upload */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
                        <span style={{ background: '#3b82f6', color: 'white', width: '24px', height: '24px', borderRadius: '50%', textAlign: 'center', fontSize: '0.9rem', lineHeight: '24px', marginRight: '10px' }}>1</span>
                        Upload Evidence
                    </h2>

                    <div
                        style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '3rem', textAlign: 'center', background: file ? '#f0f9ff' : 'transparent', borderColor: file ? '#3b82f6' : '#cbd5e1' }}
                    >
                        <input type="file" accept="video/*,audio/*" id="hvac-upload" onChange={handleFileChange} style={{ display: 'none' }} />
                        <label htmlFor="hvac-upload" style={{ cursor: 'pointer', display: 'block' }}>
                            {file ? (
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
                                    <p style={{ fontWeight: '500', color: '#0f172a' }}>{file.name}</p>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
                                    <p style={{ fontWeight: '500', color: '#0f172a' }}>Drag & drop or Click to Upload</p>
                                </div>
                            )}
                        </label>
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={!file || isAnalyzing}
                        onClick={handleAnalyze}
                        style={{ width: '100%', marginTop: '1.5rem' }}
                    >
                        {isAnalyzing ? 'Gemini is Diagnosis Model Running...' : 'Analyze with Gemini AI'}
                    </button>

                    {isAnalyzing && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <div style={{ background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', width: '100%', animation: 'progress 3s ease-in-out infinite', transformOrigin: 'left' }}></div>
                            </div>
                            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Analyzing audio waveforms...</p>
                            <style jsx>{` @keyframes progress { 0% { transform: scaleX(0); } 50% { transform: scaleX(0.7); } 100% { transform: scaleX(1); } } `}</style>
                        </div>
                    )}
                </div>

                {/* Right Col: Diagnosis */}
                <div style={{ opacity: diagnosis || isAnalyzing ? 1 : 0.5, transition: 'opacity 0.5s' }}>
                    <div className="card" style={{ height: '100%', borderTop: diagnosis ? '4px solid #10b981' : 'none' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>Diagnostic Report</span>
                            {diagnosis && (
                                <span className="badge" style={{ background: diagnosis.severity === 'Critical' ? '#dc2626' : '#f59e0b', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                    {diagnosis.severity}
                                </span>
                            )}
                        </h2>

                        {!diagnosis ? (
                            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                                Waiting for analysis data...
                            </div>
                        ) : (
                            <div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Identified Issue</label>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{diagnosis.issue}</div>
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                                        Confidence:
                                        <div style={{ flex: 1, height: "6px", background: "#e2e8f0", borderRadius: "3px", maxWidth: "100px" }}>
                                            <div style={{ width: `${diagnosis.confidence * 100}%`, background: "#10b981", height: "100%", borderRadius: "3px" }}></div>
                                        </div>
                                        {Math.round(diagnosis.confidence * 100)}%
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem', background: '#fff7ed', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #f97316' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#9a3412', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 'bold' }}>Recommended Action</label>
                                    <div style={{ color: '#c2410c' }}>{diagnosis.recommendedAction}</div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Inventory Check</label>
                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                        {diagnosis.partsRequired.map((part, i) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ marginRight: '10px', color: '#3b82f6' }}>⚙️</span>
                                                    {part.name}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.8rem', fontWeight: 'bold',
                                                    color: part.status === 'In Stock' ? '#16a34a' : '#dc2626',
                                                    background: part.status === 'In Stock' ? '#dcfce7' : '#fee2e2',
                                                    padding: '2px 8px', borderRadius: '4px'
                                                }}>
                                                    {part.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }}>Order Parts Now</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
