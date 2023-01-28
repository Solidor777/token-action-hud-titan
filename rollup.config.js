import { terser } from 'rollup-plugin-terser'
import multi from '@rollup/plugin-multi-entry'

export default [
    {
        input: {
            include: [
                'scripts/*.js',
                'scripts/*/*.js'
            ],
            exclude: [
                'scripts/constants.js',
                'scripts/defaults.js',
                'scripts/token-action-hud-titan.min.js']
        },
        output: {
            format: 'esm',
            file: 'scripts/token-action-hud-titan.min.js'
        },
        plugins: [
            terser({ keep_classnames: true, keep_fnames: true }),
            multi()
        ]
    }
]