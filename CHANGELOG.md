# NHS digital service manual Changelog

## 5.7.4 - 4 April 2022

:wrench: **Maintenance**

- Add 301 redirects from old to new service standards content location (Fixes #1749)

## 5.7.3 - 30 March 2022

:new: **New features**

- Expand the NHS service standard section to include a new technology section
- Add 2 new pages about NHS login and the Personal Demographics Service (PDS)
- Add links from NHS service standard 11 to the NHS login and PDS pages
- Add new posts by Tero Väänänen and Kathryn Grace to the blog posts page
- Link to Tero Väänänen's blog post from service standard points 1, 2 and 6

:wrench: **Maintenance**

- Update site map

## 5.7.2 - 21 February 2022

:new: **New features**

- Turn inclusive language page into inclusive content section 
- Iterate skin symptoms guidance in inclusive content section, adding information about long descriptions
- Mention long descriptions in images component and accessibility guidance
- Update wording about Open Document Formats (with a link) in guidance on PDFs and other non-HTML documents
- Update A to Z of NHS health writing to reflect changes to inclusive content and skin symptoms pages

:wrench: **Maintenance**

- Update entry for NHSX and fix inconsistencies in A to Z of NHS health writing
- Remove mentions of Behind the Headlines from the A to Z
- Update site map
- Added `browserslist` config to `package.json` for Webpack build to fully support Internet Explorer 11

## 5.7.1 - 3 February 2022

:wrench: **Maintenance**

- Remove beta banner from NHS service standard pages
- Small content tweaks on Formatting and punctuation page
- Update service manual team page

## 5.7.0 - 17 January 2022

:new: **New features**

- Add new section on aligning text on formatting and punctuation page
- Add new section on text alignment on typography page

## 5.6.5 - 13 January 2022

:new: **New features**

- Add new entry for "booster" to the A to Z of NHS health writing
- Add word "only" to guidance on avoiding linking to PDFs on Links page

## 5.6.4 - 11 January 2022

:wrench: **Maintenance**

- Removed [NHSUK ESLint config](https://www.npmjs.com/package/eslint-config-nhsuk) as a dependency and replaced with [AirBnB base configuration](https://www.npmjs.com/package/eslint-config-airbnb-base)
- Added [Volta](https://volta.sh/) setting to the `package.json` file so anyone with Volta installed will automatically use a version of Node that is known to be compatible with the current version of the service manual

## 5.6.3 - 6 January 2022

:new: **New features**

- Update closed captions section in accessibility guidance 
- Add more detail about colour contrast and accessibility in design system
- Add sentence about not using "none of the above" to the checkboxes component "none" option
- Link to Involving people and communities in digital services (NHSX's website) from NHS service standards 1 and 5

:wrench: **Fixes**

- Update link to WC3 WCAG2.1 on Links page
- Update link to modulus 11 algorithm information in the pattern for asking users for their NHS number
- Update service manual team page

## 5.6.2 - 16 December 2021

:wrench: **Fixes**

- Update service manual team page. Remove old members and add new member.
- Bug fix on A to Z of NHS health writing page [#1677](https://github.com/nhsuk/nhsuk-service-manual/pull/1677)

## 5.6.1 - 8 December 2021

:wrench: **Fixes**

- Update service manual team page. Remove old members and add new member.
- Added "Would you like to contribute to this guidance?" section at the bottom of the accessibility posters page.

## 5.6.0 - 2 December 2021

:new: **New features**

- Add new page for downloading accessibility posters

:wrench: **Fixes**

- Fix arrow in A to Z of NHS health writing

## 5.5.0 - 29 November 2021

:new: **New features**

- Rework care card component as a pattern to help users decide when and where to get care
- Update links to point to the new pattern from the colour page and from 5 components: action link, card, expander, inset text, warning callout
- Amend the care cards component page to direct people to the new pattern and add a review date component page to direct people to the pattern for reassuring users that a page is up to date 
- Update links to point to the new pattern from 2 content style guide pages: the A to Z of NHS health writing and the Formatting and punctuation page
- Add the word "reuse" alongside "build" and "buy" in the guidance on NHS service standard 11

:wrench: **Fixes**

- Update service manual team page. Remove old members.
- Update site map with new pattern
- Improve search so it no longer treats word after hyphen as a new search, e.g. `x-ra` now returns `x-ray` instead of `Radios`
- Install latest version of NHS.UK frontend (6.0.1)

## 5.4.1 - 28 October 2021

:wrench: **Fixes**

- Remove static `aria-label` attribute on header menu toggle. Replace with descriptive `aria-expanded="false"` on page load.
- Update to make alt-text more findable in the search field
- Update service manual team page. Remove old members and add new members
- Install latest version of NHS.UK frontend (5.2.1)

## 5.4.0 — 19 October 2021

:new: **New features**

- Add start page pattern and guidance

:wrench: **Fixes**

- Change case of word "or" in "none" option for checkboxes

## 5.3.0 - 30 September 2021

:new: **New features**

- Add to checkboxes component - an option for "none" example and guidance
- Add satisfaction survey to design system, style, components and content style guide hub pages
- Update layout of the service manual team page

## 5.2.0 - 22 September 2021

:new: **New features**

- Update Inclusive language page section on ethnicity, religion and nationality
- Add entries for "BAME", "Black or black", "BME", "ethnic minorities", "ethnicity", "race" and "White or white" to the A to Z of NHS health writing
- Add note about "Black or black" and "White or white" to the section on capitalisation on the Formatting and punctuation page
- Add entry for "positive" to the A to Z of NHS health writing

:wrench: **Fixes**

- Install latest version of NHS.UK frontend (5.2.0)
- Update dependencies to the latest versions
- Update team members

## 5.1.0 - 25 August 2021

:new: **New features**

- Add link to week notes from the NHS additional language support discovery
- Add new entries on NHS England and NHS Improvement (NHSEI) and NHSX to the A to Z of NHS health writing
- Add 2 more bullet points to the guidance on image captions in the image component

:wrench: **Fixes**

- Use the correct service header example on the Header components page
- Update team members
- Update dependencies to the latest versions

## 5.0.5 - 17 August 2021

:wrench: **Fixes**

- Update links on the header component examples to match the current NHS website and NHS digital service manual website
- Update dependencies to the latest versions
- Update team members

## 5.0.4 - 30 July 2021

:wrench: **Fixes**

- Updates to team members

## 5.0.3 - 22 July 2021

:new: **New features**

- Add Qualtrics feedback survey to footer, home page and Get in touch

:wrench: **Fixes**

- Fix typo in NHS service standard point 5
- Update dependencies to the latest versions

## 5.0.2 - 8 July 2021

:new: **New features**

- Make minor changes to the NHS service standard, including explaining what we mean by inclusion and accessibility
- Bring all guidance on captions together in the images component and add more detail

:wrench: **Fixes**

- Update dependencies to the latest versions

## 5.0.1 - 28 June 2021

:wrench: **Fixes**

- Add real error message example to date input component
- Update dependencies to the latest versions

## 5.0.0 - 14 June 2021

:new: **New features**

- Display Nunjucks macro options with the Nunjucks code examples

:wrench: **Fixes**

- Update dependencies to the latest versions

## 4.2.0 - 10 June 2021

:new: **New content**

- Update accessibility guidance - change length of alt-text for images
- Add new section on making content about skin symptoms more inclusive to content style guide
- Add new entries in the A to Z of NHS health writing for: black skin, brown skin, redness, skin colour changes, white skin, GP online services and ID
- Update entries for immunisation, jab, vaccination, and vaccine
- Add guidance on writing about skin colour on the Inclusive language page
- Add link to blog post on community and contribution in What's new

:wrench: **Fixes**

- Fix broken health literacy link on the service standard pages [Issue 1136](https://github.com/nhsuk/nhsuk-service-manual/issues/1136)

## 4.1.3 - 8 June 2021

:wrench: **Fixes**

- Update content style guide example and research insight callout boxes
- Fix typo in video and other multimedia content accessibility guidance
- Update dependencies to the latest versions

## 4.1.2 - 15 May 2021

:wrench: **Fixes**

- Fix incorrect example for Lead text typography
- Update dependencies to the latest versions

## 4.1.1 - 14 May 2021

:wrench: **Fixes**

- Fix broken link in What's new updates

## 4.1.0 - 14 May 2021

:new: **New content**

- Update guidance on making video and other multimedia content accessible

:wrench: **Fixes**

- Use the latest version of NHS.UK frontend (v5.1.0)
- Update dependencies to the latest versions

## 4.0.0 - 05 May 2021

:new: **New features**

- Restructure the design examples folder to allow for Nunjucks macro options

:new: **New content**

- Replace Mini-hub pattern example image with full page code snippet

:wrench: **Fixes**

- Update the error summary example to match the NHS.UK frontend example and only include 1 error
- Give the design examples HTML, Nunjucks and Copy functionality titles for Adobe analytics
- Update dependencies to the latest versions

## 3.15.1 - 27 April 2021

:new: **New features**

- Add new entry to A to Z of NHS health writing for GP system supplier names and patient-facing services
- Update service manual team page with new members

:wrench: **Fixes**

- Fix GitHub issue number for PDF page in content style guide
## 3.15.0 - 09 April 2021

:new: **New features**

- Update A to Z of NHS health writing with a link to new GOV.UK coronavirus (COVID-19) A to Z
- Replace Google Analytics with Adobe Analytics and update the cookie policy to include the new cookies [Issue 1101](https://github.com/nhsuk/nhsuk-service-manual/issues/1101)

:wrench: **Fixes**

- Add contribution links to pages across the service manual [Issue 1000](https://github.com/nhsuk/nhsuk-service-manual/issues/1000)
- Find and replace all non-closing `<p>` tags - [Issue 1092](https://github.com/nhsuk/nhsuk-service-manual/issues/1092)
- Fix HTML validation issues with the code examples and OGL footer logo
- Remove duplicate IE11 polyfills
- Update dependencies to the latest versions

## 3.14.2 - 18 March 2021

:wrench: **Fixes**

- Improve content about publishing an accessibility statement
- Make sure "Updated" date is correct on the product and delivery pages in accessibility guidance
- Update the NHS digital service manual team members

## 3.14.1 - 16 March 2021

:wrench: **Fixes**

- Remove role and focusable attributes from the logo

## 3.14.0 - 16 March 2021

:new: **New features**

- Remove the review date component and replace it with the "Reassure users that a page is up to date" pattern.

:wrench: **Fixes**

- Use maincontent as the ID for the main element across the NHS digital service manual and examples for consistency and to match the Skip link anchor (https://github.com/nhsuk/nhsuk-frontend/issues/716)
- Use the latest version of NHS.UK frontend (v5.0.0)
- Update dependencies to the latest versions

## 3.13.0 - 11 March 2021

:new: **New features**
- Add service manual team page

:wrench: **Fixes**

- Update `site-map.njk` 'community' to 'community and contribution'

## 3.12.1 - 08 March 2021
:wrench: **Fixes**

- Update `app.js` redirect URL for `/community`


## 3.12.0 - 08 March 2021

:new: **New features**
- Change name of the contribution section to community and contribution

:wrench: **Fixes**

- Replace broken Chrome link for accessibility page web developer tool

## 3.11.0 - 25 February 2021

:new: **New features**
- Add page template guidance to the design system
- Update guidance on PDFs and other non-HTML documents
- Add explanation and more examples to the section on hyphens and dashes

:wrench: **Fixes**
- Remove readability tools page and explain that we do not recommend them on our health literacy page
- Remove 2 broken links from health literacy page
- Amend the site map page to bring it into line with the site map entry in the style guide
- Remove negative contraction (can't) on Page not found page
- Remove all code related to the readability tool page

## 3.10.1 - 28 January 2021

:wrench: **Fixes**

- Update package dependencies to latest versions
- Remove the `pattern="[0-9]*"` attribute from NHS number examples to allow for spaces
- Update code example for the font weight normal override class

## 3.10.0 - 21 January 2021

:new: **New features**

- Install [NHS.UK frontend v4.1.0](https://github.com/nhsuk/nhsuk-frontend/blob/master/CHANGELOG.md#410---21-january-2021)
- Add guidance for asking for whole numbers using the text input component
- Update code examples with inputmode numeric for the ask users for their NHS number pattern and date input component

:wrench: **Fixes**

- Update package dependencies to latest versions

## 3.9.0 - 19 January 2021

:new: **New features**

- Add more examples to the section on capitalisation in the content style guide
- Add a new entry for "site map" in the A to Z of NHS health writing

:wrench: **Fixes**

- Update the guidance on dates in the content style guide
- Update the entry for the NHS App in the A to Z of NHS health writing
- Add more links between the A to Z of NHS health writing and the rest of the content style guide

## 3.8.0 - 18 December 2020

:new: **New features**

- Added new entries for GUM clinic and vial to the A to Z of NHS health writing

:wrench: **Fixes**

- Add quotation marks to contractions section in style guide to make it clearer
- Update typography list to use real examples
- Remove readability tool page with broken link to SMOG calculator while we consider it further

## 3.7.0 - 9 December 2020

:new: **New features**

- Add link to the new 10 ways the NHS digital service manual can help you blog post
- Add new and updated guidance on using bold, contractions in URLs and page titles, full stops and quotation marks to the content style guide
- Add new entry on vial to the A to Z of NHS health writing
- Update package dependencies to latest versions

:wrench: **Fixes**

- Remove full stops from the card component and other cards to align with content style guide

## 3.6.3 - 11 November 2020

:wrench: **Fixes**

- Fix an issue with the CSP not executing inline scripts
- Update package dependencies to latest versions

## 3.6.2 - 9 November 2020

:wrench: **Fixes**

- Use Helmet to help secure app by setting various HTTP headers
- Create a new route to act as a short URL for the contribution survey
- Update package dependencies to latest versions

## 3.6.1 - 6 November 2020

:wrench: **Fixes**

- Amend typo in NHS service standard point 9
- Hide caption in table about time in content style guide
- Fix typo on the Skip links component page [Issue 330](https://github.com/nhsuk/nhsuk-service-manual-backlog/issues/330)
- Update contact panel to make it clearer which links are for code changes
- Update package dependencies to latest versions

## 3.6.0 - 27 October 2020

:new: **New features**

- Add card component
- Add tag component
- Add responsive table component
- Add `nhsuk-link--no-visited-state` style for links in typography
- Update warning callout guidance with a section on making headings accessible

## 3.5.0 - 29 September 2020

:new: **New features**

- Create new route to act short URL to join our public Slack instance
- Use the Slack link across the website

:wrench: **Fixes**

- Update package dependencies to latest versions

## 3.4.1 - 16 September 2020

:wrench: **Fixes**

- Fix incorrect icon file name for chevron left on the Icons guidance page
- Replace "telephone" entry in A to Z with a "phone" entry and link from "telephone and telephone numbers" to "phone and phone numbers"
- Replace "telephone" with "phone" in forms and text input guidance
- Update package dependencies to latest versions

## 3.4.0 - 4 September 2020

:new: **New content**

- Remove experimental tag from organisational header and summary list component
- Add prototype kit how to guides link to the prototyping page

:wrench: **Fixes**

- Fix design example link focus style
- Fix duplicated content under service user on A to Z of NHS health writing
- Update package dependencies to latest versions

## 3.3.4 - 7 August 2020

:new: **New content**

- Add accessibility posters
- Add new 'Get in touch' page
- Add entry for NHS Test and Trace to A to Z of NHS health writing
- Remove feedback survey

## 3.3.3 - 14 July 2020

:wrench: **Fixes**

- Remove the splunk logging function code to prevent console errors within the cookie banner
- Use DOMContentLoaded event instead of load for performance benefits with the cookie banner
- Update package dependencies to latest versions
- Add building great digital services during a crisis blog post

## 3.3.2 - 30 June 2020

:wrench: **Fixes**

- Prevent the autocomplete from being initialised twice
- Add `role="main"` to `<main>` container for consistency and accessibility fixes
- Update package dependencies to latest versions

## 3.3.1 - 23 June 2020

:wrench: **Fixes**

- Updated first paragraph for "Organisational header"
- Update package dependencies to latest versions
- Use `noopener` and `noreferrer` on links that open in a new window
- Defer the cookie consent to stop the script render blocking the page

## 3.3.0 - 9 June 2020

:new: **New content**

- Update guidance and add more examples for the error message component ([Community backlog Issue 222](https://github.com/nhsuk/nhsuk-service-manual-backlog/issues/222))

:wrench: **Fixes**

- Update package dependencies to latest versions

## 3.2.1 - 18 May 2020

:new: **New content**

- Update community backlog page
- Add guidance for the `<main>` wrapper vertical spacing modifier classes ([Community backlog Issue 221](https://github.com/nhsuk/nhsuk-service-manual-backlog/issues/221))
- Update footer guidance

:wrench: **Fixes**

- Fix A to Z page pattern example

## 3.2.0 - 27 April 2020

:new: **New features**

- Add conditional reveal for radios and checkboxes ([Community backlog Issue 173](https://github.com/nhsuk/nhsuk-service-manual-backlog/issues/173))

:new: **New content**

- Update community backlog page

:wrench: **Fixes**

- Update package dependencies to latest versions

## 3.1.0 - 31 March 2020

:new: **New content**

- Add new video of our public show and tell on YouTube
- Update home page What's new promo box to point to latest blog post
- Add new entries for calories, Deaf people, hearing loss, death and trimesters to A to Z of NHS health writing
- Add a reference from "disease" to "condition" in the A to Z of NHS health writing
- Add a new section on calories to the Numbers, measurements, dates and time page
- Mention social model of disability in the section on disabilities and conditions on the Inclusive language page
- Change memorable number example under telephone numbers in the A to Z of NHS writing and explain that we use "call" or "phone"
- Remove "straight away" from our guidance on hyphens
- Standardise links in the A to Z of NHS health writing

:wrench: **Fixes**

- Install latest version of NHS.UK frontend (3.0.4)
- Update package dependencies to latest versions
- Reword entry for coronavirus (COVID-19) in A to Z of NHS health writing to make it clearer

## 3.0.7 - 23 March 2020

:new: **New content**

- Add recent Radio 4 interview to content style guide
- Update Patterns index page with new wording after testing
- Add feedback survey to help improve the service manual
- Update cookie policy with information about other organisations' cookies
- Update Your privacy page with information about other organisations' cookies and a section on social media
- Update package dependencies to latest versions

:wrench: **Fixes**

- Add error summary to NHS number pattern with errors example
- Fix design example spacing
- Change "services" to "a service" for Google Analytics in the cookie-consent.js

## 3.0.6 - 19 February 2020

- Use the no cookie version of YouTube video embedding
- Remove unused cookie (ARRAffinity) from the cookie policy page as we no longer set this cookie

## 3.0.5 - 18 February 2020

:new: **New content**

- Add new entry in A to Z of NHS health writing for "GP"
- Add explanation about using months up to 2 years on Inclusive language page
- Add new guidance on telephone numbers to A to Z of NHS health writing, based on GOV.UK guidance
- Add new guidance and examples of an error summary and an error message working together ([Community backlog Issue 189](https://github.com/nhsuk/nhsuk-service-manual-backlog/issues/189))
- Add latest show and tell and recent Radio 4 interview to What's new section

:wrench: **Fixes**

- Update entry in A to Z of NHS health writing for "doctor"
- Improve guidance on ordinal numbers on Numbers, measurements, dates and time page
- Remove reference to the Oxford Dictionary for Writers and Editors on content style guide hub page and include contact details instead
- Use the latest version of the NHS.UK frontend library (3.0.3)

## 3.0.4 - 12 February 2020

:new: **New content**

- Update guidance on "sex" and "intersex" on the Inclusive language page.
- Update What's new section with latest changes.

:wrench: **Fixes**

- Fix design example 'Open in new window' link accessibility issue ([Issue 548](https://github.com/nhsuk/nhsuk-service-manual/issues/548))

## 3.0.3 - 4 February 2020

:wrench: **Fixes**

- Remove old CSS/JS caching techniques as this is now covered on the server side
- Clarify guidance on temperature, and edit examples on numbers and measurements page
- Fix a typo on the Warning callout page
- Update package dependencies to latest versions

## 3.0.2 - 29 January 2020

:wrench: **Fixes**

- Add temporary meta data to verify domain with Google
- Update package dependencies to latest versions

## 3.0.1 - 28 January 2020

:wrench: **Fixes**

- use the new open graph images for each section

## 3.0.0 - 28 January 2020

:new: **New features**

- The NHS digital service manual is now a live service (https://service-manual.nhs.uk)
- Add main navigation to the service manual
- Add side navigation to the different sections in the service manual
- Add in-page navigation to longer pages in the service manual

:new: **New content**

- Add a hint text page to components after user research showed users did not look for it under text input or other components
- Add new page: Backlog of components and patterns
- Add new section: "What's new" with updates and blog pages
- Update the Inclusive language page with revised guidance on "sex, gender and sexuality", "race, ethnicity, religion and nationality" and "age"
- Add new entries for "chronic", "acute", "renal" and "kidney" to the A to Z of NHS health writing
- Update the A to Z of NHS health writing with entries on "pharmacy", "chemist" and "sex assigned or registered at birth"
- Make it easier for people to understand negative contractions. Add "can't or cannot" and "don't or do not" to the A to Z of NHS health writing
- Amend the guidance on using the number 1 on the Numbers, measurements, dates and time page
- Amend index page and side navigation of How to write good questions to improve search results
- Add 'Need help?' or 'Get in touch' details to pages across the site
- Update Cookies page to reflect current cookies practice and let people opt in
- Update Terms and conditions page to make it clear the service manual is covered by the Open Government Licence
- Amend Your privacy page to reflect service manual policy and practice

:wrench: **Fixes**

- Remove the /service-manual prefix
- Use the new domain name in the sitemap and configuration files
- Add the cookie policy and declaration pages and logic
- Self host the cookie banner and change content to remove Hotjar/Adobe
- Update the XML sitemap
- Only use Google Analytics on the production environment
- Update the 404 page not found content and add a variable to disable search

## 2.2.0 - 13 January 2020

:new: **New features**

- Display the parent page in search results

:wrench: **Fixes**

- Update package dependencies to latest versions

## 2.1.0 - 6 January 2020

:new: **New features**
- Add entries for "pharmacy", "chemist" and "sex assigned or registered at birth" to the A to Z of NHS health writing

:wrench: **Fixes**

- Add more detail about interoperability standards to section 17 of NHS service standard
- Amend guidance on using the number 1 in Numbers, measurements, dates and time after December Style Council meeting
- Update inclusive language page, especially the section on sex, gender and sexuality
- Update package dependencies to latest versions

## 2.0.1 - 17 December 2019

:wrench: **Fixes**

- Correct formatting of full sentence list style on formatting and punctuation page
- Remove link and clarify direction to research in details page
- Update package dependencies to latest versions
- Update frontend library and prototyping tools breadcrumb

## 2.0.0 - 16 December 2019

:new: **New features**

- Add search functionality to the service manual

:new: **New content**

- NHS service standard

:wrench: **Fixes**

- Update package dependencies to latest versions

## 1.13.4 - 09 December 2019

:wrench: **Fixes**

- Add missing Details component JavaScript polyfill
- Use https on all external links and fix broken link on the test your questions page
- Remove the unnecessary type attribute from JavaScript resources
- Fix broken link to the PDF page on sitemap page
- Update accessibility footer link to accessibility statement
- Make filter question image decorative using alt null

## 1.13.3 - 25 November 2019

:wrench: **Fixes**

- Made it clear in PDF guidance that PDFs can be used for a permanent record
- Added an additional bullet point on PDFs being used as a permanent record.
- Refactor CSS and HTML to clean up the code base and make the spacing more consistent

## 1.13.2 - 18 November 2019

:wrench: **Fixes**

- Update PDF and links pages and related content

## 1.13.1 - 12 November 2019

:wrench: **Fixes**

- clarify start of project questions for product and delivery in Accessibility guidance
- fix incorrect url on summary list component to github issue
- use latest version of the nhsuk-frontend (3.0.2)
- Consistent HTML spacing and indenting to make the code easier to read
- Remove unnecessary spacing override classes
- Create 2 new page layouts (full width and two thirds) to reduce code duplication
- Add Sass styles to constrain widths of elements when using the full width layout
- cache bust CSS and JavaScript assets
- remove duplicate import for the radios nunjucks macro

## 1.13.0 - 7 November 2019

:new: **New content**

- Guidance on how to write good questions in forms
- Improvements to the Header component page with guidance on the new organisational header
- New page: Understanding focus state styles
- Summary list component
- Asking users for their NHS number pattern
- NHS number entry in A to Z of NHS health writing
- Improved guidance for colour and typography

:wrench: **Fixes**

- Capitalise GOV.UK 'Design System'
- Tidy up the colours and typography pages with more examples and improve page design
- Improve the guidance around use of the Frutiger font
- Remove the hint text page and include guidance for hint text on individual component pages
- Use the latest version of NHS.UK frontend (3.0.0) including new focus styles
- Fix the Nunjucks snippets for the A to Z and Mini-hub patterns

## 1.12.0 - 21 October 2019

:new: **New content**

- Add contribution criteria for community contribution

:wrench: **Fixes**

- Update the guidance around usage of Do & Don't lists on their own
- Update package dependencies to latest versions

## 1.11.0 - 2 October 2019

:new: **New content**

- Add new entry to A to Z of NHS health writing for "PMS (premenstrual syndrome)"

:wrench: **Fixes**

- Amend entries for GP surgery and seizure or fit in the A to Z of NHS health writing
- Delete mention of wizard behind the curtain from accessibility guidance
- Update package dependencies to latest versions
- Update the Slack workspace URL

## 1.10.4 - 24 September 2019

:wrench: **Fixes**

- Remove the old basic cookie consent solution
- Implement the new cookie consent solution
- Remove feedback survey from the sitemap

## 1.10.3 - 19 September 2019

:wrench: **Fixes**

- Remove redundant Adobe Analytics code
- Anonymize IP addresses in Google Analytics
- Update package dependencies to latest versions
- Remove feedback survey from the footer
- Use the correct class names for the typography size modifiers

## 1.10.2 - 16 September 2019

:wrench: **Fixes**

- Remove the search JavaScript until the search functionality is complete

## 1.10.1 - 11 September 2019

:wrench: **Fixes**

- Use the latest version of the NHS.UK frontend library (v2.3.1)
- Update package dependencies to latest versions

## 1.10.0 - 4 September 2019

:new: **New content**

- Add new entries to A to Z of NHS health writing, including: "baby", "foetus", "drowsy", "sleepy", "preconception care", "seizure or fit"

:wrench: **Fixes**

- Add mini-hub at top of Inclusive language page and change "baby" in section on Age
- Update entry for summary care record in A to Z of NHS health writing
- Update package dependencies to latest versions

## 1.9.0 - 21 August 2019

:new: **New content**

- Add more guidance for content designers to the care card page
- Add "red book" and inclusive language terms to A to Z of NHS health writing

:wrench: **Fixes**

- Update inclusive language page in content style guide, especially guidance on sex, gender and sexuality
- Change "measurement" to "measurements" in Numbers, measurements, dates and time - and update links to this page
- Improve wording about ordinal numbers on Numbers, measurements, dates and time

## 1.8.0 - 9 August 2019

:new: **New content**

- Add entries to A to Z of NHS health writing: health record and related terms

:wrench: **Fixes**

- Remove duplicate entry from the XML sitemap
- Accessibility: Updated home link aria label, it now reads as "NHS digital service manual homepage"
- Fix a few minor content formatting issues, like apostrophes
- Update package dependencies to latest versions

## 1.7.0 - 6 August 2019

:new: **New content**

- Add new page in content style guide with updated guidance on numbers, measurement, dates and time
- Add new numbers terms to A to Z of health writing

:wrench: **Fixes**

- Update the guidance for how we use the microgram symbol
- Update the guidance for how we write concisely with example
- Update package dependencies to latest versions

## 1.6.2 - 30 July 2019

:wrench: **Fixes**

- Use the latest version of the NHS.UK frontend library (v2.3.0)
- Use the latest NHS website Open Graph assets and metadata
- Update package dependencies to latest versions
- Accessibility guidance pages grammar and content updates
- Add 'homeless' to the A-Z of NHS health writing
- Add external links to the links and PDF guidance pages

## 1.6.1 - 22 July 2019

:wrench: **Fixes**

- Update package dependencies to latest versions
- Remove page section from the Open Graph meta title
- Fix broken link to the privacy policy on the sitemap page
- Update the link to the contribution criteria

## 1.6.0 - 8 July 2019

:new: **New content**

- Accessibility guidance pages

:wrench: **Fixes**

- Update package dependencies to latest versions

## 1.5.0 - 1 July 2019

:new: **New content**

- New content in the A to Z of NHS health writing, including cervical screening, people, patients and service users
- Publish new patterns for A to Z and Mini-hub
- Accessibility statement

:wrench: **Fixes**

- Update package dependencies to latest versions
- Prevent the code snippets from escaping the container on mobile ([Issue 190](https://github.com/nhsuk/nhsuk-service-manual/issues/190))
- Tidy up the core application structure and configuration ([Issue 196](https://github.com/nhsuk/nhsuk-service-manual/issues/196))
- Swap the white background around on the homepage and tidy up the HTML markup
- Update to version 2.2.0 of the NHS.UK frontend library - with favicon changes in layout file

## 1.4.1 - 26 April 2019

:wrench: **Fixes**

- Prevent the CSS and JavaScript files being cached for too long with cache busting
- Update package dependencies to the latest versions

## 1.4.0 - 26 April 2019

:new: **New content**

- Example of a transactional header with service name on the header component page
- Publish new styles: Spacing

 :wrench: **Fixes**

- Update package dependencies including latest version (2.1.0) of the NHS.UK frontend
- Remove checked attribute from the radio button example
- Fix the page width of the radio component page
- Fix broken email anchor link
- Fixed hyphens in modifier class names on typography page

## 1.3.0 - 5 April 2019

:new: **New content**

- Add more terms to the A to Z of NHS health writing after March Style Council meeting, plus other content updates

:wrench: **Fixes**

- Rename Grid page - now Layout - and iterate content

## 1.2.0 - 12 March 2019

:new: **New features**

- Publish new contribution pages for proposing and working on new features with contribution criteria

:wrench: **Fixes**

- Use the correct paths in the component code snippets for importing Nunjucks macros
- Add links to discuss each of the component on the GitHub service manual backlog
- Use latest version of the NHS.UK frontend library (2.0.0)
- Amend typo on the inset text component page

## 1.1.1 - 4 March 2019

:wrench: **Fixes**

- Add more terms to A to Z of NHS health writing after January Style Council meeting
- Update temperature info on Formatting and punctuation page and link to A to Z

## 1.1.0 - 26 February 2019

:new: **New features**

- Publish new components; Back link, Contents list, Details,
Expander, Images, Pagination, Review date, Skip link and Table
- Draft first release of the service standard pages

:wrench: **Fixes**

- Updated the guidance on using icons and buttons user research
- Fix broken links across the manual such as breadcrumb
- Fix spelling mistakes across the manual such as sufar to sugar
- Change `/content-style-guide/` page URL to `/content/`
- Report the correct http status code on 404 page not found pages
- Reduce the file size of the design principles PDF
- Use the corrext Sass colour variable names and colour hex codes
- Fix broken breadcrumb Home link on error message component page

## 1.0.0 - 5 February 2019

:tada: **Official release of the NHS digital service manual**
