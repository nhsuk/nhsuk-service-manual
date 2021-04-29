# NHS digital service manual

Guidance for designing and building digital services for the NHS. Things you need to make consistent, usable services that put people first.

## Prerequisite

Install the long-term support (LTS) version of <a href="https://nodejs.org/en/">Node.js</a>, which includes NPM.

## Running the application

Clone the repo: `git clone https://github.com/nhsuk/nhsuk-service-manual.git nhsuk-service-manual` and while in the project directory `cd nhsuk-service-manual`, install the required npm packages with: `npm install`.

Run the project in development mode `npm run watch` and visit <a href="http://localhost:3000">http://localhost:3000</a>.

## Releasing the application

- [Review](https://nhsuk-service-manual-pr.azurewebsites.net/) - code pushed to the `review` branch will deploy to the Review environment (optional environment for content review)
- [Staging](https://nhsuk-service-manual-dev-uks.azurewebsites.net/) - code pushed to the `master` branch will deploy to the Staging environment
- [Live](https://service-manual.nhs.uk/) - git tags created using SEMVER format `v0.0.0` will deploy to the Live environment. (Note: Live is behind a server side cache which results in changes not appearing immediately.)

### Creating a tagged released

Visit the [GitHub releases page](https://github.com/nhsuk/nhsuk-service-manual/releases) and [draft a new release](https://github.com/nhsuk/nhsuk-service-manual/releases/new).
The tag version should be the version in the [CHANGELOG](https://github.com/nhsuk/nhsuk-service-manual/blob/master/CHANGELOG.md) and [package.json](https://github.com/nhsuk/nhsuk-service-manual/blob/master/package.json#L3) files, prefixed with a `v`. For example `v13.15.1`. The release title should be the same.
The release description should be the [CHANGELOG](https://github.com/nhsuk/nhsuk-service-manual/blob/master/package.json#L3) entry for this version's release. You can find examples of other release descriptions on the [GitHub releases page](https://github.com/nhsuk/nhsuk-service-manual/releases).
Then click the Publish release button. 
After a couple of minutes the pipelines will complete and the release will start.

## Get in touch

The NHS digital service manual is maintained by NHS Digital. [Email us](mailto:service-manual@nhs.net), open a [GitHub issue](https://github.com/nhsuk/nhsuk-service-manual/issues/new) or get in touch on the [NHS digital service manual Slack workspace](https://service-manual.nhs.uk/slack).

## Licence

The codebase is released under the MIT Licence, unless stated otherwise. This covers both the codebase and any sample code in the documentation. The documentation is © Crown copyright and available under the terms of the Open Government 3.0 licence.
