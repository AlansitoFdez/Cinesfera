const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('reviews', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    rating: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'reviews',
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
        name: "unique_review",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
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
