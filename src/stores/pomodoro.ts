import { writable } from 'svelte/store';

type PomodoroState = {
	time: string;
};

export const pomodoroState = writable<PomodoroState>({
	time: '25'
});