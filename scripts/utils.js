import { Logger } from './config.js'

const namespace = 'token-action-hud-titan'

/**
 * Get setting value
 * @param {string} key The key
 * @param {string=null} defaultValue The default value
 * @returns The setting value
 */
export function getSetting(key, defaultValue = null) {
    let value = defaultValue ?? null
    try {
        value = game.settings.get(namespace, key)
    } catch {
        Logger.debug(`Setting '${key}' not found`)
    }
    return value
}

/**
 * Set setting value
 * @param {string} key The key
 * @param {string} value The value
 */
export async function setSetting(key, value) {
    if (game.settings.settings.get(`${namespace}.${key}`)) {
        value = await game.settings.set(namespace, key, value)
        Logger.debug(`Setting '${key}' set to '${value}'`)
    } else {
        Logger.debug(`Setting '${key}' not found`)
    }
}


export function localize(label) {
    return game.i18n.localize(`tokenActionHud.titan.${label}.label`);
};

export function getOptions() {
    const retVal = game.settings.get('titan', 'getCheckOptions') === true;
    return game.keyboard.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT) ? !retVal : retVal;
}
