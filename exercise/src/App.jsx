import "./App.css";

import { useEffect } from "react";
import { useActor, useSelector } from "@xstate/react";
import { wordleService } from "./wordle-machine";
import WordGrid from "./WordGrid";
import KeyRows from "./KeyRows";
import Overlay from "./Overlay";

function App() {
  // Wordle machine is started globally instead of calling useMachine 
  // in order to get vitejs hot-reloading working
  // See: https://github.com/statelyai/xstate/discussions/2956
  const [state, send] = useActor(wordleService);

  const guesses = useSelector(wordleService, (s) => s?.context?.guesses);
  const targetWord = ""

  useEffect(() => {
    const eventListener = (event) => {
      send({ type: "KEYDOWN", event });
    };

    document.addEventListener("keydown", eventListener);

    return () => document.removeEventListener("keydown", eventListener);
  }, [send]);

  return (
    <>
      {state.matches("started.invalid_guess") && <Overlay>Invalid guess!</Overlay>}
      <div className="App">
        <h1>Wordle</h1>

        <main>
          <WordGrid words={guesses} />
          <KeyRows words={guesses} />
          {state.matches("stopped.won") && <p>You won!</p>}
          {state.matches("stopped.lost") && (
            <>
              <p>You lost!</p>
              <p>
                The correct word was &quot;{targetWord}&quot;.
              </p>
            </>
          )}
          {state.matches("stopped") && (
            <button type="button" onClick={() => send("START_GAME")}>
              Start game!
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
