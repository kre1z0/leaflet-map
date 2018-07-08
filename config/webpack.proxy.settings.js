const EVERPOINT_SERVER = "msp.everpoint.ru";

module.exports = {
  "/api/plan/*": {
    target: "https://" + EVERPOINT_SERVER,
    prependPath: false,
    changeOrigin: true,
    rewrite: function(req, options) {
      req.headers.host = "dev2.everpoint.ru";
      const params = req.originalUrl.replace("/api/plan/", "");
      req.url = options.target + params;
    },
  },
  "/auth/*": {
    target: "https://" + EVERPOINT_SERVER,
    changeOrigin: true,
    rewrite: function(req) {
      req.headers.host = EVERPOINT_SERVER;
    },
  },
  "/api/geocode/*": {
    target: "https://" + EVERPOINT_SERVER,
    changeOrigin: true,
    secure: false,
    rewrite: function(req, res) {
      req.headers.host = "geocode-maps.yandex.ru";
    },
  },

  "/api/*": {
    target: "https://" + EVERPOINT_SERVER,
    changeOrigin: true,
    rewrite: function(req) {
      req.headers.host = EVERPOINT_SERVER;
    },
  },
  "/backapi/*": {
    target: "https://" + EVERPOINT_SERVER,
    changeOrigin: true,
    rewrite: function(req) {
      req.headers.host = EVERPOINT_SERVER;
    },
  },
  "/media/*": {
    target: "https://" + EVERPOINT_SERVER,
    changeOrigin: true,
    rewrite: function(req) {
      req.headers.host = EVERPOINT_SERVER;
    },
  },

  "/static/*": {
    target: "http://" + EVERPOINT_SERVER,
    changeOrigin: true,
    rewrite: function(req) {
      req.headers.host = EVERPOINT_SERVER;
    },
  },

  "/service/*": {
    target: "https://" + EVERPOINT_SERVER,
    changeOrigin: true,
    rewrite: function(req) {
      req.headers.host = EVERPOINT_SERVER;
    },
  },
};
