import { useState } from 'react';
import FoodForm from './components/FoodForm.jsx';
import NaturalInput from './components/NaturalInput.jsx';
import NutritionTable from './components/NutritionTable.jsx';

export default function App() {
  const [foodList, setFoodList] = useState([]);

  function addFood(entry) {
    setFoodList((prev) => [...prev, entry]);
  }

  function addMultiple(entries) {
    setFoodList((prev) => [...prev, ...entries]);
  }

  function removeFood(id) {
    setFoodList((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Food Nutrition Tracker</h1>
        <p className="app-subtitle">
          Log food by name, or describe your whole meal by voice or text.
        </p>
      </header>

      <main className="app-main">
        <div className="input-sections">
          <div className="input-section">
            <h2 className="input-section__title">Single food</h2>
            <FoodForm onAdd={addFood} />
          </div>
          <div className="input-divider">or</div>
          <div className="input-section">
            <h2 className="input-section__title">Voice / describe your meal</h2>
            <NaturalInput onAddMultiple={addMultiple} />
          </div>
        </div>
        <NutritionTable foodList={foodList} onRemove={removeFood} />
      </main>

      <footer className="app-footer">
        Nutrition data provided by the{' '}
        <a
          href="https://fdc.nal.usda.gov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          USDA FoodData Central
        </a>
      </footer>
    </div>
  );
}
