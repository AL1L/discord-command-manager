addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});

async function discordOAuth(request, { search }) {
  const query = new URLSearchParams(search);

  const code = query.get('code');
  const state = query.get('state');

  if (!code)
    return new Response(JSON.stringify({ message: "Missing code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });


  const data = await fetch(URL_TOKEN, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://discord-commands.artex.workers.dev/auth/discord'
    }).toString()
  });

  return data;
}

async function discordProxy(request, url) {
  const headers = new Headers(request.headers);
  headers.set('user-agent', 'DiscordCommandManagerProxy/1.0');
  url.hostname = 'discord.com';
  console.log(headers, request.headers);

  const c = cors(request);

  Object.entries(c).forEach(([k, v]) => headers.set(k, v));

  return await fetch(url, {
    method: request.method,
    headers,
    body: request.body
  });
}

function cors(request) {
  return {
    "access-control-allow-origin": request.headers.origin || '*',
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "POST, GET, PUT, PATCH, DELETE",
    "access-control-allow-headers": "Content-Type, Authorization, X-Audit-Log-Reason, X-Track, X-Super-Properties, X-Context-Properties, X-Failed-Requests, X-Fingerprint, X-RPC-Proxy, X-Discord-Locale, X-Debug-Options, x-client-trace-id, If-None-Match, Range, X-RateLimit-Precision",
    "access-control-expose-headers": "Retry-After, X-RateLimit-Global, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset, X-RateLimit-Reset-After, X-RateLimit-Bucket, X-RateLimit-Scope, Date",
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response('', {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...cors(request)
      },
    });
  }

  if (url.pathname === '/auth/discord') {
    return await discordOAuth(request, url);
  } else if (url.pathname.startsWith('/api/v9/applications') || url.pathname.startsWith('/api/v9/guilds')) {
    return await discordProxy(request, url);
  }

  return new Response(JSON.stringify({ message: "Route not found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}