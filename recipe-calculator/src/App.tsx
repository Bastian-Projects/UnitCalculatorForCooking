import { useState, useEffect, type FormEvent } from 'react';
import { volumeFactors, massFactors, type MeasurementCategory, type Ingredient, convertIngredients } from './utils/conversion';
import './App.css'

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
    const [inputUnit, setInputUnit] = useState<string>('us_cup');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients));
    }, [ingredients]);

    const generateId = () => Math.random().toString(36).substring(2, 9);

    const allUnits = [...Object.keys(volumeFactors), ...Object.keys(massFactors)];

    const handleAddIngredient = (e: FormEvent) => {
        e.preventDefault();

        if (!inputName.trim() || inputAmount === '' || inputAmount <= 0) return;

        const isVolume = Object.keys(volumeFactors).includes(inputUnit);
        const detectedCategory: MeasurementCategory = isVolume ? 'volume' : 'mass';

        const newIngredient: Ingredient = {
            id: generateId(),
            name: inputName.trim(),
            amount: Number(inputAmount),
            unit: inputUnit,
            category: detectedCategory,
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
        const convertedList = convertIngredients(ingredients,ratio);
        setIngredients(convertedList);
    };

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

                    <select value={inputUnit} onChange={(e) => setInputUnit(e.target.value)}>
                        {allUnits.map(unit => (
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
                        value={ratio}
                        onChange={(e) => setRatio(parseFloat(e.target.value) || 0)}
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
