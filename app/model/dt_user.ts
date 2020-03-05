/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const dt_user = app.model.define('dt_user', {
    user_serial: {
      type: INTEGER,
      allowNull: true,
      primaryKey: true,
    },
    zh: {
      type: STRING,
      allowNull: true
    },
    user_fname: {
      type: STRING,
      allowNull: true
    },
    user_no: {
      type: STRING,
      allowNull: true
    },
    user_telephone: {
      type: STRING,
      allowNull: true
    },
    user_type: {
      type: INTEGER,
      allowNull: true
    },
    user_lname: {
      type: STRING,
      allowNull: true
    },
    user_sex: {
      type: STRING,
      allowNull: true
    },
    user_dep: {
      type: INTEGER,
      allowNull: true
    },
    dep_no: {
      type: STRING,
      allowNull: true
    },
  }, {
    tableName: 'dt_user',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return dt_user;
};
