import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql } from 'gatsby';

import Img from 'gatsby-image';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import withRoot from '@arcblock/ux/lib/withTheme';
import withI18n from '@arcblock/www/components/withI18n';
import Layout from '@arcblock/www/components/layouts/default';
import Container from '@arcblock/www/components/container';

import { translations } from '../../libs/constant';

class Developer extends React.PureComponent {
  static propTypes = {
    t: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { data, t } = this.props;
    return (
      <Layout title={t('menu.developer.main')} location={this.props.location}>
        <Div variant="odd">{this.renderHeroSection(data, t)}</Div>
      </Layout>
    );
  }

  renderHeroSection(data, t) {
    return (
      <Container className="section section--hero">
        <Grid container spacing={0}>
          <Grid item xs={12} sm={6} md={7}>
            <div className="hero-text">
              <Typography
                component="h2"
                variant="h4"
                className="section__title"
                dangerouslySetInnerHTML={{ __html: t('developer.hero.title') }}
              />
              <Typography component="h3" variant="h5" className="section__subtitle">
                {t('developer.hero.subtitle')}
              </Typography>
              <Typography component="p" variant="body1" className="section__description">
                {t('developer.hero.description')}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <div className="hero-image">
              <Img fluid={data.heroImage.childImageSharp.fluid} alt="developer" critical={true} />
            </div>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withRoot(withI18n(translations)(Developer));

export const pageQuery = graphql`
  query DeveloperImages {
    heroImage: file(relativePath: { eq: "developer/images/hero@3x.png" }) {
      ...SharpImageFragment
    }
  }
`;

const Div = styled.div`
  padding: 100px 0;
  background-color: ${props => (props.variant === 'even' ? '#fbfbfb' : '#ffffff')};
  @media (max-width: ${props => props.theme.breakpoints.values.md}px) {
    padding: 50px 0;
  }

  .section__title,
  .section__subtitle {
    margin-bottom: 20px;
  }

  .section__description {
    margin-bottom: 40px;
  }

  .section--hero {
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .hero-text {
      flex-grow: 1;
    }

    .hero-image {
      width: 400px;
      flex-shrink: 0;

      img {
        object-fit: contain;
        width: 400px;
        height: 400px;
      }
    }
  }
`;
