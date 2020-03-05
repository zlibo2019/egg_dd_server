'use strict';

import { Controller } from 'egg';
import { IResult } from '../../../extend/helper';

/**
* 查询考勤记录
*/
class TradController extends Controller {
    async queryKqMx() {
        const { ctx } = this;
        let body = ctx.request.body;
        // @ts-ignore

        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null,
        };

        let authCode = body.authCode;
        jResult = await ctx.service.qiye.kq.serviceDDUser.getUserIdByAuthCode(authCode);
        if (jResult.resultCode === 601) {
            console.log(jResult.msg);
            return jResult;
        }
        console.log(JSON.stringify(jResult.data));
        let userId = jResult.data.userid;


        try {
            let zh = userId;
            let pageIndex = body.page_index;
            let pageSize = body.page_size;
            let beginTime = body.begin_time;
            let endTime = body.end_time;
            jResult = await ctx.service.qiye.kq.serviceReport.queryKqMx(zh, pageIndex, pageSize, beginTime, endTime);
            ctx.success(jResult);
        } catch (err) {
            jResult.resultCode = 601;
            jResult.msg = err.stack;
            ctx.failed(jResult);
        }
    }


}

module.exports = TradController;
