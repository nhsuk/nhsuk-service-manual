const additionalIndices = {
  '/service-manual/accessibility/testing': [ 'svg' ]
};


const alternativeSpelling = {
  'alzheimer’s': [ 'alzheimers', 'alzheimer' ],
  'fever': [ 'temperature' ],
  'temperature': [ 'fever' ]
};

const indexBlacklist = [
  '/service-manual/',
  'https://nhsdigital.eu.qualtrics.com/jfe/form/SV_4SKczWOHvnneiWh'
];

module.exports = { additionalIndices, alternativeSpelling, indexBlacklist };
