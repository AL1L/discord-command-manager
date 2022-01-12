import CommandList from "../components/CommandList";

export default function GlobalCommands({ user, rest }) {
  return <div className="content">
    <h1>Global Application Commands</h1>
    <h2>{user.username}#{user.discriminator}&nbsp;<small>({user.id})</small></h2>
    <CommandList user={user} rest={rest} />
  </div>;
}