const { defineConfig } = require('@vue/cli-service')

const repoName = 'programming-portfolio'

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? `/${repoName}/`
    : '/',
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = 'Programming portfolio'
      return args
    })
  }
})
