const { injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const path = require('path')

module.exports = function override(config, env) {
   config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);  // change importing css to less
   config = rewireLess.withLoaderOptions({
        modifyVars: {
            "@normal-color":"rgba(0, 34, 64, 0.7)",
            "@heading-color":"fade(#fff, 100%)",
            "@text-color":"fade(#fff,85%)",
            "@text-color-secondary":"fade(#fff, 65%)",
            "@border-color-split":"rgba(64,169,255,0.4)",
            "@input-bg":"transparent",
            "@popover-bg":"rgba(0,21,41,0.7)",
            "@btn-default-bg":"rgba(0,21,41,0.7)",
            "@component-background":"rgba(0,21,41,0.7)"
        }
   })(config, env);
   config.resolve.alias.components = path.resolve('src/js/components')
   config.resolve.alias.actions = path.resolve('src/js/actions')
   config.resolve.alias.containers = path.resolve('src/js/containers')
   config.resolve.alias.reducers = path.resolve('src/js/reducers')
   config.resolve.alias.common = path.resolve('src/js/common')
   config.module.rules.push({
       test:/node_modules/,
       loader:'ify-loader'
   })
   return config;
};
