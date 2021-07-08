import PasswordResetApi from '@becodebg/odin-api-passwordreset';
import mongoose from 'mongoose';

import { appName } from '../../config';
import mailSender from '../../services/mailsender';
import { master } from '../../services/passport';
import { Entity as userEntity } from '../users';

/**
 * @api {post} /password-resets Send email
 * @apiName SendPasswordReset
 * @apiGroup PasswordReset
 * @apiPermission master
 * @apiParam {String} email Email address to receive the password reset token.
 * @apiSuccess (Success 202) 202 Accepted.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 **/

/**
 * @api {get} /password-resets/:token Verify token
 * @apiName VerifyPasswordReset
 * @apiGroup PasswordReset
 * @apiSuccess {String} token Password reset token.
 * @apiSuccess {Object} user User's data.
 * @apiError 404 Token has expired or doesn't exist.
 **/

/**
 * @api {put} /password-resets/:token Submit password
 * @apiName SubmitPasswordReset
 * @apiGroup PasswordReset
 * @apiParam {String{6..}} password User's new password.
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Token has expired or doesn't exist.
 **/

const { router, model } = PasswordResetApi({
  appName,
  authMiddleware: master(),
  mailSender,
  mongooseInstance: mongoose,
  userEntity
});

export { model };

export default router;
