// System Module Imports
import { ActionHandler } from './action-handler.js';
import { RollHandler } from './roll-handler.js';
import * as systemSettings from './settings.js';
import { createDefaults } from './defaults.js';

export let SystemManager = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
   SystemManager = class SystemManagerClass extends coreModule.api.SystemManager {
      /** @override */
      getActionHandler() {
         return new ActionHandler();
      }

      /** @override */
      getAvailableRollHandlers() {
         const choices = { core: 'Core Titan' };
         coreModule.api.SystemManager.addHandler(choices);

         return choices;
      }

      /** @override */
      getRollHandler() {
         return new RollHandler();
      }

      /** @override */
      registerSettings(onChangeFunction) {
         systemSettings.register(onChangeFunction);
      }

      /** @override */
      async registerDefaults() {
         return createDefaults();

         /*
         await coreModule.api.Utils.setUserFlag('default', defaults);
         await coreModule.api.Utils.setUserFlag('categories', foundry.utils.deepClone(defaults.categories));
         await coreModule.api.Utils.setUserFlag('subcategories', foundry.utils.deepClone(defaults.subcategories));
         */
      }
   };
});
