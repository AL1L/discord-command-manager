import cloneDeep from "lodash.clonedeep";
import { oneOf, OPTION_TYPES } from "../../../enums";

export default function OptionMaxValue({ id, name, option, setOption, loading }) {
  return (
    <div className="input-wrapper">
      <label htmlFor={`${id}-${name}-max_value`}>Maximum Value</label>
      <input
        id={`${id}-${name}-max_value`}
        value={option.max_value}
        type="number"
        disabled={loading || !oneOf([OPTION_TYPES.NUMBER, OPTION_TYPES.INTEGER], option.type)}
        step={oneOf([OPTION_TYPES.INTEGER], option.type) ? 1 : 0.1}
        onScroll={(e) => e.stopPropagation()}
        onChange={(e) => {
          const clone = cloneDeep(option);
          clone.max_value = parseFloat(e.target.value);
          if (isNaN(clone.max_value))
            delete clone.max_value;
          setOption(clone);
        }} />
    </div>
  );
}