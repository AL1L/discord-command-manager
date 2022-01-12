import cloneDeep from "lodash.clonedeep";
import { Switch } from "../Switch";

const OPTION_TYPES = {
  SUB_COMMAND: 1,
  SUB_COMMAND_GROUP: 2,
  STRING: 3,
  INTEGER: 4,
  BOOLEAN: 5,
  USER: 6,
  CHANNEL: 7,
  ROLE: 8,
  MENTIONABLE: 9,
  NUMBER: 10,
};

export default function Option({ id, option, setOption, loading }) {
  const { name, description } = option;
  return <div className="option">
    <h2>{name}</h2>
    {/* <div className="input-wrapper">
      <label for={`${id}-${name}-name`}>Name</label>
      <input id={`${id}-${name}-name`} value={name} readOnly required />
    </div> */}
    <div className="input-wrapper">
      <label for={`${id}-${name}-description`}>Description</label>
      <input id={`${id}-${name}-description`} disabled={loading} value={description} onChange={(e) => {
        const clone = cloneDeep(option);
        clone.description = e.target.value;
        setOption(clone);
      }} />
    </div>
    <div className="input-row">
      <div className="input-wrapper" style={{ minWidth: '25%' }}>
        <label for={`${id}-${name}-type`}>Type</label>
        <select
          id={`${id}-${name}-type`}
          value={`${option.type}`}
          disabled={loading}
          onChange={(e) => {
            const clone = cloneDeep(option);
            clone.type = parseInt(e.target.value, 10);

            if (clone.type !== OPTION_TYPES.NUMBER && clone.type !== OPTION_TYPES.INTEGER) {
              delete clone.min_value;
              delete clone.max_value;
            }

            if (clone.type !== OPTION_TYPES.SUB_COMMAND && clone.type !== OPTION_TYPES.SUB_COMMAND_GROUP) {
              delete clone.options;
            }

            if (clone.type !== OPTION_TYPES.CHANNEL) {
              delete clone.channel_types;
            }

            if (clone.type !== OPTION_TYPES.STRING && clone.type !== OPTION_TYPES.INTEGER && clone.type !== OPTION_TYPES.NUMBER) {
              delete clone.choices;
            }

            setOption(clone);
          }}
        >
          {/* <option value={OPTION_TYPES.SUB_COMMAND}>Sub Command</option> */}
          {/* <option value={OPTION_TYPES.SUB_COMMAND_GROUP}>Sub Command Group</option> */}
          <option value={OPTION_TYPES.STRING}>String</option>
          <option value={OPTION_TYPES.INTEGER}>Integer</option>
          <option value={OPTION_TYPES.BOOLEAN}>Boolean</option>
          <option value={OPTION_TYPES.USER}>User</option>
          <option value={OPTION_TYPES.CHANNEL}>Channel</option>
          <option value={OPTION_TYPES.ROLE}>Role</option>
          <option value={OPTION_TYPES.MENTIONABLE}>Mentionable</option>
          <option value={OPTION_TYPES.NUMBER}>Number</option>
        </select>
      </div>
      <div className="input-wrapper" style={{ maxWidth: 100 }}>
        <label for={`${id}-${name}-required`}>Required</label>
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
      <div className="input-wrapper" style={{ maxWidth: 100 }}>
        <label for={`${id}-${name}-autocomplete`}>Auto Complete</label>
        <div className="switch-wrapper">
          <Switch id={`${id}-${name}-autocomplete`} disabled={loading} checked={option.autocomplete} onChange={(e) => {
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
      </div>
      {/* </div>
    <div className="input-row"> */}
      <div className="input-wrapper">
        <label for={`${id}-${name}-min_value`}>Minimum Value</label>
        <input
          id={`${id}-${name}-min_value`}
          value={option.min_value}
          type="number"
          disabled={loading || (option.type !== OPTION_TYPES.NUMBER && option.type !== OPTION_TYPES.INTEGER)}
          step={option.type === OPTION_TYPES.INTEGER ? 1 : 0.1}
          onScroll={(e) => e.stopPropagation()}
          onChange={(e) => {
            const clone = cloneDeep(option);
            clone.min_value = parseFloat(e.target.value);
            if (isNaN(clone.min_value))
              delete clone.min_value;
            setOption(clone);
          }} />
      </div>
      <div className="input-wrapper">
        <label for={`${id}-${name}-max_value`}>Maximum Value</label>
        <input
          id={`${id}-${name}-max_value`}
          value={option.max_value}
          type="number"
          disabled={loading || (option.type !== OPTION_TYPES.NUMBER && option.type !== OPTION_TYPES.INTEGER)}
          step={option.type === OPTION_TYPES.INTEGER ? 1 : 0.1}
          onScroll={(e) => e.stopPropagation()}
          onChange={(e) => {
            const clone = cloneDeep(option);
            clone.max_value = parseFloat(e.target.value);
            if (isNaN(clone.max_value))
              delete clone.max_value;
            setOption(clone);
          }} />
      </div>
    </div>
    {
      option.type === OPTION_TYPES.CHANNEL && <div className="input-wrapper">
        <label for={`${id}-${name}-channel_types`}>Channel Types</label>
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
          <option value="0">Guild Text</option>
          <option value="2">Guild Voice</option>
          <option value="4">Guild Category</option>
          <option value="11">Guild Public Thread</option>
          <option value="12">Guild Private Thread</option>
          <option value="13">Guild Stage Voice</option>
          <option value="5">Guild News</option>
          <option value="6">Guild Store</option>
          {/* <option value="7">Guild Unknown</option>
          <option value="8">Guild Unknown</option>
          <option value="9">Guild Unknown</option> */}
          <option value="10">Guild News Thread</option>
          <option value="1">DM</option>
          <option value="3">Group DM</option>
        </select>
      </div>
    }
  </div >;
}