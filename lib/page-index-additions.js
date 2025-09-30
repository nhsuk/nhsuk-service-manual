/**
 * Page specific
 */
const additionalIndices = {
  '/accessibility/content': ['alt-text, alt text, alternative'],
  '/accessibility/testing': ['svg'],
  '/community-and-contribution/community-resources': [
    'figma, mural, react, wordpress'
  ],
  '/design-system/components': ['elements'],
  '/design-system/components/action-link': ['call to action, cta'],
  '/design-system/components/back-link': ['return link, back button'],
  '/design-system/components/breadcrumbs': ['navigation path, cookie crumb'],
  '/design-system/components/card': ['panel, promo'],
  '/design-system/components/care-cards': [
    'non-urgent care card, blue care card, red care card, immediate care card, emergency care card'
  ],
  '/design-system/components/checkboxes': [
    'check boxes, tickboxes, tick boxes'
  ],
  '/design-system/components/details': [
    'reveal, progressive disclosure, hidden text, show and hide'
  ],
  '/design-system/components/error-message': ['validation message'],
  '/design-system/components/expander': ['reveal, accordion'],
  '/design-system/components/header': ['banner'],
  '/design-system/components/hint-text': ['helper text'],
  '/design-system/components/images': ['pictures, photos'],
  '/design-system/components/inset-text': [
    'information, highlighted text, callout'
  ],
  '/design-system/components/pagination': ['previous page, next page'],
  '/design-system/components/radios': ['radio buttons, option buttons'],
  '/design-system/components/select': [
    'drop down menu, list box, drop down list, combo box, pop-up menu'
  ],
  '/design-system/components/skip-link': [
    'skip to body content, Skip navigation link'
  ],
  '/design-system/components/summary-list': ['definition list'],
  '/design-system/components/table': ['responsive table'],
  '/design-system/components/tag': ['chip, badge, flag, token'],
  '/design-system/components/task-list': ['tasks', 'section', 'todo', 'to-do'],
  '/design-system/components/text-input': [
    'text box, text field, input field, text entry box'
  ],
  '/design-system/components/textarea': [
    'big text box, multi-line text box, multi-line text field'
  ],
  '/design-system/components/typography': ['fonts'],
  '/design-system/components/warning-callout': [
    'yellow callout, warning box, important'
  ],
  '/design-system/patterns/a-to-z-page': [
    'A to Z, alphabet, a-z, az, a to z, page list, a-to-z, atoz'
  ],
  '/design-system/patterns/check-answers': [
    'summary, confirm, review, change answers'
  ],
  '/design-system/patterns/find-bsl-content': [
    'sign langage, interpreter, translation, bsl icon'
  ],
  '/design-system/patterns/know-that-a-page-is-up-to-date': [
    'review date, date updated'
  ],
  '/design-system/styles/colour': ['palette'],
  '/design-system/styles/layout': ['grid'],
  '/design-system/styles/spacing': ['margin, padding'],
  '/get-in-touch': ['contact, contact us, support, get in touch'],
  '/whats-new/blog-posts': ['news, updates'],
  '/whats-new/updates': ['news, latest changes']
}

// Term specific
const alternativeSpelling = {
  '&': ['ampersand'],
  '5 A Day': ['Five A Day'],
  'A&E': ['accident and emergency'],
  'GP surgery': ['GP practice'],
  OK: ['okay'],
  'PMS (premenstrual syndrome)': ['pre-menstrual syndrome'],
  STI: ['STD'],
  'X-ray': ['xray'],
  ageing: ['aging'],
  'alzheimer’s': ['alzheimers', 'alzheimer'],
  'alzheimer’s disease': ['Alzheimers disease'],
  'breast milk': ['breastmilk'],
  components: ['elements'],
  dietitian: ['dietician'],
  eg: ['e.g.'],
  faeces: ['feces'],
  fever: ['temperature'],
  'filter questions': ['branch questions, Yes and No questions'],
  flu: ['influenza'],
  foetus: ['fetus'],
  haemorrhage: ['hemorrhage'],
  healthcare: ['health care'],
  'home help': ['homehelp'],
  ie: ['i.e.'],
  immunisation: ['immunization'],
  inpatient: ['in-patient'],
  'lip-reading ': ['lipreading'],
  'mad cow disease': ['mad cow’s disease'],
  microgram: ['mcg'],
  organisations: ['organizations'],
  outpatient: ['out-patient'],
  practice: ['practise'],
  'preconception care': ['pre-conception care'],
  sensitivities: ['sensitive questions'],
  'summary care record': ['SCR'],
  temperature: ['fever'],
  tranquillise: ['tranquillize'],
  tranquilliser: ['tranqullizer'],
  'urinary tract infections': ['UTIs'],
  'walk-in centre': ['walk in centre'],
  wellbeing: ['well-being'],
  'zimmer frame': ['zimmerframe']
}

const indexBlacklist = [
  '/',
  'https://nhsdigital.eu.qualtrics.com/jfe/form/SV_4SKczWOHvnneiWh'
]

module.exports = { additionalIndices, alternativeSpelling, indexBlacklist }
