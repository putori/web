export type StatItem = {
  title: string;
  value: number | string;
  subText?: string;
  color: "orange" | "green" | "blue" | "red" | "white";
};

export type StatListProps = {
  items: StatItem[];
};

const styleMap = {
  orange: {
    border: "border-orange-500",
    value: "text-orange-400",
  },
  green: {
    border: "border-green-500",
    value: "text-green-400",
  },
  blue: {
    border: "border-blue-500",
    value: "text-blue-400",
  },
  red: {
    border: "border-red-500",
    value: "text-red-400",
  },
  white: {
    border: "border-white/20",
    value: "text-white",
  },
} as const;

export default function StatList({ items = [] }: StatListProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {items.map((item, index) => {
        const style = styleMap[item.color];

        return (
          <div
            key={index}
            className={`bg-[#14161d] p-4 rounded-xl border-l-4 ${style.border}`}
          >
            <p className="text-gray-400 text-sm">{item.title}</p>

            <p className={`text-2xl font-bold ${style.value}`}>
              {item.value}
            </p>

            {item.subText && (
              <p className="text-green-400 text-xs">
                {item.subText}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}