import * as XLSX from "xlsx";
import { useState, useContext } from "react";
import { db } from "./firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { AuthContext } from "./AuthContext";
export function BulkDataFromExcel() {
  const { user } = useContext(AuthContext);
  const [excelData, setExcelData] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(sheet);

      const cleaned = SanitizeAndValidate(rawData);
      console.log("Get data ", cleaned);
      setExcelData(cleaned);
    };

    reader.readAsArrayBuffer(file);
  };

  function excelDateToJSDate(serial) {
    const utc_value = (serial - 25569) * 86400; // full seconds including time fraction
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString();
  }

  const SanitizeAndValidate = (data) => {
    console.log("Raw excel data ", data);
    const cleaned = [];
    const seen = new Set();

    data.forEach((row) => {
      console.log("Row ", row);

      const category = String(row.category || "")
        .replace(/<[^>]*>?/gm, "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();

      const datef = () => {
        const d = excelDateToJSDate(row.date);
        console.log("After functions : ", d);
        const parsedDate = new Date(d);

        return isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
      };

      const date = datef();

      const amountf = () => {
        const parsedAmt = parseFloat(row.amount);

        return isNaN(parsedAmt) ? 0 : parsedAmt;
      };

      const amount = amountf();

      const recurringf = () => {
        const val = String(row.recurring || "")
          .toLowerCase()
          .replace(/<[^>]*>?/gm, "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .trim();

        if (["true", "yes", 1].includes(val)) return true;
        if (["false", "no", 0].includes(val)) return false;

        return false;
      };

      const recurring = recurringf();

      const remarks = String(row.remarks || "")
        .replace(/<[^>]*>?/gm, "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .trim();

      const key = `${category}-${date}-${amount}-${recurring}-${remarks}`;

      if (seen.has(key)) return;
      seen.add(key);

      cleaned.push({ category, date, amount, recurring, remarks });
    });

    // PREVENT DUPLICATION

    return cleaned;
  };

  const upload = async () => {
    if (!excelData.length) {
      alert("No data to upload");
      return;
    }

    const batch = writeBatch(db);
    const expenseRef = collection(db, "users", user.uid, "expenses");
    excelData.forEach((data) => {
      const newDocRef = doc(expenseRef);

      batch.set(newDocRef, data);
    });

    try {
      await batch.commit();
      alert("Upload successfull");
    } catch (err) {
      console.log("Failed to upload ", err.message);
      alert("Failed");
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFile} />
      <button
        className="btn btn-primary p-3 text-bold"
        onClick={() => upload()}
      >
        Use Bulk Upload
      </button>
    </div>
  );
}
