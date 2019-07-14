module.exports = {
  plugins: {
    autoprefixer: {}
  },

  //WebPack
  configureWebpack: {
    devServer :{
      public : '0.0.0.0',
      host : '0.0.0.0',
      disableHostCheck : true,

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "X-Requested-With, Content-Type, Authorization, Accept, Cookie"
      },
    }
  },
}
