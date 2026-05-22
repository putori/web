// Column<T> mô tả key tương ứng với data trong TableProps, tên header (label) và cách  hiển thị dữ liệu của 1 cột 
export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
};

export default function GenericTable<T>({ data, columns }: TableProps<T>) {
  return (
    <div className="bg-[#14161d] rounded-xl overflow-hidden">
      
      <table className="w-full text-sm">
        
        {/* HEADER */}
        <thead className="text-gray-400 border-b border-white/10">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="text-left p-4 font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="border-b border-white/5 hover:bg-white/5 transition"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="p-4"
                >
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}