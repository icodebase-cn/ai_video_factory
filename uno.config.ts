import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      // ...
    },
  },
  shortcuts: [['drag-bar', 'drag after:window-control-bar-no-drag-mask']],
  rules: [
    ['drag', { '-webkit-app-region': 'drag' }],
    ['no-drag', { '-webkit-app-region': 'no-drag' }],
    [
      'window-control-bar-no-drag-mask',
      {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '120px',
        height: '35px',
        '-webkit-app-region': 'no-drag',
      },
    ],
  ],
  presets: [
    presetWind3(),
    presetIcons(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        // ...
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
