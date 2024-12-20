module.exports = {
    "/api": {
      target:
        process.env["services__ygglink-gateway__http__0"]
        || 
        process.env["services__ygglink-gateway__https__0"],
      changeOrigin: true,
      secure: false, //process.env["NODE_ENV"] !== "development",
    },
  };