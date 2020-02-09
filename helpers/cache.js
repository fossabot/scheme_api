const NodeCache = require("node-cache");
const nodecache = new NodeCache();

module.exports = {
  checkOnRequest(req, res, next) {
    let key = req.originalURL || req.url;
    if (nodecache.get(key)) {
      res.json({ success: true, content: nodecache.get("key") });
      next();
    }
  },

  get(key) {
    if (nodecache.get(key)) {
      return nodecache.get(key);
    }
  },
  set(key, item) {
    nodecache.set(key, item);
  },
  clear() {
    nodecache.flushAll();
  }
};
