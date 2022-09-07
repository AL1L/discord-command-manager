import cloneDeep from "lodash.clonedeep";
import { oneOf, OPTION_TYPES } from "../../../enums";

export default function OptionType({ id, option, loading, setOption }) {
  const { name } = option;

  return <div className="input-wrapper" style={{ minWidth: '25%' }}>
    <label htmlFor={`${id}-${name}-type`}>Type</label>
    <select
      id={`${id}-${name}-type`}
      value={`${option.type}`}
      disabled={loading}
      onChange={(e) => {
        const clone = cloneDeep(option);
        clone.type = parseInt(e.target.value, 10);

        if (!oneOf([OPTION_TYPES.NUMBER, OPTION_TYPES.INTEGER], clone.type)) {
          delete clone.min_value;
          delete clone.max_value;
        }

        if (oneOf([OPTION_TYPES.SUB_COMMAND, OPTION_TYPES.SUB_COMMAND_GROUP], clone.type)) {
          clone.options = [];
        } else {
          delete clone.options;
        }

        if (!oneOf([OPTION_TYPES.CHANNEL], clone.type)) {
          delete clone.channel_types;
        }

        if (!oneOf([OPTION_TYPES.STRING, OPTION_TYPES.NUMBER, OPTION_TYPES.INTEGER], clone.type)) {
          delete clone.choices;
        }

        setOption(clone);
      }}
    >
      {Object.values(OPTION_TYPES).map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  </div>
}