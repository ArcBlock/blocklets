import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useWindowSize from 'react-use/lib/useWindowSize';
import useMeasure from 'react-use/lib/useMeasure';
import { Link } from 'gatsby';

import withTheme from '@arcblock/ux/lib/withTheme';
import withI18n from '@arcblock/www/components/withI18n';
import Layout from '@arcblock/www/components/layouts/default';
import Container from '@arcblock/www/components/container';
import Typography from '@material-ui/core/Typography';
import Tag from '@arcblock/ux/lib/Tag';
import CodeBlock from '@arcblock/ux/lib/CodeBlock';
import Button from '@arcblock/ux/lib/Button';

import 'github-markdown-css/github-markdown.css';

import { ReactComponent as GithubLogo } from './images/github.svg';
import { translations } from '../../libs/constant';
import renderAst from '../../components/renderAst';
import Stats from '../../components/stats';

function BlockletDetail({ location, pageContext }) {
  const { width: windowWidth } = useWindowSize();
  const [ref, { width }] = useMeasure();
  const {
    name,
    version,
    provider,
    keywords,
    group,
    htmlAst,
    logoUrl,
    gitUrl,
    stats,
    color = 'primary',
  } = pageContext.blocklet;

  return (
    <Layout location={location} title={name}>
      <Div color={color}>
        <div className={`header header--${group}`}>
          <Container className="header__inner">
            <Link to="/blocklets">
              <Typography component="span" className="header__text" ref={ref}>
                <Typography component="span" variant="h2" className="header__text__title">
                  Blocklet.
                </Typography>
                <Typography component="span" variant="h2" className="header__text__group">
                  {group}
                </Typography>
              </Typography>
            </Link>
            <div
              component="span"
              className="header__logo"
              style={{ width: (windowWidth - width) / 2 + 170, right: -(windowWidth - width) / 2 }}>
              <img src={logoUrl} className="header__logo__image" alt={name} />
            </div>
          </Container>
        </div>
        <div className="main">
          <Container>
            <div className="meta">
              <Typography component="h2" variant="h2" className="title">
                {name}
                <Button
                  href={gitUrl}
                  target="_blank"
                  color="default"
                  size="small"
                  variant="contained"
                  className="github">
                  <GithubLogo style={{ marginRight: 3, transform: 'scale(0.5)' }} />
                  View on Github
                </Button>
              </Typography>
              <Stats stats={stats} className="blocklet__stats" />
              <Typography component="p" className="tags">
                <Tag className="tag" type="success">
                  {provider}
                </Tag>
                <Tag className="tag" type="success">
                  v{version}
                </Tag>
                {Array.isArray(keywords) &&
                  keywords.length > 0 &&
                  keywords.map(keyword => (
                    <Tag className="tag" key={keyword}>
                      {keyword}
                    </Tag>
                  ))}
              </Typography>
            </div>
            <div className="markdown-body">
              <PostContent component="div" className="content-wrapper post-content">
                {renderAst(htmlAst)}
              </PostContent>
              <Typography component="h2">Usage</Typography>
              <CodeBlock>{`forge blocklet:use ${name}`}</CodeBlock>
            </div>
          </Container>
        </div>
      </Div>
    </Layout>
  );
}

BlockletDetail.propTypes = {
  pageContext: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withTheme(withI18n(translations)(BlockletDetail));

const codeFont = 'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace !important';
const Div = styled.div`
  .header {
    background-color: ${props => props.theme.palette[props.color].light};
    background-image: radial-gradient(
      ${props => props.theme.palette[props.color].main} 8%,
      transparent 0
    );
    background-size: 20px 20px;
    height: 160px;

    .header__inner {
      position: relative;
    }

    .header__text {
      margin-top: 60px;
      margin-bottom: 30px;
      display: flex;
      align-items: flex-end;
      width: 100%;
    }

    .header__text__title {
      font-size: 64px;
      font-weight: bold;
      text-transform: capitalize;
      color: ${props => props.theme.palette[props.color].dark};
    }

    .header__text__group {
      font-size: 50px;
      padding: 6px 12px;
      font-weight: bold;
      background-color: ${props => props.theme.palette[props.color].dark};
      color: ${props => props.theme.palette[props.color].light};
      text-transform: capitalize;
    }

    .header__logo {
      box-sizing: border-box;
      position: absolute;
      height: 160px;
      border-radius: 120px 0 0 120px;
      padding-left: 50px;
      background-color: ${props => props.theme.palette[props.color].main};
      display: flex;
      justify-content: flex-start;
      align-items: center;
      @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
        display: none;
      }

      img {
        width: 100px;
        height: 100px;
        transition: all 800ms ease-in-out;
      }

      &:hover {
        img {
          transform: rotate(360deg);
        }
      }
    }
  }

  .main {
    margin: 100px 0;

    .title {
      font-size: 40px;
      font-weight: bold;
      color: ${props => props.theme.colors.primary};
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .blocklet__stats {
      margin-bottom: 16px;
    }

    .tags {
      margin: 16px 0 48px;

      .tag {
        margin-right: 8px;
        text-transform: capitalize;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }

    .github {
      padding: 0 8px;
    }
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
