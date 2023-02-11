import { SystemManager } from './system-manager.js'
import { MODULE, REQUIRED_CORE_MODULE_VERSION } from './constants.js'

Hooks.once('ready', async () => {
   const localModule = game.modules.get(MODULE.ID)
   localModule.api = {
      requiredCoreModuleVersion: REQUIRED_CORE_MODULE_VERSION,
      SystemManager
   }
   Hooks.call('tokenActionHudSystemReady', localModule)
})
