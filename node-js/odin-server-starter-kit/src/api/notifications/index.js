import { Router } from 'express';
import { middleware as query } from 'querymen';

import { token } from '../../services/passport';
import { actions } from './controller';
import { bodymenSchema } from './model';

const router = new Router();

/**
 * @api {get} /notifications Retrieve notifications
 * @apiGroup Notifications
 * @apiName RetrieveAll
 * @apiPermission user
 * @apiUse listParams
 * @apiSuccess {Notification[]} notifications List of notifications.
 * @apiError 401 User access only.
 **/
router.get('/', token({ required: true }), query(bodymenSchema.query), actions.showUserNotifications);

export Entity, { schema } from './model';

export default router;
