'use strict'

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://api-dev"', // 开发环境API地址Base
})
