// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

const config = withTurborepoManagedCache(
  withMonorepoPaths(
    withNativeWind(getDefaultConfig(__dirname), {
      input: "./global.css",
      configPath: "./tailwind.config.js",
    })
  )
);

config.resolver.unstable_enablePackageExports = true;

config.resolver.disableHierarchicalLookup = true;

module.exports = config;

/**
 * Add the monorepo paths to the Metro config.
 * This allows Metro to resolve modules from the monorepo.
 *
 * @see https://docs.expo.dev/guides/monorepos/#modify-the-metro-config
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withMonorepoPaths(config) {
  const projectRoot = __dirname;
  const workspaceRoot = path.resolve(projectRoot, "../..");

  // #1 - Watch all files in the monorepo
  config.watchFolders = [workspaceRoot];

  // #2 - Resolve modules within the project's `node_modules` first, then all monorepo modules
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules/.pnpm/node_modules"),
  ];

  // #3 - Add additional resolver options for pnpm compatibility
  config.resolver.resolverMainFields = ["react-native", "browser", "main"];
  config.resolver.platforms = ["ios", "android", "native", "web"];

  return config;
}

/**
 * Move the Metro cache to the `.cache/metro` folder.
 * If you have any environment variables, you can configure Turborepo to invalidate it when needed.
 *
 * @see https://turbo.build/repo/docs/reference/configuration#env
 * @param {import('expo/metro-config').MetroConfig} config
 * @returns {import('expo/metro-config').MetroConfig}
 */
function withTurborepoManagedCache(config) {
  config.cacheStores = [new FileStore({ root: path.join(__dirname, ".cache/metro") })];
  return config;
}
