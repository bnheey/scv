import clsx from "clsx";

interface TabsProps<T extends string> {
  tabs: T[]; // 탭 배열 (ex: ['출석', '마감', '셔틀콕'])
  selected: T;
  onChange: (tab: T) => void;
  className?: string;
}

export function SubTabs<T extends string>({
  tabs,
  selected,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      className={clsx(
        "flex rounded-xl bg-gray-100 overflow-hidden text-sm",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={clsx(
            "px-4 py-2 transition-colors duration-200 font-medium",
            selected === tab
              ? "bg-[#dd9595] text-white"
              : "text-gray-600 hover:bg-gray-200"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
