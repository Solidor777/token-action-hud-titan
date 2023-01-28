// System Module Imports
import ActionHandler from './action-handler.js'
import { RollHandler } from './roll-handler.js'
import { localize } from './utils.js'
import * as systemSettings from './settings.js'

// Core Module Imports
import { CoreSystemManager, CoreCategoryManager } from './config.js'

export default class SystemManager extends CoreSystemManager {
    /** @override */
    doGetCategoryManager() {
        return new CoreCategoryManager()
    }

    /** @override */
    doGetActionHandler(categoryManager) {
        const actionHandler = new ActionHandler(categoryManager)
        return actionHandler
    }

    /** @override */
    getAvailableRollHandlers() {
        const choices = { core: 'Core Titan' }
        CoreSystemManager.addHandler(choices)
        return choices;
    }

    /** @override */
    doGetRollHandler(handlerId) {
        return new RollHandler();
    }

    /** @override */
    doRegisterSettings(updateFunc) {
        systemSettings.register(updateFunc)
    }

    /** @override */
    async doRegisterDefaultFlags() {
        const settings = {
            categories: [
                {
                    id: 'attributes',
                    title: localize('attributes'),
                    subcategories: [{
                        id: 'attributes',
                        title: localize('attributes'),
                        type: 'system'
                    }],
                },
                {
                    id: 'resistances',
                    title: localize('resistances'),
                    subcategories: [{
                        id: 'resistances',
                        title: localize('resistances'),
                        type: 'system'
                    }],
                },
                {
                    id: 'skills',
                    title: localize('skills'),
                    subcategories: [{
                        id: 'skills',
                        title: localize('skills'),
                        type: 'system'
                    }],
                },
                {
                    id: 'weapons',
                    title: localize('weapons'),
                    subcategories: [],
                },
                {
                    id: 'equipment',
                    title: localize('equipment'),
                    subcategories: [{
                        id: 'equipment',
                        title: localize('equipment'),
                        type: 'equipment'
                    }],
                },
                {
                    id: 'abilities',
                    title: localize('abilities'),
                    subcategories: [{
                        id: 'abilities',
                        title: localize('abilities'),
                        type: 'abilities'
                    }],
                },
                {
                    id: 'spells',
                    title: localize('spells'),
                    subcategories: [],
                },
                {
                    id: 'utility',
                    title: localize('utility'),
                    subcategories: [
                        {
                            id: 'recovery',
                            title: localize('recovery'),
                            type: 'system'
                        },
                        {
                            id: 'resources',
                            title: localize('resources'),
                            type: 'system'
                        }
                    ],
                }
            ],
            subcategories: [
                { id: 'attributes', title: localize('attributes'), type: 'system' },
                { id: 'skills', title: localize('skills'), type: 'system' },
                { id: 'resistances', title: localize('resistances'), type: 'system' },
                { id: 'abilities', title: localize('abilities'), type: 'system' },
                { id: 'utility', title: localize('skills'), type: 'system' },
            ]
        }

        const defaults = foundry.utils.deepClone(settings);
        settings.default = defaults;

        await game.user.update({ flags: { 'token-action-hud-core': settings } })
    }
}
