import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from 'react-redux';
import { match, RouterContext } from 'react-router';
import { IntlProvider } from 'react-intl';

import reducers from '../frontend_app/reducers';
import { findSupportedLanguage } from '../frontend_app/reducers/language';
import Routes from '../frontend_app/components/Routes';
import { translations } from '../frontend_app/messages';

const googleAnalyticsCode = `
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-86896275-1', 'auto');
  ga('send', 'pageview');

</script>`;

function renderFullPage(html, preloadedState) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="/stylesheets/general.css" />
    <link rel="stylesheet" type="text/css" href="/stylesheets/bundle.css" />
    <link rel="shortcut icon" type="image/png" href="/media/favicon.png"/>
    <link href='https://fonts.googleapis.com/css?family=Noto+Serif:400,400i|Ubuntu:400,400i,500' rel='stylesheet' type='text/css'/>
  </head>
  <body>
    <div id="gymi-app-container">${html}</div>
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)}
    </script>
    <script src="/bundle.js" type="text/javascript" charset="utf-8"></script>
    ${googleAnalyticsCode}
  </body>
</html>`;
}

export function handleRender(req, res) {
  const supportedLanguage = findSupportedLanguage(req.language);
  const store = supportedLanguage ?
    createStore(reducers, { language: { currentLanguage: supportedLanguage } }) :
    createStore(reducers);

  match({ routes: Routes, location: req.url }, (err, redirect, props) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const lang = supportedLanguage ? supportedLanguage.localeCode : 'en';
    // Render the component to a string
    const html = renderToString(
      <ReduxProvider store={store}>
        <IntlProvider
          locale={lang}
          messages={translations[lang]}
          defaultLocale="en"
        >
          <RouterContext {...props} />
        </IntlProvider>
      </ReduxProvider>
    );

    // Grab the initial state from our Redux store
    const preloadedState = store.getState();

    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState));
  });
}
