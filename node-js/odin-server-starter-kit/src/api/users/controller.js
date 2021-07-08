import { ControllerGenerator } from '@becodebg/odin-generators';
import { success, notFound } from '@becodebg/odin-services-response';

import Entity from './model';

const actions = ControllerGenerator(Entity);

actions.showMe = ({ user }, res) => user.view(true, null, { populate: true }).then(element => {
  res.json(element);
});

actions.create = ({ bodymen: { body } }, res, next) => {
  if (body && body.role === 'admin') {
    res.status(401).json();
    return null;
  }

  Entity.create(body)
    .then(user => user.view(true, null, { populate: true }))
    .then(success(res, 201))
    .catch(err => {
      /* istanbul ignore else */
      if (err.name === 'MongoError' && err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email - username',
          message: 'email or username already registered'
        });
      } else {
        next(err);
      }
    });
};

actions.update = ({ bodymen: { body }, params, user }, res, next) => Entity.findById(params.id === 'me' ? user.id : params.id)
  .then(notFound(res))
  .then(result => {
    if (body) {
      delete body.password;
    }

    if (!result) {
      return null;
    }

    const isAdmin = user.role === 'admin';
    const isSelfUpdate = user.id === result.id;
    if (!isSelfUpdate && !isAdmin) {
      res.status(401).json({
        valid: false,
        message: 'You can\'t change other user\'s data'
        });
      return null;
    }
    return result;
  })
  .then(user => {
    if (!user) {
      return null;
    }

    for (const key in body) {
      if (
        !_.isUndefined(body[key]) &&
        user[key] !== body[key]
      ) {
        user[key] = null;
        user[key] = body[key];
        user.markModified(key);
      }
    }
    return user.save();
  })
  .then(user => (user ? user.view(true, null, { populate: true }) : null))
  .then(success(res))
  .catch(next);

actions.updatePassword = ({ bodymen: { body }, params, user }, res, next) => Entity.findById(params.id === 'me' ? user.id : params.id)
  .then(notFound(res))
  .then(result => {
    if (!result) {
      return null;
    }

    const isSelfUpdate = user.id === result.id;
    if (!isSelfUpdate || user.role !== 'admin') {
      res.status(401).json({
        valid: false,
        param: 'password',
        message: 'You can\'t change other user\'s password'
      });
      return null;
    }
    return result;
  })
  .then(user => (user ? user.set({ password: body.password }).save() : null))
  .then(user => (user ? user.view(true, null, { populate: true }) : null))
  .then(success(res))
  .catch(next);

export { actions };
