# NHS digital service manual

Guidance for designing and building digital services for the NHS. Things you need to make consistent, usable services that put people first.

## Running the application locally

### Prerequisite

Install the long-term support (LTS) version of <a href="https://nodejs.org/en/">Node.js</a>, which includes npm.

### Cloning and running the application

Clone the repo: `git clone https://github.com/nhsuk/nhsuk-service-manual.git nhsuk-service-manual` and while in the project directory `cd nhsuk-service-manual`, install the required npm packages with: `npm install`.

Run the project in development mode `npm run watch` and visit <a href="http://localhost:3000">http://localhost:3000</a>.

Run automated tests locally with `npm run test`.

## Running the application via the browser with Gitpod

Before running Gitpod, you must <a href="https://github.com/apps/gitpod-io/installations/new">install the Gitpod.io application on your GitHub account</a>.

Gitpod also requires access to public repositories. Enable this via <a href="https://gitpod.io/integrations">Gitpod integrations</a>. (Click on the 3 dots to edit permissions for your GitHub account. Gitpod may pre-select permissions. You need read/write access to code in the repos.)

Using your own Github credentials you can create, change, commit and push to branches on our Gitpod container via the "ready to code" button below.

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/nhsuk/nhsuk-service-manual)

Read an <a href="https://www.gitpod.io/docs">introduction to Gitpod (on Gitpod's website)</a>.

## Release lifecycle

### Environments

#### Review

Code pushed to a branch starting with `review/1-` will deploy on the [review/1 environment](https://nhsuk-service-manual-review-wa-1-dev-uks.azurewebsites.net/).

Code pushed to a branch starting with `review/2-` will deploy on the [review/2 environment](https://nhsuk-service-manual-review-wa-2-dev-uks.azurewebsites.net/).

Code pushed to a branch starting with `review/3-` will deploy on the [review/3 environment](https://nhsuk-service-manual-review-wa-3-dev-uks.azurewebsites.net/).

#### Development

Code pushed to a branch starting with `dev/` will deploy on the [development environment](https://nhsuk-service-manual-wa-dev-uks.azurewebsites.net/).

#### User Testing

Code pushed to a branch starting with `user/` will deploy on the [user testing environment](https://nhsuk-service-manual-usertesting-wa-dev-uks.azurewebsites.net/).

#### Staging

Used for very final checks before changes are pushed to the live website.

Code pushed to the `main` branch will deploy to the [Staging environment](https://nhsuk-service-manual-dev-uks.azurewebsites.net/).

#### Live

The live NHS digital service manual website, accessible to the public.

Git tags created using SEMVER format `v0.0.0` will deploy to the [Live environment](https://service-manual.nhs.uk/). (Note: Live is behind a server side cache which results in changes not appearing immediately.)

### Release to live

1. Visit the [GitHub releases page](https://github.com/nhsuk/nhsuk-service-manual/releases) and [draft a new release](https://github.com/nhsuk/nhsuk-service-manual/releases/new).
2. Enter the tag version, using the same version as in the [CHANGELOG](https://github.com/nhsuk/nhsuk-service-manual/blob/main/CHANGELOG.md) and [package.json](https://github.com/nhsuk/nhsuk-service-manual/blob/main/package.json#L3) files, prefixed with a `v`. For example `v13.15.1`.
3. The `main` branch should be preselected. Leave it as it is.
4. Enter the same tag version in the release title box. For example, `v13.15.1`.
5. Enter the [CHANGELOG](https://github.com/nhsuk/nhsuk-service-manual/blob/main/CHANGELOG.md) entry for this version's release in the release description box. You can find examples of other release descriptions on the [GitHub releases page](https://github.com/nhsuk/nhsuk-service-manual/releases).
6. Leave "This is a pre-release" unticked.
7. Leave "Create a discussion for this release" unticked.
8. Then click the Publish release button.
9. After a couple of minutes the Azure Pipeline will complete and the release will start.

### Code Analysis

Code analysis results can be found in [SonarQube](https://sonarcloud.io/project/overview?id=nhsuk-service-manual).

## Get in touch

The NHS digital service manual is maintained by NHS Digital. [Email the service manual team](mailto:england.service-manual@nhs.net), open a [GitHub issue](https://github.com/nhsuk/nhsuk-service-manual/issues/new) or get in touch on the [NHS digital service manual Slack workspace](https://service-manual.nhs.uk/slack).

## Licence

The codebase is released under the MIT Licence, unless stated otherwise. This covers both the codebase and any sample code in the documentation. The documentation is © Crown copyright and available under the terms of the Open Government 3.0 licence.
