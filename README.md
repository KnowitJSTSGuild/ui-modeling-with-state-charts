# UI modeling with statecharts

This repository contains files for statechart workshop (27.4.2022).

# Presentation

The presentation was done with sli.dev and the source is located in `presentation`-directory. 
[Check the presentation as PDF here](https://github.com/KnowitJSTSGuild/ui-modeling-with-statecharts/blob/main/presentation/slides-export.pdf)

# Workshop
Your task in this workshop is to implement application logic for a Wordle-game. The workshop template with UI-components and some
utilities is located in the exercise-subdirectory.

Open terminal in the `exercise`-directory and run the following commands:
```
    npm ci
    npm run dev
```

The app will start in `http://localhost:3000`. During the startup the app will also open `xstate inspector` in another tab, where you can see your statechart visualized.

## Bonus task: Async random word generation
If you have time left after the initial workshop, you can also implement async initialization. There's also a fake API function pickRandomWordAsync in words-db.js. It simulates an API-call by returning a promise, which fails 25% of the time. Use the pickRandomWordAsync instead of pickRandomWord. Remember to handle "loading", "error" and "success" states :-)

# Links
- The original scientific paper introducing statecharts -  http://www.inf.ed.ac.uk/teaching/courses/seoc/2005_2006/resources/statecharts.pdf
- The Official Beginner's Guide to XState in React - https://www.youtube.com/playlist?list=PLvWgkXBB3dd4ocSi17y1JmMmz7S5cV8vI
- An example how to use xstate with redux - https://github.com/mattpocock/redux-xstate-poc
