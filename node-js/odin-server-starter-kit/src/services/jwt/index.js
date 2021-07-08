import jwt from 'jsonwebtoken';

import { jwtSecret } from '../../config';

import moment from 'moment';
import logger from '../../services/logger/index';

const jwtSign = Promise.promisify(jwt.sign);
const jwtVerify = Promise.promisify(jwt.verify);

export const sign = (id, options, method = jwtSign) => {
    if (id.socialToken !== null){
        const d = new Date(0);
        d.setUTCSeconds(id.expireToken);
        let expiresSec = id.expireToken === '3600' ? '3600' : moment(d).diff(moment.utc(),'seconds');
        logger.warn('setting expirations seconds for our token ----------->'+expiresSec);
        options = options || {};
        options.expiresIn=expiresSec;
        return method({ id: id.id }, jwtSecret, options);
    }
        return method({ id }, jwtSecret, options);

};

export const signSync = (id, options) => sign(id, options, jwt.sign);

export const verify = token => jwtVerify(token, jwtSecret);
