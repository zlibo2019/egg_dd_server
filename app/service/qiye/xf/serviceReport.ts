import { Service } from 'egg';
import { IResult } from '../../../extend/helper';

export default class TradService extends Service {


    // 充值 
    async rechargeCash(zh: string, cash: number) {

        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let res = await ctx.model.DtUser.findOne({
                where: {
                    zh: zh,
                }
            })
            let userSerial = res.user_serial;
            let sql = `exec Link_cardsave_account 0,'','ext','${userSerial}',${cash},''`;
            res = await ctx.model.query(sql, {
                type: ctx.model.QueryTypes.SELECT
            });

        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }


    // 查询交易明细 
    async queryTradRecord(
        zh: string,
        pageIndex: number,
        pageSize: number,
        beginTime: string,
        endTime: string
    ) {
        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let condition = 'where xf_mx.lx = 1';
            if (null !== zh && '' !== zh) {
                condition = `${condition} and dt_user.zh ='${zh}'`;
            }
            if (null !== beginTime && '' !== beginTime) {
                condition = `${condition} and xf_mx.sj between '${beginTime}' and '${endTime}'`;
            }

            let sql = `select count(1) count from xf_mx inner join dt_user 
            on xf_mx.user_serial = dt_user.user_serial ${condition}`;
            let res = await ctx.model.query(sql, {
                type: ctx.model.QueryTypes.SELECT
            });
            let count = res[0].count;

            // let pageCondition = condition;
            // if ('' !== condition) {
            //     pageCondition = `${condition} and dt_user.zydm = '${id}'`;
            // }
            sql = `select top ${pageSize} * 
            from (
                select row_number() over(order by xh desc) as rownumber,dt_user.user_no id,
                CONVERT(VARCHAR(20),xf_mx.sj,120) sj,xf_mx.dev_serial,xf_mx.new_money as trad_amt,
                dt_user.user_lname,dt_user.user_telephone,case when xf_mx.dev_serial = '0000000' then '订餐' else st_device.mc end mc
                from xf_mx
                inner join dt_user on xf_mx.user_serial = dt_user.user_serial
                left join st_device on xf_mx.dev_serial = st_device.bh
                ${condition}
            ) temp_table
            where rownumber > ((${pageIndex}-1)*${pageSize})
            order by sj desc`;
            res = await ctx.model.query(sql, {
                type: ctx.model.QueryTypes.SELECT
            });
            jResult.data = {
                count: count,
                data: res,
            }
            return jResult;
        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }

    // 查询充值明细 
    async queryRechargeRecord(
        zh: string,
        pageIndex: number,
        pageSize: number,
        beginTime: string,
        endTime: string
    ) {
        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let condition = 'where xf_mx.lx = 2';
            if (null !== zh && '' !== zh) {
                condition = `${condition} and dt_user.zh ='${zh}'`;
            }
            if (null !== beginTime && '' !== beginTime) {
                condition = `${condition} and xf_mx.sj between '${beginTime}' and '${endTime}'`;
            }

            let sql = `select count(1) count from xf_mx inner join dt_user 
            on xf_mx.user_serial = dt_user.user_serial ${condition}`;
            let res = await ctx.model.query(sql, {
                type: ctx.model.QueryTypes.SELECT
            });
            let count = res[0].count;

            // let pageCondition = condition;
            // if ('' !== condition) {
            //     pageCondition = `${condition} and dt_user.zydm = '${id}'`;
            // }
            sql = `select top ${pageSize} * 
            from (
                select row_number() over(order by xh desc) as rownumber,dt_user.user_no id,
                CONVERT(VARCHAR(20),xf_mx.sj,120) sj,xf_mx.dev_serial,xf_mx.new_add as trad_amt,
                dt_user.user_lname,dt_user.user_telephone,case when xf_mx.dev_serial = '0000000' then '充值' else st_device.mc end mc
                from xf_mx
                inner join dt_user on xf_mx.user_serial = dt_user.user_serial
                left join st_device on xf_mx.dev_serial = st_device.bh
                ${condition}
            ) temp_table
            where rownumber > ((${pageIndex}-1)*${pageSize})
            order by sj desc`;
            res = await ctx.model.query(sql, {
                type: ctx.model.QueryTypes.SELECT
            });
            jResult.data = {
                count: count,
                data: res,
            }
            return jResult;
        } catch (error) {
            jResult.resultCode = 601;
            jResult.msg = error;
            ctx.logger.error(error);
        }
        return jResult;
    }

    // 查询补贴明细 
    async querySubRecord(
        zh: string,
        pageIndex: number,
        pageSize: number,
        beginTime: string,
        endTime: string
    ) {
        const { ctx } = this;
        let jResult: IResult
            = {
            resultCode: 600,
            msg: '',
            data: null
        };

        try {
            let condition = 'where xf_mx.lx = 4';
            if (null !== zh && '' !== zh) {
                condition = `${condition} and dt_user.zh ='${zh}'`;
            }
            if (null !== beginTime && '' !== beginTime) {
                condition = `${condition} and xf_mx.sj between '${beginTime}' and '${endTime}'`;
            }

            let sql = `select count(1) count from xf_mx inner join dt_user 
            on xf_mx.user_serial = dt_user.user_serial ${condition}`;
            let res = await ctx.model.query(sql, {
                type: ctx.model.QueryTypes.SELECT
            });
            let count = res[0].count;

            // let pageCondition = condition;
            // if ('' !== condition) {
            //     pageCondition = `${condition} and dt_user.zydm = '${id}'`;
            // }
            sql = `select top ${pageSize} * 
            from (
                select row_number() over(order by xh desc) as rownumber,dt_user.user_no id,
                CONVERT(VARCHAR(20),xf_mx.sj,120) sj,xf_mx.dev_serial,xf_mx.new_sub as trad_amt,
                dt_user.user_lname,dt_user.user_telephone,st_device.mc
                from xf_mx
                inner join dt_user on xf_mx.user_serial = dt_user.user_serial
                left join st_device on xf_mx.dev_serial = st_device.bh
                ${condition}
            ) temp_table
            where rownumber > ((${pageIndex}-1)*${pageSize})
            order by sj desc`;
            res = await ctx.model.query(sql, {
                type: ctx.model.QueryTypes.SELECT
            });
            jResult.data = {
                count: count,
                data: res,
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
