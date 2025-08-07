//https://us-central1-expense-a4a50.cloudfunctions.net/api

export const DownloadTemplate = () => {
  const handleDownload = async () => {
    try {
      const response = await fetch(
        "https://us-central1-expense-a4a50.cloudfunctions.net/api/downloadExcel"
      );
      if (!response.ok) throw new Error("Download Failed");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "Expense_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log("Failed to download ", error.message);
    }
  };

  return (
    <button onClick={() => handleDownload()}>📥 Download Excel Template</button>
  );
};
