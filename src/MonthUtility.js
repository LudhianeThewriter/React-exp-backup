export function filterBudgetData(selectedMonth, budgetData, expData) {
  const filterBudget = budgetData.filter(({ month }) => {
    return selectedMonth == "" || month == selectedMonth;
  });

  const enrichedData = filterBudget.map((budgetEntry) => {
    const actual = expData
      .filter(
        (exp) =>
          exp.category == budgetEntry.category &&
          new Date(exp.date).toISOString().slice(0, 7) == budgetEntry.month
      )
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    return { ...budgetEntry, actual };
  });

  return enrichedData;
}
