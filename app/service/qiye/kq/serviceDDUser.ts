import { Service } from 'egg';
import { IResult } from '../../../extend/helper';
// import moment = require('moment');
// import { json } from 'body-parser';

export default class TradService extends Service {

    // 获取人员id
    async getUserByUserId(userId) {
        const { ctx, app } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let token = await app.redis.get(`dd_token`);
            if (undefined === token || null == token) {
                jResult.resultCode = 601;
                jResult.msg = 'not found token';
            }
            let url = `https://oapi.dingtalk.com/user/get?access_token=${token}&userid=${userId}`;
            // 获取token  
            let res = await this.ctx.curl(url, {
                method: 'GET',
                dataType: 'json'
            });
            if (null !== res && res.data.errcode == 0) {
                jResult.data = res.data;
            } else {
                jResult.resultCode = 601;
                jResult.msg = res.data.errmsg;
            }

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }

    // 根据免登陆授权码查询userId
    async getUserIdByAuthCode(authCode) {
        const { ctx, app } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let token = await app.redis.get(`dd_token`);
            if (undefined === token || null == token) {
                jResult.resultCode = 601;
                jResult.msg = 'not found token';
            }
            let url = `https://oapi.dingtalk.com/user/getuserinfo?access_token=${token}&code=${authCode}`;
            // 获取token  
            let res = await this.ctx.curl(url, {
                method: 'GET',
                dataType: 'json'
            });
            if (null !== res && res.data.errcode == 0) {
                jResult.data = res.data;
            } else {
                jResult.resultCode = 601;
                jResult.msg = res.data.errmsg;
            }

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }

    // 获取人员id
    async getDDUserIds() {
        const { ctx, app } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let token = await app.redis.get(`dd_token`);
            if (undefined === token || null == token) {
                jResult.resultCode = 601;
                jResult.msg = 'not found token';
            }
            let url = `https://oapi.dingtalk.com/user/getDeptMember?access_token=${token}&deptId=1`
            // 获取token  
            let res = await this.ctx.curl(url, {
                method: 'GET',
                dataType: 'json'
            });
            if (null !== res && res.data.errcode == 0) {
                jResult.data = res.data.userIds;
            } else {
                jResult.resultCode = 601;
                jResult.msg = res.data.errmsg;
            }

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }
}
