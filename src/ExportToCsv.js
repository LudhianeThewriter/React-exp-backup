import react from "react";
import { CSVLink } from "react-csv";
import { button } from "react-bootstrap";

const Exporter = ({ title, data }) => {
  const fileName = `${title.replace(/\s+/g, "_")}_Report.csv`;
  console.log("Data : ", data);
  return (
    <div className="card p-3 mb-4">
      <h4 className="mb-3">{title}</h4>
      {data && data.length > 0 ? (
        <>
          <div className="table-responsive mb-3">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  {Object.keys(data[0]).map((key, idx) => (
                    <th key={idx}>{key.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr key={idx}>
                    {Object.values(item).map((value, idx) => (
                      <td key={idx}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CSVLink data={data} filename={fileName} className="btn btn-success">
            Export to Excel
          </CSVLink>
        </>
      ) : (
        <div className="text-muted">No data or Nothing to show</div>
      )}
    </div>
  );
};

export default Exporter;
