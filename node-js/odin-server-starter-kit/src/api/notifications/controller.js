import { ControllerGenerator } from '@becodebg/odin-generators';

import Notification from './model';

const actions = ControllerGenerator(Notification);

actions.showUserNotifications = (
  { user, querymen: { query, select, cursor, view }, query: querystring },
  res,
  next
) => {
  const roleQuery = user.role === 'admin' ? query : { ...query, targetUser: { $in: user._id } };

  return actions.index(
    {
      querymen: {
        query: roleQuery,
        select,
        cursor,
        view
      },
      query: querystring
    },
    res,
    next
  );
};

export { actions };
