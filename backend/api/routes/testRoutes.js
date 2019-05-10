module.exports = function(router, { logger }) {
  router.get("/", async (ctx, next) => {
    ctx.body = {
      success: true
    };
  });
};
