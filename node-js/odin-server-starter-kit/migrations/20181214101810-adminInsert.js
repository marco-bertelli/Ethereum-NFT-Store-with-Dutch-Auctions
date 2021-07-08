let ObjectID = require('mongodb').ObjectID;

module.exports = {
  up(db) {
    return db.collection('users').insertOne({
      _id: ObjectID('59e90ce61d2d521ffc7c1fb2'),
      email: 'admin@admin.com',
      role: 'admin',
      password: '$2a$04$X408KgJSUwO3glL6Lky0heKrwozNJg79/FpjP7rIfwDqZcjjkV9J6',
      isConfirmed: false,
      isEnabled: true,
      name: 'admin'
    });
  },

  down(db) {
    return db.collection('users').deleteOne({ _id: ObjectID('59e90ce61d2d521ffc7c1fb2') });
  }
};
