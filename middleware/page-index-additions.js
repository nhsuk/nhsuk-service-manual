const additionalIndicies = {
  '/service-manual/accessibility/testing': [ 'svg' ]
}


const alternativeSpelling = {
  'alzheimer’s': [ 'alzheimers', 'alzheimer' ]
}

const indexBlacklist = [
  '/service-manual/privacy-policy',
  '/service-manual/',
  'https://nhsdigital.eu.qualtrics.com/jfe/form/SV_4SKczWOHvnneiWh'
]

module.exports = { additionalIndicies, alternativeSpelling, indexBlacklist }
