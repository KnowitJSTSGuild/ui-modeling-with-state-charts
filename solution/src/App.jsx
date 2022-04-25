import "./App.css";

import { useEffect } from "react";
import { useActor, useSelector } from "@xstate/react";
import { wordleService } from "./wordle-machine";
import WordGrid from "./WordGrid";
import KeyRows from "./KeyRows";
import Overlay from "./Overlay";

function App() {
  const [state, send] = useActor(wordleService);

  const guesses = useSelector(wordleService, (s) => s?.context?.guesses);
  const currentGuess = useSelector(wordleService, (s) => s?.context.currentGuess);

  const gridGuesses = [...guesses, currentGuess];

  useEffect(() => {
    const eventListener = (event) => {
      send({ type: "KEYDOWN", event });
    };

    document.addEventListener("keydown", eventListener);

    return () => document.removeEventListener("keydown", eventListener);
  }, [send]);

  return (
    <>
      {state.matches("initializing") && <Overlay>Starting...</Overlay>}
      {state.matches("started.invalid_guess") && (
        <Overlay>{state.context.error}</Overlay>
      )}
      {state.matches("stopped.error") && (
        <Overlay>
          <p>{state.context.error}</p>
          <button type="button" onClick={() => send("START_GAME")}>
            Try again!
          </button>
        </Overlay>
      )}
      <div className="App">
        <h1>Wordle</h1>

        <main>
          <WordGrid words={gridGuesses} />
          <KeyRows words={gridGuesses} />
          {state.matches("stopped.won") && <p>You won!</p>}
          {state.matches("stopped.lost") && (
            <>
              <p>You lost!</p>
              <p>
                The correct word was &quot;{state.context.targetWord}&quot;.
              </p>
            </>
          )}
          {state.matches("stopped") && (
            <button type="button" onClick={() => send("START_GAME")}>
              Play again!
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
