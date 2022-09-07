import cloneDeep from "lodash.clonedeep";
import { oneOf, OPTION_TYPES } from "../../enums";
import OptionAutocomplete from "./OptionFields/OptionAutocomplete";
import OptionChannelTypes from "./OptionFields/OptionChannelTypes";
import OptionChoices from "./OptionFields/OptionChoices";
import OptionMaxValue from "./OptionFields/OptionMaxValue";
import OptionMinValue from "./OptionFields/OptionMinValue";
import OptionRequired from "./OptionFields/OptionRequired";
import Options from "./OptionFields/Options";
import OptionType from "./OptionFields/OptionType";

export default function Option({ id, option, setOption, loading, removeOption }) {
  const { name, description } = option;

  const params = { id, option, loading, setOption, name, description };

  console.log(option, oneOf([OPTION_TYPES.NUMBER, OPTION_TYPES.INTEGER], option.type));

  return <div className="option">
    <div className="header">
      <div className="meta">
        <h2>{name}</h2>
      </div>
      <div className="actions">
        <button className="big warning" onClick={() => {
          const confirmed = window.confirm(`Are you sure you want to delete the option "${name}"?`);
          if (!confirmed) return;
          removeOption(option);
        }}>Delete "{name}"</button>
      </div>
    </div>
    {/* <div className="input-wrapper">
      <label htmlFor={`${id}-${name}-name`}>Name</label>
      <input id={`${id}-${name}-name`} value={name} readOnly required />
    </div> */}
    <div className="input-wrapper">
      <label htmlFor={`${id}-${name}-description`}>Description</label>
      <input id={`${id}-${name}-description`} disabled={loading} value={description} onChange={(e) => {
        const clone = cloneDeep(option);
        clone.description = e.target.value;
        setOption(clone);
      }} />
    </div>
    <div className="input-row">
      <OptionType {...params} />
      <OptionRequired {...params} />
      <OptionAutocomplete {...params} />
      <OptionMinValue {...params} />
      <OptionMaxValue {...params} />
    </div>
    <OptionChoices {...params} />
    <OptionChannelTypes {...params} />
    {oneOf([OPTION_TYPES.SUB_COMMAND, OPTION_TYPES.SUB_COMMAND_GROUP], option.type) && (
      <>
        <Options optionOrCommand={option} loading={loading} id={`${id}-${name}`} setter={setOption} />
        <button className="big" disabled={loading} onClick={() => {
          const name = prompt("Enter the name of the new option:");
          if (!name) return;
          if (!/^[\w-]{1,32}$/.test(name.trim()))
            return alert("Invalid option name. Must be 1-32 characters long and contain only alphanumeric characters and dashes.");

          const clone = cloneDeep(option);
          clone.options = clone.options || [];
          clone.options.push({
            name: name.trim(),
            description: `New ${name} option`,
            type: 6,
          });

          setOption(clone);
        }}>Add Sub-Option</button>
      </>
    )}
  </div>;
}