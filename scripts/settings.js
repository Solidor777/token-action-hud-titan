export function register(updateFunc) {
    const appName = 'token-action-hud-titan'

    game.settings.register(appName, 'abbreviateSkills', {
        name: game.i18n.localize(
            'tokenActionHud.titan.settings.abbreviateSkills.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.titan.settings.abbreviateSkills.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(appName, 'showSlowActions', {
        name: game.i18n.localize(
            'tokenActionHud.titan.settings.showSlowActions.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.titan.settings.showSlowActions.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(appName, 'displaySpellInfo', {
        name: game.i18n.localize(
            'tokenActionHud.titan.settings.displaySpellInfo.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.titan.settings.displaySpellInfo.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(appName, 'showUnchargedItems', {
        name: game.i18n.localize(
            'tokenActionHud.titan.settings.showUnchargedItems.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.titan.settings.showUnchargedItems.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(appName, 'showUnequippedItems', {
        name: game.i18n.localize(
            'tokenActionHud.titan.settings.showUnequippedItems.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.titan.settings.showUnequippedItems.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(appName, 'showUnpreparedSpells', {
        name: game.i18n.localize(
            'tokenActionHud.titan.settings.showUnpreparedSpells.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.titan.settings.showUnpreparedSpells.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: true,
        onChange: (value) => {
            updateFunc(value)
        }
    })

    game.settings.register(appName, 'showItemsWithoutActivationCosts', {
        name: game.i18n.localize(
            'tokenActionHud.titan.settings.showItemsWithoutActivationCosts.name'
        ),
        hint: game.i18n.localize(
            'tokenActionHud.titan.settings.showItemsWithoutActivationCosts.hint'
        ),
        scope: 'client',
        config: true,
        type: Boolean,
        default: false,
        onChange: (value) => {
            updateFunc(value)
        }
    })
}
