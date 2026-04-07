var DataTypes = require("sequelize").DataTypes;
var _contentCache = require("./contentCache");
var _follows = require("./follows");
var _listItems = require("./listItems");
var _lists = require("./lists");
var _reviews = require("./reviews");
var _users = require("./users");

function initModels(sequelize) {
  var contentCache = _contentCache(sequelize, DataTypes);
  var follows = _follows(sequelize, DataTypes);
  var listItems = _listItems(sequelize, DataTypes);
  var lists = _lists(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  listItems.belongsTo(contentCache, { as: "tmdb", foreignKey: "tmdb_id"});
  contentCache.hasMany(listItems, { as: "list_items", foreignKey: "tmdb_id"});
  listItems.belongsTo(contentCache, { as: "media_type_content_cache", foreignKey: "media_type"});
  contentCache.hasMany(listItems, { as: "media_type_list_items", foreignKey: "media_type"});
  reviews.belongsTo(contentCache, { as: "tmdb", foreignKey: "tmdb_id"});
  contentCache.hasMany(reviews, { as: "reviews", foreignKey: "tmdb_id"});
  reviews.belongsTo(contentCache, { as: "media_type_content_cache", foreignKey: "media_type"});
  contentCache.hasMany(reviews, { as: "media_type_reviews", foreignKey: "media_type"});
  listItems.belongsTo(lists, { as: "list", foreignKey: "list_id"});
  lists.hasMany(listItems, { as: "list_items", foreignKey: "list_id"});
  follows.belongsTo(users, { as: "follower", foreignKey: "follower_id"});
  users.hasMany(follows, { as: "follows", foreignKey: "follower_id"});
  follows.belongsTo(users, { as: "followed", foreignKey: "followed_id"});
  users.hasMany(follows, { as: "followed_follows", foreignKey: "followed_id"});
  lists.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(lists, { as: "lists", foreignKey: "user_id"});
  reviews.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "user_id"});

  return {
    contentCache,
    follows,
    listItems,
    lists,
    reviews,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
