import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ECharts with Deno</title>
  <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.2/dist/echarts.min.js"></script>
</head>
<body>
  <h1>ECharts Demo</h1>
  <div id="main" style="width: 600px;height:400px;"></div>
  
  <script type="text/javascript">
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option = {
      title: {
        text: 'ECharts Example'
      },
      tooltip: {},
      xAxis: {
        data: ['Category1', 'Category2', 'Category3']
      },
      yAxis: {},
      series: [{
        type: 'bar',
        data: [120, 200, 150]
      }]
    };
    myChart.setOption(option);
  </script>
</body>
</html>
`;

serve((req) => new Response(html, { headers: { "content-type": "text/html" } }));
