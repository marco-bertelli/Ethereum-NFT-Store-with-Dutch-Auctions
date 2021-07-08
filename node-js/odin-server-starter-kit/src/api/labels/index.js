import { middleware as body } from '@becodebg/chocomen';
import { Router } from 'express';
import { middleware as query } from 'querymen';

import { admin, token } from '../../services/passport';

import { actions } from './controller';
import { bodymenSchema } from './model';

const router = new Router();

/**
 * @api {get} /labels List labels
 * @apiGroup Label
 * @apiName RetrieveAll
 * @apiPermission user
 * @apiUse listParams
 * @apiSuccess {Label[]} labels List of Labels.
 **/
router.get('/', token({ required: true }), query(bodymenSchema.query), actions.index);

/**
 * @api {get} /labels/:id Retrieve label
 * @apiGroup Label
 * @apiName Retrieve
 * @apiPermission user
 * @apiSuccess {Label} label Label's data.
 * @apiError 404 Label not found.
 **/
router.get('/:id', token({ required: true }), actions.show);

/**
 * @api {post} /labels Create label
 * @apiGroup Label
 * @apiName Create
 * @apiPermission admin
 * @apiSuccess (Success 201) {Label} label new Label's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 **/
router.post('/', admin, body(bodymenSchema.creation), actions.create);

/**
 * @api {put} /labels/:id Update label
 * @apiGroup Label
 * @apiName Update
 * @apiPermission admin
 * @apiSuccess {Label} label Label's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Label not found.
 **/
router.put('/:id', admin, body(bodymenSchema.update), actions.update);

/**
 * @api {delete} /labels/:id Delete label
 * @apiGroup Label
 * @apiName Delete
 * @apiPermission admin
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Label not found.
 **/
router.delete('/:id', admin, actions.destroy);

export Entity from './model';

export default router;
