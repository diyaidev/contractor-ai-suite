
export interface AIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// --- Visualizer ---
export interface SegmentationResult {
    maskUrl: string;
    detectedObjects: string[];
    estimatedSqFt: number;
    wallPolygon?: { x: number, y: number }[]; // Precise wall boundary points
    cabinetHandlePositions?: { x: number, y: number }[]; // Exact handle locations
}

export interface RemodelResult {
    imageUrl: string;
    estimatedCost: number;
}

// --- Pool ---
export interface PoolQuoteInput {
    points: { lat: number, lng: number }[];
    poolType: 'concrete' | 'fiberglass' | 'vinyl';
    accessories: string[];
    accessDifficulty: 'standard' | 'narrow' | 'crane';
}

export interface PoolQuote {
    areaSqFt: number;
    baseCost: number;
    accessoryCost: number;
    accessSurcharge: number;
    totalCost: number;
    feasibility: 'High' | 'Medium' | 'Low';
    notes: string[];
}

// --- HVAC ---
export interface HvacDiagnosis {
    issue: string;
    confidence: number;
    recommendedAction: string;
    partsRequired: { name: string, status: 'In Stock' | 'Order' }[];
    severity: 'Critical' | 'Moderate' | 'Maintenance';
}

// --- Legal ---
export interface LegalCaseAnalysis {
    viabilityScore: number; // 0-100
    summary: string;
    keyFacts: string[];
    statuteCheck: 'Pass' | 'Fail' | 'Warning';
    recommendedNextStep: string;
}

// --- Voice ---
export interface VoiceCallLog {
    id: string;
    callerName: string;
    timestamp: string;
    duration: string;
    intent: 'New Booking' | 'Reschedule' | 'Quote Inquiry' | 'Complaint';
    summary: string;
    status: 'Booked' | 'Follow-up Needed' | 'Resolved';
}

const DELAY_MS = 1500;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MockAIService = {
    // Visualizer
    async segmentImage(imageUrl: string): Promise<AIResponse<SegmentationResult>> {
        await delay(DELAY_MS);

        // Check if this is a demo image by looking at the data URL or filename
        // For demo purposes, we'll provide precise coordinates for uploaded images
        const isDemoImage = imageUrl.includes('data:image') || imageUrl.includes('blob:');

        // Default generic response
        let wallPolygon: { x: number, y: number }[] | undefined;
        let cabinetHandlePositions: { x: number, y: number }[] | undefined;

        // For demo images, provide precise AI detection
        // These coordinates are normalized (0-1 range) and will be scaled to actual canvas size
        if (isDemoImage) {
            // Precise wall polygon (avoiding floor and ceiling)
            wallPolygon = [
                { x: 0, y: 0.15 },      // Top left
                { x: 0.25, y: 0.22 },   // Left wall inner top
                { x: 0.25, y: 0.78 },   // Left wall inner bottom
                { x: 0, y: 0.85 },      // Bottom left
                { x: 1, y: 0.85 },      // Bottom right
                { x: 0.75, y: 0.78 },   // Right wall inner bottom
                { x: 0.75, y: 0.22 },   // Right wall inner top
                { x: 1, y: 0.15 }       // Top right
            ];

            // Precise cabinet handle positions (typical kitchen cabinet layout)
            cabinetHandlePositions = [
                // Lower cabinets (left to right, 2 rows)
                { x: 0.15, y: 0.65 }, { x: 0.28, y: 0.65 }, { x: 0.41, y: 0.65 }, { x: 0.54, y: 0.65 },
                { x: 0.15, y: 0.75 }, { x: 0.28, y: 0.75 }, { x: 0.41, y: 0.75 }, { x: 0.54, y: 0.75 },
                // Upper cabinets (if visible)
                { x: 0.72, y: 0.45 }, { x: 0.85, y: 0.45 },
                { x: 0.72, y: 0.55 }, { x: 0.85, y: 0.55 }
            ];
        }

        return {
            success: true,
            data: {
                maskUrl: imageUrl,
                detectedObjects: ['floor', 'wall_left', 'wall_right', 'ceiling', 'cabinets'],
                estimatedSqFt: Math.floor(Math.random() * 200) + 150,
                wallPolygon,
                cabinetHandlePositions
            }
        };
    },

    // Pool
    async estimatePool(input: PoolQuoteInput): Promise<AIResponse<PoolQuote>> {
        await delay(DELAY_MS);
        const area = Math.floor(Math.random() * 500) + 300;

        let baseMultiplier = 150;
        if (input.poolType === 'concrete') baseMultiplier = 180;
        if (input.poolType === 'vinyl') baseMultiplier = 120;

        const baseCost = area * baseMultiplier;
        const accessoryCost = input.accessories.length * 2500;

        let accessSurcharge = 0;
        if (input.accessDifficulty === 'narrow') accessSurcharge = 1500;
        if (input.accessDifficulty === 'crane') accessSurcharge = 5000;

        return {
            success: true,
            data: {
                areaSqFt: area,
                baseCost,
                accessoryCost,
                accessSurcharge,
                totalCost: baseCost + accessoryCost + accessSurcharge,
                feasibility: 'High',
                notes: ['Slope is acceptable (<5%)', 'Soil type appears stable (Clay/Loam)']
            }
        };
    },

    // HVAC
    async diagnoseHvac(file: File): Promise<AIResponse<HvacDiagnosis>> {
        await delay(2500);
        return {
            success: true,
            data: {
                issue: 'Fan Bearing Failure',
                confidence: 0.94,
                severity: 'Critical',
                recommendedAction: 'Replace condenser fan motor and capacitor immediately to prevent compressor overheat.',
                partsRequired: [
                    { name: 'OEM Motor #5532', status: 'In Stock' },
                    { name: '35/5 Capacitor', status: 'In Stock' }
                ]
            }
        };
    },

    // Legal
    async analyzeLegalDoc(file: File): Promise<AIResponse<LegalCaseAnalysis>> {
        await delay(3000);
        return {
            success: true,
            data: {
                viabilityScore: 85,
                summary: 'Client slipped on wet floor in grocery store; caution sign was allegedly not visible.',
                keyFacts: [
                    'Incident Date: 2025-10-12',
                    'Location: SuperMart on 5th',
                    'Injury: Fractured Wrist',
                    'Evidence: Witness Statement attached'
                ],
                statuteCheck: 'Pass',
                recommendedNextStep: 'Schedule Intake Interview'
            }
        };
    },

    // Voice
    async getRecentCalls(): Promise<AIResponse<VoiceCallLog[]>> {
        return {
            success: true,
            data: [
                { id: '1', callerName: 'John Doe', timestamp: '10:14 AM', duration: '2m 15s', intent: 'New Booking', summary: 'Scheduled estimate for roof repair.', status: 'Booked' },
                { id: '2', callerName: 'Sarah Smith', timestamp: '09:45 AM', duration: '1m 05s', intent: 'Reschedule', summary: 'Moved HVAC maintenance to Tuesday.', status: 'Resolved' },
                { id: '3', callerName: 'Unknown', timestamp: '09:12 AM', duration: '45s', intent: 'Quote Inquiry', summary: 'Asked about pool installation, sent link.', status: 'Follow-up Needed' },
            ]
        };
    }
};
