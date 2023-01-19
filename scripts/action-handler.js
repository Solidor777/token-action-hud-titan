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
      this._buildResistancesSubcategory(actionList, actorId, tokenId);
      this._buildSkillsSubcategory(actionList, actorId, tokenId);
      this._buildWeaponsCategory(actionList, actorId, tokenId, actor);
      this._buildEquipmentSubcategory(actionList, actorId, tokenId, actor);
      this._buildAbilitiesCategory(actionList, actorId, tokenId, actor);
      this._buildSpellsCategory(actionList, actorId, tokenId, actor);

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
      // Filter and sort items
      const items = actor.items.filter((item) => {
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
      items.forEach((weapon) => this._buildWeaponSubcategory(actionList, actorId, tokenId, weapon));
   }

   _buildWeaponSubcategory(actionList, actorId, tokenId, weapon) {
      // Get the weapon ID
      const weaponId = weapon._id;

      // Build attack actions
      const attacks = weapon.system.attack.map((attack, idx) => {
         return {
            id: `${weaponId},attack,${idx}`,
            name: attack.label,
            encodedValue: [actorId, tokenId, 'attackCheck', weaponId, idx],
            icon: attack.type === 'melee' ? '<i class="fas fa-sword"></i>' : '<i class="fas fa-bow-arrow"></i>'
         };
      });

      // Build item check actions
      const itemChecks = weapon.system.check.map((check, idx) => {
         return {
            id: `${weaponId},itemCheck,${idx}`,
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
      subcategory.img = this.getImage(weapon);
      this._addSubcategoryToCategory(actionList, subcategory, 'weapons');

      return this.addActionsToActionList(actionList, [...attacks, ...itemChecks, toggleMultiAttack], weaponId);
   }

   _buildEquipmentSubcategory(actionList, actorId, tokenId, actor) {
      // Filter and sort items
      const items = actor.items.filter((item) => {
         if (item.system.check.length > 0) {
            switch (item.type) {
               case 'weapon':
               case 'ability':
               case 'spell': {
                  return false;
               }
               case 'armor': {
                  return getSetting('showUnEquippedEquipment') || actor.system.equipped.armor === item._id;
               }

               case 'shield': {
                  return getSetting('showUnEquippedEquipment') || actor.system.equipped.shield === item._id;
               }

               default: {
                  return getSetting('showUnEquippedEquipment') || item.system.equipped === undefined ? true : item.system.equipped;
               }
            }
         }
      }).sort((a, b) => {
         if (a.sort < b.sort) {
            return -1;
         }
         if (a.sort > b.sort) {
            return 1;
         }
         return 0;
      });

      // Setup actions
      const actions = [];
      items.forEach((item) => {
         const itemId = item._id;
         item.system.check.forEach((check, idx) => {
            actions.push({
               id: `${itemId},itemCheck`,
               name: `${item.name} (${check.label})`,
               encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx],
               img: this.getImage(item)
            });
         });
      });

      // Add actions to subcategory
      return this.addActionsToActionList(actionList, actions, 'equipment');
   }

   _buildAbilitiesCategory(actionList, actorId, tokenId, actor) {
      // Filter and sort items
      const items = actor.items.filter((item) => item.type === 'ability' && item.system.check.length > 0).sort((a, b) => {
         if (a.sort < b.sort) {
            return -1;
         }
         if (a.sort > b.sort) {
            return 1;
         }
         return 0;
      });

      // Setup actions
      const actions = [];
      items.forEach((item) => {
         const itemId = item._id;
         item.system.check.forEach((check, idx) => {
            actions.push({
               id: `${itemId},itemCheck`,
               name: `${item.name} (${check.label})`,
               encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx],
               img: this.getImage(item)
            });
         });
      });

      // Add actions to subcategory
      return this.addActionsToActionList(actionList, actions, 'abilities');
   }

   _buildSpellsCategory(actionList, actorId, tokenId, actor) {
      // Filter and sort items
      const items = actor.items.filter((item) => item.type === 'spell').sort((a, b) => {
         if (a.sort < b.sort) {
            return -1;
         }
         if (a.sort > b.sort) {
            return 1;
         }
         return 0;
      });

      // Create list of traditions
      const traditions = [];
      items.forEach((spell) => {
         if (traditions.indexOf(spell.system.tradition) === -1) {
            traditions.push(spell.system.tradition);
         }
      });

      // Create tradition subcategories
      traditions.forEach((tradition) => {
         this._buildTraditionSubcategory(actionList, actorId, tokenId, tradition, items);
      });

      return actionList;
   }

   _buildTraditionSubcategory(actionList, actorId, tokenId, tradition, spells) {
      // Filter the spells by tradition
      const traditionSpells = spells.filter((spell) => spell.system.tradition === tradition);

      // Setup actions
      const actions = [];
      traditionSpells.forEach((item) => {
         // Add casting check
         const itemId = item._id;
         actions.push({
            id: `${itemId},castingCheck`,
            name: `${item.name}`,
            encodedValue: [actorId, tokenId, 'castingCheck', itemId],
            img: this.getImage(item)
         });

         // Add item checks
         item.system.check.forEach((check, idx) => {
            actions.push({
               id: `${itemId},itemCheck`,
               name: `${item.name} (${check.label})`,
               encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx],
               img: this.getImage(item)
            });
         });
      });

      // Add the subcategory and actions to the action list
      const subcategory = this.initializeEmptySubcategory(tradition, 'spells', tradition, 'system');
      this._addSubcategoryToCategory(actionList, subcategory, 'spells');

      return this.addActionsToActionList(actionList, actions, tradition);
   }
}
