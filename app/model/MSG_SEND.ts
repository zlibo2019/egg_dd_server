/* jshint indent: 2 */

module.exports = app => {
  const {
    STRING,
    INTEGER,
  } = app.Sequelize;
  const MSG_SEND = app.model.define('MSG_SEND', {
    
    user_serial: {
      type: INTEGER,
      allowNull: true
    },
    MSG_STATE: {
      type: INTEGER,
      allowNull: true
    },
    RECORD_DATE: {
      type: STRING,
      allowNull: true
    },
    INSERT_DATE: {
      type: STRING,
      allowNull: true
    },
    TEMPLET_ID: {
      type: STRING,
      allowNull: true
    },
    MES_CONTENT: {
      type: STRING,
      allowNull: true
    },
  }, {
    tableName: 'MSG_SEND',
    freezeTableName: true, // Model 对应的表名将与model名相同
    timestamps: false,//去除createAt updateAt
  });
  return MSG_SEND;
};
