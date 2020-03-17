# NHS digital service manual Changelog

## 3.0.7 - TBD

:new: **New content**

- Add recent Radio 4 interview to content style guide
- Update Patterns index page with new wording after testing

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
