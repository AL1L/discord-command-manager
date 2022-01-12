import { Routes } from "discord-api-types/v9";
import { useCallback, useEffect, useState } from "react";
import Command from "./Command";

export default function CommandList({ user, rest, guild }) {
  const [commands, setCommands] = useState([]);

  const manyRoute = guild
    ? Routes.applicationGuildCommands(user.id, guild.id)
    : Routes.applicationCommands(user.id);
  const singleRoute = useCallback((command) => {
    if (guild) {
      return Routes.applicationGuildCommand(user.id, guild.id, command.id);
    } else {
      return Routes.applicationCommand(user.id, command.id);
    }
  }, [user, guild])

  useEffect(() => {
    rest.get(manyRoute, { proxy: true }).then((commands) => {
      setCommands(commands);
    });
  }, [user, rest, manyRoute, setCommands]);

  const updateCommand = useCallback((command) => {
    if (command.id) {
      return rest.patch(singleRoute(command), {
        proxy: true,
        body: command
      }).then((newCommand) => {
        setCommands(commands.map((c) => c.name === newCommand.name ? newCommand : c));
      });
    } else {
      return rest.post(manyRoute, {
        proxy: true,
        body: command
      }).then((newCommand) => {
        setCommands([...commands.filter(c1 => !commands.find(c2 => c1.name === c2.name)), newCommand]);
      });
    }
  }, [commands, rest, manyRoute, singleRoute, setCommands]);

  const deleteCommand = useCallback((command) => {
    if (!commands.id) {
      setCommands(commands.filter(c => c.name !== command.name));
      return;
    }

    return rest.delete(singleRoute(command), {
      proxy: true
    }).then(() => {
      setCommands(commands.filter((c) => c.name !== command.name));
    });
  }, [commands, rest, singleRoute, setCommands]);

  const onAdd = () => {
    const name = prompt("Enter the name of the command");
    if (!name) return;
    if (!/^[\w-]{1,32}$/.test(name.trim()))
      return alert("Invalid option name. Must be 1-32 characters long and contain only alphanumeric characters and dashes.");
    if (commands.find(c => c.name === name))
      return alert("Command with this name already exists.");

    const command = {
      name,
      type: 1,
      description: "",
      guild_id: guild ? guild.id : undefined
    };


    setCommands([...commands, command]);
  };


  return (
    <div className="command-list">
      {guild && <div>
        <button className="big danger">Remove Guild</button>
      </div>}
      {commands && commands.length ? commands
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((command) => <Command key={command.id} command={command} updateCommand={updateCommand} deleteCommand={deleteCommand} />)
        : <div className="command-list-empty">{guild ? guild.name : user.username} has no commands</div>}
      <div>
        <button className="big" onClick={onAdd}>Add Command</button>
      </div>
    </div>
  );
}