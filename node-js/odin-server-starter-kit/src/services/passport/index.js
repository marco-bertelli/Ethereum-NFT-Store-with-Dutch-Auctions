import { Schema } from '@becodebg/chocomen';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import User, { schema } from '../../api/users/model';
import { jwtSecret, masterKey } from '../../config';

export const password = () => (req, res, next) => passport.authenticate('password', { session: false }, (err, user) => {
    if (err && err.param) {
      return res.status(400).json(err);
    } else if (err || !user) {
      return res.status(401).end();
    }
    req.logIn(user, { session: false }, err => {
      if (err) {
        return res.status(401).end();
      }

      next();
    });
  })(req, res, next);

export const master = () => passport.authenticate('master', { session: false });

export const token = ({ required, roles = User.roles } = {}) => (req, res, next) => passport.authenticate('token', { session: false }, (err, user) => {
    if (err || (required && !user) || (required && !~roles.indexOf(user.role))) {
      res.status(401);
      res.send({ message: 'invalid/expired token' });
      return res.end();
    }

    req.logIn(user, { session: false }, err => {
      if (err) {
        res.status(403);
        res.send({ message: 'invalid role for the route' });
        return res.end();
      }

      next();
    });
  })(req, res, next);

export const admin = token({
  required: true,
  roles: ['admin']
});

passport.use(
  'password',
  new BasicStrategy((email, password, done) => {
    const userSchema = new Schema({
      email: schema.tree.email,
      password: schema.tree.password
    });

    userSchema.validate(
      {
        email: email,
        password
      },
      err => {
        if (err) {
          done(err);
        }
      }
    );

    User.findOne({ email: email.toLowerCase(), isEnabled: true }).then(user => {
      if (!user) {
        done(true);
        return null;
      }
      return user
        .authenticate(password, user.password)
        .then(user => {
          user.pre_last_login = user.last_login;
          user.last_login = new Date();

          user.save();
          done(null, user);
          return null;
        })
        .catch(done);
    });
  })
);

passport.use(
  'master',
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {});
    } else {
      done(null, false);
    }
  })
);

passport.use(
  'token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
      ])
    },
    ({ id }, done) => {
      User.findOne({ _id: id, isEnabled: true })
        .then(user => {
          done(null, user);
          return null;
        })
        .catch(done);
    }
  )
);

export default passport;
