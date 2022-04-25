---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false
---


# UI modeling with statecharts

How to make sense of complex UI logic?

---

# Motivation (1/2) - Facetime bug (January 2019)

1. Start a FaceTime video call

2. Before the call is answered, tap “Add Person” and add yourself

3. You can listen to the callee's microphone <u>before</u> they accept the call

The app was in a state that <u>should be impossible</u>.


https://medium.com/@DavidKPiano/the-facetime-bug-and-the-dangers-of-implicit-state-machines-a5f0f61bdaa2

---

# Motivation (2/2) - Dangers of implicit state machines
State machines are already hiding in your code :-)

```js
const [loading, setLoading] = useState(false);
const [uploadError, setUploadError] = useState(false);

const onDrop = async files => {
  setLoading(true);
  setUploadError(false);
  try {
    const values = await upload(files);
    setLoading(false);
    onChange(values);
  } catch (e) {
    setLoading(false);
    setUploadError(true);
    setTimeout(() => {
      setUploadError(false);
    }, 2000);
  }
};
```

---

# State machines (1/2)

<div class="float-right w-100 text-center">
  <img src="/Turnstile_state_machine_colored.png" class=" w-100" />
  A state machine diagram for a turnstile
</div>
  
- A finite number of states

- A finite number of events

- An initial state

- A transition function that determines the next state given the current state and event

- A (possibly empty) set of final states

<br><br>
<br><br>
<br><br>

  

<small>https://en.wikipedia.org/wiki/Finite-state_machine#/media/File:Turnstile_state_machine_colored.svg</small>

  

---

# State machines (2/2) - Problem: state explosion


<img src="/valid-invalid-enabled-disabled-changed-unchanged.png" class="h-90" />

<small>https://statecharts.dev/valid-invalid-enabled-disabled-changed-unchanged.svg</small>

--- 

# Statecharts
"A visual formalism for complex systems"

<img src="/valid-invalid-enabled-disabled-changed-unchanged-parallel.png" class="float-right w-80 mr-0" />

Extended state machines. Some of the extensions include:

- Guarded transitions
- Actions (entry, exit, transition)
- Extended state (context)
- Orthogonal (parallel) states
- Hierarchical (nested) states
- History

<small>https://www.sciencedirect.com/science/article/pii/0167642387900359/pdf</small>

<small>https://statecharts.dev/valid-invalid-enabled-disabled-changed-unchanged-parallel.svg</small>

---

# XState (1/4) - Executable statecharts
<div class="float-right w-100">

```js
import { createMachine } from 'xstate';

const promiseMachine = createMachine({
  id: 'promise',
  initial: 'pending',
  states: {
    pending: {
      on: {
        RESOLVE: { target: 'resolved' },
        REJECT: { target: 'rejected' }
      }
    },
    resolved: {
      type: 'final'
    },
    rejected: {
      type: 'final'
    }
  }
});
```

</div>

- A Framework-agnostic statechart library
- Has bindings for React, Vue and Svelte
- Developed by a startup called <a href="https://stately.ai/">Stately</a>

---


### XState (2/4) -  Context, actions and guards

<div class="flex justify-between">

<div class="w-99">

```js
const states = {
  empty: {
    on: {
      FILL: {
        target: 'filling',
        actions: 'addWater'
      }
    }
  },
  filling: {
    // Transient transition
    always: {
      target: 'full',
      cond: 'glassIsFull'
    },
    on: {
      FILL: {
        target: 'filling',
        actions: 'addWater'
      }
    }
  },
  full: {}
}
```
</div>
  
<div class="w-99">

```js
import { createMachine, assign } from 'xstate';
// Action to increment the context amount
const addWater = assign({
  amount: (context, event) => context.amount + 1
});
// Guard to check if the glass is full
const glassIsFull = function (context, event) {
  return context.amount >= 10;
};

const glassMachine = createMachine({
  id: 'glass',
  // Extended state
  context: {
    amount: 0
  },
  initial: 'empty',
  states,
},
{
  actions: { addWater },
  guards: { glassIsFull }
});
  
```
</div>
</div>

---

# XState (3/4) - Invoking a promise

<div class="flex justify-between">

<div class="w-125">

```js
const fetchUser = (userId) =>
  fetch(`url/to/user/${userId}`)
    .then((response) => response.json());

const loading = {
  invoke: {
    id: 'getUser',
    src: (context, event) => 
      fetchUser(context.userId),
    onDone: {
      target: 'success',
      actions: assign({ user: (context, event) => event.data })
    },
    onError: {
      target: 'failure',
      actions: assign({ error: (context, event) => event.data })
    }
  }
}

```
</div>

<div class="w-80">

```js
const userMachine = createMachine({
  id: 'user',
  initial: 'idle',
  context: {
    userId: 42,
    user: undefined,
    error: undefined
  },
  states: {
    idle: {
      on: {
        FETCH: { target: 'loading' }
      }
    },
    loading,
    success: {},
    failure: {
      on: {
        RETRY: { target: 'loading' }
      }
    }
  }
});
```

</div>
</div>

---

# XState (4/4) - Actors

```js

import { createMachine, spawn } from 'xstate';
import { todoMachine } from './todoMachine';

const todosMachine = createMachine({
  // ...
  on: {
    'NEW_TODO.ADD': {
      actions: assign({
        todos: (context, event) => [
          ...context.todos,
          {
            todo: event.todo,
            // add a new todoMachine actor with a unique name
            ref: spawn(todoMachine, `todo-${event.id}`)
          }
        ]
      })
    }
    // ...
  }
});

```

---

# Workshop

- Implement UI logic for a wordle-clone (https://wordlegame.org/)
- Repo here: https://github.com/KnowitJSTSGuild/ui-modeling-with-statecharts
- Workshop template is in the __exercise__-directory
- UI components and some other utilites are there, you just need to implement the logic with xstate
- You can use the Stately editor, if you want (https://stately.ai/registry/new)
- This is not an exam. If you get stuck, peek the __solution__-directory or ask for help in the chat
