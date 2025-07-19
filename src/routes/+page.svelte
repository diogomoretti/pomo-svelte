<script lang="ts">
  import { pomodoroState } from '../stores/pomodoro';
  import { convertMinutesToSeconds, convertSecondsToTime } from '$lib';
  let isAnimating = $state(false);

  let remainingTime = $derived(convertMinutesToSeconds($pomodoroState.time));
  let percentage = $derived(remainingTime / convertMinutesToSeconds($pomodoroState.time));
  
  let interval = $state<number | null>(null);
  let INTERVAL_TIME: number = 1000;

  function animate() {
    isAnimating = true;
    setTimeout(() => isAnimating = false, 200);
  }

  function clear() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function setPomodoro(minutes: string) {
    pomodoroState.set({
      time: minutes,
    });
    animate();
  }

  function startOrPausePomodoro() {
    if (interval) {
      clear();
    } else {
      interval = setInterval(() => {
        remainingTime = remainingTime - 1;

        if (remainingTime === 0) {
          resetPomodoro();
        }
      }, INTERVAL_TIME);
    }
  }

  function resetPomodoro() {
    if (interval) {
      clear();
    }
    remainingTime = convertMinutesToSeconds($pomodoroState.time);
    animate();
  }
</script>

<svelte:head>
  <title>{convertSecondsToTime(remainingTime)} • Pomo Svelte by Diogo Moretti</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏱️</text></svg>">
</svelte:head>

<main>
  <h1 class:animate={isAnimating}>{convertSecondsToTime(remainingTime)}</h1>

  <div class="progress-bar" style="--percentage: {percentage * 100}%"></div>

  <section>
    <button onclick={startOrPausePomodoro}>
      {interval ? '⏸️ Pause' : '▶️ Start'}
    </button>
    <button onclick={resetPomodoro}>🔄 Reset</button>
  </section>

  <section class="pomodoro-buttons">
    <button 
      onclick={() => setPomodoro('25')} 
      disabled={interval !== null}
      class:active={$pomodoroState.time === '25'}
    >
      25 min
    </button>
    <button 
      onclick={() => setPomodoro('10')} 
      disabled={interval !== null}
      class:active={$pomodoroState.time === '10'}
    >
      10 min
    </button>
    <button 
      onclick={() => setPomodoro('5')} 
      disabled={interval !== null}
      class:active={$pomodoroState.time === '5'}
    >
      5 min
    </button>
  </section>
</main>

<style>
  :global(body) {
    background-color: #fff;
    color: #000;
    display: grid;
    place-items: center;
    height: 100dvh;
    margin: 0;
    padding: 0;
    font-family: "IBM Plex Mono", monospace;
    cursor: default;
  }

  :global(::selection) {
    background-color: #000;
    color: #fff;
  }

  .progress-bar {
    --percentage: 0%;
    position: relative;
    max-width: 20rem;
    border-radius: .4rem;
    width: 100%;
    height: .3rem;
    background-color: #ccc;
    overflow: hidden;
    margin: 1rem 0 1.6rem;
    background-image: linear-gradient(to right, #000 0%, #000 var(--percentage), #ccc var(--percentage), #ccc 100%);
    transition: background-image .5s ease;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  h1 {
    font-size: 4rem;
    margin: 0;
    transition: transform 0.2s ease;
  }

  h1.animate {
    transform: scale(1.05);
  }

  section {
    display: flex;
    gap: .5rem;
    margin-bottom: 1rem;
    max-width: 20rem;
    width: 100%;
  }

  button {
    width: 100%;
    font-family: "IBM Plex Mono", monospace;
    font-size: 1rem;
    letter-spacing: -.05em;
    font-weight: 500;
    padding: .5em 1em;
    border-radius: .2rem;
    cursor: pointer;
    color: #000;
    border: none;
    box-shadow: 0 0 0 1px #999;

    &.active {
      box-shadow: 0 0 0 2px #000;
    }

    &:disabled {
      opacity: .3;
      cursor: not-allowed;
    }
  }

  .pomodoro-buttons {
    button {
      font-size: .75rem;
    }
  }
</style>