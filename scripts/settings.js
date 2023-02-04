export function register(updateFunc) {
   const appName = 'token-action-hud-titan'

   game.settings.register(appName, 'showUnEquippedEquipment', {
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
         updateFunc(value)
      }
   });

   game.settings.register(appName, 'maxWeapons', {
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
      onChange: (value) => {
         updateFunc(value)
      },
      requiresReload: true
   });

   game.settings.register(appName, 'maxSpellTraditions', {
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
         updateFunc(value)
      }
   });
}
