'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './visualizer.module.css';
import { MockAIService } from '../../services/mockAi';
import products from '../../data/products.json';

export default function VisualizerPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
    const [structureStrength, setStructureStrength] = useState(0.8);

    // New Deep Features
    const [roomType, setRoomType] = useState('living-room');
    const [designStyle, setDesignStyle] = useState('modern');
    const [budgetLimit, setBudgetLimit] = useState(5000);

    const [isProcessing, setIsProcessing] = useState(false);
    const [resultReady, setResultReady] = useState(false);
    const [estimatedSqFt, setEstimatedSqFt] = useState<number>(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Load initial image to canvas
    useEffect(() => {
        if (selectedImage && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const img = new Image();
            img.src = selectedImage;
            img.onload = () => {
                if (canvasRef.current) {
                    canvasRef.current.width = img.width;
                    canvasRef.current.height = img.height;
                    ctx?.drawImage(img, 0, 0);
                }
            };
        }
    }, [selectedImage]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setSelectedImage(e.target?.result as string);
            reader.readAsDataURL(file);
            setResultReady(false);
        }
    };

    const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!selectedImage || isProcessing) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
                ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                setTimeout(() => {
                    const img = new Image();
                    img.src = selectedImage;
                    img.onload = () => ctx.drawImage(img, 0, 0);
                }, 300);
            }
        }
    };

    const handleGenerate = async () => {
        if (!selectedImage || !selectedProduct) return;

        setIsProcessing(true);
        const result = await MockAIService.segmentImage(selectedImage);

        if (result.success && result.data) {
            setEstimatedSqFt(result.data.estimatedSqFt);
            setResultReady(true);

            // Apply Visual Change to Canvas
            const product = products.find(p => p.id === selectedProduct);
            if (product && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                    // Simple mock: apply a color tint to simulate "material change"
                    // In a real app, this would be the new image from the AI
                    ctx.globalCompositeOperation = 'multiply';
                    ctx.fillStyle = product.color;
                    ctx.globalAlpha = 0.4; // Transparency
                    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                    // Reset composite op
                    ctx.globalCompositeOperation = 'source-over';
                    ctx.globalAlpha = 1.0;
                }
            }
        }
        setIsProcessing(false);
    };

    const calculateCost = () => {
        const product = products.find(p => p.id === selectedProduct);
        if (!product || !estimatedSqFt) return 0;
        return estimatedSqFt * product.priceSqFt;
    };

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Interior Visualizer <span className="badge">PRO</span></h1>
                <p style={{ color: '#666' }}>Upload a photo, select a real product, and AI will remodel the room while preserving structure.</p>
            </header>

            <div className={styles.container}>
                {/* Controls Sidebar */}
                <aside className={`${styles.controls} card`}>

                    {/* section 1: Upload */}
                    <div className={styles.controlSection}>
                        <h3 className={styles.sectionTitle}>1. Site Capture</h3>
                        <label className="btn btn-secondary" style={{ width: '100%', textAlign: 'center', marginBottom: '1rem' }}>
                            Upload Room Photo
                            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                        </label>

                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Room Type</label>
                                <select value={roomType} onChange={(e) => setRoomType(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                    <option value="living-room">Living Room</option>
                                    <option value="kitchen">Kitchen</option>
                                    <option value="bathroom">Bathroom</option>
                                    <option value="bedroom">Bedroom</option>
                                </select>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Style</label>
                                <select value={designStyle} onChange={(e) => setDesignStyle(e.target.value)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                                    <option value="modern">Modern</option>
                                    <option value="rustic">Rustic</option>
                                    <option value="industrial">Industrial</option>
                                    <option value="scandi">Scandinavian</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Product Catalog */}
                    <div className={styles.controlSection}>
                        <h3 className={styles.sectionTitle}>2. Select Material</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Your Budget Limit: ${budgetLimit}</label>
                            <input type="range" min="1000" max="20000" step="1000" value={budgetLimit} onChange={(e) => setBudgetLimit(Number(e.target.value))} style={{ width: '100%' }} />
                        </div>

                        <div className={styles.swatchGrid}>
                            {products.map((p) => (
                                <div
                                    key={p.id}
                                    className={`${styles.swatch} ${selectedProduct === p.id ? styles.activeSwatch : ''}`}
                                    style={{ backgroundColor: p.color, backgroundImage: `url(${p.imageUrl})`, backgroundSize: 'cover' }}
                                    title={`${p.name} ($${p.priceSqFt}/sqft)`}
                                    onClick={() => setSelectedProduct(p.id)}
                                />
                            ))}
                        </div>
                        {selectedProduct && (
                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '4px', fontSize: '0.85rem' }}>
                                <strong>{products.find(t => t.id === selectedProduct)?.name}</strong>
                                <br />
                                <span style={{ color: '#666' }}>${products.find(t => t.id === selectedProduct)?.priceSqFt}/sqft</span>
                            </div>
                        )}
                    </div>

                    {/* Section 3: AI Settings */}
                    <div className={styles.controlSection}>
                        <h3 className={styles.sectionTitle}>3. AI Settings</h3>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Structure Preservation: {structureStrength}</label>
                        <input type="range" min="0" max="1" step="0.1" value={structureStrength} onChange={(e) => setStructureStrength(parseFloat(e.target.value))} style={{ width: '100%' }} />
                    </div>

                    <button
                        className="btn btn-primary"
                        disabled={!selectedImage || !selectedProduct || isProcessing}
                        onClick={handleGenerate}
                        style={{ marginTop: '1rem', width: '100%' }}
                    >
                        {isProcessing ? 'Generating Preview...' : 'Visualize Remodel'}
                    </button>

                    {resultReady && (
                        <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                            <strong>AI Estimate Generated</strong>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                                <span>Approx. Area:</span>
                                <strong>{estimatedSqFt} sq ft</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Material Cost:</span>
                                <strong style={{ color: calculateCost() > budgetLimit ? 'red' : 'green' }}>
                                    ${calculateCost().toLocaleString()}
                                </strong>
                            </div>
                            {calculateCost() > budgetLimit && (
                                <p style={{ color: 'red', fontSize: '0.8rem', marginTop: '4px' }}>Over Budget by ${(calculateCost() - budgetLimit).toLocaleString()}</p>
                            )}
                        </div>
                    )}
                </aside>

                {/* Main Canvas */}
                <div className={styles.canvasArea} style={{ minHeight: '500px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                    {!selectedImage ? (
                        <div style={{ textAlign: 'center', color: '#64748b' }}>
                            <p>Upload a photo to start visualizing</p>
                        </div>
                    ) : (
                        <>
                            <canvas
                                ref={canvasRef}
                                style={{ maxWidth: '100%', maxHeight: '600px', cursor: 'crosshair', filter: resultReady ? 'sepia(0.2) contrast(1.1)' : 'none', transition: 'filter 1s ease' }}
                                onClick={handleCanvasClick}
                            />
                            {!resultReady && !isProcessing && (
                                <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 16px', borderRadius: '20px', pointerEvents: 'none' }}>
                                    Tap image to mask areas
                                </div>
                            )}
                            {isProcessing && (
                                <div className={styles.overlay} style={{ background: 'rgba(0,0,0,0.6)' }}>
                                    <div className="spinner"></div>
                                    <p style={{ color: 'white', marginTop: '1rem', fontWeight: 500 }}>Analyzing Geometry...</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            <style jsx>{`
                .spinner { width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                .badge { background:linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-size: 0.8rem; padding: 4px 8px; border-radius: 4px; vertical-align: middle; margin-left: 10px; }
            `}</style>
        </div>
    );
}
