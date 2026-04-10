import React from 'react';

interface Column {
  header: string;
  accessor: string;
  isNumeric?: boolean;
  className?: string; // Support for custom colors (e.g. text-green, text-error)
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  maxHeight?: string;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, maxHeight = '400px' }) => {
  return (
    <div className="card overflow-hidden border-none shadow-none">
      <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight }}>
        <table className="w-full text-sm text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.accessor} 
                  className={`px-4 py-3 font-bold text-slate-500 uppercase tracking-widest text-[10px] border-b border-slate-100 dark:border-slate-700 ${col.isNumeric ? 'text-right' : ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {data.map((row, i) => (
              <tr 
                key={i} 
                className="hover:bg-blue/5 transition-colors group"
              >
                {columns.map((col) => (
                  <td 
                    key={col.accessor} 
                    className={`px-4 py-3 font-medium font-numbers ${col.isNumeric ? 'text-right' : ''} ${col.className ? col.className : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    {row[col.accessor]}
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

export default DataTable;
