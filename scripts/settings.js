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
}
