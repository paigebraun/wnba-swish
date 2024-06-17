interface ToggleProps {
  enabled: boolean;
  onClick: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ enabled, onClick }) => {
  return (
    <div className="flex gap-2 h-min items-center">
      <span className="ml-2 text-xs font-medium">Glossary</span>
      <div className="flex items-center">
        <label className="inline-flex relative items-center mr-5 cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={enabled}
            readOnly
          />
          <div
            onClick={onClick}
            className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wOrange"
          ></div>
        </label>
      </div>
    </div>
  );
};

export default Toggle;
