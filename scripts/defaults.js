import { localize } from "./utils";

/**
 * Default categories and subcategories
 */
export const DEFAULTS = {
    categories: [
        {
            nestId: 'attributes',
            id: 'attributes',
            name: localize('attributes'),
            subcategories: [{
                nestId: 'attributes_attributes',
                id: 'attributes',
                name: localize('attributes'),
                type: 'system',
                hasDerivedSubcategories: false
            }],
        },
        {
            nestId: 'resistances',
            id: 'resistances',
            name: localize('resistances'),
            subcategories: [{
                nestId: 'resistances_resistances',
                id: 'resistances',
                name: localize('resistances'),
                type: 'system',
                hasDerivedSubcategories: false
            }],
        },
        {
            nestId: 'skills',
            id: 'skills',
            name: localize('skills'),
            subcategories: [{
                nestId: 'skills_skills',
                id: 'skills',
                name: localize('skills'),
                type: 'system',
                hasDerivedSubcategories: false
            }],
        },
        {
            nestId: 'weapons',
            id: 'weapons',
            name: localize('weapons'),
            subcategories: [{
                nestId: 'weapons_weapons',
                id: 'weapons',
                name: '',
                type: 'system',
                hasDerivedSubcategories: true
            }],
        },
        {
            nestId: 'equipment',
            id: 'equipment',
            name: localize('equipment'),
            subcategories: [{
                nestId: 'equipment_equipment',
                id: 'equipment',
                name: localize('equipment'),
                type: 'system',
                hasDerivedSubcategories: false
            }],
        },
        {
            nestId: 'abilities',
            id: 'abilities',
            name: localize('abilities'),
            subcategories: [{
                nestId: 'abilities_abilities',
                id: 'abilities',
                name: localize('abilities'),
                type: 'system',
                hasDerivedSubcategories: false
            }],
        },
        {
            nestId: 'spells',
            id: 'spells',
            name: localize('spells'),
            subcategories: [],
        },
        {
            nestId: 'utility',
            id: 'utility',
            name: localize('utility'),
            subcategories: [
                {
                    nestId: 'utility_recovery',
                    id: 'recovery',
                    name: localize('recovery'),
                    type: 'system'
                },
                {
                    nestId: 'utility_resources',
                    id: 'resources',
                    name: localize('resources'),
                    type: 'system'
                }
            ],
        }
    ],
    subcategories: [
        { id: 'attributes', name: localize('attributes'), type: 'system', hasDerivedSubcategories: false },
        { id: 'skills', name: localize('skills'), type: 'system', hasDerivedSubcategories: false },
        { id: 'resistances', name: localize('resistances'), type: 'system', hasDerivedSubcategories: false },
        { id: 'abilities', name: localize('abilities'), type: 'system', hasDerivedSubcategories: false },
        { id: 'utility', name: localize('skills'), type: 'system', hasDerivedSubcategories: false },
    ]
}