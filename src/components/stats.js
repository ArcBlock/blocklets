import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import Icon from '@arcblock/ux/lib/Icon';

export default function Stats({ stats, ...rest }) {
  return (
    <Div component="p" {...rest}>
      {stats.downloads > 0 && (
        <span className="blocklet__stat">
          <Icon name="arrow-to-bottom" size={14} className="blocklet__stat__icon" />
          {stats.downloads}
        </span>
      )}
      {stats.star > 0 && (
        <span className="blocklet__stat">
          <Icon name="heart" size={14} className="blocklet__stat__icon" />
          {stats.star}
        </span>
      )}
    </Div>
  );
}

Stats.propTypes = {
  stats: PropTypes.object.isRequired,
};

const Div = styled(Typography)`
  .blocklet__stat {
    margin-right: 16px;
    font-size: 14px;
    font-weight: 500;

    .blocklet__stat__icon {
      margin-right: 4px;
    }
  }
`;
