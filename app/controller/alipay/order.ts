import AlipaySdk from 'alipay-sdk';
import { Controller } from 'egg';
const fs = require('fs');
const path = require('path');
const moment = require('moment');
/**
* 查询考勤记录
*/
class AlipayController extends Controller {
    async exec(method, params, options) {
        console.log('path:' + __dirname);
        let alipaySdk = new AlipaySdk({
            // 参考下方 SDK 配置
            appId: this.config.key.appId,
            privateKey: fs.readFileSync(path.resolve(__dirname, 'private-key.pem'), 'ascii'),
        });


        const res = await alipaySdk.exec(method, params, options);
        console.log(JSON.stringify(res));
        return res;


    }

    async create() {
        // let url = `https://openapi.alipay.com/gateway.do?timestamp=${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}&method=alipay.fund.trans.toaccount.transfer&app_id=${this.config.key.appId}&sign_type=RSA2&sign=ERITJKEIJKJHKKKKKKKHJEREEEEEEEEEEE&version=1.0&charset=GBK&biz_content=
        // {
        // "out_biz_no":"11111111111",
        // "payee_type":"zlibo@163.com",
        // "payee_account":"a35986597@163.com",
        // "amount":"0.23",
        // "payer_show_name":"同事转账",
        // "payee_real_name":"张三毛",
        // "remark":"转账备注"
        // }`;
        // let res = await this.ctx.curl(url,{
        //     method: 'GET',
        //     dataType: 'json'
        // })
        // return res;

        let res = await this.exec('alipay.trade.app.pay', {

            format: "JSON",
            // HTTP/HTTPS开头字符串 可不填
            return_url: "",
            charset: "utf-8",
            sign_type: "RSA2",
            timestamp: moment(new Date).format('YYYY-MM-DD HH:mm:ss'),
            version: "1.0",
            // 支付宝服务器主动通知商户服务器里指定的页面http/https路径。 可不填
            notify_url: "",
            // 应用授权概述 可不填
            app_auth_token: "",
            bizContent: {
                total_amount: 1,
                // 商品的标题/交易标题/订单标题/订单关键字等
                subject: "转账id",
                // 商户网站唯一订单号
                out_trade_no: "1111111111"
            },
        },
            {});
        return res;
    }


}

module.exports = AlipayController;
