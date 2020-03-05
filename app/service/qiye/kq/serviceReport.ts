import { Service } from 'egg';
import { IResult } from '../../../extend/helper';

export default class TradService extends Service {


    // 查询考勤明细 
    async queryKqMx(
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
            let condition = 'where 1 = 1';
            if (null !== zh && '' !== zh) {
                condition = `${condition} and dt_user.zh ='${zh}'`;
            }
            if (null !== beginTime && '' !== beginTime) {
                condition = `${condition} and kt_jl.sj between '${beginTime}' and '${endTime}'`;
            }

            let sql = `select count(1) count from kt_jl inner join dt_user 
            on kt_jl.user_serial = dt_user.user_serial ${condition}`;
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
                select row_number() over(order by kt_jl.bh desc) as rownumber,dt_user.user_no id,
                CONVERT(VARCHAR(20),kt_jl.sj,120) sj,kt_jl.dev_serial,
                dt_user.user_lname,dt_user.user_telephone,st_device.mc,kt_jl.address
                from kt_jl
                inner join dt_user on kt_jl.user_serial = dt_user.user_serial
                left join st_device on kt_jl.dev_serial = st_device.bh
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
