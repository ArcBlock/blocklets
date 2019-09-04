import React from 'react';
import RehypeReact from 'rehype-react';

import ActionButton from '@arcblock/ux/lib/ActionButton';
import Alert from '@arcblock/ux/lib/Alert';
import CodeBlock from '@arcblock/www/components/code';

const components = {
  pre: CodeBlock,
  alert: Alert,
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
