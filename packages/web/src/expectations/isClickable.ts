import { and, isPresent } from '@serenity-js/assertions';
import { Expectation } from '@serenity-js/core';

import { PageElement } from '../screenplay';
import { ElementExpectation } from './ElementExpectation';

/**
 *  {@apilink Expectation} that an element is clickable, which means it resolves to `true` when:
 *  - the element {@apilink isPresent|is present} in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
 *  - {@apilink PageElement.isClickable} resolves to `true`
 *
 *  If the above conditions are not met, the expectation resolves to `false`.
 *
 * ## Learn more
 * - {@apilink PageElement.isClickable}
 * - {@apilink ElementExpectation}
 * - {@apilink Expectation}
 * - {@apilink Check}
 * - {@apilink Ensure}
 * - {@apilink Wait}
 *
 * @group Expectations
 */
export function isClickable(): Expectation<PageElement> {
    return Expectation.to<boolean, PageElement>('become clickable').soThatActual(and(
        isPresent(),
        ElementExpectation.forElementTo('become clickable', actual => actual.isClickable())
    ));
}
