// System Module Imports
import ActionHandler from './action-handler.js'
import { RollHandler as Core } from './roll-handler.js'
import * as systemSettings from './settings.js'
import { createDefaults } from './defaults.js'

// Core Module Imports
import { CoreSystemManager, CoreCategoryManager, CoreUtils } from './config.js'

export class SystemManager extends CoreSystemManager {
    /** @override */
    doGetCategoryManager() {
        return new CoreCategoryManager();
    }

    /** @override */
    doGetActionHandler(categoryManager) {
        return new ActionHandler(categoryManager);
    }

    /** @override */
    getAvailableRollHandlers() {
        const choices = { core: 'Core Titan' }
        CoreSystemManager.addHandler(choices);

        return choices
    }

    /** @override */
    doGetRollHandler(handlerId) {
        return new Core();
    }

    /** @override */
    doRegisterSettings(updateFunc) {
        systemSettings.register(updateFunc);
    }

    /** @override */
    async doRegisterDefaultFlags() {
        const defaults = createDefaults();
        await CoreUtils.setUserFlag('default', defaults);
        await CoreUtils.setUserFlag('categories', foundry.utils.deepClone(defaults.categories));
        await CoreUtils.setUserFlag('subcategories', foundry.utils.deepClone(defaults.subcategories));
    }
}
