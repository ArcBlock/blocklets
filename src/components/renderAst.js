import React from 'react';
import RehypeReact from 'rehype-react';

import Typography from '@material-ui/core/Typography';
import ActionButton from '@arcblock/ux/lib/ActionButton';
import Alert from '@arcblock/ux/lib/Alert';
import CodeBlock from '@arcblock/www/src/components/code';

const components = {
  pre: CodeBlock,
  alert: Alert,
  p: props => <Typography variant="body1" {...props} />,
  h2: props => <Typography variant="h3" {...props} />,
  h3: props => <Typography variant="h4" {...props} />,
  h4: props => <Typography variant="h5" {...props} />,
  h5: props => <Typography variant="h5" {...props} />,
  h6: props => <Typography variant="h6" {...props} />,
  'action-button': ActionButton,
};

function createElement(component, props, children) {
  const Tag =
    (components && component && components[component]) || // Get component from map if present
    component || // Otherwise just the string
    'div'; // Default to div

  // And return the formed component
  return <Tag {...props}>{children}</Tag>;
}

export default new RehypeReact({ createElement }).Compiler;
