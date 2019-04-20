workflow "Install, Lint, Test, Build, and Publish" {
  on = "push"
  resolves = ["Publish"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Link" {
  needs = "Install"
  uses = "actions/npm@master"
  args = "link"
}

action "Lint" {
  needs = "Link"
  uses = "actions/npm@master"
  args = "run lint"
}

action "Test" {
  needs = "Lint"
  uses = "actions/npm@master"
  args = "run test"
}

action "Build" {
  needs = "Test"
  uses = "actions/npm@master"
  args = "run build"
}

action "Tag" {
  needs = "Build"
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "Publish" {
  needs = "Tag"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
