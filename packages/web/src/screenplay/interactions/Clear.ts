import { Answerable, AnswersQuestions, d, Interaction, LogicError, UsesAbilities } from '@serenity-js/core';

import { PageElement } from '../models';
import { PageElementInteraction } from './PageElementInteraction';

/**
 * Instructs an {@apilink Actor|actor} who has the {@apilink Ability|ability} to {@apilink BrowseTheWeb}
 * to clear the `value` of a [form `input` field](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).
 *
 * ## Example widget
 *
 * ```html
 * <form>
 *   <input type="text" name="example" id="example" />
 * </form>
 * ```
 *
 * ## Lean Page Object describing the widget
 *
 * ```ts
 * import { By, PageElement } from '@serenity-js/web'
 *
 * const Form = {
 *   exampleInput: () =>
 *     PageElement.located(By.id('example'))
 *      .describedAs('example input')
 * }
 * ```
 *
 * ## Clearing the value of an input field
 *
 * ```ts
 * import { actorCalled } from '@serenity-js/core'
 * import { Clear, Enter, Value } from '@serenity-js/web'
 * import { Ensure, equals } from '@serenity-js/assertions'
 *
 * await actorCalled('Inés')
 *   .whoCan(BrowseTheWeb.using(browser))
 *   .attemptsTo(
 *     Enter.theValue('Hello world!').into(Form.exampleInput()),
 *     Ensure.that(Value.of(Form.exampleInput()), equals('Hello world!')),
 *
 *     Clear.theValueOf(Form.exampleInput()),
 *     Ensure.that(Value.of(Form.exampleInput()), equals('')),
 *   )
 * ```
 *
 * ## Learn more
 *
 * - {@apilink BrowseTheWeb}
 * - {@apilink Enter}
 * - {@apilink Value}
 * - {@apilink PageElement}
 *
 * @group Interactions
 */
export class Clear extends PageElementInteraction {

    /**
     * Instantiates an {@apilink Interaction|interaction}
     * that instructs the {@apilink Actor|actor}
     * to clear the value of an input `field`,
     *
     * @param field
     *  The field which value should be cleared
     */
    static theValueOf(field: Answerable<PageElement>): Interaction {
        return new Clear(field);
    }

    protected constructor(private readonly field: Answerable<PageElement>) {
        super(d`#actor clears the value of ${ field }`);
    }

    /**
     * @inheritDoc
     */
    async performAs(actor: UsesAbilities & AnswersQuestions): Promise<void> {
        const element   = await this.resolve(actor, this.field);

        await this.ensureElementCanBeCleared(element);

        return element.clearValue();
    }

    private async ensureElementCanBeCleared(element: PageElement): Promise<void> {
        let threwError: Error,
            hasValueAttribute = false;

        try {
            const value = await element.value();
            hasValueAttribute = value !== null && value !== undefined;
        } catch (error) {
            threwError = error;
        }

        if (! hasValueAttribute || threwError) {
            throw new LogicError(
                this.capitaliseFirstLetter(d`${ this.field } doesn't seem to have a 'value' attribute that could be cleared.`),
                threwError
            );
        }
    }

    private capitaliseFirstLetter(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}
