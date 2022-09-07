import cloneDeep from "lodash.clonedeep";
import { Switch } from "../../Switch";

export default function OptionRequired({ id, name, option, setOption, loading }) {
  return (
    <div className="input-wrapper" style={{ maxWidth: 100 }}>
      <label htmlFor={`${id}-${name}-required`}>Required</label>
      <div className="switch-wrapper">
        <Switch id={`${id}-${name}-required`} disabled={loading} checked={option.required} onChange={(e) => {
          const clone = cloneDeep(option);
          if (e.target.checked) {
            clone.required = true;
          } else {
            delete clone.required;
          }
          setOption(clone);
        }} />
      </div>
    </div>
  );
}