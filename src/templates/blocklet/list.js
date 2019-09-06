import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'gatsby';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tag from '@arcblock/ux/lib/Tag';
import Button from '@arcblock/ux/lib/Button';
import Icon from '@arcblock/ux/lib/Icon';
import withTheme from '@arcblock/ux/lib/withTheme';
import withI18n from '@arcblock/www/components/withI18n';
import Layout from '@arcblock/www/components/layouts/default';
import Container from '@material-ui/core/Container';

import { translations } from '../../libs/constant';

function BlockletList({ pageContext, location }) {
  const { blocklets } = pageContext;
  // FIXME: update this link in production
  const docLink = 'https://arcblock-docs.netlify.com/en/docs/tutorials/writing-blocklets';
  return (
    <Layout location={location} title="Blocklets">
      <Div>
        <Container className="hero" maxWidth="lg">
          <Typography className="hero__title" component="h2">
            Powerful Blocklets.
          </Typography>
          <Typography className="hero__description" component="p">
            ArcBlock is dedicated to continuously deliver innovation, tools and features to help you
            accelerate your blockchain projects.
          </Typography>
          <Button variant="outlined" size="large" className="hero__button" href={docLink}>
            Create New Blocklet
          </Button>
        </Container>
        <Container className="blocklets" maxWidth="lg">
          <Grid container spacing={4}>
            {blocklets.map(blocklet => (
              <Grid item lg={3} md={4} sm={6} xs={12} key={blocklet.bane}>
                <Blocklet color={blocklet.color}>
                  <Link to={blocklet.path}>
                    <div className="blocklet__header">
                      <div className="blocklet__image">
                        <img
                          src={blocklet.logoUrl}
                          className="header__logo__image"
                          alt={blocklet.name}
                        />
                      </div>
                    </div>
                    <div className="blocklet__info">
                      <Typography component="h2" className="blocklet__title">
                        {blocklet.name}
                      </Typography>
                      <Typography component="p" className="blocklet__stats">
                        {blocklet.stats.downloads > 0 && (
                          <span className="blocklet__stat">
                            <Icon
                              name="arrow-to-bottom"
                              size={14}
                              className="blocklet__stat__icon"
                            />
                            {blocklet.stats.downloads}
                          </span>
                        )}
                        {blocklet.stats.star > 0 && (
                          <span className="blocklet__stat">
                            <Icon name="heart" size={14} className="blocklet__stat__icon" />
                            {blocklet.stats.star}
                          </span>
                        )}
                      </Typography>
                      <Typography component="p" className="blocklet__description">
                        {blocklet.description}
                      </Typography>
                      <Typography component="div" className="blocklet__tags">
                        <Tag className="blocklet__tag" type="default">
                          {blocklet.provider}
                        </Tag>
                        <Tag className="blocklet__tag" type="default">
                          v{blocklet.version}
                        </Tag>
                      </Typography>
                    </div>
                  </Link>
                </Blocklet>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Div>
    </Layout>
  );
}

BlockletList.propTypes = {
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withTheme(withI18n(translations)(BlockletList));

const Div = styled.div`
  color: #404040;

  .hero {
    margin-top: 120px;
    text-align: center;
    @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
      margin-top: 60px;
    }

    .hero__title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 24px;
    }

    .hero__description {
      font-size: 16px;
      margin-bottom: 24px;
    }

    .hero__button {
      width: 240px;
      margin: 0 auto;
    }
  }

  .blocklets {
    margin: 80px auto;
    @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
      margin-top: 40px;
      margin-bottom: 40px;
    }
  }
`;

const Blocklet = styled.div`
  margin-bottom: 40px;

  .blocklet__header {
    height: 60px;
    background-color: ${props => props.theme.palette[props.color].light};
    background-image: radial-gradient(
      ${props => props.theme.palette[props.color].main} 10%,
      transparent 0
    );
    background-size: 10px 10px;
  }

  .blocklet__image {
    width: 80px;
    height: 60px;
    border-radius: 0 40px 40px 0;
    padding-right: 10px;
    background-color: ${props => props.theme.palette[props.color].main};
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
      transition: all 800ms ease-in-out;
    }
  }

  .blocklet__info {
    padding: 24px 12px;
  }

  .blocklet__title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }

  .blocklet__stats {
    margin-bottom: 16px;
  }

  .blocklet__stat {
    margin-right: 16px;
    font-size: 14px;
    font-weight: 500;

    .blocklet__stat__icon {
      margin-right: 4px;
    }
  }

  .blocklet__description {
    font-size: 14px;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 24px;
  }

  .blocklet__tag {
    margin-right: 12px;
    text-transform: capitalize;
  }

  &:hover {
    .blocklet__image {
      img {
        transform: rotate(360deg);
      }
    }
  }
`;
