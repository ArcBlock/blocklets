#!/usr/bin/env bash

## Main Repo build can be triggered by PR Merge | content/theme repo PR Merge

# constants
VERSION_FILE="version"
VERSION_FOLDER=".versions"
DEPENDENCY_CHANGED=false
MAIN_CHANGED=false


## 1. update submodules
echo "Updating submodules..."
git config --local user.name "wangshijun"
git config --local user.email "wangshijun2010@gmail.com"
git checkout master
git pull origin master
git submodule update --remote
git submodule status


## step 2~6 should only be executed on master
if [ "$TRAVIS_PULL_REQUEST" = false ]; then
  ## 2. check for submodule status by updating dependency version files and run `git status`: DEPENDENCY_CHANGED
  echo "Check submodule status..."
  GIT_STATUS_SUBMODULE=`git status --short`
  echo "$GIT_STATUS_SUBMODULE"
  if [ "$GIT_STATUS_SUBMODULE" != "" ]; then
    echo "Dependency versions have changed!"
    DEPENDENCY_CHANGED=true
  fi


  ## 3. check for main repo status by compare versions: MAIN_CHANGED
  LAST_VERSION=`cat $VERSION_FOLDER/$VERSION_FILE`
  LATEST_VERSION=`cat $VERSION_FILE`
  if [ "$LAST_VERSION" != "$LATEST_VERSION" ]; then
    echo "Main version have changed!"
    MAIN_CHANGED=true
  fi

  echo "DEPENDENCY_CHANGED: $DEPENDENCY_CHANGED, MAIN_CHANGED: $MAIN_CHANGED"
  echo $LATEST_VERSION > $VERSION_FOLDER/$VERSION_FILE

  ## Release strategy matrix
  # --------------------------------------------------------------------------
  #                         |   MAIN_CHANGED=YES    |   MAIN_CHANGED=NO     |
  # --------------------------------------------------------------------------
  # DEPENDENCY_CHANGED=YES  |   do ACTIVE_RELEASE   |   do PASSIVE_RELEASE  |
  # DEPENDENCY_CHANGED=NO   |   do ACTIVE_RELEASE   |   no release needed   |
  # --------------------------------------------------------------------------
  if [ "$DEPENDENCY_CHANGED" = false ] && [ "$MAIN_CHANGED" = false ]; then
    echo "Nothing changed, no release can be produced, abort!"
    exit 1
  fi

  ## 4. if PASSIVE_RELEASE=true: update main repo version (not standard bumpversion)
  if [ "$DEPENDENCY_CHANGED" = true ] && [ "$MAIN_CHANGED" = false ]; then
    VERSION_MAJOR=`echo $LATEST_VERSION | awk -F. '{print $1}'`
    VERSION_MINOR=`echo $LATEST_VERSION | awk -F. '{print $2}'`
    VERSION_PATCH=`echo $LATEST_VERSION | awk -F. '{print $3}'`
    VERSION_PATCH=$((VERSION_PATCH + 1))
    NEXT_VERSION="$VERSION_MAJOR.$VERSION_MINOR.$VERSION_PATCH"
    echo "Bump version: $LATEST_VERSION => $NEXT_VERSION"
    echo $NEXT_VERSION > $VERSION_FILE
    echo $NEXT_VERSION > $VERSION_FOLDER/$VERSION_FILE
  fi


  ## 5. update dependency version;
  VERSIONS=`git submodule status`
  echo "Persist version for dependency..."
  IFS=$'\n'
  for line in $VERSIONS
  do
    REPO_VERSION=$(echo "$line" | awk '{print $1}' | tr -d + | tr -d -)
    REPO_NAME=$(echo "$line" | awk '{print $2}' | awk -F/ '{print $NF}')
    REPO_FILE=$VERSION_FOLDER/$REPO_NAME
    echo "Persist version: $REPO_VERSION for repo $REPO_NAME to file $REPO_FILE"

    touch $REPO_FILE
    echo "$REPO_VERSION" > $REPO_FILE
  done
fi

## 9. commit changes to files, only on master
if [ "$TRAVIS_PULL_REQUEST" = false ]; then
  echo "Commit dependency and version changes..."
  git remote remove origin
  git remote add origin "https://$GITHUB_TOKEN@github.com/$TRAVIS_REPO_SLUG.git"
  git status
  git commit -am 'update dependencies and bump version'
  git push origin master
fi
