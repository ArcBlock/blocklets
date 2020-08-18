/* eslint-disable import/prefer-default-export */

export function getBlockletLogo(blocklet) {
  const defaults = {
    official: './images/official.svg',
    community: './images/community.svg',
  };

  // TODO: uncomment this to use blocklet logo after shanghai event
  // if (blocklet.logoUrl) {
  //   return blocklet.logoUrl;
  // }

  if (['official', 'arcblock'].includes(blocklet.provider.toLowerCase())) {
    return defaults.official;
  }

  return defaults.community;
}
