import { middleware as body } from '@becodebg/chocomen';
import { Router } from 'express';


import { master, password, token } from '../../services/passport';
import { actions } from '../users/controller';
import { login, checkJWT,socialLogin,renewSocialToken } from './controller';
import { bodymenSchema } from '../users/model';

const router = new Router();
/**
 * @api {post} /auth/register Register an user
 * @apiGroup Auth
 * @apiName Register
 * @apiPermission master
 * @apiParam {String} access_token Master access_token.
 * @apiSuccess (Success 201) {User} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Master access only.
 * @apiError 403 Forbidden operation.
 * @apiError 409 Email already registered.
 **/
router.post('/register', master(), body(bodymenSchema.creation), actions.create);

/**
 * @api {post} /auth Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission basic
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {User} user Current user's data.
 * @apiError 401 Invalid credentials.
 **/
router.post('/', password(), login);

/**
 * @api {post} /auth Authenticate
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission basic
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {User} user Current user's data.
 * @apiError 401 Invalid credentials.
 **/
 router.post('/renewSocialToken',token({ required: true }), renewSocialToken);

/**
 * @api {post} /auth/socialLogin
 * @apiName Authenticate
 * @apiGroup Auth
 * @apiPermission basic
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {User} user Current user's data.
 * @apiError 401 Invalid credentials.
 **/
 router.post('/socialLogin', body({ token: String,Atoken: String,provider: String }),socialLogin);


/**
 * @api {get} /auth/checkJWT Check JWT Validity
 * @apiName Check JWT Validity
 * @apiGroup Auth
 * @apiPermission token
 * @apiParam {String} access_token access_token.
 * @apiSuccess (Success 200) {String} result OK
 * @apiError 401 Invalid token.
 **/
router.get('/checkJWT/:token',body({ token: String,provider: String }),checkJWT);

/**
 * @api {get} /auth/renewJWT Renew JWT
 * @apiName Renew JWT
 * @apiGroup Auth
 * @apiPermission token
 * @apiParam {String} access_token access_token.
 * @apiSuccess (Success 201) {String} token User `access_token` to be passed to other requests.
 * @apiSuccess (Success 201) {User} user Current user's data.
 * @apiError 401 Invalid token.
 **/
router.get('/renewJWT', token({ required: true }), login);

export default router;
