# UI-modeling with statecharts

Welcome! This repository contains all files for the JS/TS-guild workshop "UI-modeling with statecharts".

# Presentation

The presentation was implemented with [sli.dev](https://sli.dev) and the source code is located in the `presentation`-directory.

[Download the presentation as PDF](https://github.com/KnowitJSTSGuild/ui-modeling-with-statecharts/blob/main/presentation/slides-export.pdf)

# Workshop
Your task in this workshop is to implement application logic for a Wordle-game using XState. The workshop template (React) with UI-components and some
utilities is located in the exercise-subdirectory.

Open terminal in the `exercise`-directory and run the following commands:
```
    npm ci
    npm run dev
```

The app will start in `http://localhost:3000` with hot reloading. During the startup the app will also open `xstate inspector` in another tab, where you can see your statechart visualized.

When the game is initialized, you have to acquire a random word from a "database" to be guessed by the user. There is a small API for accessing the "database" in file words-db.js. In the first part of the workshop, use the synchronous `pickRandomWord`-function to initialize the game. 

If you have time left, you can also implement async initialization. In addition to `pickRandomWord` there's also a fake API function `pickRandomWordAsync` in words-db.js. It simulates an API-call by returning a promise, which fails 25% of the time. Use the `pickRandomWordAsync` instead of `pickRandomWord`. Remember to handle "loading", "error" and "success" states :-)

## Tips

If you want, you can start modeling the UI visually using the [Stately beta editor](https://stately.ai/registry/new?source=landing-page) and then export it to use in your xstate machine.


In order to get familiar with xstate, you can (browse the documentation)[https://xstate.js.org/docs/], or watch the [official beginner's guide in Youtube](https://www.youtube.com/playlist?list=PLvWgkXBB3dd4ocSi17y1JmMmz7S5cV8vI).

## Solution
Example implementation for the workshop (using `pickRandomWordAsync`) is located in the solution-directory. You can take a peek, if you get stuck. 

# Links
- Introduction to state mahines and statecharts - https://xstate.js.org/docs/guides/introduction-to-state-machines-and-statecharts
- Statecharts.dev - https://statecharts.dev/
- XState - https://xstate.js.org
- Stately.ai - https://stately.ai
- The original scientific paper introducing statecharts -  http://www.inf.ed.ac.uk/teaching/courses/seoc/2005_2006/resources/statecharts.pdf
- The Official Beginner's Guide to XState in React - https://www.youtube.com/playlist?list=PLvWgkXBB3dd4ocSi17y1JmMmz7S5cV8vI
- An example how to use xstate with redux - https://github.com/mattpocock/redux-xstate-poc
