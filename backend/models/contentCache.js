const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contentCache', {
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    poster_path: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    vote_average: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    media_type: {
      type: DataTypes.ENUM('movie','tv'),
      allowNull: false,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'content_cache',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "tmdb_id" },
          { name: "media_type" },
        ]
      },
    ]
  });
};
