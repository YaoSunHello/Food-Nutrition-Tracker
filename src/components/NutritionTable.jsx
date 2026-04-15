export default function NutritionTable({ foodList, onRemove }) {
  if (foodList.length === 0) {
    return (
      <p className="table-empty">
        No foods added yet. Search for a food above to get started.
      </p>
    );
  }

  const totals = foodList.reduce(
    (acc, item) => ({
      portion:  acc.portion  + item.portion,
      calories: acc.calories + item.calories,
      carbs:    acc.carbs    + item.carbs,
      fat:      acc.fat      + item.fat,
      protein:  acc.protein  + item.protein,
    }),
    { portion: 0, calories: 0, carbs: 0, fat: 0, protein: 0 }
  );

  return (
    <div className="table-wrapper">
      <table className="nutrition-table">
        <thead>
          <tr>
            <th>Food</th>
            <th>Portion (g)</th>
            <th>Calories (kcal)</th>
            <th>Carbs (g)</th>
            <th>Fat (g)</th>
            <th>Protein (g)</th>
            <th>Vitamins &amp; Minerals</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {foodList.map((item) => (
            <tr key={item.id}>
              <td className="col-name">{item.name}</td>
              <td className="col-num">{item.portion}</td>
              <td className="col-num">{item.calories}</td>
              <td className="col-num">{item.carbs}</td>
              <td className="col-num">{item.fat}</td>
              <td className="col-num">{item.protein}</td>
              <td className="col-minerals">{item.minerals}</td>
              <td>
                <button
                  className="btn-remove"
                  onClick={() => onRemove(item.id)}
                  title="Remove"
                >
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="totals-row">
            <td><strong>Totals</strong></td>
            <td className="col-num"><strong>{totals.portion}</strong></td>
            <td className="col-num"><strong>{totals.calories.toFixed(1)}</strong></td>
            <td className="col-num"><strong>{totals.carbs.toFixed(1)}</strong></td>
            <td className="col-num"><strong>{totals.fat.toFixed(1)}</strong></td>
            <td className="col-num"><strong>{totals.protein.toFixed(1)}</strong></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
