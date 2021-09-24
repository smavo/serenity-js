import { Answerable, AnswersQuestions, MetaQuestion, Question, UsesAbilities } from '@serenity-js/core';
import { formatted } from '@serenity-js/core/lib/io';

import { UIElement } from '../../ui';
import { TargetNestedElement } from './targets';
import { UIElementQuestion } from './UIElementQuestion';

/**
 * @desc
 *  Returns the `value` attribute of a given {@link WebElement},
 *  represented by Answerable<{@link @wdio/types~Element}>
 *
 * @example <caption>Example widget</caption>
 *  <input type="text" id="username" value="Alice" />
 *
 * @example <caption>Retrieve CSS classes of a given WebElement</caption>
 *  import { actorCalled } from '@serenity-js/core';
 *  import { Ensure, equals } from '@serenity-js/assertions';
 *  import { BrowseTheWeb, by, Value, Target } from '@serenity-js/webdriverio';
 *
 *  const usernameField = () =>
 *      Target.the('username field').located(by.id('username'))
 *
 *  actorCalled('Lisa')
 *      .whoCan(BrowseTheWeb.using(browser))
 *      .attemptsTo(
 *          Ensure.that(Value.of(usernameField), equals('Alice')),
 *      )
 *
 * @extends {@serenity-js/core/lib/screenplay~Question}
 * @implements {@serenity-js/core/lib/screenplay/questions~MetaQuestion}
 */
export class Value
    extends UIElementQuestion<Promise<string>>
    implements MetaQuestion<Answerable<UIElement>, Promise<string>>
{
    /**
     * @param {Answerable<UIElement>} element
     * @returns {Value}
     */
    static of(element: Answerable<UIElement>): Question<Promise<string>> & MetaQuestion<Answerable<UIElement>, Promise<string>> {
        return new Value(element);
    }

    /**
     * @param {Answerable<UIElement>} element
     */
    constructor(private readonly element: Answerable<UIElement>) {
        super(formatted`the value of ${ element }`);
    }

    /**
     * @desc
     *  Resolves to the value of a given [`input`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
     *  {@link WebElement}, located in the context of a `parent` element.
     *
     * @param {Answerable<UIElement>} parent
     * @returns {Question<Promise<string>>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/questions~MetaQuestion}
     */
    of(parent: Answerable<UIElement>): Question<Promise<string>> {
        return new Value(new TargetNestedElement(parent, this.element));
    }

    /**
     * @desc
     *  Makes the provided {@link @serenity-js/core/lib/screenplay/actor~Actor}
     *  answer this {@link @serenity-js/core/lib/screenplay~Question}.
     *
     * @param {AnswersQuestions & UsesAbilities} actor
     * @returns {Promise<void>}
     *
     * @see {@link @serenity-js/core/lib/screenplay/actor~Actor}
     * @see {@link @serenity-js/core/lib/screenplay/actor~AnswersQuestions}
     * @see {@link @serenity-js/core/lib/screenplay/actor~UsesAbilities}
     */
    async answeredBy(actor: AnswersQuestions & UsesAbilities): Promise<string> {
        const element = await this.resolve(actor, this.element);

        return element.getValue();
    }
}