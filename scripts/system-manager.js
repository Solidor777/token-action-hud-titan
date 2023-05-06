// System Module Imports
import { ActionHandler } from './action-handler.js';
import { RollHandler } from './roll-handler.js';
import * as systemSettings from './settings.js';
import { createDefaults } from './defaults.js';

// Core Module Imports
import { CoreSystemManager, CoreCategoryManager, CoreUtils } from './config.js';

export let SystemManager = null;

Hooks.once('tokenActionHudCoreApiReady', async (coreModule) => {
   SystemManager = class SystemManagerClass extends coreModule.api.SystemManager {
      /** @override */
      doGetCategoryManager() {
         return new CoreCategoryManager();
      }

      /** @override */
      doGetActionHandler(categoryManager) {
         return new ActionHandler(categoryManager);
      }

      /** @override */
      getAvailableRollHandlers() {
         const choices = { core: 'Core Titan' };
         CoreSystemManager.addHandler(choices);

         return choices;
      }

      /** @override */
      doGetRollHandler() {
         return new RollHandler();
      }

      /** @override */
      doRegisterSettings(updateFunc) {
         systemSettings.register(updateFunc);
      }

      /** @override */
      async doRegisterDefaultFlags() {
         return createDefaults();

         /*
         await CoreUtils.setUserFlag('default', defaults);
         await CoreUtils.setUserFlag('categories', foundry.utils.deepClone(defaults.categories));
         await CoreUtils.setUserFlag('subcategories', foundry.utils.deepClone(defaults.subcategories));
         */
      }
   };
});
