import { success } from '@becodebg/odin-services-response';
import uuid from 'uuid';
import { sign } from '../../services/jwt';
import { getUserData } from '../../services/openAuth/firebase';
import jwt from 'jsonwebtoken';
import { jwtSecret,firebaseConfig } from '../../config';
import request from 'request-promise';

import logger from '../../services/logger/index';

import User from '../../api/users/model';

export const login = ({ user }, res, next) => sign(user.id)
    .then((token) => Promise.all([token, user.view(true, null, { populate: true })])
    )
    .then(([token, userView]) => ({
      token,
      user: userView,
    }))
    .then(success(res, 201))
    .catch(next);

export const renewSocialToken = ({ user }, res, next) => {
    const endpointUrl = `https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`;
    const options = {
      url: endpointUrl,
      method: 'POST',

      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: {
        grant_type: 'refresh_token',
        refreshToken: user.refreshToken,
      },
      json: true,
    };
    request(options)
      .promise()
      .then((result) => {
        logger.warn('Success renew social token');

        user.socialToken = result.access_token;
        user.expireToken = result.expires_in;
        user.idToken = result.id_token;
        user.save().then((savedUser)=>{
          sign(savedUser)
            .then((token) => Promise.all([token, user.view(true, null, { populate: true })])
            )
            .then(([token, userView]) => ({
              token,
              user: userView,
            }))
            .then(success(res, 201))
            .catch(next);
          }
        );
        return;

      })
      .catch((err) => logger.error(
          `Failed to send command to ${endpointUrl}: ${JSON.stringify(err)}`
        )
      );
    return;
  };

export const socialLogin = ({ bodymen: { body } }, res, next) => {
  let googleIdToken = body.token;
  let provider = body.provider;
  let access_token = body.Atoken;

  if (provider === 'firebase') {
    console.log({ provider });
    return getUserData(googleIdToken)
      .then((data) => {
        if (data?.user) {
          let { displayName, uid, photoURL, email } = data.user;
          let exp = data.additionalUserInfo.profile.exp;
          let idToken = data.credential.idToken;
          let refreshToken = data.user.refreshToken;
          return {
            displayName,
            uid,
            photoURL,
            email,
            exp,
            idToken,
            refreshToken,
          };
        }
        throw new Error('no social user');
      })
      .then((socialUser) => {
        if (socialUser) {
          return User.findOne({ email: socialUser.email }).then((user) => {
            if (user) {
              user.socialToken = access_token;
              user.idToken = socialUser.idToken;
              user.refreshToken = socialUser.refreshToken;
              user.expireToken = socialUser.exp;

              return user.save();
            }

            let bodyUser = {
              email: socialUser.email,
              password: uuid.v1().toString(),
              socialToken: access_token,
              idToken: socialUser.idToken,
              refreshToken: socialUser.refreshToken,
              expireToken: socialUser.exp,
              toComplete: true,
            };
            return User.create(bodyUser).catch((err) => {
              /* istanbul ignore else */
              if (err.name === 'MongoError' && err.code === 11000) {
                res.status(409).json({
                  valid: false,
                  param: 'email - username',
                  message: 'email or username already registered',
                });
              } else {
                next(err);
              }
            });
          });
        }
      })
      .then((user) => {
        return { token: sign(user), user };
      })
      .then((obj) => Promise.all([obj.token, obj.user.view(true, null, { populate: true })])
      )
      .then(([token, userView]) => ({
        token,
        user: userView,
      }))
      .then(success(res, 201))
      .catch(next);
  }
};

export const checkJWT = ({ params }, res) => jwt.verify(params.token, jwtSecret, function (err, decoded) {
    if (err) {
      res.send(err);
    } else {
      res.send(decoded);
    }
  });
