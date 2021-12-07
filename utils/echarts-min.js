import * as echarts from '../ec-canvas/echarts';

// 折线表
let optionLine = {
    title: {
        text: '业绩走势'
    },
    xAxis: {
        type: 'category',
        data: ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00']
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: [-0.1, -0.15, 0,  0.05,0 ,0.05,-0.05, 0, -0.1],
        type: 'line',
        smooth: true
    }],
    backgroudColor:'#fff'
  
};
let chartData = {
  'line' : {
    option: optionLine,
    chart: null
  }
}
 
let chart = null;
function getChart(type) {
  if (!type) {
    console.error("要获取图表名必传！");
    return null;
  }
  return chartData[type].chart;
}
/**
 * 初始化: 如下使用方法
 * this.data.chartR.init((canvas, width, height, dpr) => {
      charts.initChart(canvas, width, height, dpr, 'radar') // 注意最后一个参数自己定义的，后面使用用这个做区分
    });
*/
function initChart(canvas, width, height, dpr, type) {
  if(!type) {
    console.error("图表名必传（为了一个页面使用多个图表区分的id）");
    return false;
  }
  chartData[type].chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chartData[type].chart);
  chartSetOption(type);
  return chartData[type].chart;
}
 
/**
 * 绘制表格数据
*/
function chartSetOption(type, data = null) {
  if(!type || !chartData[type]) {
    console.error("图表id必传或者未找到图表:" + type);
    return false;
  }
  if(data) {  // 如果传了data则要替换
    setOption(type, data);
  }
  chartData[type].chart.setOption(chartData[type].option);
}
/**
 * 设置图表数据
*/
function setOption(type, data) {
  if (!type || !chartData[type]) {
    console.error('图表id必传或者未找到图表:' + type);
    return false;
  }
  if(!data) {
    console.error('没有要更新的数据');
    return false;
  }
  if (type == "radar") { // 雷达图
    chartData[type].option.series[0].data = data;
  }
}
 
/**
 * 删掉图表对象(节约空间)
*/
function closeChart(type) {
  if (!type || !chartData[type]) {
    console.error("图表id必传或者未找到图表:" + type);
    return false;
  }
  chartData[type].chart = null;
}
export default {
  getChart,  // 得到图表对象
  initChart,  // 初始化图表
  setOption,  //  设置图表内容
  chartSetOption,  //  动态改变图表内容
  closeChart,  // 删除图表对象
}
