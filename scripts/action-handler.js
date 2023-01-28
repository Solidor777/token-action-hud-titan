// System Module Imports
import { getSetting, localize } from './utils.js'

// Core Module Imports
import { CoreActionHandler, Logger } from './config.js'

export default class ActionHandler extends CoreActionHandler {

   /**
    * Build System Actions
    * @override
    * @param {object} character
    * @param {array} subcategoryIds
    * @returns {object}
    */
   async buildSystemActions(character, subcategoryIds) {
      const actor = character?.actor

      // Single actor actions
      if (actor) {
         const actorId = character?.actor?.id
         const tokenId = character?.token?.id
         return await this._buildSingleCharacterActions(actorId, tokenId, actor, subcategoryIds);
      }

      // Multi character actions
      return await this._buildMultiCharacterActions();
   }

   async _buildSingleCharacterActions(actorId, tokenId, actor) {
      await this._buildAttributesSubcategory(actorId, tokenId);
      await this._buildResistancesSubcategory(actorId, tokenId);
      await this._buildSkillsSubcategory(actorId, tokenId);
      await this._buildWeaponsCategory(actorId, tokenId, actor);
      await this._buildEquipmentSubcategory(actorId, tokenId, actor);
      await this._buildAbilitiesCategory(actorId, tokenId, actor);
      await this._buildSpellsCategory(actorId, tokenId, actor);
      await this._buildRecoverySubcategory(actorId, tokenId);
      await this._buildResourcesSubcategory(actorId, tokenId, actor);

      return;
   }

   async _buildMultiCharacterActions() {
      const actorId = 'multi';
      const tokenId = 'multi';
      await this._buildAttributesSubcategory(actorId, tokenId);
      await this._buildResistancesSubcategory(actorId, tokenId);
      await this._buildSkillsSubcategory(actorId, tokenId);
      await this._buildRecoverySubcategory(actorId, tokenId);
      await this._buildResourcesSubcategory(actorId, tokenId);

      return;
   }

   async _buildAttributesSubcategory(actorId, tokenId) {
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
            encodedValue: [actorId, tokenId, 'attributeCheck', entry].join(this.delimiter)
         };
      });

      // Add entries to action list
      await this.addActionsToActionList(actions, { id: 'attributes', type: "system" });
   }

   async _buildSkillsSubcategory(actorId, tokenId) {
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
            encodedValue: [actorId, tokenId, 'skillCheck', entry].join(this.delimiter)
         };
      });

      // Add entries to action list
      return await this.addActionsToActionList(actions, { id: 'skills', type: "system" });
   }

   async _buildResistancesSubcategory(actorId, tokenId) {
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
            encodedValue: [actorId, tokenId, 'resistanceCheck', entry].join(this.delimiter)
         };
      });

      // Add entries to action list
      return await this.addActionsToActionList(actions, { id: 'resistances', type: "system" });
   }

   async _buildWeaponsCategory(actorId, tokenId, actor) {

      // Filter and sort items
      const items = actor.items.filter((item) => {
         return item.type === 'weapon'
            && (item.system.attack.length > 0 || item.system.check.length > 0)
            && (getSetting('showUnEquippedEquipment') || item.system.equipped);
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

      // Build weapons subcategories
      for (const item of items) {
         await this._buildWeaponSubcategory(actorId, tokenId, item);
      }

      // Clear old weapons subcategories
      //await new Promise(r => setTimeout(r, 0));
      const weaponsCategory = this.actionList.categories.filter((category) => category.id === 'weapons')[0].subcategories[0];
      weaponsCategory.subcategories = weaponsCategory.subcategories.filter((category) => category.actions.length > 0);

      return;
   }

   async _buildWeaponSubcategory(actorId, tokenId, weapon) {
      // Get the weapon ID
      const weaponId = weapon._id;

      // Build attack actions
      const attacks = weapon.system.attack.map((attack, idx) => {
         return {
            id: `${weaponId},attack,${idx}`,
            name: attack.label,
            encodedValue: [actorId, tokenId, 'attackCheck', weaponId, idx].join(this.delimiter),
            icon1: attack.type === 'melee' ? '<i class="fas fa-sword"></i>' : '<i class="fas fa-bow-arrow"></i>'
         };
      });

      // Build item check actions
      const itemChecks = weapon.system.check.map((check, idx) => {
         return {
            id: `${weaponId},itemCheck,${idx}`,
            name: check.label,
            encodedValue: [actorId, tokenId, 'itemCheck', weaponId, idx].join(this.delimiter),
            icon1: '<i class="fas fa-dice"></i>'
         };
      });

      // Build toggle multi attack action
      const toggleMultiAttack = {
         id: `${weaponId},toggleMultiAttack`,
         name: localize(weapon.system.multiAttack ? 'multiAttackOn' : 'multiAttackOff'),
         encodedValue: [actorId, tokenId, 'toggleMultiAttack', weaponId].join(this.delimiter),
         icon1: weapon.system.multiAttack ? '<i class="fas fa-swords"></i>' : '<i class="fas fa-sword"></i>'
      }

      // Add the subcategory to the action list
      const subcategory = { id: weaponId, nestId: weaponId, name: weapon.name, type: 'system_generated' };
      const parentSubcategory = { id: 'weapons', type: 'system' };
      await this.addSubcategoryToActionList(parentSubcategory, subcategory);

      // Add the image if appropriate
      const img = this.getImage(weapon);
      if (img !== '') {
         const categories = this.categoryManager.getFlattenedSubcategories({ id: weaponId, type: "system" });
         categories.forEach((category) => category.img = img);
      }

      return await this.addActionsToActionList([...attacks, ...itemChecks, toggleMultiAttack], { id: weaponId, type: "system_generated" });
   }

   async _buildEquipmentSubcategory(actorId, tokenId, actor) {
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
               encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx].join(this.delimiter),
               img: this.getImage(item)
            });
         });
      });

      // Add actions to subcategory
      return await this.addActionsToActionList(actions, { id: 'equipment', type: "system" });
   }

   async _buildAbilitiesCategory(actorId, tokenId, actor) {
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
               encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx].join(this.delimiter),
               img: this.getImage(item)
            });
         });
      });

      // Add actions to subcategory
      return await this.addActionsToActionList(actions, { id: 'abilities', type: 'system' });
   }

   async _buildSpellsCategory(actorId, tokenId, actor) {
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
      for (const tradition of traditions) {
         await this._buildTraditionSubcategory(actorId, tokenId, tradition, items);
      }

      // Clear empty tradition subcategories
      //await new Promise(r => setTimeout(r, 0));
      const spellsCategory = this.actionList.categories.filter((category) => category.id === 'spells')[0].subcategories[0];
      spellsCategory.subcategories = spellsCategory.subcategories.filter((category) => category.actions.length > 0);

      return;
   }

   async _buildTraditionSubcategory(actorId, tokenId, tradition, spells) {
      // Filter the spells by tradition
      const traditionSpells = spells.filter((spell) => spell.system.tradition === tradition);
      console.log(tradition);

      // Setup actions
      const actions = [];
      traditionSpells.forEach((item) => {
         // Add casting check
         const itemId = item._id;
         actions.push({
            id: `${itemId},castingCheck`,
            name: `${item.name}`,
            encodedValue: [actorId, tokenId, 'castingCheck', itemId].join(this.delimiter),
            img: this.getImage(item)
         });

         // Add item checks
         item.system.check.forEach((check, idx) => {
            actions.push({
               id: `${itemId},itemCheck`,
               name: `${item.name} (${check.label})`,
               encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx].join(this.delimiter),
               img: this.getImage(item)
            });
         });
      });

      // Add the subcategory to the action list
      const subcategory = { id: tradition, nestId: tradition, name: tradition, type: 'system_generated' };
      const parentSubcategory = { id: 'traditions', type: 'system' };
      await this.addSubcategoryToActionList(parentSubcategory, subcategory);

      return await this.addActionsToActionList(actions, { id: tradition, type: 'system_generated' });
   }

   async _buildRecoverySubcategory(actorId, tokenId) {
      // Setup actions
      const actions = [
         {
            id: `longRest`,
            name: localize('longRest'),
            encodedValue: [actorId, tokenId, 'longRest'].join(this.delimiter),
            icon1: '<i class="fas fa-bed"></i>'
         },
         {
            id: `shortRest`,
            name: localize('shortRest'),
            encodedValue: [actorId, tokenId, 'shortRest'].join(this.delimiter),
            icon1: '<i class="fas fa-face-exhaling"></i>'
         },
         {
            id: `removeTemporaryEffects`,
            name: localize('removeTemporaryEffects'),
            encodedValue: [actorId, tokenId, 'removeTemporaryEffects'].join(this.delimiter),
            icon1: '<i class="fas fa-arrow-rotate-left"></i>'
         }
      ];

      // Add actions to list
      return await this.addActionsToActionList(actions, { id: 'recovery', type: 'system' });
   }

   async _buildResourcesSubcategory(actorId, tokenId, actor) {
      // Setup actions
      const actions = [
         {
            id: `spendResolve`,
            name: localize('spendResolve'),
            encodedValue: [actorId, tokenId, 'spendResolve'].join(this.delimiter),
            icon1: '<i class="fas fa-bolt"></i>'
         }
      ];

      // Add toggle inspiration action for players
      if (actor?.type === 'player') {
         actions.push({
            id: `toggleInspiration`,
            name: localize('inspiration'),
            encodedValue: [actorId, tokenId, 'toggleInspiration'].join(this.delimiter),
            icon1: actor.system.inspiration ? '<i class="fas fa-sun"></i>' : '<i class="far fa-circle"></i>'
         });
      }

      // Add actions to list
      return await this.addActionsToActionList(actions, { id: 'resources', type: 'system' });
   }
}
