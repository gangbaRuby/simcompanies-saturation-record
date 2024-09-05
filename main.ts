import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECharts Example</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
    <style>
        #chartContainer {
            width: 600px;
            height: 400px;
        }
    </style>
</head>
<body>
    <div id="chartContainer"></div>
    <script>
        // 从 GitHub 加载 JSON 数据
        fetch('https://raw.githubusercontent.com/gangbaRuby/simcompanies-saturation-record/main/data/saturation.json')
            .then(response => response.json())
            .then(data => {
                // 处理 JSON 数据，转换为 ECharts 所需的数据格式
                var dates = Object.keys(data);
                var seriesData = [];

                dates.forEach(date => {
                    var seriesItem = { name: date, type: 'line', data: [] };
                    Object.keys(data[date]).forEach(id => {
                        seriesItem.data.push({ value: data[date][id], name: id });
                    });
                    seriesData.push(seriesItem);
                });

                // 初始化 ECharts 实例
                var chart = echarts.init(document.getElementById('chartContainer'));

                // 配置 ECharts 图表
                var option = {
                    title: {
                        text: 'Saturation Data Chart'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: dates
                    },
                    xAxis: {
                        type: 'category',
                        data: Object.keys(data[dates[0]])
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: seriesData
                };

                // 使用指定的配置项和数据显示图表
                chart.setOption(option);
            })
            .catch(error => console.error('Error fetching data:', error));
    </script>
</body>
</html>
`;

serve((req) => {
  return new Response(htmlContent, {
    headers: { "content-type": "text/html" },
  });
});
