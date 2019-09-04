import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Img from 'gatsby-image';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { graphql } from 'gatsby';

import withRoot from '@arcblock/ux/lib/withTheme';
import withI18n from '@arcblock/www/components/withI18n';
import Layout from '@arcblock/www/components/layouts/default';
import Container from '@arcblock/www/components/container';

import { translations } from '../libs/constant';

class NotFoundPage extends React.PureComponent {
  render() {
    const { data } = this.props;
    return (
      <Layout location={this.props.location} title="404">
        <OutDiv>
          <Container className="section">
            <Grid container spacing={0}>
              <Grid item xs={12} sm={6} md={7}>
                <div className="section_text">
                  <Typography component="h3" variant="h5" className="section_title">
                    Oops! Page not found!
                  </Typography>
                  <Typography component="p" variant="body1" className="section_description">
                    You just hit a route that doesn’t exist.
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={6} md={5}>
                <div className="section_image">
                  <Img fluid={data.noPageImg.childImageSharp.fluid} alt="Platform" />
                </div>
              </Grid>
            </Grid>
          </Container>
        </OutDiv>
      </Layout>
    );
  }
}

NotFoundPage.propTypes = {
  data: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withRoot(withI18n(translations)(NotFoundPage));

export const pageQuery = graphql`
  query NotFoundImages {
    noPageImg: file(relativePath: { eq: "images/404.jpg" }) {
      ...SharpImageFragment
    }
  }
`;

const OutDiv = styled.div`
  background-color: #ffffff;
  height: 60vh;
  padding-top: 40px;
  .section {
    .section_text {
      display: flex;
      justify-content: center;
      flex-flow: column;
      height: 100%;
      .section_title {
        font-size: 32px;
        font-weight: bold;
        color: #404040;
      }
      .section_description {
        font-size: 24px;
        color: #404040;
      }
    }
  }
  .section_image {
    flex-shrink: 0;
    width: 500px;
    @media (max-width: ${props => props.theme.breakpoints.values.md}px) {
      width: 100%;
    }
    img {
      object-fit: contain;
      width: 100%;
      height: auto;
    }
  }
`;
