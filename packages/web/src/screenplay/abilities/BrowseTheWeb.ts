import { Ability, UsesAbilities } from '@serenity-js/core';

import { BrowserCapabilities, BrowsingSession, Page } from '../models';

/**
 * The {@apilink Ability|ability} to `BrowseTheWeb` enables an {@apilink Actor|actor}
 * to {@apilink Interaction|interact with} and {@apilink Question|retrieve information from} Web-based user interfaces.
 *
 * `BrowseTheWeb` wraps test integration tools such as [Playwright](/api/playwright),
 * [Protractor](/api/protractor), or [WebdriverIO](/api/webdriverio),
 * and together with Serenity/JS Web models, such as {@apilink Page} or {@apilink PageElement} - offers a standardised way
 * to write Web-based tests following the Screenplay Pattern.
 *
 * The consistent and portable design of abstractions provided by the [`@serenity-js/web` module](/api/web)
 * also helps to make your tests portable across the various test integration tools and helps to make your test
 * code easier to reuse across projects and teams.
 *
 * ## Giving the actors an ability to `BrowseTheWeb`
 *
 * To give an {@apilink Actor|actor} an ability to `BrowseTheWeb`, provide the **integration tool-specific implementation**
 * via {@apilink Actor.whoCan} in {@apilink Cast.prepare}, or via {@apilink Cast.whereEveryoneCan}.
 *
 * ```ts
 * import { beforeEach } from 'mocha'
 * import { engage, Actor, Cast } from '@serenity-js/core'
 * import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright'
 * import { Browser, chromium } from 'playwright'
 *
 * beforeEach(async () => {
 *   const browser = await chromium.launch({ headless: true })
 *
 *   engage(
 *     BrowseTheWebWithPlaywright.using(browser),
 *   )
 * })
 * ```
 *
 * ### Learn more
 *
 * To learn more about using Serenity/JS with your chosen test integration tool, follow their respective documentation:
 *
 * - {@apilink BrowseTheWebWithPlaywright}
 * - {@apilink BrowseTheWebWithProtractor}
 * - {@apilink BrowseTheWebWithWebdriverIO}
 *
 * ## Using the ability to `BrowseTheWeb`
 *
 * To use the ability to `BrowseTheWeb` in a custom {@apilink Interaction} or {@apilink Question}, use the **generic** method {@apilink BrowseTheWeb.as}
 * to retrieve it.
 *
 * This generic method retrieves the integration tool-specific implementation of {@apilink BrowseTheWeb} present on the {@apilink Actor},
 * such as {@apilink BrowseTheWebWithPlaywright} or {@apilink BrowseTheWebWethWebdriverIO}, using {@apilink Actor.abilityTo}.
 *
 * This decoupling mechanism helps to make your test code portable across test integration tools,
 * since the only part of your test suite that needs to know about the test integration tool used are the actors.
 * The rest of your test code, so {@apilink Task|tasks}, {@apilink Interaction|interactions}, and {@apilink Question|questions},
 * remain fully agnostic of the underlying tool.
 *
 * ```ts
 * import { BrowseTheWeb, Question } from '@serenity-js/web'
 *
 * const BrowserDetails = () =>
 *  Question.about('browser details', async actor => {
 *    const capabilities = await BrowseTheWeb.as(actor).browserCapabilities();
 *    return ${ capabilities.browserName } ${ capabilities.browserVersion }`;
 *  })
 * ```
 *
 * **Pro tip:** Use the specific `BrowseTheWebWith<test integration tool name>` to give the actor the ability,
 * and generic `BrowseTheWeb.as(actor)` to retrieve it.
 *
 * ### Learn more
 *
 * - {@apilink Ability}
 * - {@apilink Actor.whoCan}
 * - {@apilink Cast.whereEveryoneCan}
 * - {@apilink Cast.prepare}
 *
 * @group Abilities
 */
export abstract class BrowseTheWeb<Native_Element_Type = any> implements Ability {

    /**
     * Used to access the {@apilink Actor}'s {@apilink Ability|ability} to {@apilink BrowseTheWeb}
     * from within the {@apilink Interaction|interactions}, such as {@apilink Click},
     * and {@apilink Question|questions}, such as {@apilink Attribute}.
     *
     * @param actor
     */
    static as<NET = any>(actor: UsesAbilities): BrowseTheWeb<NET> {
        return actor.abilityTo(BrowseTheWeb) as BrowseTheWeb<NET>;
    }

    protected constructor(protected readonly session: BrowsingSession<Page<Native_Element_Type>>) {
    }

    /**
     * Returns {@apilink BrowserCapabilities|basic meta-data} about the browser associated with this ability.
     */
    abstract browserCapabilities(): Promise<BrowserCapabilities>;

    /**
     * Returns a {@apilink Page} representing the currently active browser tab.
     */
    async currentPage(): Promise<Page<Native_Element_Type>> {
        return this.session.currentPage();
    }

    /**
     * Returns an array of {@apilink Page|pages} representing all the browser tabs
     * available in the current {@apilink BrowsingSession}.
     */
    allPages(): Promise<Array<Page<Native_Element_Type>>> {
        return this.session.allPages();
    }
}
