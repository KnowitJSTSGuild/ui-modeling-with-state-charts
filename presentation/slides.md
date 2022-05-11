---
theme: default
background: https://source.unsplash.com/jW8hkB_Qmj8/1920x1080
# apply any windi css classes to the current slide
class: 'text-center'
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
aspectRatio: '16/9'
# persist drawings in exports and build
drawings:
  persist: false
---

# UI Modeling with Statecharts
How to make sense of complex UI logic?

<style>

  #slide-content h1 {
    color: var(--knowit-sand);
    font-size: 3rem;
  }

  #slide-content p {
    font-size: 1.8rem;
    opacity: 0.75;
  }

</style>

---

# Often UI logic is spread all over component code and difficult to maintain.

```js
//...
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
//...
```

---

<h1 class="text-center">We can do better...</h1>

<img src="/6f559y.jpg" class="mx-auto h-90" />

---

# State machine is an abstract machine that can be in <u>exactly one state at a time</u>

<div class="float-right w-100 mr-20 text-center">
  <img src="/Turnstile_state_machine_colored.png" class=" w-100" />
  A state machine diagram for a turnstile
</div>
<br>

- States
- Events
- Transitions

<footer>

  <small>https://en.wikipedia.org/wiki/Finite-state_machine#/media/File:Turnstile_state_machine_colored.svg</small>

</footer>

<style>

  #slide-content h1 {
    margin-bottom: 30px
  }

</style>

---

# State machines don't scale well. (state explosion)

<img src="/valid-invalid-enabled-disabled-changed-unchanged.png" class="h-90" />

<footer>

  <small>https://statecharts.dev/valid-invalid-enabled-disabled-changed-unchanged.svg</small>

</footer>
--- 



# Statecharts solve the state explosion problem with parallel and nested states

<img src="/valid-invalid-enabled-disabled-changed-unchanged-parallel-hierarchy.png" class="w-100" />

<footer>

<small>https://statecharts.dev/valid-invalid-enabled-disabled-changed-unchanged-parallel-hierarchy.svg</small>

</footer>

---

# Statecharts are extended state machines

<img src="/glass-statechart.png" class="w-180">

<footer>

<small>https://stately.ai/viz/790f79f2-abcd-424d-a3ce-1fcd755be863</small>

</footer>

---

# <u>Guarded transitions</u> are the if-else logic for statecharts

<figure class="relative">
  <div class="highlight w-47 h-11 left-105 top-41"></div>
  <img src="/glass-statechart.png" class="w-180">
</figure>
---

# <u>Extended state (context)</u> allows you to save additional data

<figure class="relative">
  <div class="highlight w-50 h-10 left-10 top-54 border-0"> amount = 0</div>
  <div class="highlight w-90 h-10 left-70 top-54 border-0"> 1 &lt;= amount &lt;= 9 </div>
  <div class="highlight w-50 h-10 left-150 top-54 border-0"> amount = 10</div>
  <img src="/glass-statechart.png" class="w-180">
</figure>
---

# <u>Actions</u> allow you to fire side-effects on entry, exit or transition.

<figure class="relative">
  <div class="highlight w-30 h-9 left-70 top-28"></div>
  <div class="highlight w-30 h-9 left-34 top-43"></div>
  <img src="/glass-statechart.png" class="w-180">
</figure>

---

# XState is a framework-agnostic JS/TS-library for creating executable statecharts
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

- Developed by [Stately](https://stately.ai)
- Visualizer: https://stately.ai/viz
- Editor (beta): https://stately.ai/registry/new
- [VSCode plugin](https://marketplace.visualstudio.com/items?itemName=statelyai.stately-vscode) allows both visualization and editing

<img class="w-100" src="/promise-machine.png" />

---

# XState example: Guards, context and the assign-action

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

<style>

#slide-content h1 {
  margin: 0;
}

</style>

---

# XState example: Delayed transitions
```js
const lightDelayMachine = createMachine({
  id: 'lightDelay',
  initial: 'green',
  states: {
    green: {
      after: {
        // after 1 second, transition to yellow
        1000: { target: 'yellow' }
      }
    },
    yellow: {
      after: {
        // after 0.5 seconds, transition to red
        500: { target: 'red' }
      }
    },
    red: {
      after: {
        // after 2 seconds, transition to green
        2000: { target: 'green' }
      }
    }
  }
});
```

<style>
#slide-content h1 {
  margin: 0;
}
</style>

---

# XState example: Invoking a promise and sending events

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

```js
const userService = interpret(userMachine).start()
userService.send({type: 'FETCH'})
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

# Some XState features not introduced in this presentation

- Actors and spawning
- History states
- Activities
- Delayed events
- Invoking callbacks & observables
- Nested & parallel states
- ...

Study further at https://xstate.js.org/docs

---

# Why statecharts & XState ?

- Decoupling
- Maintainability
- Communication
- Code = Documentation

---

<h1 class="text-center">Workshop: Implement UI logic for Wordle using XState</h1>

<div class="text-center mb-6">

https://github.com/KnowitJSTSGuild/ui-modeling-with-statecharts

</div>
<div class="text-center">
  <img src="/wordle.png" class="inline-block h-90" />
</div>
