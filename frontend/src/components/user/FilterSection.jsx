import { ChevronDown, ChevronUp } from "lucide-react";

function FilterSection({
  title,
  expanded,
  setExpanded,
  options,
  selectedOptions,
  onChange,
}) {
  return (
    <div>
      <button
        className="flex items-center justify-between w-full font-semibold mb-2"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {title}
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {expanded && (
        <div className="space-y-2">
          {options.map((option, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => onChange(option)}
              />
              <span className="ml-2 text-sm">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default FilterSection;
