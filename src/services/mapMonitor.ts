import { GET, POST } from "../utils/request";

export default {
  confirmAlarmInfoByIdxxx(data: { alarmId: number; companyId?: string; unitId?: number; userId?: number; username?: string }) {
    return GET("/mapMonitor/getMapConfigLogin", data);
  },
  getDynamicSourceByPmCodeAndParkId(data: {}) {
    return POST("/mapMonitor/getDynamicSourceByPmCodeAndParkId", data);
  },
  getEmissionsContributionByPmCodeAndParkId(data: { parkId: string; pmCode: string; rankingType: number; statisticalTime: string; statisticalType: number }) {
    return POST("/mapMonitor/getEmissionsContributionByPmCodeAndParkId", data);
  },
  getFactoryEmissionsTrendByPmCode(data: { factoryId: string; pmCode: string; type: number; statisticalTime: string }) {
    return POST("/mapMonitor/getFactoryEmissionsTrendByPmCode", data);
  },
  getPollutantDistributionByPmCode(data: { parkId: string; pmCode: string; timeStart: string; timeEnd: string }) {
    return POST("/mapMonitor/getPollutantDistributionByParkIdAndPmCode", data);
  },
  getParkList() {
    return GET("/mapMonitor/getParkList");
  },
  getFactoryListAll() {
    return GET("mapMonitor/getFactoryListAll");
  },
  getPmCodeListAll() {
    return GET("mapMonitor/getPmCodeListAll");
  },
  getFactoryList(data: { parkId: string }) {
    return GET("/mapMonitor/getFactoryList", data);
  },
  getPmCodeList(data: { factoryId: string; parkId: string }) {
    return GET("/mapMonitor/getPmCodeList", data);
  },
  getSitePmValueList(data: { pmCode: string; parkId: string; factoryId: string }) {
    return POST("/mapMonitor/getSitePmValueList", data);
  },
  getSiteMonitorDataById(data: { siteId: string }) {
    return GET("/mapMonitor/getSiteMonitorDataById", data);
  },
  getPmCodeListByParkId(data: { parkId: string }) {
    return GET("/mapMonitor/getPmCodeListByParkId", data);
  },

  getUncheckedAlarmInformation() {
    return GET("/mapMonitor/getUncheckedAlarmInformation");
  },

  confirmAlarmInfoById(data: { alarmId: string; isFromPopup?: number }) {
    return GET("/mapMonitor/confirmAlarmInfoById", data);
  },
  getMapInfoByPmCodeAndParkId(data: { parkId: string; pmCode: string }) {
    return POST("/mapMonitor/getMapInfoByPmCodeAndParkId", data);
  },
  getDynamicSourceContribution(data: { endTime: string; lng: number; lat: number; parkId: string; pmCode: string; startTime: string }) {
    return POST("/mapMonitor/getDynamicSourceContribution", data);
  },
  getDynamicSourceWindRose(data: { endTime: string; parkId: string; pmCode: string; startTime: string }) {
    return POST("/mapMonitor/getDynamicSourceWindRose", data);
  },
  getDynamicSourceTraceSource(data: { endTime: string; parkId: string; pmCode: string; startTime: string }) {
    return POST("/mapMonitor/getDynamicSourceTraceSource", data);
  },
  getParkListByUser() {
    return GET("/mapMonitor/getParkListByUser ");
  },
};
