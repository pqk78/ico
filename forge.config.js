const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('node:path');

module.exports = {
  packagerConfig: {
    asar: {
      unpackDir: path.join('**', 'node_modules', '{sharp,@img}', '**', '*'),
    },
    icon: './src/images/logo-dark',
    extraResource: [
      './src/templates/files.liquid',
      './src/templates/help.liquid',
      './src/templates/index.liquid',
      './src/templates/menu.liquid',
      './src/templates/preview.liquid',
      './src/templates/settings.liquid',
    ],
    osxSign: {
      optionsForFile: (filePath) => { 
        return { entitlements: './entitlements.plist' };
      }
    },
    osxNotarize: {
      keychainProfile: 'com-panqike-ico',
    },
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    // {
    //   name: '@electron-forge/maker-dmg',
    //   config: {
    //     name: 'ICO',
    //     icon: './src/images/logo-dark.icns',
    //   }
    // },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
