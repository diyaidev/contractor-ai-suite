'use client';

import { useState } from 'react';
import { MockAIService, LegalCaseAnalysis } from '../../services/mockAi';

export default function LegalIntakePage() {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<LegalCaseAnalysis | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setAnalysis(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsAnalyzing(true);
        const result = await MockAIService.analyzeLegalDoc(file);
        if (result.success && result.data) {
            setAnalysis(result.data);
        }
        setIsAnalyzing(false);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>AI Legal Intake</h1>
                <p style={{ color: '#666' }}>Upload case files (PDF, DOCX) for instant viability scoring and fact extraction.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '3rem' }}>

                {/* Left: Upload */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Case Documents</h2>
                    <div
                        style={{
                            border: '2px dashed #cbd5e1',
                            borderRadius: '12px',
                            padding: '3rem',
                            textAlign: 'center',
                            background: file ? '#f8fafc' : 'transparent'
                        }}
                    >
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            id="legal-upload"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="legal-upload" style={{ cursor: 'pointer', display: 'block' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚖️</div>
                            {file ? (
                                <p style={{ fontWeight: 'bold' }}>{file.name}</p>
                            ) : (
                                <p>Drag & drop case files here</p>
                            )}
                        </label>
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={!file || isAnalyzing}
                        onClick={handleAnalyze}
                        style={{ width: '100%', marginTop: '1.5rem' }}
                    >
                        {isAnalyzing ? 'Analyzing Case Law...' : 'Process Case File'}
                    </button>
                </div>

                {/* Right: Analysis */}
                <div>
                    {!analysis && !isAnalyzing && (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '12px' }}>
                            Waiting for document...
                        </div>
                    )}

                    {isAnalyzing && (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <div className="spinner" style={{ marginBottom: '1rem' }}></div>
                            <p>Cross-referencing statutes...</p>
                            <p>Extracting key dates...</p>
                            <style jsx>{`
                                .spinner {
                                    width: 40px; height: 40px;
                                    border: 3px solid #e2e8f0; border-top-color: #3b82f6;
                                    border-radius: 50%; animation: spin 1s linear infinite;
                                }
                                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                            `}</style>
                        </div>
                    )}

                    {analysis && (
                        <div className="card" style={{ borderTop: `4px solid ${getScoreColor(analysis.viabilityScore)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>Viability Score</span>
                                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: getScoreColor(analysis.viabilityScore), lineHeight: '1' }}>
                                        {analysis.viabilityScore}/100
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>Statute Check</span>
                                    <div style={{ fontWeight: 'bold', color: analysis.statuteCheck === 'Pass' ? '#166534' : '#991b1b' }}>
                                        {analysis.statuteCheck === 'Pass' ? '✅ Within Limits' : '⚠️ Potential Issue'}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Case Summary</h3>
                                <p style={{ lineHeight: '1.6', color: '#334155' }}>{analysis.summary}</p>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Key Facts Extracted</h3>
                                <ul style={{ paddingLeft: '1.2rem' }}>
                                    {analysis.keyFacts.map((fact, i) => (
                                        <li key={i} style={{ marginBottom: '0.5rem', color: '#475569' }}>{fact}</li>
                                    ))}
                                </ul>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.5rem' }}>Recommended Next Step</h4>
                                <div style={{ fontSize: '1.1rem', fontWeight: '500', color: '#0f172a' }}>
                                    {analysis.recommendedNextStep}
                                </div>
                                <button className="btn btn-outline" style={{ marginTop: '1rem', background: 'white' }}>
                                    Execute Action
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    function getScoreColor(score: number) {
        if (score >= 80) return '#16a34a';
        if (score >= 50) return '#ca8a04';
        return '#dc2626';
    }
}
