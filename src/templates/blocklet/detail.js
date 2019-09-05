import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import withTheme from '@arcblock/ux/lib/withTheme';
import withI18n from '@arcblock/www/components/withI18n';
import Layout from '@arcblock/www/components/layouts/default';
import Container from '@arcblock/www/components/container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tag from '@arcblock/ux/lib/Tag';

import { translations } from '../../libs/constant';
import renderAst from '../../components/renderAst';

class BlockletDetail extends React.PureComponent {
  static propTypes = {
    pageContext: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { name, version, keywords, group, htmlAst, logoUrl } = this.props.pageContext.blocklet;
    // TODO: use default logo

    return (
      <Layout location={this.props.location} title={name}>
        <Div>
          <div item xs={12} md={12} className={`header header--${group}`}>
            <Container className="header__inner">
              <Typography component="span" className="header__text">
                <Typography component="span" variant="h2" className="header__text__title">
                  Blocklet.
                </Typography>
                <Typography component="span" variant="h2" className="header__text__group">
                  {group}
                </Typography>
              </Typography>
              <div component="span" className="header__logo">
                <img src={logoUrl} className="header__logo__image" alt={name} />
              </div>
            </Container>
          </div>
          <div className="main">
            <Container>
              <Grid container spacing={24}>
                <Grid item xs={12} md={12} className="meta">
                  <Typography component="h2" variant="h2">
                    {name}
                  </Typography>
                  <Typography component="p">
                    <Tag className="header__tag">{version}</Tag>
                    {Array.isArray(keywords) &&
                      keywords.length > 0 &&
                      keywords.map(keyword => <Tag className="header__tag">{keyword}</Tag>)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={9} className="main">
                  <PostContent
                    component="div"
                    className="content-wrapper markdown-body post-content">
                    {renderAst(htmlAst)}
                  </PostContent>
                </Grid>
                <Grid item xs={12} md={3} className="sidebar">
                  This is sidebar
                </Grid>
              </Grid>
            </Container>
          </div>
        </Div>
      </Layout>
    );
  }
}

export default withTheme(withI18n(translations)(BlockletDetail));

const codeFont = 'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace !important';
const Div = styled.div`
  .header {
    background-color: ${props => props.theme.palette.primary.light};
    height: 160px;

    .header__inner {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
        justify-content: flex-start;
      }
    }

    .header__text {
      margin-top: 60px;
      margin-bottom: 30px;
      display: flex;
      align-items: flex-end;
    }

    .header__text__title {
      font-size: 64px;
      font-weight: bold;
      text-transform: capitalize;
      color: ${props => props.theme.palette.primary.dark};
    }

    .header__text__group {
      font-size: 50px;
      padding: 6px 12px;
      font-weight: bold;
      background-color: ${props => props.theme.palette.primary.dark};
      color: ${props => props.theme.palette.primary.light};
      text-transform: capitalize;
    }

    .header__logo {
      width: 170px;
      height: 160px;
      border-radius: 120px 0 0 120px;
      background-color: ${props => props.theme.palette.primary.main};
      display: flex;
      justify-content: center;
      align-items: center;
      @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
        display: none;
      }

      img {
        width: 120px;
        height: 120px;
      }
    }
  }

  .main {
    margin: 100px 0;
  }

  .markdown-body .highlight pre,
  .markdown-body pre {
    background-color: #222;
    border-radius: 5px;
  }
  .markdown-body code {
    font-family: ${codeFont};
  }
  .markdown-body pre code {
    color: #fff;
    font-size: 14px;
    font-family: ${codeFont};
  }

  .markdown-body h1,
  .markdown-body h2,
  .markdown-body h3,
  .markdown-body h4,
  .markdown-body h5,
  .markdown-body h6 {
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 20px;
    margin-top: 40px;
  }

  .markdown-body .CodeMirror pre {
    background: #f6f8fa !important;
  }
`;

const PostContent = styled(Typography)`
  width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  line-height: 1.5em;

  .alert-content {
    max-width: 100%;
    p:last-of-type {
      margin-bottom: 0;
    }
  }

  iframe {
    width: 100% !important;
  }

  a {
    color: ${props => props.theme.colors.blue};
  }
`;
