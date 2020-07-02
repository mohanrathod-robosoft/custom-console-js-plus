/*global window EventSource fetch */
import { getContainer } from './run';
import isUrl from 'is-url';

const API = process.env.REACT_APP_API || '';

const welcome = () => ({
  value: '<strong>Welcome to Custom Console App.</strong>',
  html: true,
});

const help = () => ({
  html: true,
});

const load = async ({ args: urls, console }) => {
  const document = getContainer().contentDocument;
  urls.forEach(url => {
    if (url === 'datefns') url = 'date-fns'; // Backwards compatibility
    url = isUrl(url) ? url : `https://cdn.jsdelivr.net/npm/${url}`;
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => console.log(`Loaded ${url}`);
    script.onerror = () => console.warn(`Failed to load ${url}`);
    document.body.appendChild(script);
  });
  return 'Loading script…';
};

const set = async ({ args: [key, value], app }) => {
  switch (key) {
    case 'theme':
      if (['light', 'dark'].includes(value)) {
        app.props.setTheme(value);
      }
      break;
    case 'layout':
      if (['top', 'bottom'].includes(value)) {
        app.props.setLayout(value);
      }
      break;
    default:
  }
};



const clear = ({ console }) => {
  console.clear();
};

const listen = async ({ args: [id], console: internalConsole }) => {
  // create new eventsocket
  const res = await fetch(`${API}/remote/${id || ''}`);
  id = await res.json();

  return new Promise(resolve => {
    const sse = new EventSource(`${API}/remote/${id}/log`);
    sse.onopen = () => {
      resolve(
        `Connected to "${id}"\n\n<script src="${
          window.location.origin
        }/js/remote.js?${id}"></script>`
      );
    };

    sse.onmessage = event => {
      console.log(event);
      const data = JSON.parse(event.data);
      if (data.response) {
        if (typeof data.response === 'string') {
          internalConsole.log(data.response);
          return;
        }

        const res = data.response.map(_ => {
          if (_.startsWith('Error:')) {
            return new Error(_.split('Error: ', 2).pop());
          }

          if (_ === 'undefined') {
            // yes, the string
            return undefined;
          }

          return JSON.parse(_);
        });
        internalConsole.log(...res);
      }
    };

    sse.onclose = function() {
      internalConsole.log('Remote connection closed');
    };
  });
};

const commands = {
  help,
  load,
  listen,
  clear,
  set,
  welcome,
};

export default commands;
