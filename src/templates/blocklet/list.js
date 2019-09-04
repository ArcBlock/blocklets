import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { graphql } from 'gatsby';

import withTheme from '@arcblock/ux/lib/withTheme';

import withI18n from '@arcblock/www/components/withI18n';
import Layout from '@arcblock/www/components/layouts/default';

import { translations } from '../../libs/constant';

class BlockletList extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    pageContext: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    const { data, pageContext } = this.props;

    return (
      <Layout location={this.props.location} title="Blocklets">
        <Div>
          <pre>
            <code>{JSON.stringify(data, true, 2)}</code>
          </pre>
          <pre>
            <code>{JSON.stringify(pageContext, true, 2)}</code>
          </pre>
        </Div>
      </Layout>
    );
  }
}

export default withTheme(withI18n(translations)(BlockletList));

// export const query = graphql`
//   query($path: String!) {
//     markdownRemark(frontmatter: { path: { eq: $path }, layout: { eq: "page" } }) {
//       id
//       pageHtmlAst
//       frontmatter {
//         path
//         date
//         tags
//         categories
//         language
//         title
//         description
//         keywords
//         robots
//         disableHeader
//         darkHeader
//         layout
//         pageType
//         backgroundImage {
//           id
//           publicURL
//           childImageSharp {
//             fluid(maxWidth: 2000) {
//               ...GatsbyImageSharpFluid_noBase64
//             }
//           }
//         }
//         logoColor
//         logoImage {
//           id
//           publicURL
//         }
//       }
//     }
//   }
// `;

const Div = styled.div``;
