import UploadFilesAPI from '@becodebg/odin-api-uploads';
import mongoose from 'mongoose';

import { accessKeyId, secretAccessKey, s3BucketName } from '../../config';
import { token, admin } from '../../services/passport';

/**
 * @api {delete} /uploads/:id Delete Upload
 * @apiGroup FileManagement
 * @apiName DeleteUpload
 * @apiPermission admin
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 uploaded file not found.
 **/

/**
 * @api {get} /uploads Retrieve uploaded files
 * @apiGroup FileManagement
 * @apiName RetrieveFiles
 * @apiPermission admin
 * @apiUse listParams
 * @apiSuccess {File[]} files List of Files.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 Admin access only.
 **/

/**
 * @api {post} /uploads Upload a file
 * @apiGroup FileManagement
 * @apiName UploadFile
 * @apiPermission user
 * @apiParam (Body) {File} file The multipart-data file to be uploaded.
 * @apiParam (Body) {String} metadataName One or more metadata to assign to the file.
 * @apiSuccess 201 Created
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 **/

const { router, model } = UploadFilesAPI({
    listAuthMiddleware: admin,
    authMiddleware: token({ required: true }),
    mongooseInstance: mongoose,
    s3Options: {
        accessKeyId,
        secretAccessKey,
        s3BucketName
    }
});

export { model };

export default router;
