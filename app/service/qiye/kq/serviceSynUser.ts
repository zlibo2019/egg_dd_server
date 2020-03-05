import { Service } from 'egg';
import { IResult } from '../../../extend/helper';
// import moment = require('moment');
// import { json } from 'body-parser';

export default class TradService extends Service {

   
    /**
      * # 同步钉人员到一卡通
      * # 按照zh和user_telephone进行比对，有则更新，无则新增
      */

    async updateUserToScm(user) {
        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {

            let zh = user.userid;
            let userTelephone = user.mobile;
            let userLname = user.name;
            let res = await ctx.model.DtUser.findOne({
                where: {
                    user_lname: userLname
                },
            })
            if (res === null) {
                jResult = await ctx.service.qiye.kq.serviceUser.createUser(zh, zh, userLname, '', userTelephone);
                if(jResult.resultCode === 601){
                    console.log(jResult.msg);
                }
              
            } else {
                await ctx.model.DtUser.update({
                    zh:zh,
                    user_telephone: userTelephone,
                }, {
                    where: {
                        user_lname: userLname
                    },

                });
                // let res = await ctx.model.DtUser.findOne({
                //     where: {
                //         user_telephone: userTelephone
                //     },
                // })
                // if (res !== null) {
                //     await ctx.model.DtUser.update({
                //         zh: zh,
                //         user_lname: userLname,
                //     }, {
                //         where: {
                //             user_telephone: userTelephone,
                //         },

                //     });

                // } else {
                //     jResult = await ctx.service.qiye.kq.serviceUser.createUser(zh, zh, userLname, '', userTelephone);
                //     if(jResult.resultCode === 601){
                //         console.log(jResult.msg);
                //     }
                // }
            }

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }

    

    // 同步钉钉打卡记录到一卡通
    async syncDDUser() {
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
            let arrUserId = jResult.data

            for (let i = 0; i < arrUserId.length; i++) {
                let curUserId = arrUserId[i];
                jResult = await ctx.service.qiye.kq.serviceDDUser.getUserByUserId(curUserId);
                if (jResult.resultCode === 601) {
                    console.log(jResult.msg);
                    return jResult;
                }
                let user = jResult.data;
                jResult = await this.updateUserToScm(user);
                if (jResult.resultCode === 601) {
                    console.log(jResult.msg);
                    return jResult;
                }
            }
        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }
}
