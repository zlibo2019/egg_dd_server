import { Service } from 'egg';
import { IResult } from '../../../extend/helper';
import moment = require('moment');
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

    

    // 获取钉钉打卡记录
    async getDDRecord(arrUserId) {
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
            let url = `https://oapi.dingtalk.com/attendance/listRecord?access_token=${token}`;
            let data = {
                "userIds": arrUserId,
                "checkDateFrom": moment(Date()).subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss'),
                "checkDateTo": moment(Date()).subtract(0, 'days').format('YYYY-MM-DD HH:mm:ss'),
                "isI18n": "false"
            };
            let res = await this.ctx.curl(url, {
                method: 'POST',
                data: data,
                dataType: 'json',
                contentType: 'json',
            })
            if (null !== res && res.data.errcode == 0) {
                jResult.data = res.data.recordresult;
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




    // 钉钉记录是否存在
    async isRecordExists(id) {
        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let res = await ctx.model.KtJl.findOne({
                where: {
                    id: id,
                },
            })
            jResult.data = res;
            return jResult;
        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }



    // 同步钉钉打卡记录到一卡通
    async insertRecordToScm(arrDDRecord) {
        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            // let id;
            // let userFname;
            // let userSerial;
            // let fx;
            // let sj;
            // let address;
            // let userLname;
            // console.log(JSON.stringify(arrDDRecord));
            for (let i = 0; i < arrDDRecord.length; i++) {
                let curRecord = arrDDRecord[i];
                let id = curRecord.id;
                let userId = curRecord.userId;
                let fx = curRecord.checkType == "OnDuty" ? 1 : 2;
                let sj = moment(curRecord.userCheckTime).format("YYYY-MM-DD HH:mm:ss");
                let address = curRecord.userAddress;

                let userSerial;
                let userLname;
                jResult = await ctx.service.qiye.kq.serviceUser.getUserInfoByUserId(userId);
                if (jResult.resultCode == 600) {
                    userSerial = jResult.data.user_serial;
                    userLname = jResult.data.user_lname;
                }

                jResult = await this.isRecordExists(id);
                if (jResult.resultCode == 600 && jResult.data === null) {

                    let sql = `insert into kt_jl(id,user_serial,sj,fx,address) values('${id}',${userSerial},'${sj}',${fx},'${address}')`;
                    await ctx.model.query(sql, { type: ctx.model.QueryTypes.INSERT });
                    // await ctx.model.KtJl.create({
                    //     id: id,
                    //     user_serial: userSerial,
                    //     sj: sj,
                    //     fx: fx,
                    // });
                    let mesContent = {
                        userplace: address,
                        jlsj: sj,
                        username: userLname
                    }
                    // console.log('aaaaaaaa' + JSON.stringify(mesContent));
                    await ctx.model.MSGSEND.create({
                        user_serial: userSerial,
                        MSG_STATE: 0,
                        RECORD_DATE: sj,
                        INSERT_DATE: moment(Date()).format('YYYY-MM-DD HH:mm:ss'),
                        TEMPLET_ID: '100100',
                        MES_CONTENT: JSON.stringify(mesContent),
                    });
                }
            }

            return jResult;

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }

    // 同步钉钉打卡记录到一卡通
    async syncDDRecord() {
        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            jResult = await ctx.service.qiye.kq.serviceDDUser.getDDUserIds();
            if (jResult.resultCode === 601) {
                console.log(jResult.msg);
                return jResult;
            }
            let arrUserId = jResult.data;

            jResult = await this.getDDRecord(arrUserId);
            if (jResult.resultCode === 601) {
                console.log(jResult.msg);
                return jResult;
            }
            let arrDDRecord = jResult.data;

            jResult = await this.insertRecordToScm(arrDDRecord);
            if (jResult.resultCode === 601) {
                console.log(jResult.msg);
                return jResult;
            }

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }
}
