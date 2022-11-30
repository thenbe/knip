import load from '../../util/loader.js';
import { getPackageName } from '../../util/modules.js';
import { timerify } from '../../util/performance.js';
import type { IsPluginEnabledCallback, GenericPluginCallback } from '../../types/plugins.js';
import type { PostCSSConfig } from './types.js';

export const isEnabled: IsPluginEnabledCallback = ({ dependencies }) => dependencies.has('postcss');

export const CONFIG_FILE_PATTERNS = ['postcss.config.js', 'package.json'];

const findPostCSSDependencies: GenericPluginCallback = async (configFilePath, { manifest }) => {
  const config: PostCSSConfig = configFilePath.endsWith('package.json')
    ? manifest?.postcss
    : await load(configFilePath);

  return config?.plugins
    ? (Array.isArray(config.plugins) ? config.plugins : Object.keys(config.plugins)).map(getPackageName)
    : [];
};

export const findDependencies = timerify(findPostCSSDependencies);