VERSION=$(cat version | awk '{$1=$1;print}')
echo "publish version ${VERSION}"

git config --local user.name "wangshijun"
git config --local user.email "wangshijun2010@gmail.com"

make release
npm config set '//registry.npmjs.org/:_authToken' "${NPM_TOKEN}"

echo "publishing blocklets blocklet..."
yarn build
rm -rf blocklets/blocklets-blocklet/static
mv www blocklets/blocklets-blocklet/static
node tools/pre-publish.js blocklets-blocklet
cd blocklets/blocklets-blocklet && npm install && NODE_ENV=production abtnode bundle && npm publish _blocklet
cd ../../

node tools/post-publish.js
