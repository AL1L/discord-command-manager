import cloneDeep from "lodash.clonedeep";
import { oneOf, OPTION_TYPES } from "../../../enums";
import { Switch } from "../../Switch";

export default function OptionAutocomplete({ id, name, option, setOption, loading }) {
  const enabled = oneOf([OPTION_TYPES.STRING, OPTION_TYPES.NUMBER, OPTION_TYPES.INTEGER], option.type);

  return <div className="input-wrapper" style={{ maxWidth: 100 }}>
    <label htmlFor={`${id}-${name}-autocomplete`}>Auto Complete</label>
    <div className="switch-wrapper">
      <Switch id={`${id}-${name}-autocomplete`} disabled={loading || !enabled} checked={option.autocomplete} onChange={(e) => {
        const clone = cloneDeep(option);
        if (e.target.checked) {
          delete clone.choices;
          clone.autocomplete = true;
        } else {
          delete clone.autocomplete;
        }
        setOption(clone);
      }} />
    </div>
  </div>;
}