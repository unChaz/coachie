// config
var config = require('./config');

// Core
var Maki = require('maki');
var coachie = new Maki( config );
var jsonpatch = require('fast-json-patch');

// Plugins
var Passport = require('maki-passport-local');
var passport = new Passport({
  resource: 'Person'
});

coachie.use( passport );

var Relationship = coachie.define('Relationship', {
  attributes: {
    _user: { type: coachie.mongoose.SchemaTypes.ObjectId , ref: 'Person', required: true },
    _game: {
      type: coachie.mongoose.SchemaTypes.ObjectId,
      ref: 'Game',
      required: true
    },
    role: [{ type: String , enum: ['player', 'coach'], required: true }]
  }
});

var Person = coachie.define('Person', {
  attributes: {
    username: { type: String , slug: true, max: 32 },
    password: { type: String , masked: true },
    email: { type: String, max: 64, required: true },
    relationships: [ { type: coachie.mongoose.SchemaTypes.ObjectId , ref: 'Relationship' } ],
    team: { type: String },
    coach: { type: Boolean, default: false, render: { create: false } },
    featured: { type: Boolean, default: false, render: { create: false } },
    bio: { type: String, max: 500 },
    image: { type: 'File' }
  },
  requires: {
    'Relationship': {
      filter: function() {
        var user = this;
        return { _id: { $in: user.relationships } };
      },
      populate: '_game'
    }
  },
  icon: 'user'
});

Relationship.on('create', function(relationship) {
  Person.patch({ _id: relationship._user }, [
    { op: 'add', path: '/relationships/0' , value: relationship._id }
  ], function(err, num) {
    // all done!
  });
});

coachie.define('Review', {
  attributes: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, max: 240 },
    _player: {
      type: coachie.mongoose.SchemaTypes.ObjectId,
      ref: 'Person',
      populate: [{
        method: 'get',
        fields: 'username'
      }]
    }, 
    _coach: {
      type: coachie.mongoose.SchemaTypes.ObjectId,
      ref: 'Person',
      populate: [{
        method: 'get',
        fields: 'username'
      }]
    }
  },
  icon: 'comments'
});

var Game = coachie.define('Game', {
  attributes: {
    name: { type: String , slug: true },
    image: { type: 'File' }
  },
  requires: {
    'Relationship': {
      filter: function() {
        return { '_game': this._id };
      },
      populate: '_user'
    }
  },
  icon: 'game'
});

var Slot = coachie.define('Slot', {
  attributes: {
    title: { type: String , max: 100 },
    start: { type: Date , required: true },
    end: { type: Date , required: true },
    rate: { type: Number },
    _creator: { type: coachie.mongoose.SchemaTypes.ObjectId , ref: 'Person' },
    _booking: { type: coachie.mongoose.SchemaTypes.ObjectId , ref: 'Booking' }
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

var Booking = coachie.define('Booking', {
  attributes: {
    _slot: { type: coachie.mongoose.SchemaTypes.ObjectId , ref: 'Slot' },
    _user: { type: coachie.mongoose.SchemaTypes.ObjectId , ref: 'Person' },
    price: { type: Number },
    status: { type: String, enum: ['unpaid','cancelled', 'paid', 'refunded', 'complete']}
  },
  icon: 'book'
});

coachie.start(function(err) {
  coachie.app.get('/about', function(req, res, next) {
    res.render('about');
  });

  coachie.app.post('/slots', function(req, res, next) {
    var slot = req.body;
    slot._creator = req.user._id;
    Slot.create( slot , function(err, slot) {
      res.status(303).redirect('/slots/' + slot._id);
    });
  });

});
