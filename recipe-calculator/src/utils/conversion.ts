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

export interface Ingredient {
    id: string;
    name: string;
    amount: number;
    unit: string;
    category: MeasurementCategory;
    convertedAmount?: number;
    convertedUnit?: string;
}

export function convertIngredients(
    ingredients: Ingredient[],
    ratio: number
): Ingredient[] {
    return ingredients.map((ing) => {
        //Todo: Meldung einfügen, dass negative Mengen nicht erlaubt sind
        if (ing.amount < 0) ing.amount = 0;
        let targetAmount = 0;
        let targetUnit = '';

        if (ing.category === 'volume') {
            const baseAmountInMl = ing.amount * (volumeFactors[ing.unit] || 0);
            targetAmount = baseAmountInMl * ratio;

            if (targetAmount >= 1000) {
                targetAmount = targetAmount / 1000;
                targetUnit = 'l';
            } else {
                targetUnit = 'ml';
            }
        } else if (ing.category === 'mass') {
            const baseAmountInG = ing.amount * (massFactors[ing.unit] || 0);
            targetAmount = baseAmountInG * ratio;

            if (targetAmount >= 1000) {
                targetAmount = targetAmount / 1000;
                targetUnit = 'kg';
            } else {
                targetUnit = 'g';
            }
        }

        return {
            ...ing,
            convertedAmount: parseFloat(targetAmount.toFixed(3)),
            convertedUnit: targetUnit,
        };
    });
}