import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import withI18n from '@arcblock/www/src/components/withI18n';
import Layout from '@arcblock/www/src/components/layouts/default';
import withRoot from '@arcblock/www/src/components/withRoot';

import withTheme from '@arcblock/ux/lib/withTheme';

import { translations } from '../../libs/constant';
import Blocklets from '../../components/blocklets';

function BlockletList({ pageContext, location }) {
  const { blocklets } = pageContext;
  return (
    <Layout location={location} title="Blocklets">
      <Div>
        <Container className="hero" maxWidth="lg">
          <Typography className="hero__title" component="h2" variant="h4">
            Blocklets.
          </Typography>
          <Typography className="hero__subtitle" component="h3" variant="h5">
            The easy to start building dApps!
          </Typography>
          <Typography className="hero__description" component="p">
            Blocklets are easy to use packages that allow you to quickly build a dApp by giving you instant access to
            helpful modules, smart contracts, libraries, front-end views and more. Use one blocklet or combine them to
            build a complete dApp. Blocklets help you start with ready-made components and modules, libraries, view and
            more; helping you build a complete dApp.
          </Typography>
        </Container>
        <Blocklets blocklets={blocklets} className="blocklets" />
      </Div>
    </Layout>
  );
}

BlockletList.propTypes = {
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRoot()(withTheme(withI18n(translations)(BlockletList)));

const Div = styled.div`
  color: #404040;

  .hero {
    margin-top: 120px;
    text-align: center;
    @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
      margin-top: 60px;
    }

    .hero__title {
      font-weight: bold;
      margin-bottom: 8px;
    }

    .hero__subtitle {
      font-weight: bold;
      margin-bottom: 16px;
    }

    .hero__description {
      margin: 0 auto;
      margin-bottom: 24px;
      text-align: center;
    }

    .hero__button {
      width: 240px;
      margin: 0 auto;
    }
  }

  .blocklets {
    margin: 40px auto;
  }
`;
