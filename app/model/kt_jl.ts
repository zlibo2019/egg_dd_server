/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const kt_jl = app.model.define('kt_jl', {
    id: {
      type: STRING,
      allowNull: true,
      primaryKey: true,
    },
    user_serial: {
      type: INTEGER,
      allowNull: true
    },
    fx: {
      type: INTEGER,
      allowNull: true
    },
    sj: {
      type: STRING,
      allowNull: true
    },
  }, {
    tableName: 'kt_jl',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return kt_jl;
};
