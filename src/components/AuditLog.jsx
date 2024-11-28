import React from "react";
import { useAppContext } from "../context/AppContext";

const AuditLog = () => {
  const { state } = useAppContext();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Audit Log</h1>

      {state.logs.length === 0 ? (
        <p>No logs available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
              <th className="border border-gray-300 px-4 py-2">User</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {state.logs.map((log, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {log.timestamp}
                </td>
                <td className="border border-gray-300 px-4 py-2">{log.user}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.action}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AuditLog;
