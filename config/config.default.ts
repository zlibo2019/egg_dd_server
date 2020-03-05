import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1545281209678_6598';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.security = {
    csrf: {
      enable: false,
    }
  };

  config.sequelize = {
    dialect: 'mssql',     // 数据库类型
    // database: 'scm_main_dh',   // 数据库名称
    database: 'scm_lan',   // 数据库名称
    timezone: '+08:00',
    pool: {
      max: 5000,
      min: 0,
      idle: 100000,
    },
    // host: '10.18.0.6',     // 服务器
    // host: '10.0.63.10',     // 服务器
    host: '222.173.219.54',
    port: 15005, //59157,           // 端口 
    username: 'sa',        // 用户名
    // password: '123',       // 密码
    password: 'weds123!@#',       // 密码
    // dialectOptions: {
    //   instanceName: 'sql2008',    // 实例名
    //   // instanceName: '59157',    // 实例名
    //   connectTimeout: 600000,      // 连接超时时间
    //   requestTimeout: 999999,     // 请求超时时间
    // },
    logging: false,                  // 是否打印sql日志
  };

  config.multipart = {
    mode: 'file',
    fileExtensions: ['.jpeg', '.jpg', '.png'], // 增加对 扩展名的文件支持
  };



  config.bodyParser = {
    jsonLimit: '50mb',
    formLimit: '50mb',
  };

  config.httpclient = {
    // @ts-ignore
    request: {
      timeout: 600000,
    },
    httpAgent: {
      keepAlive: true,
      freeSocketTimeout: 4000,
      maxSockets: Number.MAX_SAFE_INTEGER,
      maxFreeSockets: 256,
    },
    httpsAgent: {
      keepAlive: true,
      freeSocketTimeout: 4000,
      maxSockets: Number.MAX_SAFE_INTEGER,
      maxFreeSockets: 256,
    },
  };


  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 1,
    },
  };

  config.cluster = {
    listen: {
      port: 3000,
      // hostname: '127.0.0.1',
    }
  }

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.info = {
    connectIp: "http://116.249.5.18:82",
  };

  config.key = {
    oapiHost: 'https://oapi.dingtalk.com',
    appId: '2018051560091226',
    appKey: 'dingk4t4ecpt5ikg3vmy',//'dingyzvld2sgmb0tzesj',//
    appSecret: 'uMoXX8GFW6nCktAInr8LzWfpla7LdLr-KECUoUvKIw2c0s4KrZyGNK8XWweZUSUH'//'G4jLC5k8xbesAxIICtRQaApVUdz0EFDqa-ncLKhSRp99j7rXGuOhq2UOlWzh35aG',//
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
