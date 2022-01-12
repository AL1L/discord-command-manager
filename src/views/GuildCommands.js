import { Routes } from "discord-api-types/v9";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommandList from "../components/CommandList";

export default function GuildCommands({ user, rest }) {
  const nav = useNavigate();
  const { guildId } = useParams();
  const [guild, setGuild] = useState(null);

  useEffect(() => {
    rest.get(Routes.guild(guildId), { proxy: true }).then((guild) => {
      setGuild(guild);
    }).catch((e) => {
      console.error(e);
      alert("Guild not found: " + e.message);
      nav("/");
    });
  }, [rest, guildId, nav]);

  if (!guild) return null;

  return <div className="content">
    <h1>Guild Application Commands</h1>
    <h2>{user.username}#{user.discriminator}&nbsp;<small>({user.id})</small></h2>
    <h2>{guild.name}&nbsp;<small>({guild.id})</small></h2>
    <CommandList user={user} rest={rest} guild={guild} />
  </div>;
}