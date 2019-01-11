import fs from 'fs';

module.exports = fs.readdirSync('./build').reduce((matches, asset) => {
  ['runtime', 'vendor', 'client'].forEach(assetType => {
    if (asset.match(new RegExp(`^${assetType}`))) {
      matches[assetType] = asset; // eslint-disable-line no-param-reassign
    }
  });
  return matches;
}, {});
