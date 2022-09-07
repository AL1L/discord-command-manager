import cloneDeep from "lodash.clonedeep";
import { CHANNEL_TYPES, oneOf, OPTION_TYPES } from "../../../enums";

export default function OptionChannelTypes({ id, name, option, setOption, loading }) {
  if (!oneOf([OPTION_TYPES.CHANNEL], option.type)) return null;

  return <div className="input-row">
    <div className="input-wrapper">
      <label htmlFor={`${id}-${name}-channel_types`}>Channel Types</label>
      <select
        id={`${id}-${name}-channel_types`}
        // value={option.channel_types ? option.channel_types : []}
        multiple
        onChange={(e) => {
          const types = [...e.target.selectedOptions].map((option) => parseInt(option.value, 10));
          const clone = cloneDeep(option);
          if (types.length > 0) {
            clone.channel_types = types;
          } else {
            delete clone.channel_types;
          }
          setOption(clone);
        }}
        disabled={loading}
        style={{
          height: 'auto',
        }}
      >
        {Object.values(CHANNEL_TYPES).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
    </div>
  </div>;
}