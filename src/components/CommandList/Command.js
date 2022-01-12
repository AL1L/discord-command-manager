import Option from "./Option";
import cloneDeep from "lodash.clonedeep";
import { useCallback, useEffect, useState } from "react";
import isEqual from "lodash.isequal";
import isObject from "lodash.isobject";
import transform from "lodash.transform";
import { Error } from "./Error";

function difference(object, base) {
  function changes(object, base) {
    return transform(object, function (result, value, key) {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  }
  return changes(object, base);
}

const DISCORD_EPOCH = 1420070400000;

function convertSnowflakeToDate(snowflake, epoch = DISCORD_EPOCH) {
  return new Date(snowflake / 4194304 + epoch);
}

export default function Command({ command, updateCommand, deleteCommand }) {
  const [editCommand, setEditCommand] = useState(cloneDeep(command));
  const [loading, setLoading] = useState(false);
  const { id, name, options, description, version } = editCommand;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditCommand(command);
  }, [command])

  const optionalCount = options ? options.filter((option) => !option.required).length : 0;

  const onSave = useCallback(() => {
    setLoading(true);
    updateCommand(editCommand)
      .then(() => {
        setLoading(false)
        setErrors({});
      })
      .catch((e) => {
        console.log({ e }, e.errors)
        if (e.errors) {
          setErrors(e.errors);
        } else {
          alert(e.message);
        }
        setLoading(false);
      });
  }, [editCommand, updateCommand, setLoading, setErrors]);

  const diff = difference(editCommand, command);
  const created = convertSnowflakeToDate(id);
  const edited = version && convertSnowflakeToDate(version);

  return <details open={command.id ? undefined : true}>
    <summary>
      <div className="name">{name}<span>{options && options.filter((o) => o.required).map((o) => <span key={o.name}>{o.name}</span>)}{optionalCount ? <small>+{optionalCount} optional</small> : null}</span></div>
      <p>{description}</p>
    </summary>
    <div className="header">
      <div className="meta">
        <h4>Id</h4>
        <code>{id}</code>
        <h4>Version</h4>
        <code>{version || 'none'}</code>
        <h4>Created</h4>
        <code>{created.toLocaleDateString()} @ {created.toLocaleTimeString()}</code>
        {version ? <>
          <h4>Edited</h4>
          <code>{edited.toLocaleDateString()} @ {edited.toLocaleTimeString()}</code>
        </> : null}
      </div>
      <div className="actions">
        <button className="big danger" onClick={() => {
          const confirmed = window.confirm(`Are you sure you want to delete the command ${name}?`);
          if (!confirmed) return;
          deleteCommand(command);
        }}>Delete</button>
      </div>
    </div>
    {/* <div className="input-wrapper">
      <label for={`${id}-name`}>Name</label>
      <input id={`${id}-name`} value={`/${editCommand.name}`} readOnly required />
    </div> */}
    <Error errors={errors} name="name" />
    <div className="input-wrapper">
      <label for={`${id}-description`}>Description</label>
      <input id={`${id}-description`} value={editCommand.description} disabled={loading} onChange={(e) => {
        const clone = cloneDeep(editCommand);
        clone.description = e.target.value;
        setEditCommand(clone);
      }} />
      <Error errors={errors} name="description" />
    </div>
    <div className="input-wrapper">
      <label>Options</label>
      {editCommand.options && (
        <div className="options-list">{(
          editCommand.options
            .map((option, i) => (
              <Option key={option.name}
                errors={
                  errors && errors.options && errors.options[i]
                    ? errors.options[i]
                    : {}
                }
                id={id}
                option={option}
                loading={loading}
                setOption={(o) => {
                  const clone = cloneDeep(editCommand);
                  clone.options[i] = o;
                  setEditCommand(clone);
                }} />
            ))
        )}</div>
      )}
    </div>
    <div className="button-group">
      <button className="big" disabled={loading} onClick={() => {
        const name = prompt("Enter the name of the new option:");
        if (!name) return;
        if (!/^[\w-]{1,32}$/.test(name.trim()))
          return alert("Invalid option name. Must be 1-32 characters long and contain only alphanumeric characters and dashes.");

        const clone = cloneDeep(editCommand);
        clone.options = clone.options || [];
        clone.options.push({
          name: name.trim(),
          description: `New ${name} option`,
          type: 6,
        });

        setEditCommand(clone);
      }}>Add Option</button>
      <div className="button-group">
        <button className="big danger" disabled={isEqual(command, editCommand) || loading} onClick={() => {
          setEditCommand(cloneDeep(command));
        }}>Reset</button>
        <button className="big success" disabled={isEqual(command, editCommand) || loading} onClick={() => onSave()}>Save</button>
      </div>
    </div>
    {!isEqual(diff, {}) && (
      <div className="diff">
        <h3>Changes To be Made</h3>
        <pre>
          {JSON.stringify(diff, (k, v) => v === undefined ? '<to be removed>' : v, 2)}
        </pre>
      </div>
    )}
  </details>;
}