module.exports = {
  service: {
    name: 'coachie',
    mission: 'get coached in esports',
    description: 'awesome esports are awesome and you\'re not.  get better.  coachi.',
    points: [
      { header: 'lolwat' },
      { header: 'lolwat' },
      {
        header: 'Already registered?',
        description: 'Go on then.  Get logged in.  You\'re _groovy_.',
        action: {
          text: 'Log In &raquo;',
          link: '/sessions'
        }
      }
    ],
    icon: 'game'
  },
  database: {
    name: 'chaz'
  }
};
