import { Service } from 'egg';
import { IResult } from '../../../extend/helper';
// import moment = require('moment');
// import { json } from 'body-parser';

export default class TradService extends Service {


    // 获取钉钉token 
    async getDDToken() {
        const { ctx, app } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let url = `https://oapi.dingtalk.com/gettoken?appkey=${this.config.key.appKey}&appsecret=${this.config.key.appSecret}`
            // 获取token  
            let res = await this.ctx.curl(url, {
                method: 'GET',
                dataType: 'json'
            })
            let token;
            if (null !== res && res.data.errcode == 0) {
                token = res.data.access_token;
                await app.redis.set(`dd_token`, token);
            } else {
                jResult.resultCode = 601;
                jResult.msg = res.data.errmsg;
            }
            return jResult;

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }

}
