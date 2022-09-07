import cloneDeep from "lodash.clonedeep";
import { oneOf, OPTION_TYPES } from "../../../enums";

export default function OptionMinValue({ id, name, option, setOption, loading }) {
  return (
    <div className="input-wrapper">
      <label htmlFor={`${id}-${name}-min_value`}>Minimum Value</label>
      <input
        id={`${id}-${name}-min_value`}
        value={option.min_value}
        type="number"
        disabled={loading || !oneOf([OPTION_TYPES.NUMBER, OPTION_TYPES.INTEGER], option.type)}
        step={oneOf([OPTION_TYPES.INTEGER], option.type) ? 1 : 0.1}
        onScroll={(e) => e.stopPropagation()}
        onChange={(e) => {
          const clone = cloneDeep(option);
          clone.min_value = parseFloat(e.target.value);
          if (isNaN(clone.min_value))
            delete clone.min_value;
          setOption(clone);
        }} />
    </div>
  );
}