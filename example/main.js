import React from 'react'
import ReactDom from 'react-dom'
import FlowMaker from '../flowmaker'

const domainCheck = (_, input) => {
  const items = input.split('.')
  if (items.length > 1 && items.every(i => i.length > 0)) return true
  return 'Not a valid server name'
}

const portCheck = (_, input) => {
  if (!isNaN(Number(input)) && Number(input) > 0 && Number(input) < 90000) {
    return true
  }
  return 'not a valid port'
}

const appLogic = {
  introComponents: ['fip', 'frontend'],
  components: [
    {
      name: 'fip',
      tooltip: 'Add a floating ip',
      title: 'Floating IP',
      inputs: [
        {
          name: 'ip',
          title: 'IP Address',
          type: 'text',
          validation: (ctx, input) => {
            const splitted = input.split('.')
            if (splitted.length == 4 && splitted.every(i => !isNaN(Number(i)) && i.length > 0 && i.length < 4 && Number(i) < 256)) return true
            return 'not a valid ip address'
          }
        }
      ],
      next: 'frontend'
    }, {
      name: 'frontend',
      tooltip: 'Information about the proxy/load balancing server',
      title: 'Frontend',
      getInputs(info) {
        const isHttpsInputs = info.inputs.https ? [
          {
            name: 'sslCert',
            title: 'Add ssl cert',
            tooltip: 'Add a ssl certificate',
            type: 'switch',
            default: true,
          }
        ] : [];
        return [
          {
            name: 'server',
            title: 'Server',
            type: 'text',
            tooltip: 'The address of the proxy/load balancing server',
            validation: domainCheck,
          }, {
            name: 'https',
            title: 'The server traffic is https',
            type: 'switch',
            default: true,
          },
          ...isHttpsInputs,
          {
            name: 'port',
            title: 'Web server port',
            type: 'number',
            default: 443,
            validation: portCheck,
          }
        ]
      },
      next: 'backend'
    }, {
      name: 'backend',
      title: 'Backend',
      inputs: [
        {
          name: 'domain',
          title: 'Domain name',
          type: 'text',
          validation: domainCheck,
        }, {
          name: 'lbalgo',
          title: 'Load balancing algorithm',
          type: 'dropdown',
          default: 'roundrobin',
          advanced: true,
          options: [
            { title: 'Roundrobin', value: 'roundrobin', tooltip: 'The best choise for most applications' },
            { title: 'Least Connections', value: 'leastconn', tooltip: 'When handeling with multiple long running request this works the best' },
            { title: 'First', value: 'first', tooltip: 'works good when handeling with lots of tcp connections and the client doesn\'t have dynmaic ip' },
            { title: 'Source', value: 'source', tooltip: 'works best when the ip address of the client is the always the same' },
            { title: 'URI', value: 'uri', tooltip: 'works best when working with caching servers' },
          ]
        }, {
          name: 'persistence',
          title: 'Persistence',
          type: 'switch',
          default: true,
          advanced: true,
        }, {
          name: 'persistenceduration',
          title: 'Persistence duration',
          type: 'text',
          default: '1h',
          advanced: true,
          validation: (ctx, input) => {
            if (/[0-9]+(h|m|d)/.test(input)) {
              return true
            }
            return 'Not a valid time, the time must be a number followed by the time format for example "90m" for 1.5 hour or "4h" for 4 hours'
          }
        }
      ],
      next: 'server'
    }, {
      name: 'server',
      title: 'Server',
      inputs: [
        {
          name: 'servAddr',
          title: 'Server address',
          type: 'text',
          validation: domainCheck,
        }, {
          name: 'https',
          title: 'The server traffic is https',
          type: 'switch',
          default: true,
        }, {
          name: 'port',
          title: 'Web server port',
          type: 'number',
          default: 443,
          validation: portCheck
        }
      ],
    }
  ]
}

function App() {
  return (
    <div className="app">
      <style>{`
        * {
          padding: 0px;
          margin: 0px;
        }
        .drawing {
          position: fixed;
          height: 100vh;
          width: 100vw;
          top: 0px;
          left: 0px;
        }
      `}</style>
      <div className="drawing">
        <FlowMaker
          logic={appLogic}
          onChange={data => {
            localStorage.setItem('flowMakerExample', JSON.stringify(data))
            console.log(data)
          }}
          flow={JSON.parse(localStorage.getItem('flowMakerExample'))}
        />
      </div>
    </div>
  )
}

ReactDom.render(<App />, document.getElementById("app"))
