import { Actor } from '../screenplay';
import { Cast } from './Cast';

/**
 * Produces no-op actors with no special {@link Ability}
 */
export class Extras implements Cast {
    prepare(actor: Actor): Actor {
        return actor;
    }
}
