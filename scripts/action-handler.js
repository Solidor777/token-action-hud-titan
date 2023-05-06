// System Module Imports
import { getControlledActors, getSetting, localize } from './utils.js';
import { CoreUtils } from './config.js';

export let ActionHandler = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
   ActionHandler = class ActionHandlerClass extends coreModule.api.ActionHandler {
      async buildSystemActions(groupIds) {
         // Set actor and token variables
         const actors = getControlledActors();

         // Single actor actions
         if (actors.length === 1) {
            const actorId = this.actor?.id;
            const tokenId = this.token?.id;
            const actions = await this._buildSingleCharacterActions(actorId, tokenId, this.actor, groupIds);
            return actions;
         }

         // Multi character actions
         return await this._buildMultiCharacterActions();
      }

      async _buildSingleCharacterActions(actorId, tokenId, actor) {
         await this._buildAttributesGroup(actorId, tokenId);
         await this._buildResistancesGroup(actorId, tokenId);
         await this._buildSkillsGroup(actorId, tokenId);
         await this._buildWeaponsCategory(actorId, tokenId, actor);
         await this._buildEquipmentGroup(actorId, tokenId, actor);
         await this._buildAbilitiesCategory(actorId, tokenId, actor);
         await this._buildSpellsCategory(actorId, tokenId, actor);
         await this._buildRecoveryGroup(actorId, tokenId);
         await this._buildResourcesGroup(actorId, tokenId, actor);
         await this._buildEffectsGroup(actorId, tokenId, actor);

         return;
      }

      async _buildMultiCharacterActions() {
         const actorId = 'multi';
         const tokenId = 'multi';
         await this._buildAttributesGroup(actorId, tokenId);
         await this._buildResistancesGroup(actorId, tokenId);
         await this._buildSkillsGroup(actorId, tokenId);
         await this._buildRecoveryGroup(actorId, tokenId);
         await this._buildResourcesGroup(actorId, tokenId);
         await this._buildEffectsGroup(actorId, tokenId);

         return;
      }

      async _buildAttributesGroup(actorId, tokenId) {
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
         await this.addActions(actions, { id: 'attributes', type: 'system' });
      }

      async _buildSkillsGroup(actorId, tokenId) {
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
         return await this.addActions(actions, { id: 'skills', type: 'system' });
      }

      async _buildResistancesGroup(actorId, tokenId) {
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
         return await this.addActions(actions, { id: 'resistances', type: 'system' });
      }

      async _buildWeaponsCategory(actorId, tokenId, actor) {
         // Filter and sort items
         const items = actor.items.filter((item) => {
            return item.type === 'weapon' &&
               (item.system.attack.length > 0 || item.system.check.length > 0) &&
               (getSetting('showUnEquippedEquipment') || item.system.equipped);
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
         const maxWeapons = Math.min(items.length, getSetting('maxWeapons'));
         for (let idx = 0; idx < maxWeapons; idx++) {
            const item = items[idx];
            await this._buildWeaponGroup(actorId, tokenId, item, idx);
         }

         return;
      }

      async _buildWeaponGroup(actorId, tokenId, item, idx) {
         // Get the weapon ID
         const itemId = item._id;

         // Build attack actions
         const attacks = item.system.attack.map((attack, attackIdx) => {
            return {
               id: `${itemId}|attack,${attackIdx}`,
               name: attack.label,
               encodedValue: [actorId, tokenId, 'attackCheck', itemId, attackIdx].join(this.delimiter),
               icon1: attack.type === 'melee' ? '<i class="fas fa-sword"></i>' : '<i class="fas fa-bow-arrow"></i>'
            };
         });

         // Build item check actions
         const itemChecks = item.system.check.map((check, checkIdx) => {
            return {
               id: `${itemId}|itemCheck,${checkIdx}`,
               name: check.label,
               encodedValue: [actorId, tokenId, 'itemCheck', itemId, checkIdx].join(this.delimiter),
               icon1: '<i class="fas fa-dice"></i>'
            };
         });

         // Build toggle multi attack action
         const toggleMultiAttack = {
            id: `${itemId}|toggleMultiAttack`,
            name: localize(item.system.multiAttack ? 'multiAttackOn' : 'multiAttackOff'),
            encodedValue: [actorId, tokenId, 'toggleMultiAttack', itemId].join(this.delimiter),
            icon1: item.system.multiAttack ? '<i class="fas fa-swords"></i>' : '<i class="fas fa-sword"></i>'
         };

         // Update the group
         const groupId = `weapon${idx}`;
         const groupData = { id: groupId, type: 'system' };
         const group = this._getGroup(groupData);
         group.name = item.name;
         group.img = CoreUtils.getImage(item);

         return await this.addActions([...attacks, ...itemChecks, toggleMultiAttack], groupData);
      }

      async _buildEquipmentGroup(actorId, tokenId, actor) {
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

            return false;
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
                  id: `${itemId}|itemCheck`,
                  name: `${item.name} (${check.label})`,
                  encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx].join(this.delimiter),
                  img: CoreUtils.getImage(item)
               });
            });
         });

         // Add actions to group
         return await this.addActions(actions, { id: 'equipment', type: 'system' });
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
                  id: `${itemId}|itemCheck`,
                  name: `${item.name} (${check.label})`,
                  encodedValue: [actorId, tokenId, 'itemCheck', itemId, idx].join(this.delimiter),
                  img: CoreUtils.getImage(item)
               });
            });
         });

         // Add actions to group
         return await this.addActions(actions, { id: 'abilities', type: 'system' });
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

         // Build spell tradition subcategories
         const MaxSpellTraditions = Math.min(items.length, getSetting('maxSpellTraditions'));
         for (let idx = 0; idx < MaxSpellTraditions; idx++) {
            const tradition = traditions[idx];
            await this._buildSpellTraditionGroup(actorId, tokenId, tradition, items, idx);
         }

         return;
      }

      async _buildSpellTraditionGroup(actorId, tokenId, tradition, items, idx) {
         // Filter the spells by tradition
         const traditionSpells = items.filter((spell) => spell.system.tradition === tradition);

         // Setup actions
         const actions = [];
         traditionSpells.forEach((item) => {
            // Add casting check
            const itemId = item._id;
            actions.push({
               id: `${itemId}|castingCheck`,
               name: `${item.name}`,
               encodedValue: [actorId, tokenId, 'castingCheck', itemId].join(this.delimiter),
               img: CoreUtils.getImage(item)
            });

            // Add item checks
            item.system.check.forEach((check, checkIdx) => {
               actions.push({
                  id: `${itemId}|itemCheck`,
                  name: `${item.name} (${check.label})`,
                  encodedValue: [actorId, tokenId, 'itemCheck', itemId, checkIdx].join(this.delimiter),
                  img: CoreUtils.getImage(item)
               });
            });
         });

         // Update the group
         const groupId = `tradition${idx}`;
         const groupData = { id: groupId, type: 'system' };
         const group = this._getGroup(groupData);
         group.name = tradition;

         return await this.addActions(actions, groupData);
      }

      async _buildRecoveryGroup(actorId, tokenId) {
         // Setup actions
         const actions = [
            {
               id: 'longRest',
               name: localize('longRest'),
               encodedValue: [actorId, tokenId, 'longRest'].join(this.delimiter),
               icon1: '<i class="fas fa-bed"></i>'
            },
            {
               id: 'shortRest',
               name: localize('shortRest'),
               encodedValue: [actorId, tokenId, 'shortRest'].join(this.delimiter),
               icon1: '<i class="fas fa-face-exhaling"></i>'
            },
            {
               id: 'removeCombatEffects',
               name: localize('removeCombatEffects'),
               encodedValue: [actorId, tokenId, 'removeCombatEffects'].join(this.delimiter),
               icon1: '<i class="fas fa-arrow-rotate-left"></i>'
            }
         ];

         // Add actions to list
         return await this.addActions(actions, { id: 'recovery', type: 'system' });
      }

      async _buildResourcesGroup(actorId, tokenId, actor) {
         // Setup actions
         const actions = [
            {
               id: 'spendResolve',
               name: localize('spendResolve'),
               encodedValue: [actorId, tokenId, 'spendResolve'].join(this.delimiter),
               icon1: '<i class="fas fa-bolt"></i>'
            }
         ];

         // Add toggle inspiration action for players
         if (actor?.type === 'player') {
            actions.push({
               id: 'toggleInspiration',
               name: localize('inspiration'),
               encodedValue: [actorId, tokenId, 'toggleInspiration'].join(this.delimiter),
               icon1: actor.system.inspiration ? '<i class="fas fa-sun"></i>' : '<i class="far fa-circle"></i>'
            });
         }

         // Add actions to list
         return await this.addActions(actions, { id: 'resources', type: 'system' });
      }

      async _buildEffectsGroup(actorId, tokenId) {
         // Setup actions
         const actions = [
            {
               id: 'removeExpiredEffects',
               name: localize('removeExpiredEffects'),
               encodedValue: [actorId, tokenId, 'removeExpiredEffects'].join(this.delimiter),
               icon1: '<i class="fas fa-clock"></i>'
            }
         ];

         // Add actions to list
         return await this.addActions(actions, { id: 'effects', type: 'system' });
      }
   };
});
