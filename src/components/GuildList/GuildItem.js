import { Link } from "react-router-dom";

export default function GuildItem({ avatar, id, name, global, selected }) {
  return <Link
    to={global ? '/' : `/guilds/${id}`}
    className={`item${global ? ' global' : ''}${selected ? ' selected' : ''}`}
    style={{
      backgroundImage: `url('${avatar}')`,
    }}
    href={global ? '/global' : `/guilds/${id}`}
  >
    {!avatar ? name.split(/[ _.-]/).map(p => p.substring(0, 1)).filter(p => !!p).slice(0, 3).join('').toUpperCase() : null}
  </Link>
}