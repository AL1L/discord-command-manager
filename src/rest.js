class RateLimitedEvent extends Event {
  constructor({ global, message, retry_after }) {
    super("rate_limited", { global, message, retry_after });
    this.global = global;
    this.retryAfter = retry_after;
    this.message = message;
  }
}


class DiscordError {
  constructor(data, res) {
    this.message = data.message;

    Object.entries(data).forEach(([key, value]) => {
      this[key] = value;
    });

    this.status = res.status;
    this.response = res;
  }
}

export default class REST extends EventSource {
  constructor() {
    super();
    this.version = '9';
  }

  setToken(token) {
    this.token = token;
    return this;
  }

  get(route, requestData) {
    return this.request(route, requestData, 'GET');
  }

  post(route, requestData) {
    return this.request(route, requestData, 'POST');
  }

  put(route, requestData) {
    return this.request(route, requestData, 'PUT');
  }

  delete(route, requestData) {
    return this.request(route, requestData, 'DELETE');
  }

  patch(route, requestData) {
    return this.request(route, requestData, 'PATCH');
  }

  request(route, { versioned = true, body, headers = {}, query, reason, proxy }, method) {
    const url = new URL(`https://discordapp.com/api${versioned ? `/v${this.version}` : ''}${route}`);
    if (query && Object.keys(query).length)
      url.search = `?${new URLSearchParams(query).toString()}`;
    if (proxy)
      url.hostname = 'discord-commands.artex.workers.dev';

    const options = {
      method,
      headers: {
        ...headers,
        Authorization: `Bot ${this.token}`,
        'Content-Type': method !== 'GET' ? 'application/json' : undefined,
      },
      body: method !== 'GET' ? (body ? JSON.stringify(body) : undefined) : undefined,
    };

    if (reason)
      options.headers['X-Audit-Log-Reason'] = reason;

    return fetch(url, options).then(res => {
      if (res.status < 200 || res.status >= 300) {
        return res.json().then((data) => {
          if (res.status === 429)
            this.dispatchEvent(new RateLimitedEvent(data));
          throw new DiscordError(data, res)
        });
      }

      if (res.headers.get('Content-Type') === 'application/json')
        return res.json();
      else
        return res.text();
    });
  }
}