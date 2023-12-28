/* eslint-disable no-undef */

import { MODULE } from './constants.js';

export function register(updateFunc) {
   console.log('Token Action HUD TITAN | Registering settings.');

   game.settings.register(MODULE.ID, 'showUnEquippedEquipment', {
      name: game.i18n.localize(
         'tokenActionHud.titan.settings.showUnEquippedEquipment.label'
      ),
      hint: game.i18n.localize(
         'tokenActionHud.titan.settings.showUnEquippedEquipment.hint'
      ),
      scope: 'client',
      config: true,
      type: Boolean,
      default: false,
      onChange: (value) => {
         updateFunc(value);
      }
   });

   game.settings.register(MODULE.ID, 'maxWeapons', {
      name: game.i18n.localize(
         'tokenActionHud.titan.settings.maxWeapons.label'
      ),
      hint: game.i18n.localize(
         'tokenActionHud.titan.settings.maxWeapons.hint'
      ),
      scope: 'client',
      config: true,
      type: Number,
      default: 5,
      range: {
         min: 3,
         max: 10,
         step: 1
      },
      requiresReload: true,
      onChange: (value) => {
         updateFunc(value);
      }
   });

   game.settings.register(MODULE.ID, 'maxSpellTraditions', {
      name: game.i18n.localize(
         'tokenActionHud.titan.settings.maxSpellTraditions.label'
      ),
      hint: game.i18n.localize(
         'tokenActionHud.titan.settings.maxSpellTraditions.hint'
      ),
      scope: 'client',
      config: true,
      type: Number,
      default: 5,
      range: {
         min: 3,
         max: 10,
         step: 1
      },
      requiresReload: true,
      onChange: (value) => {
         updateFunc(value);
      }
   });
}
