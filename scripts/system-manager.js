// System Module Imports
import { ActionHandler } from './action-handler.js'
import { RollHandler as Core } from './roll-handler.js'
import { localize } from './utils.js'
import * as systemSettings from './settings.js'

// Core Module Imports
import { CoreSystemManager, CoreCategoryManager } from './config.js'

export class SystemManager extends CoreSystemManager {
   /** @override */
   doGetCategoryManager(user) {
      return new CoreCategoryManager(user)
   }

   /** @override */
   doGetActionHandler(character, categoryManager) {
      return new ActionHandler(character, categoryManager)
   }

   /** @override */
   getAvailableRollHandlers() {
      const choices = { core: 'Core Titan' }
      return choices
   }

   /** @override */
   doGetRollHandler(handlerId) {
      return new Core()
   }

   /** @override */
   doRegisterSettings(updateFunc) {
      systemSettings.register(updateFunc)
   }

   /** @override */
   async doRegisterDefaultFlags() {
      const settings = {
         categories: {
            inventory: {
               id: 'attributes',
               title: localize('attributes'),
               subcategories: [{
                  id: 'attributes',
                  title: localize('attributes'),
                  type: 'system'
               }]
            },
            skills: {
               id: 'skills',
               title: localize('skills'),
               subcategories: [{
                  id: 'skills',
                  title: localize('skills'),
                  type: 'system'
               }]
            },
            resistances: {
               id: 'resistances',
               title: localize('resistances'),
               subcategories: [{
                  id: 'resistances',
                  title: localize('resistances'),
               }]
            },
            weapons: {
               id: 'weapons',
               title: localize('weapons'),
               subcategories: []
            },
            equipment: {
               id: 'equipment',
               title: localize('equipment'),
               subcategories: []
            },
            spells: {
               id: 'spells',
               title: localize('spells'),
               subcategories: []
            },
            utility: {
               id: 'utility',
               title: localize('utility'),
               subcategories: []
            },
         },
         subcategories: [
            { id: 'attributes', title: localize('attributes') },
            { id: 'skills', title: localize('skills') },
            { id: 'resistances', title: localize('resistances') },
            { id: 'weapons', title: localize('weapons') },
            { id: 'equipment', title: localize('attributes') },
            { id: 'spells', title: localize('spells') },
            { id: 'utility', title: localize('utility') },
         ]
      }
      const defaults = foundry.utils.deepClone(settings);
      settings.defaults = defaults;
      await game.user.update({ flags: { 'token-action-hud-core': settings } })
   }
}
