import React from "react";

const CustomTable = () => {
  const headers = ["Name", "Email", "Role", "Status"];
  const data = [
    ["John Doe", "john@example.com", "Admin", "Active"],
    ["Jane Smith", "jane@example.com", "User", "Active"],
    ["Bob Johnson", "bob@example.com", "Editor", "Inactive"],
    ["Alice Williams", "alice@example.com", "User", "Active"],
  ];

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50 hover:bg-gray-50">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="h-12 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;
