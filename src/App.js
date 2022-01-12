import { useEffect, useState } from 'react';
import './App.scss';
import GuildList from './components/GuildList';
import { Routes } from 'discord-api-types/v9';
import REST from './rest';
import GlobalCommands from './views/GlobalCommands';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import GuildCommands from './views/GuildCommands';

function testLogin(token) {
  return new Promise((resolve, reject) => {
    const rest = new REST({
      version: '9',
    }).setToken(token);

    rest.get(Routes.user(), {

    }).then((user) => {
      if (user) {
        resolve({ user, rest })
      } else {
        reject({ code: -1, message: 'Something went wrong' })
      }
    }).catch((e) => {
      reject(e)
    });
  });
}

function Login({ setRest, setUser }) {
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('');
  const [error, setError] = useState(null);

  const onClick = () => {
    setLoading(true);

    testLogin(input).then(({ user, rest }) => {
      setRest(rest);
      setUser(user);
      setLoading(false);
      localStorage.setItem('discord-token', JSON.stringify(input));
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if (!localStorage.getItem('discord-token')) return;

    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('discord-token'));

      setInput(token);

      testLogin(token).then(({ user, rest }) => {
        setRest(rest);
        setUser(user);
      }).catch(() => {
        localStorage.removeItem('discord-token');
        setError('Token expired, please login again');
        setInput('');
      }).finally(() => {
        setLoading(false);
      });
    } catch (e) {
      setLoading(false);
      setError(e.message)
      localStorage.removeItem('discord-token');
      return;
    }
  }, [setRest, setUser]);

  return <div className='login'>
    <div className='card'>
      <label>Discord Application Command Manager</label>
      <h1>Login</h1>
      {error && <div className='error'>{error}</div>}
      <label for="token">Bot Token</label>
      <input disabled={loading} id="token" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className='seperator' />
      <button className='big' disabled={loading} onClick={onClick}>Login</button>
      <div className='seperator' />
      <h4>While I promise not to store your token, it's completely understandable if you don't trust me. <a href="https://github.com/AL1L/discord-command-manager" target="_blank" rel="noreferrer">So host it yourself &lt;3</a></h4>
    </div>
  </div>
}

function App() {
  const [rest, setRest] = useState(null);
  const [user, setUser] = useState(null);

  if (!rest || !user) {
    return <Login setRest={setRest} setUser={setUser} />;
  }

  return (
    <>
      <nav>
        <div>Discord Application Command Manager</div>
      </nav>
      <main>
        <GuildList user={user} rest={rest} />
        <div className='scrollable'>
          <RouterRoutes>
            <Route path="/guilds/:guildId" element={<GuildCommands user={user} rest={rest} />} />
            <Route path="/" element={<GlobalCommands user={user} rest={rest} />} />
            <Route element={<h1>404: Not found</h1>} />
          </RouterRoutes>
        </div>
      </main>
    </>
  );
}

export default App;
