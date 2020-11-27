import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line
export default class HTML extends React.Component {
  static propTypes = {
    headComponents: PropTypes.any.isRequired,
    body: PropTypes.any.isRequired,
    postBodyComponents: PropTypes.any.isRequired,
  };

  render() {
    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="msvalidate.01" content="9FE85FD962F331A6F8900C9602BC5A64" />
          <meta name="google-site-verification" content="8nNdIdMRDKBtI-Ue-EWxaVazbzOZxT8_gIBUJyUdYFE" />
          <link rel="stylesheet" type="text/css" href="/icons/css/all.css" />
          <script type="text/javascript" src="/get_env_script.js" />
          {this.props.headComponents}
        </head>
        <body>
          <div id="___gatsby" dangerouslySetInnerHTML={{ __html: this.props.body }} />
          {this.props.postBodyComponents}
        </body>
      </html>
    );
  }
}
