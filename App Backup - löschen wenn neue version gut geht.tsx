import { useState, useEffect, type FormEvent } from 'react';
import { volumeFactors, massFactors, type MeasurementCategory } from './utils/conversion';
import './App.css'

interface Ingredient {
    id: string;
    name: string;
    amount: number;
    unit: string;
    category: MeasurementCategory;
    convertedAmount?: number;
    convertedUnit?: string;
}
const STORAGE_KEY = 'recipe_calculator_ingredients';
function App() {
    const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (error) {
                console.error("Fehler beim Lesen der lokalen Daten", error);
                return [];
            }
        }
        return [];
    });
    const [ratio, setRatio] = useState<number>(1);

    const [inputName, setInputName] = useState<string>('');
    const [inputAmount, setInputAmount] = useState<number | ''>('');
    const [inputCategory, setInputCategory] = useState<MeasurementCategory>('volume');
    const [inputUnit, setInputUnit] = useState<string>('us_cup');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    }, [ingredients]);

    const generateId = () => Math.random().toString(36).substring(2, 9);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as MeasurementCategory;
        setInputCategory(newCategory);
        setInputUnit(newCategory === 'volume' ? Object.keys(volumeFactors)[0] : Object.keys(massFactors)[0]);
    };

    const handleAddIngredient = (e: FormEvent) => {
        e.preventDefault();

        if (!inputName.trim() || inputAmount === '' || inputAmount <= 0) return;

        const newIngredient: Ingredient = {
            id: generateId(),
            name: inputName.trim(),
            amount: Number(inputAmount),
            unit: inputUnit,
            category: inputCategory,
        };

        setIngredients([...ingredients, newIngredient]);

        setInputName('');
        setInputAmount('');
    };

    const handleDeleteIngredient = (idToRemove: string) => {
        setIngredients(ingredients.filter(ing => ing.id !== idToRemove));
    };

    //const handleDeleteLastIngredient = () => {
    //    if (ingredients.length === 0) return;
    //    setIngredients(ingredients.slice(0, -1));
    //};

    const handleConversion = () => {
        const convertedList = ingredients.map((ing) => {
            let targetAmount = 0;
            let targetUnit = '';

            if (ing.category === 'volume') {
                const baseAmountInMl = ing.amount * volumeFactors[ing.unit];
                targetAmount = baseAmountInMl * ratio;

                if (targetAmount >= 1000) {
                    targetAmount = targetAmount / 1000;
                    targetUnit = 'l';
                } else {
                    targetUnit = 'ml';
                }
            } else if (ing.category === 'mass') {
                const baseAmountInG = ing.amount * massFactors[ing.unit];
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
            }
        });
        setIngredients(convertedList);
    };

    const availableUnits = inputCategory === 'volume' ? Object.keys(volumeFactors) : Object.keys(massFactors);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px' }}>
            <h1>Rezept-Umrechner</h1>
            <form onSubmit={handleAddIngredient} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>Zutat hinzufügen</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>

                    <input
                        type="text"
                        placeholder="Name (z.B. Mehl)"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        required
                    />

                    <input
                        type="number"
                        step="0.1"
                        placeholder="Menge"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value === '' ? '' : Number(e.target.value))}
                        required
                        style={{ width: '80px' }}
                    />

                    <select value={inputCategory} onChange={handleCategoryChange}>
                        <option value="volume">Volumen</option>
                        <option value="mass">Masse</option>
                    </select>

                    <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)}>
                        {availableUnits.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                        ))}
                    </select>

                    <button type="submit">Hinzufügen</button>
                </div>
            </form>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    Portions-Faktor (Verhältnis):
                    <input
                        type="number"
                        step="0.01"
                        value={ratio}
                        onChange={(e) => setRatio(parseFloat(e.target.value) || 1)}
                        style={{ marginLeft: '10px', width: '60px' }}
                    />
                </label>
            </div>
            <button onClick={handleConversion} style={{ margin: '10px' }}>Alle umrechnen</button>

            <hr style={{ margin: '20px 0' }} />
            <ul>
                {ingredients.map((ing) => (
                    <li key={ing.id} style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee' }}>
                        <strong>{ing.name}</strong>: {ing.amount} {ing.unit}
                        {ing.convertedAmount !== undefined && (
                            <span style={{ color: 'green', marginLeft: '15px', fontWeight: 'bold' }}>
                                &rarr; Umgerechnet: {ing.convertedAmount} {ing.convertedUnit}
                            </span>
                        )}
                        <button onClick={() => handleDeleteIngredient(ing.id)} style={{ marginLeft: '15px', padding: '2px 5px' }}>
                            Löschen
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App
