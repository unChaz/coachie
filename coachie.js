var config = require('./config');
var Maki = require('maki');

var chaz = new Maki( config );

var Passport = require('maki-passport-local');
var passport = new Passport({
  resource: 'User'
});

chaz.use( passport );

var GameParticipation = new chaz.mongoose.Schema({
  _user: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'User', required: true },
  _game: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'Game', required: true },
  role: {type:[{ type: String , enum: ['player', 'coach'] }], required: true }
});

chaz.define('User', {
  attributes: {
    username: { type: String , slug: true, max: 32 },
    password: { type: String , masked: true },
    email: { type: String, max: 64, required: true },
    games: [GameParticipation],
    team: { type: String },
    coach: { type: Boolean, default: false, render: { create: false } },
    featured: { type: Boolean, default: false, render: { create: false } },
    bio: { type: String, max: 500 },
    image: { type: 'File' }
  },
  icon: 'user'
});

chaz.define('Review', {
  attributes: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, max: 240 },
    _player: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'User' },
    _coach: { type: chaz.mongoose.SchemaTypes.ObjectId, ref: 'User' }
  },
  icon: 'book',
  internal: true
});

var Game = chaz.define('Game', {
  attributes: {
    shortname: { type: String, index: true },
    name: { type: String },
    image: { type: 'File' }
  },
  icon: 'trophy'
});

var Slot = chaz.define('Slot', {
  attributes: {
    title: { type: String , max: 100 },
    startTime: { type: Date , required: true },
    endTime: { type: Date , required: true },
    rate: { type: Number },
    _creator: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'User' },
    _booking: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'Booking' }
  },
  icon: 'calendar'
});

Slot.pre('create', function(next, done) {
  var slot = this;
  if (!slot.endTime) {
    //By default set endTime to 1 hour after start
    slot.endTime = slot.startTime + 3600 * 1000;
  }
  return next( null , slot );
});

var Booking = chaz.define('Booking', {
  attributes: {
    _slot: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'Slot' },
    _user: { type: chaz.mongoose.SchemaTypes.ObjectId , ref: 'User' },
    price: { type: Number },
    status: { type: String, enum: ['unpaid','cancelled', 'paid', 'refunded', 'complete']}
  },
  icon: 'event'
});

chaz.start(function(err) {
  chaz.app.get('/about', function(req, res, next) {
    res.render('about');
  });

  chaz.app.post('/slots', function(req, res, next) {
    var slot = req.body;
    slot._creator = req.user._id;
    Slot.create( slot , function(err, slot) {
      res.status(303).redirect('/slots/' + slot._id);
    });
  });

});
