// System Module Imports
import { getSetting, localize } from './utils.js'

// Core Module Imports
import { CoreActionHandler, Logger } from './config.js'

export default class ActionHandler extends CoreActionHandler {

   _addSubcategoryToCategory(actionList, subcategory, categoryId) {
      // Add subcategory to each category with a matching id
      actionList.categories.forEach((category) => {
         if (category.id === categoryId) {
            category.subcategories = [...category.subcategories, subcategory];
         }
      });

      console.log(actionList);

      return;
   }

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
      console.log(actionList);

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
      this._buildWeaponsCategory(actionList, actorId, tokenId, actor);

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

   _buildWeaponsCategory(actionList, actorId, tokenId, actor) {
      // For each appropriate item
      const weapons = actor.items.filter((item) => {
         return item.type === 'weapon'
            && (item.system.attack.length > 0 || item.system.check.length > 0)
            && getSetting('showUnEquippedEquipment') || item.system.equipped;
      })
         .sort((a, b) => {
            if (a.sort < b.sort) {
               return -1;
            }
            if (a.sort > b.sort) {
               return 1;
            }
            return 0;
         });

      // Build the subcategory
      weapons.forEach((weapon) => this._buildWeaponSubcategory(actionList, actorId, tokenId, weapon));
   }

   _buildWeaponSubcategory(actionList, actorId, tokenId, weapon) {
      // Get the weapon ID
      const weaponId = weapon._id;

      // Build attack actions
      const attacks = weapon.system.attack.map((attack, idx) => {
         return {
            id: `${weaponId}|attack|${idx}`,
            name: attack.label,
            encodedValue: [actorId, tokenId, 'attackCheck', weaponId, idx],
            icon: attack.type === 'melee' ? '<i class="fas fa-sword"></i>' : '<i class="fas fa-bow-arrow"></i>'
         };
      });

      // Build item check actions
      const itemChecks = weapon.system.check.map((check, idx) => {
         return {
            id: `${weaponId}|itemCheck|${idx}`,
            name: check.label,
            encodedValue: [actorId, tokenId, 'itemCheck', weaponId, idx],
            icon: '<i class="fas fa-dice"></i>'
         };
      });

      // Build toggle multi attack action
      const toggleMultiAttack = {
         id: `${weaponId},toggleMultiAttack`,
         name: localize(weapon.system.multiAttack ? 'multiAttackOn' : 'multiAttackOff'),
         encodedValue: [actorId, tokenId, 'toggleMultiAttack', weaponId],
         icon: weapon.system.multiAttack ? '<i class="fas fa-swords"></i>' : '<i class="fas fa-sword"></i>'
      }

      // Add the subcategory and actions to the action list
      const subcategory = this.initializeEmptySubcategory(weaponId, 'weapons', weapon.name, 'system');
      this._addSubcategoryToCategory(actionList, subcategory, 'weapons');

      return this.addActionsToActionList(actionList, [...attacks, ...itemChecks, toggleMultiAttack], weaponId);
   }
}
