module.exports = {
  service: {
    name: 'Coachster',
    mission: 'eSport Coach Matchmaking Made Easy',
    description: 'eSports Coach Matchmaking.',
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
          link: '/users',
          color: 'blue'
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
    ],
    icon: 'game'
  },
  database: {
    name: 'coachie'
  }
};
