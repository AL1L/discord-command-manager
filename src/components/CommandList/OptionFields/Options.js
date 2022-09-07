import cloneDeep from "lodash.clonedeep";
import Option from "../Option";

export default function Options({ optionOrCommand, loading, id, setter }) {
  return (
    <div className="input-row">
      <div className="input-wrapper">
        <label>Options</label>
        {optionOrCommand.options && (
          <div className="options-list">{(
            optionOrCommand.options
              .map((option, i) => (
                <Option key={option.name}
                  id={id}
                  option={option}
                  loading={loading}
                  setOption={(o) => {
                    const clone = cloneDeep(optionOrCommand);
                    clone.options[i] = o;
                    setter(clone);
                  }}
                  removeOption={() => {
                    const clone = cloneDeep(optionOrCommand);
                    clone.options.splice(i, 1);
                    setter(clone);
                  }}
                />
              ))
          )}</div>
        )}
      </div>
    </div>
  )
}