import cloneDeep from "lodash.clonedeep";
import { oneOf, OPTION_TYPES } from "../../../enums";

function Choice({ id, choice, setChoice, removeChoice, loading }) {
  return <div className="choice">
    <div className="choice-name" title="Name">
      {choice.name}
    </div>
    <input
      id={`${id}-choice_${choice.name}`}
      value={choice.value}
      disabled={loading}
      title="Value"
      onChange={(e) => {
        const clone = cloneDeep(choice);
        clone.value = e.target.value;
        setChoice(clone);
      }} />
    <button className="warning" onClick={removeChoice} title="Remove choice">X</button>
  </div>;
}

export default function OptionChoices({ id, name, option, setOption, loading }) {
  if (!oneOf([OPTION_TYPES.STRING, OPTION_TYPES.NUMBER, OPTION_TYPES.INTEGER], option.type) || option.autocomplete)
    return null;

  return (
    <div className="input-row">
      <div className="input-wrapper">
        <label>Choices (name, value) <button className="choice-add" onClick={() => {
          const name = prompt("Enter the name of the choice");
          if (!name) return;
          const clone = cloneDeep(option);
          if (!clone.choices) clone.choices = [];
          clone.choices.push({ name, value: name });
          setOption(clone);
        }}>+</button></label>
        <div className="choice-list">
          {option.choices ? option.choices.map((choice, i) => (
            <Choice
              key={choice.name}
              id={id}
              choice={choice}
              loading={loading}
              setChoice={(c) => {
                const clone = cloneDeep(option);
                clone.choices[i] = c;
                setOption(clone);
              }}
              removeChoice={() => {
                const clone = cloneDeep(option);
                clone.choices.splice(i, 1);
                if (clone.choices.length === 0)
                  delete clone.choices;
                setOption(clone);
              }} />
          )) : <div className="choice-none">No choices</div>}
        </div>
      </div>
    </div>
  );

}