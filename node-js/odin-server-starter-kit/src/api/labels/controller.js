import { ControllerGenerator } from '@becodebg/odin-generators';

import Entity from './model';

const actions = ControllerGenerator(Entity);

export { actions };
