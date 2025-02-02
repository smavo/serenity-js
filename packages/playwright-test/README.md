_** This README is for Serenity/JS version 3.0-RC. Some links might not work yet as we're working on getting the new website and API docs ready. Thanks for your patience and support! **_

# Serenity/JS

[Serenity/JS](https://serenity-js.org) is a framework designed to make acceptance and regression testing
of modern full-stack applications faster, more collaborative and easier to scale.

Visit [serenity-js.org](https://serenity-js.org/) for the [latest tutorials](https://serenity-js.org/handbook/)
and [API docs](https://serenity-js.org/modules/), and follow [@SerenityJS](https://twitter.com/SerenityJS) and [@JanMolak](https://twitter.com/JanMolak) on Twitter for project updates.

[![Twitter Follow](https://img.shields.io/twitter/follow/SerenityJS?style=social)](https://twitter.com/@SerenityJS)
[![Twitter Follow](https://img.shields.io/twitter/follow/JanMolak?style=social)](https://twitter.com/@JanMolak)
[![Chat on Gitter](https://badges.gitter.im/serenity-js/Lobby.svg)](https://gitter.im/serenity-js/Lobby)

Subscribe to [Serenity/JS YouTube channel](https://www.youtube.com/channel/UC0RdeVPyjtJopVHvlLrXd1Q) to get notified when new demos and video tutorials are available.

### Learning Serenity/JS

To learn more about Serenity/JS, [follow the tutorial](https://serenity-js.org/handbook/thinking-in-serenity-js/index.html), [review the examples](https://github.com/serenity-js/serenity-js/tree/main/examples), and create your own test suite using the [Serenity/JS template projects](https://github.com/serenity-js).

If you have any questions, join us on [Serenity/JS Community Chat](https://gitter.im/serenity-js/Lobby).

## Serenity/JS Playwright Test

[`@serenity-js/playwright-test`](https://serenity-js.org/api/playwright-test/) module offers a Serenity/JS reporter
and fixtures that integrate [Playwright Test](https://playwright.dev/docs/intro) with Serenity/JS Screenplay Pattern APIs.

### Installation

To install this module, use an existing [Playwright project](https://playwright.dev/docs/intro) or generate a new one by running:

```bash
npm init playwright@latest
```

Next, run the following command in your Playwright project directory:

```bash
npm install --save-dev @serenity-js/{assertions,console-reporter,core,serenity-bdd,web,playwright,playwright-test}
```

### Serenity/JS Playwright Fixtures

To use Serenity/JS Screenplay Pattern APIs and benefit from the in-depth reporting capabilities,
import Serenity/JS test fixtures instead of the default ones:

```diff
// example.spec.ts
+ import { test } from '@serenity-js/playwright-test'
- import { test } from '@playwright/test'

test.describe('Serenity Screenplay with Playwright', () => {
    
    test.describe('New Todo', () => {

        test('should allow me to add todo items', async ({ page }) => {
            //...
        })
    })
})
```

If you prefer, Serenity/JS also offers the more concise BDD-style `describe/it` syntax:

```typescript
// example.spec.ts
import { describe, it, test } from '@serenity-js/playwright-test'

test.use({
    headles: true,
})

describe('Serenity Screenplay with Playwright', () => {
    
    describe('New Todo', () => {

        it('should allow me to add todo items', async ({ page }) => {
            //...
        })
    })
})
```

### Serenity/JS Screenplay Pattern Actors

Serenity/JS test fixtures simplify how you instantiate and use Serenity/JS Screenplay Pattern Actors.

#### Single-actor scenarios

If your tests need only a single actor, you can inject it using the `actor` fixture.
To configure the name of your default actor, use the `defaultActorName` configuration property:

```typescript
// example.spec.ts

import { describe, it, test } from '@serenity-js/playwright-test'   // import fixtures
import { Navigate, Page } from '@serenity-js/playwright'            // import Screenplay Pattern Web APIs
import { Ensure, equals } from '@serenity-js/assertions'            // import Screenplay Pattern assertion APIs                            

test.use({
    headles: true,
    defaultActorName: 'Serena'  // change default actor name
})

describe('Serenity Screenplay with Playwright', () => {
    
    describe('New Todo', () => {

        // inject default actor:
        it('should allow me to add todo items', async ({ actor }) => { 
            
            // define test workflow
            await actor.attemptsTo(                                                  
                Navigate.to('https://todo-app.serenity-js.org/'),
                Ensure.that(Page.current().title(), equals('Serenity/JS TodoApp')),
            )
        })
    })
})
```

#### Multi-actor scenarios

For multi-actor scenarios where you need each actor to use a separate browser, use the `actorCalled` fixture.
You can also use this pattern to override the default actor name on a per-scenario basis:

```````typescript
// example.spec.ts

import { describe, it, test } from '@serenity-js/playwright-test'   // import fixtures

describe('Serenity Screenplay with Playwright', () => {
    
    describe('Chat app', () => {

        it('should allow actors to send and receive messages', async ({ actorCalled }) => { 

            // define part of the workflow performed by the first actor:
            await actorCalled('Alice').attemptsTo(                               
                // navigate to a chat app
                // post a message to Bob
            )

            // define parts of the workflow performed by the any other actors:
            await actorCalled('Bob').attemptsTo(                                 
                // navigate to a chat app
                // post a reply to Alice
            )

            // Note that invoking actorCalled(name) multiple times
            // while using the same name and within the scope of a single test
            // returns the same actor, so you don't need to cache them:
            await actorCalled('Alice').attemptsTo(                              
                // check if the reply from Bob is received                      
            )                                                                   
        })
    })
})
```````

#### Customising Actors

The default [cast](https://serenity-js.org/api/core/class/Cast) of actors is limited to using a single ability
to [`BrowseTheWebWithPlaywright`](/api/playwright/class/BrowseTheWebWithPlaywright).

If you'd like to give your actors additional abilities, like to [`TakeNotes`](https://serenity-js.org/api/core/class/TakeNotes),
[`CallAnApi`](https://serenity-js.org/api/rest/class/CallAnApi),
or [`ManageALocalServer`](https://serenity-js.org/api/local-server/class/ManageALocalServer), you can install the relevant Serenity/JS module
and configure them as follows:

```typescript
// example.spec.ts

import { Cast, TakeNotes } from '@serenity-js/core'
import { test } from '@serenity-js/playwright-test'
import { BrowseTheWebWithPlaywright } from '@serenity-js/playwright'
import { CallAnApi } from '@serenity-js/rest'                            

test.use({
    actors: async ({ browser, baseURL }, use) => {
        await use(
            Cast.whereEveryoneCan(
                BrowseTheWebWithPlaywright.using(browser),
                TakeNotes.usingAnEmptyNotepad(),
                CallAnApi.at(baseURL),
            )
        )
    },
})
```

For scenarios where different actors need to be configured differently, you can also implement your own `Cast`:

```typescript
// example.spec.ts

import { Cast } from '@serenity-js/core'
import { BrowseTheWebWithPlaywright, PlaywrightOptions } from '@serenity-js/playwright'
import { test } from '@serenity-js/playwright-test'
import { CallAnApi } from '@serenity-js/rest'
import { Browser } from 'playwright'

class Actors implements Cast {
    constructor(
        private readonly browser: Browser,
        private readonly options: PlaywrightOptions,
    ) {
    }

    prepare(actor: Actor) {
        switch (actor.name) {
            case 'James':
                return actor.whoCan(BrowseTheWebWithPlaywright.using(this.browser, this.options))
            default:
                return actor.whoCan(CallAnApi.at(this.options.baseURL))
        }
    }
}

test.use({
    actors: async ({ browser, config }) => {
        await use(new Actors(browser, {
            defaultNavigationWaitUntil: 'domcontentloaded'
        }))
    }
})
```

### Serenity Reports

To use Serenity/JS reporting capabilities, register the `@serenity-js/playwright-test` reporter in your
`playwright.config.ts` and define the appropriate reporting services (a.k.a. your "stage crew").

For example, to enable Serenity/JS Console Reporter and Serenity BDD reporter, install the relevant modules:

```bash
npm install --save-dev @serenity-js/{console-reporter,serenity-bdd}
```

Next, configure your Playwright project as follows:

```typescript
// playwright.conf.ts

import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
    reporter: [
        [ '@serenity-js/playwright-test', {
            crew: [
                '@serenity-js/serenity-bdd',
                '@serenity-js/console-reporter',
                [ '@serenity-js/core:ArtifactArchiver', { outputDirectory: 'target/site/serenity' } ],
                // '@serenity-js/core:StreamReporter',
            ]
        }],

        // optional
        [ 'html', { open: 'never' } ],          // built-in Playwright HTML reporter
    ],

    // Other configuration omitted for brevity
    // For details, see https://playwright.dev/docs/test-configuration
}

export default config
```

Note that Serenity/JS reporters work well with the built-in [Playwright reporters](https://playwright.dev/docs/test-reporters).

### Reference implementation

You can find a reference implementation demonstrating how to integrate Serenity/JS with Playwright Test in the [Serenity/JS
GitHub repository](https://github.com/serenity-js/serenity-js/tree/main/examples/playwright-test-todomvc).

## More coming soon!

New features, tutorials, and demos are coming soon, so follow us on Twitter and join the [Serenity/JS Community chat channel](https://gitter.im/serenity-js/Lobby) to stay up to date!

[![Twitter Follow](https://img.shields.io/twitter/follow/SerenityJS?style=social)](https://twitter.com/@SerenityJS)
[![Twitter Follow](https://img.shields.io/twitter/follow/JanMolak?style=social)](https://twitter.com/@JanMolak)
[![Chat on Gitter](https://badges.gitter.im/serenity-js/Lobby.svg)](https://gitter.im/serenity-js/Lobby)

If you enjoy using Serenity/JS and would like to keep new features coming, become our [GitHub Sponsor](https://github.com/sponsors/serenity-js)
and donate as much or as little as you find appropriate.
