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

export const formatPerson = person => {
  if (!person) {
    return '-';
  }
  if (typeof person === 'string') {
    return person;
  }

  const name = person.name || '';
  const u = person.url || person.web;
  const url = u ? ` (${u})` : '';
  const e = person.email || person.mail;
  const email = e ? ` <${e}>` : '';

  return name + email + url;
};
