module.exports = {
    "/api": {
      target:
        process.env["services__ygglink-identityapi__https__0"] || 
        process.env["services__ygglink-identityapi__http__0"],
      changeOrigin: true,
      secure: false, //process.env["NODE_ENV"] !== "development",
      pathRewrite: {
        "^/api": "",
      },
    },
  };