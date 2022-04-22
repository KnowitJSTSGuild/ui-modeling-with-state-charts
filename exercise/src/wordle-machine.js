import { assign, createMachine, interpret } from "xstate";
import { inspect } from "@xstate/inspect";

import _ from "lodash";
import { checkWordExists, pickRandomWord, pickRandomWordAsync } from "./words-db";
import {
  GUESS_AMOUNT,
  KEY_CORRECT,
  KEY_PARTIAL,
  KEY_PENDING,
  KEY_WRONG,
  WORD_LENGTH,
} from "./helpers";

// Start xstate inspector in another tab
inspect({
  iframe: false, // open in new window
});

export const wordleService = interpret(createMachine(
  {
    id: "WordleMachine",
    initial: "stopped",
    context: {
      guesses: [[{
        char: 'a',
        status: KEY_CORRECT
      }]],
    },
    states: {
      started: {
        id: "started",
      },
      stopped: {
        on: {
          START_GAME: {
            target: '#started'
          }
        }
      }
    },
  },
  {
    guards: {},
    actions: {},
  },
), {devTools: true}).start();
