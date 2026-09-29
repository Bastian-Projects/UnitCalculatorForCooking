// src/utils/conversion.test.ts
import { describe, it, expect } from 'vitest';
import { volumeFactors, massFactors, type Ingredient, convertIngredients } from './conversion';

describe('conversion.ts - Volumen, Gewicht und Verhältnislogik', () => {
    describe('Volumenberechnungen/Flüssigkeiten', () => {
        it('sollte den Basiswert ml mit Faktor 1 definieren', () => {
            expect(volumeFactors.ml).toBe(1);
            expect(volumeFactors.l).toBe(1000);
        });

        it('sollte US-Volumeneinheiten korrekt konvertieren', () => {
            expect(volumeFactors['us cup']).toBe(236.588);
            expect(volumeFactors['us fl oz']).toBe(29.5735);
            expect(volumeFactors['us pt']).toBe(473.176);
            expect(volumeFactors['us qt']).toBe(946.353);
            expect(volumeFactors['us gal']).toBe(3.785);
        });

        it('sollte Esslöffel und Teelöffel korrekt definieren', () => {
            expect(volumeFactors.tbsp).toBe(15);
            expect(volumeFactors.tsp).toBe(5);
        });
    });

    describe('Gewichtsberechnungen', () => {
        it('sollte den Basiswert g mit Faktor 1 definieren', () => {
            expect(massFactors.g).toBe(1);
            expect(massFactors.kg).toBe(1000);
        });

        it('sollte US-Masseneinheiten und Butter-Sticks korrekt definieren', () => {
            expect(massFactors.oz).toBe(28.3495);
            expect(massFactors['lbs/pound']).toBe(453.592);
            expect(massFactors['stick butter']).toBe(115);
        });
    });

    describe('Konvertierungs- und Verhältnislogik', () => {
        it('gibt Volumen unter 1l in Millilitern aus', () => {
            const input: Ingredient[] = [
                { id: '1', name:'ML-Zutat', amount: 1, unit: 'us cup', category: 'volume' }
            ];
            const result = convertIngredients(input, 1);

            expect(result[0].convertedAmount).toBe(236.588);
            expect(result[0].convertedUnit).toBe('ml');
        });
        it('gibt Volumen über 1l in Litern aus', () => {
            const input: Ingredient[] = [
                { id: '2', name: 'Literzutat', amount: 5, unit: 'us cup', category: 'volume' }
            ];
            const result = convertIngredients(input, 1);

            expect(result[0].convertedAmount).toBe(1.183);
            expect(result[0].convertedUnit).toBe('l');
        });
        it('berücksichtigt das Verhältnis (ratio) korrekt', () => {
            const input: Ingredient[] = [
                { id: '3', name: 'Verhältniszutat', amount: 100, unit: 'g', category: 'mass' }
            ];
            const result = convertIngredients(input, 2.3);

            expect(result[0].convertedAmount).toBe(230);
            expect(result[0].convertedUnit).toBe('g');
        });
    });
});