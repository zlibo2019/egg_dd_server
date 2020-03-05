import { Service } from 'egg';
import { IResult } from '../../../extend/helper';
const moment = require('moment');


export default class UserService extends Service {


  /**
  * # 新增人员
  */
  async createUser(id: string, userNo: string, userLname: string, userSex: string, userTelephone: string) {

    const { ctx } = this;
    let jResult: IResult
      = {
      resultCode: 600,
      msg: '',
      data: null
    };
    const transaction = await ctx.model.transaction();
    try {
      let sj = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let sql = `select isnull(module_user,0) module_user from wt_module where module_id = '0002'`;
      let res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });
      let userSerial;
      if (res.length > 0) {
        let moduleUser = res[0].module_user;
        userSerial = Number(moduleUser) + 1;
      } else {
        await transaction.rollback();
        jResult.resultCode = 601;
        jResult.msg = `wt_module err`;
        return jResult;
      }

      res = await ctx.model.DtUser.findOne({
        where: {
          zh: id,
        }
      });
      if (null !== res) {
        await transaction.rollback();
        jResult.resultCode = 601;
        jResult.msg = `人员已存在`;
        return jResult;
      }


      await ctx.model.DtUser.create({
        user_serial: userSerial,
        user_no: userNo,
        user_lname: userLname,
        user_sex: userSex,
        user_telephone: userTelephone,
        user_type: 0,
        zh: id,
        user_dep: 10000,
        dep_no: '001',
      });

      res = await ctx.model.query(`declare @result int;exec ClientPro_user_kh '0000000000000001',${userSerial},'syn',@result output`);

      sql = `insert into dt_ac_dep_user(dep_serial,dep_lname,user_serial,sj,module_id,per_lx) 
			select a.acdep_serial,b.dep_name,${userSerial},'${sj}','0035' as module_id,0 
			from (select acdep_serial from xf_dep_ac_time  where ac_type='0000000000000001' group by acdep_serial) a,dt_ac_dep b 
      where a.acdep_serial=b.dep_serial`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      sql = `	insert into dt_ac_link(user_serial,ac_money,ac_addm,ac_addo,ac_subm,ac_subo,ac_regm,ac_make,ac_eachm,
        ac_eacho,ac_blockm,ac_blocks,jl_count,ac_state,sj,gly_no) 
			VALUES (${userSerial},0,0,0,0,0,0,0,0,0,0,0,0,0,'${sj}','syn')`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      sql = `insert into WT_USER_LOG(Lx,Log_type,Log_state,Module_id,Log_bz,Log_ip,Gly_no,Log_sj) 
			VALUES (0,0,0,'0002','姓名:'+'${userLname}'+' 工号:'+'${userNo}','127.0.0.1','syn','${sj}')`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      sql = `insert into kqfx_rizhi(serial,serial_bz,lx,czbz,gly_no,clbz,fxbz,sj) 
			values(${userSerial},1,12,1,'syn',0,0,'${sj}')`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });


      sql = `insert into wt_public(lx,log_type,is_all,user_serial,card_serial,new_number,old_number,
        log_sj,log_ip,gly_no) VALUES (1,1,0,${userSerial},'','','','${sj}','127.0.0.1','syn')`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      sql = `update wt_module set module_user = module_user + 1 where module_id = '0002'`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });
      await transaction.commit();
      return jResult;
    } catch (err) {
      await transaction.rollback();
      jResult.resultCode = 601;
      jResult.msg = `${err.stack}`;
      return jResult;
    }
  }


    // 同步钉钉打卡记录到一卡通
    async getUserInfoByUserId(userId) {
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
                  zh: userId,
              },
          }
          )
          jResult.data = res;

          return jResult;

      } catch (error) {
          jResult.resultCode = 601;
          jResult.msg = error;
          ctx.logger.error(error);
      }
      return jResult;

  }

  /**
   * # 修改人员
  */
  async updateUser(id, userNo, userLname, userSex, userTelephone) {

    const { ctx } = this;
    let jResult: IResult
      = {
      resultCode: 600,
      msg: '',
      data: null
    };
    const transaction = await ctx.model.transaction();
    try {
      let sj = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let sql = `update dt_user set user_lname='${userLname}',user_no='${userNo}',
      user_sj='${sj}',user_sex='${userSex}',user_telephone='${userTelephone}' where zh='${id}'`;
      let res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      sql = `insert into wt_public(lx,log_type,is_all,user_serial,card_serial,new_number,old_number,log_sj,
      log_ip,gly_no)
      select 1,2,0,user_serial,'','','','${sj}','127.0.0.1','syn' from dt_user where zh='${id}'`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });
      res;
      await transaction.commit();
      return jResult;
    } catch (err) {
      await transaction.rollback();
      jResult.resultCode = 601;
      jResult.msg = `${err.stack}`;
      return jResult;
    }
  }


  /**
  * # 删除人员
  */
  async deleteUser(id) {

    const { ctx } = this;
    let jResult: IResult
      = {
      resultCode: 600,
      msg: '',
      data: null
    };
    const transaction = await ctx.model.transaction();
    try {
      let sj = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let res = await ctx.model.DtUser.findOne({
        where: {
          zh: id,
        }
      })
      if (null === res) {
        await transaction.rollback();
        jResult.resultCode = 601;
        jResult.msg = `无此人员`;
        return jResult;
      }
      let userLname = res.user_lname;

      let sql = `update dt_user set user_type=51,user_sj='${sj}' where zh='${id}'`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      sql = `	insert into WT_USER_LOG(Lx,Log_type,Log_state,Module_id,Log_bz,Log_ip,Gly_no,Log_sj) 
			VALUES (3,0,0,'0002','姓名:'+'${userLname}'+' 工号:'+'${id}','127.0.0.1','syn','${sj}')`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      sql = `insert into wt_public(lx,log_type,is_all,user_serial,card_serial,new_number,old_number,log_sj,
      log_ip,gly_no) 
      select 1,3,0,user_serial,'','','','${sj}','127.0.0.1','syn' from dt_user 
			where zh='${id}'`;
      res = await ctx.model.query(sql, {
        type: ctx.model.QueryTypes.SELECT
      });

      await transaction.commit();
      return jResult;
    } catch (err) {
      await transaction.rollback();
      jResult.resultCode = 601;
      jResult.msg = `${err.stack}`;
      return jResult;
    }
  }


}

