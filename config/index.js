module.exports = {
  service: {
    name: 'coachie',
    mission: 'get coached in esports',
    description: 'awesome esports are awesome and you\'re not.  get better.  coachi.',
    points: [
      { header: 'Find a coach',
        description: 'Find someone coaching your game right now.',
        action: {
          text: 'browse games',
          link: '/games'
        }

      },
      { header: 'Get Started',
        description: 'Sign up to coach or be coached',
        action: {
          text: 'Sign up',
          link: '/users'
        }
      },
      {
        header: 'Already registered?',
        description: 'Go on then.  Get logged in.  You\'re _groovy_.',
        action: {
          text: 'Log In &raquo;',
          link: '/sessions'
        }
      }
    ]
  },
  database: {
    name: 'coachie'
  }
};
