// System Module Imports
import { getSetting, localize } from './utils.js'

// Core Module Imports
import { CoreActionHandler, Logger } from './config.js'

export default class ActionHandler extends CoreActionHandler {
    /**
     * Build System Actions
     * @override
     * @param {object} actionList
     * @param {object} character
     * @param {array} subcategoryIds
     * @returns {object}
     */
    async buildSystemActions(actionList, character, subcategoryIds) {
        const actor = character?.actor

        // Single actor actions
        if (actor) {
            const actorId = character?.actor?.id
            const tokenId = character?.token?.id
            return this._buildSingleCharacterActions(actionList, actorId, tokenId, actor, subcategoryIds);
        }

        // Multi character actions
        return this._buildMultiCharacterActions(actionList, subcategoryIds);
    }

    _buildSingleCharacterActions(actionList, actorId, tokenId, actor, subcategoryIds) {
        this._buildAttributesSubcategory(actionList, actorId, tokenId);
        this._buildSkillsSubcategory(actionList, actorId, tokenId);
        this._buildResistancesSubcategory(actionList, actorId, tokenId);

        return actionList;
    }

    _buildAttributesSubcategory(actionList, actorId, tokenId) {
        // List entries
        const entries = [
            'body',
            'mind',
            'soul'
        ];

        // Setup actions
        const actions = entries.map((entry) => {
            return {
                id: entry,
                name: localize(entry),
                encodedValue: [actorId, tokenId, 'attributeCheck', entry]
            };
        });

        // Add entries to action list
        return this.addActionsToActionList(actionList, actions, 'attributes');
    }

    _buildSkillsSubcategory(actionList, actorId, tokenId) {
        // List entries
        const entries = [
            'arcana',
            'athletics',
            'deception',
            'dexterity',
            'diplomacy',
            'engineering',
            'intimidation',
            'investigation',
            'lore',
            'medicine',
            'meleeWeapons',
            'metaphysics',
            'nature',
            'perception',
            'performance',
            'rangedWeapons',
            'subterfuge',
            'stealth'
        ];

        // Setup actions
        const actions = entries.map((entry) => {
            return {
                id: entry,
                name: localize(entry),
                encodedValue: [actorId, tokenId, 'skillCheck', entry]
            };
        });

        // Add entries to action list
        return this.addActionsToActionList(actionList, actions, 'skills');
    }

    _buildResistancesSubcategory(actionList, actorId, tokenId) {
        // List entries
        const entries = [
            'reflexes',
            'resilience',
            'willpower'
        ];

        // Setup actions
        const actions = entries.map((entry) => {
            return {
                id: entry,
                name: localize(entry),
                encodedValue: [actorId, tokenId, 'resistanceCheck', entry]
            };
        });

        // Add entries to action list
        return this.addActionsToActionList(actionList, actions, 'resistances');
    }
}
