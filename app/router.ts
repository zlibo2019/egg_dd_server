import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.post('/qiye/xf/mx/query', controller.qiye.xf.report.queryTradRecord);     // 查询消费明细
  router.post('/qiye/xf/recharge', controller.qiye.xf.report.rechargeCash);     // 账户充值
  router.post('/qiye/xf/recharge/query', controller.qiye.xf.report.queryRechargeRecord);     // 查询充值明细
  router.post('/qiye/xf/sub/query', controller.qiye.xf.report.querySubRecord);     // 查询补贴明细
  router.post('/qiye/kq/mx/query', controller.qiye.kq.report.queryKqMx);     // 查询考勤明细
  router.post('/alipay/order/create', controller.alipay.order.create);     // 支付宝订单创建
};
