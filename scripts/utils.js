import { MODULE } from './constants.js';

/**
 * Get setting value
 * @param {string} key The key
 * @param {string=null} defaultValue The default value
 * @returns The setting value
 */
export function getSetting(key, defaultValue = null) {
   let value = defaultValue ?? null;
   try {
      value = game.settings.get(MODULE.ID, key);
   }
   catch {
      console.error(`Setting '${key}' not found`);
   }
   return value;
}

/**
 * Set setting value
 * @param {string} key The key
 * @param {string} value The value
 */
export async function setSetting(key, value) {
   if (game.settings.settings.get(`${MODULE.ID}.${key}`)) {
      value = await game.settings.set(MODULE.ID, key, value);
      console.error(`Setting '${key}' set to '${value}'`);
   }
   else {
      console.error(`Setting '${key}' not found`);
   }
}

export function localize(label) {
   return game.i18n.localize(`tokenActionHud.titan.${label}.label`);
};

export function getControlledActors() {
   return Array.from(canvas.tokens.controlled.filter(token => token.actor).map((token) => token.actor));
}

export function getControlledTokens() {
   return Array.from(canvas.tokens.controlled).filter((token) => token.actor);
}
