import _ from "lodash";
/* eslint-disable-next-line import/no-unresolved */
import wordDB from "./wordle-nyt-answers-alphabetical.txt?raw";

export const wordsArr = wordDB.trim().split("\n");

// First use this function for initializing the target word.
// If you finish the workshop early, try changing your implementation to use 
// the async version below.
export const pickRandomWord = () => wordsArr[_.random(0, wordsArr.length - 1)];

// Imagine this is calling an API to get a random word from server :)
// This returns a rejected Promise 25% of the time for demonstration purposes.
export const pickRandomWordAsync = () =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => (Math.random() < 0.75 ? resolve(pickRandomWord()) : reject()),
      1500
    );
  });

export const checkWordExists = (word) => wordDB.includes(word);
