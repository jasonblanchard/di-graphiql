import React from 'react';
import { render } from 'react-dom';
import GraphiQL from 'graphiql';
import loadjs from 'loadjs'
import { Global, css } from '@emotion/core'

// const API_PATH = 'https://swapi-graphql.netlify.app/.netlify/functions/index';
const API_PATH = '/api/entry/'

const Logo = () => <span>{'Di'}</span>;

// See GraphiQL Readme - Advanced Usage section for more examples like this
GraphiQL.Logo = Logo;

function getCsrfToken() {
  return document.querySelector("meta[name=csrf-token]")?.getAttribute('content') || '';
}

loadjs(['https://unpkg.com/graphiql/graphiql.min.css'], 'css')

loadjs.ready('css', () => {
  const App = () => (
    <>
      <Global
        styles={css`
          body {
          padding: 0;
          margin: 0;
          min-height: 100vh;
        }

        #root {
          height: 100vh;
        }
      `}
      />
      <GraphiQL
        style={{ height: '100vh' }}
        fetcher={async graphQLParams => {
          const data = await fetch(
            API_PATH,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'CSRF-Token': getCsrfToken(),
              },
              body: JSON.stringify(graphQLParams),
              credentials: 'same-origin',
            },
          );
          return data.json().catch(() => data.text());
        }}
      />
    </>
  );

  render(<App />, document.getElementById('root'));
})

