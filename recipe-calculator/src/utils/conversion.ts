export type MeasurementCategory = 'volume' | 'mass';

export const volumeFactors: Record<string, number> = {
    ml: 1,
    l: 1000,
    'us cup': 236.588,
    'us fl oz': 29.5735,
    'us pt': 473.176,
    'us qt': 946.353,
    'us gal': 3.785,
    tbsp: 15,
    tsp: 5,
}

export const massFactors: Record<string, number> = {
    g: 1,
    kg: 1000,
    oz: 28.3495,
    'lbs/pound': 453.592,
    'stick butter': 115,
};