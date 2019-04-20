workflow "Install, Lint, Test, Build, and Publish" {
  on = "push"
  resolves = ["Publish"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}
action "Lint" {
  needs = "Install"
  uses = "actions/npm@master"
  args = "run lint"
}

action "Build" {
  needs = "Lint"
  uses = "actions/npm@master"
  args = "run build"
}

action "Link" {
  needs = "Build"
  uses = "actions/npm@master"
  args = "link"
}

action "Test" {
  needs = "Lint"
  uses = "actions/npm@master"
  args = "run test"
}

action "Tag" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "tag"
}

action "Publish" {
  needs = "Tag"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
