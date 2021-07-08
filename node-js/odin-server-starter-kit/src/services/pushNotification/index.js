import { sendMessage } from '../firebase/index';
import { default as Notification } from '../../api/notifications/model';
import { default as User } from '../../api/users/model';

const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24 // 1 day
};

const log = logger.child({ section: '\x1B[0;33mPushNotification:\x1B[0m' });

export function sendPushNotifications() {
    log.info('[PUSH]', 'Executing unsent Notifications check...');
    Notification.getUnsentPushNotifications().then(elements => {

        log.info('[PUSH]', `Will send ${elements.length} push notifications.`);
        let userWithNoDevices = [];

        return Promise.map(elements, notification => {
            return Promise.all([User.findById(notification.targetUser), notification.getMessage()])
                .then(([user, message]) => {
                    const deviceTokens = _.map(user.devices, d => d.token);
                    if (deviceTokens.length === 0) {
                        userWithNoDevices.push(user._id);
                        return Promise.reject(`User ${user._id} has no devices to send push notifications to.`);
                    }
                    return Promise.all([deviceTokens, message]);
                })
                .then(([tokens, message]) => {
                    const payload = {
                        notification: {
                            title: message.title,
                            body: message.body,
                            badge: '1',
                            sound: 'default'
                        },
                        data: message.data
                    };
                    _.each(tokens, token => {
                        sendMessage(token, payload, options);
                    });
                })
                .then(() => {
                    return notification.markSent();
                })
                .catch((err) => {
                    log.info('[ERROR]', err);
                });
        });

    }).then(() => {
        log.info('[PUSH]', 'Executing unsent Notifications check... DONE');
    });
}