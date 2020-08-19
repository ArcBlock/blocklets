VERSION=$(cat version | awk '{$1=$1;print}')
echo "publish version ${VERSION}"

git config --local user.name "wangshijun"
git config --local user.email "wangshijun2010@gmail.com"

make release
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"
npm install -g @abtnode/cli

echo "publishing blocklets blocklet..."
yarn build-blocklet
rm -f www/*.map
rm -rf blocklets/blocklet-registry/static
mv www blocklets/blocklet-registry/static
node tools/pre-publish.js blocklet-registry
cd blocklets/blocklet-registry && npm install && NODE_ENV=production abtnode bundle && npm publish _blocklet --access=public
cd ../../

node tools/post-publish.js
