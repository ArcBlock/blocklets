import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'gatsby';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Tag from '@arcblock/ux/lib/Tag';
import Button from '@arcblock/ux/lib/Button';

import Stats from './stats';
import { getBlockletLogo } from '../libs/util';

export default function BlockletList({ blocklets, group, ...rest }) {
  const groupedBlocklets = blocklets.reduce(
    (acc, x) => {
      if (!acc[x.group]) {
        acc[x.group] = [];
      }

      acc[x.group].push(x);
      acc.all.push(x);
      return acc;
    },
    { all: [] }
  );

  const [currentGroup, setCurrentGroup] = React.useState(groupedBlocklets[group] ? group : 'all');
  const groups = Object.keys(groupedBlocklets);
  const docLink = 'https://github.com/ArcBlock/blocklets';

  return (
    <Container maxWidth="lg" {...rest}>
      <Grid container spacing={4}>
        {groups.length > 1 && (
          <Grid item xs={12} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <ButtonGroup className="group-selector">
              {groups.map(x => (
                <Button
                  key={x}
                  variant={x === currentGroup ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setCurrentGroup(x)}>
                  {x}
                </Button>
              ))}
            </ButtonGroup>
            <Button variant="outlined" className="hero__button" href={docLink}>
              Create New Blocklet
            </Button>
          </Grid>
        )}
        {groupedBlocklets[currentGroup].map(x => (
          <Grid item lg={3} md={4} sm={6} xs={12} key={x.name}>
            <Blocklet color="primary">
              <Link to={x.path}>
                <div className="blocklet__header">
                  <div className="blocklet__image">
                    <img src={getBlockletLogo(x)} className="header__logo__image" alt={x.name} />
                  </div>
                  <span className="blocklet__group">{x.group}</span>
                </div>
                <div className="blocklet__info">
                  <Typography component="h2" className="blocklet__title" title={x.name}>
                    {x.name}
                  </Typography>
                  <Stats stats={x.stats} className="blocklet__stats" />
                  <Typography component="p" className="blocklet__description" title={x.description}>
                    {x.description}
                  </Typography>
                  <Typography component="div" className="blocklet__tags">
                    <Tag className="blocklet__tag" type="default">
                      v{x.version}
                    </Tag>
                  </Typography>
                </div>
              </Link>
            </Blocklet>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

BlockletList.propTypes = {
  blocklets: PropTypes.array.isRequired,
  group: PropTypes.string,
};

BlockletList.defaultProps = {
  group: 'all',
};

const Blocklet = styled.div`
  margin-bottom: 40px;
  border: 1px solid ${props => props.theme.palette[props.color].main};
  @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
    margin-bottom: 0;
  }

  .blocklet__header {
    height: 60px;
    background-color: ${props => props.theme.palette[props.color].light};
    background-image: radial-gradient(${props => props.theme.palette[props.color].main} 10%, transparent 0);
    background-size: 10px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .blocklet__image {
    width: 80px;
    height: 60px;
    border-radius: 0 30px 30px 0;
    padding-right: 10px;
    background-color: ${props => props.theme.palette[props.color].main};
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 40px;
      height: 40px;
    }
  }

  .blocklet__group {
    background-color: ${props => props.theme.palette[props.color].dark};
    color: ${props => props.theme.palette[props.color].main};
    font-size: 20px;
    font-weight: 900;
    padding: 3px 12px;
    text-transform: capitalize;
  }

  .blocklet__info {
    padding: 24px 12px;
  }

  .blocklet__title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 16px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-height: 1.5rem;
    max-height: 1.5rem;
    width: 100%;
    white-space: nowrap;
  }

  .blocklet__stats {
    margin-bottom: 16px;
  }

  .blocklet__description {
    font-size: 14px;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 24px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-height: 1.5rem;
    max-height: 4.5rem;
    height: 4.5rem;
  }

  .blocklet__tag {
    margin-right: 12px;
    text-transform: capitalize;
  }
`;
