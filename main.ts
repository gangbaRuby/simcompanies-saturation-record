import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ECharts Example</title>
    <script src="https://cdn.jsdelivr.net/npm/echarts@5.0.2/dist/echarts.min.js"></script>
</head>
<body>
    <h2>ECharts in Deno</h2>
    <div id="main" style="width: 600px;height:400px;"></div>

    <script>
        var myChart = echarts.init(document.getElementById('main'));

        var option = {
            title: {
                text: 'Sample Chart'
            },
            tooltip: {},
            xAxis: {
                data: ['A', 'B', 'C', 'D', 'E', 'F']
            },
            yAxis: {},
            series: [{
                name: 'Sales',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };

        myChart.setOption(option);
    </script>
</body>
</html>
`;

serve((req) => {
  return new Response(htmlContent, {
    headers: { "content-type": "text/html" },
  });
});
