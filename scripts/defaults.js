import { localize } from "./utils";

/**
 * Default categories and subcategories
 */
export default function getDefaults() {
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

    return settings;
}