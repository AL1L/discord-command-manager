import { Routes } from "discord-api-types/v9";
import { useState } from "react";
import GuildItem from "./GuildItem";

export default function GuildList({ user, rest }) {
  const [guilds, setGuilds] = useState([]);

  useState(() => {
    const guildIds = JSON.parse(localStorage.getItem(`guilds-${user.id}`) || "[]");

    Promise.all(guildIds.map((guildId) =>
      rest.get(Routes.guild(guildId), { proxy: true }).catch(() => undefined)
    )).then((guilds) => {
      setGuilds(guilds.filter((g) => g));
    });
  }, [user, rest]);

  const onAdd = () => {
    const guildId = prompt("Enter the ID of the guild you want to add");

    if (!guildId) return;

    rest.get(Routes.guild(guildId), { proxy: true }).then((guild) => {
      if (!guild) {
        alert("Guild not found");
        return;
      }

      setGuilds([...guilds, guild]);
      const guildIds = JSON.parse(localStorage.getItem(`guilds-${user.id}`) || "[]");
      localStorage.setItem(`guilds-${user.id}`, JSON.stringify([...guildIds, guildId]));
    }).catch((e) => {
      alert("Guild not found: " + e.message);
    });
  }

  return (
    <div className="guilds">
      <GuildItem
        name={user.username}
        avatar={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=96`}
        global selected
      />
      <div className="seperator"></div>
      {guilds.map((guild) => (
        <GuildItem
          key={guild.id}
          id={guild.id}
          name={guild.name}
          avatar={guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=96` : undefined}
          global={false}
        />
      ))}
      <button className="add-guild" onClick={onAdd}>+</button>
    </div>
  );
}