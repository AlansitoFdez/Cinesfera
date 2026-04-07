const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('listItems', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'lists',
        key: 'id'
      }
    },
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'content_cache',
        key: 'tmdb_id'
      }
    },
    media_type: {
      type: DataTypes.ENUM('movie','tv'),
      allowNull: false,
      references: {
        model: 'content_cache',
        key: 'media_type'
      }
    },
    added_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'list_items',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "unique_item",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "list_id" },
          { name: "tmdb_id" },
          { name: "media_type" },
        ]
      },
      {
        name: "tmdb_id",
        using: "BTREE",
        fields: [
          { name: "tmdb_id" },
          { name: "media_type" },
        ]
      },
    ]
  });
};
