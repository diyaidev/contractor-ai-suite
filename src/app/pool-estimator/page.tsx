'use client';

import { useState } from 'react';
import { MockAIService, PoolQuote } from '../../services/mockAi';

export default function PoolEstimatorPage() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [points, setPoints] = useState<{ x: number, y: number }[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const [quote, setQuote] = useState<PoolQuote | null>(null);

    // Deep Features
    const [poolType, setPoolType] = useState<'concrete' | 'fiberglass' | 'vinyl'>('concrete');
    const [accessDifficulty, setAccessDifficulty] = useState<'standard' | 'narrow' | 'crane'>('standard');
    const [accessories, setAccessories] = useState<string[]>([]);

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDrawing) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPoints([...points, { x, y }]);
    };

    const handleCalculate = async () => {
        if (points.length < 3) return;
        setIsCalculating(true);
        setIsDrawing(false);

        const dummyCoords = points.map(p => ({ lat: p.x, lng: p.y }));
        const result = await MockAIService.estimatePool({
            points: dummyCoords,
            poolType,
            accessDifficulty,
            accessories
        });

        if (result.success && result.data) {
            setQuote(result.data);
        }
        setIsCalculating(false);
    };

    const toggleAccessory = (acc: string) => {
        if (accessories.includes(acc)) {
            setAccessories(accessories.filter(a => a !== acc));
        } else {
            setAccessories([...accessories, acc]);
        }
    };

    const resetMap = () => {
        setPoints([]);
        setQuote(null);
        setIsDrawing(false);
    };

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', height: 'calc(100vh - 100px)', display: 'flex', gap: '2rem' }}>

            {/* Sidebar Controls */}
            <aside className="card" style={{ width: '400px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <header style={{ marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '1.8rem', lineHeight: '1.2' }}>Geospatial Pool Estimator</h1>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Using Google Maps 3D Tiles & Solar API.</p>
                </header>

                <div style={{ flex: 1 }}>
                    {!quote ? (
                        <>
                            {/* Deep Options */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. Pool Construction</h3>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    {['concrete', 'fiberglass', 'vinyl'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setPoolType(t as any)}
                                            style={{
                                                flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1',
                                                background: poolType === t ? '#3b82f6' : 'white',
                                                color: poolType === t ? 'white' : '#64748b',
                                                textTransform: 'capitalize', fontSize: '0.85rem'
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. Machinery Access</h3>
                                <select
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                    value={accessDifficulty}
                                    onChange={(e) => setAccessDifficulty(e.target.value as any)}
                                >
                                    <option value="standard">Standard (Truck Access)</option>
                                    <option value="narrow">Narrow (Mini-Excavator)</option>
                                    <option value="crane">No Access (Crane Required)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>3. Add-ons</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {['Attached Spa', 'Water Feature', 'Solar Heating', 'Auto Cover'].map(acc => (
                                        <div key={acc} onClick={() => toggleAccessory(acc)} style={{
                                            padding: '4px 10px', borderRadius: '15px', border: '1px solid', cursor: 'pointer', fontSize: '0.8rem',
                                            borderColor: accessories.includes(acc) ? '#3b82f6' : '#cbd5e1',
                                            background: accessories.includes(acc) ? '#eff6ff' : 'white',
                                            color: accessories.includes(acc) ? '#1d4ed8' : '#64748b'
                                        }}>
                                            {acc}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    className={`btn ${isDrawing ? 'btn-secondary' : 'btn-primary'}`}
                                    onClick={() => { setIsDrawing(true); setPoints([]); }}
                                    style={{ flex: 1 }}
                                >
                                    {isDrawing ? 'Drawing Mode Active' : 'Draw Shape'}
                                </button>

                                {isDrawing && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleCalculate}
                                        disabled={points.length < 3}
                                        style={{ flex: 1 }}
                                    >
                                        Calculate
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="results-panel">
                            <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>AI Quote</h3>

                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Pool Area ({poolType})</span>
                                <span style={{ fontWeight: 'bold' }}>{quote.areaSqFt} sq ft</span>
                            </div>

                            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Base Cost</span>
                                <span>${quote.baseCost.toLocaleString()}</span>
                            </div>

                            {quote.accessoryCost > 0 && (
                                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748b' }}>Accessories</span>
                                    <span>+ ${quote.accessoryCost.toLocaleString()}</span>
                                </div>
                            )}

                            {quote.accessSurcharge > 0 && (
                                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', color: '#b45309' }}>
                                    <span>Access Surcharge</span>
                                    <span>+ ${quote.accessSurcharge.toLocaleString()}</span>
                                </div>
                            )}

                            <div style={{ marginBottom: '1.5rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>TOTAL ESTIMATE</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>${quote.totalCost.toLocaleString()}</span>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: quote.feasibility === 'High' ? '#dcfce7' : '#fee2e2', color: quote.feasibility === 'High' ? '#166534' : '#991b1b', fontWeight: '500' }}>
                                    {quote.feasibility} Feasibility
                                </span>
                            </div>

                            <button className="btn btn-secondary" onClick={resetMap} style={{ width: '100%' }}>Start Over</button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Map Area */}
            <main
                className="card"
                style={{ flex: 1, padding: 0, overflow: 'hidden', position: 'relative', cursor: isDrawing ? 'cell' : 'default' }}
            >
                {/* Mock Map Background */}
                <div
                    onClick={handleMapClick}
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url(/sample-images/satellite-map-placeholder.jpg)',
                        backgroundColor: '#e2e8f0',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative'
                    }}
                >
                    {!participantsHaveImage() && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.5)', pointerEvents: 'none' }}>
                            <p style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                Satellite View Loading... (Using Mock Data)
                            </p>
                        </div>
                    )}

                    {/* SVG/Drawing Layer */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        {points.length > 0 && (
                            <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(59, 130, 246, 0.4)" stroke="#2563eb" strokeWidth="3" />
                        )}
                        {points.map((p, i) => (
                            <circle key={i} cx={p.x} cy={p.y} r="5" fill="white" stroke="#2563eb" strokeWidth="2" />
                        ))}
                    </svg>

                    {isCalculating && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <div className="spinner" style={{ marginBottom: '1rem' }}></div>
                            <p>Analyzing Topography (Solar API)...</p>
                        </div>
                    )}
                </div>
            </main>
            <style jsx>{`
                    .spinner { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
    function participantsHaveImage() { return false; }
}
