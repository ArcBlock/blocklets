import React from 'react';
import Typography from '@material-ui/core/Typography';

// eslint-disable-next-line
export default ({ children }) => (
  <Typography
    component="h2"
    variant="h4"
    style={{
      textAlign: 'center',
      fontWeight: 'bold',
      margin: '80px 0',
    }}>
    {children}
  </Typography>
);
