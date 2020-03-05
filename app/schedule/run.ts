import moment = require('moment');
exports.schedule = {
    type: 'worker',
    // cron: '0 0 3 * * *',
    // interval: '10s',
    immediate: true,
};

// 执行任务
function _getDDToken(ctx) {
    const interval = 3600000;
    setTimeout(async () => {
        let jResult = await ctx.service.qiye.kq.serviceSchedule.getDDToken();
        if (jResult.code === -1) {
            ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.message);
        }
        _getDDToken(ctx);
    }, interval);
};

// 执行任务
function _syncDDUser(ctx) {
    const interval = 15000;
    setTimeout(async () => {
        let jResult = ctx.service.qiye.kq.serviceSynUser.syncDDUser();
        if (jResult.code === -1) {
            ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.message);
        }
        _syncDDUser(ctx);
    }, interval);
};

// 执行任务
function _syncDDRecord(ctx) {
    const interval = 3000;
    setTimeout(async () => {
        let jResult = ctx.service.qiye.kq.serviceSynRecord.syncDDRecord();
        if (jResult.code === -1) {
            ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.message);
        }
        _syncDDRecord(ctx);
    }, interval);
};

exports.task = async function (ctx) {
    ctx.service.qiye.kq.serviceSchedule.getDDToken();
    _getDDToken(ctx);
    _syncDDUser(ctx);
    _syncDDRecord(ctx);
};

// exports.schedule = {
//     type: 'all',
//     // cron: '0 0 3 * * *',
//     interval: '10s',
//     // immediate: true,
// };

// exports.task = async function (ctx) {
//     let jResult = await ctx.service.serviceCommon.runTask();
//     if (jResult.code === -1) {
//         ctx.logger.error(moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + jResult.message);
//     }
// };