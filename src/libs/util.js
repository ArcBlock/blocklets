/* eslint-disable import/prefer-default-export */
export function getBlockletLogo() {
  const defaults = {
    official: '/images/official.svg',
    community: '/images/community.svg',
  };

  // TODO: uncomment this to use blocklet logo after shanghai event
  // if (blocklet.logoUrl) {
  //   return blocklet.logoUrl;
  // }

  return defaults.official;
}
