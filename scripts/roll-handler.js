// Core Module Imports
export let RollHandler = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
   RollHandler = class RollHandlerClass extends coreModule.api.RollHandler {
      /**
       * Handle Action Event
       * @override
       * @param {object} event
       * @param {string} encodedValue
       */
      async handleActionClick(event, encodedValue) {
         // Get the payload
         const actionData = encodedValue.split('|');
         if (actionData.length < 3) {
            console.error('TOKEN ACTION HUD (TITAN) | Action Failed. Incomplete Action Data.');
            return;
         }

         // Initialize action variables
         const actorId = actionData[0];
         const tokenId = actionData[1];
         const actionType = actionData[2];
         actionData.splice(0, 3);

         // Handle multiple tokens
         if (tokenId === 'multi') {
            for (const token of canvas.tokens.controlled) {
               const character = coreModule.api.Utils.getActor(token.actor?.id, token.id)?.character;
               if (character) {
                  await this._performAction(actionType, actionData, character);
               }
            }

            return;
         }

         // Handle single token
         else {
            const character = coreModule.api.Utils.getActor(actorId, tokenId)?.character;
            if (character) {
               return await this._performAction(actionType, actionData, character);
            }
         }

         return;
      }

      async _performAction(actionType, actionData, character) {
         switch (actionType) {
            // Attribute check
            case 'attributeCheck': {
               const attribute = actionData[0];
               if (!attribute) {
                  console.error('TOKEN ACTION HUD (TITAN) | Attribute Check Failed. No provided Attribute.');
                  return;
               }

               return await character.rollAttributeCheck({ attribute: attribute }, false);
            }

            // Resistance check
            case 'resistanceCheck': {
               const resistance = actionData[0];
               if (!resistance) {
                  console.error('TOKEN ACTION HUD (TITAN) | Resistance Check Failed. No provided Resistance.');
                  return;
               }

               return await character.rollResistanceCheck({ resistance: resistance }, false);
            }

            // Skill check
            case 'skillCheck': {
               const skill = actionData[0];
               if (!skill) {
                  console.error('TOKEN ACTION HUD (TITAN) | Skill Check Failed. No provided Skill.');
                  return;
               }

               return await character.rollAttributeCheck({ skill: skill }, false);
            }

            // Attack check
            case 'attackCheck': {
               const itemId = actionData[0];
               if (!itemId) {
                  console.error('TOKEN ACTION HUD (TITAN) | Attack Check Failed. No provided Weapon ID.');
                  console.trace();
                  return;
               }

               const attackIdx = actionData[1];
               if (!attackIdx) {
                  console.error('TOKEN ACTION HUD (TITAN) | Attack Check Failed. No provided Attack IDX.');
                  console.trace();
                  return;
               }

               return await character.rollAttackCheck({ itemId: itemId, attackIdx: attackIdx }, false);
            }

            // Toggle multi attack
            case 'toggleMultiAttack': {
               const itemId = actionData[0];
               if (!itemId) {
                  console.error('TOKEN ACTION HUD (TITAN) | Toggle Multi-Attack Failed. No provided Weapon ID.');
                  console.trace();
                  return;
               }

               return await character.toggleMultiAttack(itemId);
            }

            // Item check
            case 'itemCheck': {
               const itemId = actionData[0];
               if (!itemId) {
                  console.error('TOKEN ACTION HUD (TITAN) | Item Check Failed. No provided Item ID.');
                  console.trace();
                  return;
               }

               const checkIdx = actionData[1];
               if (!checkIdx) {
                  console.error('TOKEN ACTION HUD (TITAN) | Item Check Failed. No provided Check IDX.');
                  console.trace();
                  return;
               }

               return await character.rollItemCheck({ itemId: itemId, checkIdx: checkIdx }, false);
            }

            // Item check
            case 'castingCheck': {
               const itemId = actionData[0];
               if (!itemId) {
                  console.error('TOKEN ACTION HUD (TITAN) | Casting Check Failed. No provided Item ID.');
                  console.trace();
                  return;
               }

               return await character.rollCastingCheck({ itemId: itemId }, false);
            }

            case 'longRest': {
               return await character.longRest(true);
            }

            case 'shortRest': {
               return await character.shortRest(true);
            }

            case 'removeCombatEffects': {
               return await character.removeCombatEffects(true);
            }

            case 'removeExpiredEffects': {
               return await character.removeExpiredEffects(false);
            }

            case 'spendResolve': {
               return await character.spendResolve(1, 1, true);
            }

            case 'toggleInspiration': {
               return await character.toggleInspiration();
            }

            default: {
               console.error(`TOKEN ACTION HUD (TITAN) | Action. Invalid action type (${actionType}).`);
               console.trace();
               return;
            }
         }
      }
   };
});
