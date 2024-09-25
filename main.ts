import { serve } from "https://deno.land/std@0.114.0/http/server.ts";

const htmlContent = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SC饱和度</title>
    <!-- 引入Bootstrap样式 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        .chart-container {
            width: 100%;
            margin: 20px auto;
            white-space: nowrap;
            position: relative;
            padding-bottom: 150px;
            /* 增加底部空间，适应滚动条和图例 */
        }

        #chart {
            width: 100%;
            height: 70vh;
            /* 使用视口高度，确保图表根据屏幕大小自适应 */
        }

        .toggle-label-button {
            padding: 5px 10px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 12px;
        }

        .chart-title {
            text-align: center;
            font-weight: bold;
            margin-top: 20px;
        }

        .form-label {
            font-size: 14px;
            margin-right: 10px;
        }

        .form-select {
            font-size: 12px;
        }

        .control-panel {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
        }

        .control-panel select,
        .control-panel h4 {
            margin-bottom: 10px;
        }

        @media only screen and (max-width: 768px) {
            #chart {
                height: 60vh;
                /* 在手机上设置高度为60%视口高度 */
                width: 100%;
            }

            .toggle-label-button {
                padding: 3px 6px;
                font-size: 12px;
            }

            .chart-container {
                padding-bottom: 50px;
                /* 增加底部空间，适应滚动条和图例 */
            }

            .chart-title {
                font-size: 18px;
            }

            .form-label {
                font-size: 12px;
            }

            .form-select {
                font-size: 10px;
            }
        }

        footer {
            text-align: center;
            padding: 20px 0;
            background-color: #f8f9fa;
            color: #6c757d;
        }
    </style>
</head>

<body>
    <!-- Bootstrap 按钮组作为分类选择 -->
    <div class="container mt-3">
        <div class="d-flex justify-content-center">
            <div class="btn-group" role="group" aria-label="分类选择">
                <button type="button" class="btn btn-primary" data-chart="freshStore">生鲜商店</button>
                <button type="button" class="btn btn-secondary" data-chart="hardwareStore">五金商店</button>
                <button type="button" class="btn btn-secondary" data-chart="gasStation">加油站</button>
                <button type="button" class="btn btn-secondary" data-chart="fashionStore">时装商店</button>
                <button type="button" class="btn btn-secondary" data-chart="electronicsStore">电子产品商店</button>
                <button type="button" class="btn btn-secondary" data-chart="carDealership">车行</button>
                <button type="button" class="btn btn-secondary" data-chart="aerospace">航天</button>
            </div>
        </div>
    </div>

    <!-- 控制面板 -->
    <div class="container mt-3 control-panel">
        <div class="d-flex align-items-center">
            <h4 class="form-label">切换服务器:</h4>
            <select id="dataSource" class="form-select w-auto">
                <option value="R1">R1 商业大亨</option>
                <option value="R2">R2 企业家</option>
            </select>
        </div>
        <div class="d-flex align-items-center">
            <h4 class="form-label">选择时间段:</h4>
            <select id="timeRange" class="form-select w-auto">
                <option value="7">最近7天</option>
                <option value="30">最近30天</option>
                <option value="90">最近90天</option>
                <option value="all">全部</option>
            </select>
        </div>
        <button class="toggle-label-button">切换数据标签</button>
    </div>

    <!-- 图表标题 -->
    <div class="container mt-3">
        <h2 class="chart-title" id="chartTitle">生鲜商店 饱和度</h2>
    </div>

    <!-- 图表容器 -->
    <div class="container mt-3">
        <div class="chart-container">
            <div id="chart"></div>
        </div>
    </div>

    <!-- 页脚 -->
    <footer>
        <p>SC饱和度</p>
    </footer>

    <!-- 引入Bootstrap JS和依赖 -->
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>

    <script>
        const idToName = {
            '苹果': 3, '橘子': 4, '葡萄': 5, '牛排': 7, '香肠': 8, '鸡蛋': 9, '汽油': 11,
            '柴油': 12, '智能手机': 24, '平板电脑': 25, '笔记本电脑': 26, '显示器': 27, '电视机': 28,
            '经济电动车': 53, '豪华电动车': 54, '经济燃油车': 55, '豪华燃油车': 56, '卡车': 57,
            '内衣': 60, '手套': 61, '裙子': 62, '高跟鞋': 63, '手袋': 64, '运动鞋': 65,
            '圣诞脆饼': 67, '名牌手表': 70, '项链': 71, '无人机': 98, '砖块': 102, '水泥': 103,
            '木板': 108, '窗户': 109, '工具': 110, '咖啡粉': 119, '蔬菜': 120, '面包': 121,
            '芝士': 122, '苹果派': 123, '橙汁': 124, '苹果汁': 125, '姜汁汽水': 126, '披萨': 127,
            '面条': 128, '巧克力': 140, '圣诞装饰品': 144, '亚轨道火箭': 91, 'BFR': 94,
            '喷气客机': 95, '豪华飞机': 96, '单引擎飞机': 97, '人造卫星': 99
        };

        const idMappings = {
            freshStore: [3, 4, 5, 7, 8, 9, 67, 119, 122, 123, 124, 125, 126, 127, 140, 144],
            hardwareStore: [102, 103, 108, 109, 110],
            gasStation: [11, 12],
            fashionStore: [60, 61, 62, 63, 64, 65, 70, 71],
            electronicsStore: [24, 25, 26, 27, 28, 98],
            carDealership: [53, 54, 55, 56, 57],
            aerospace: [91, 94, 95, 96, 97, 99]
        };

        let labelState = 2;
        let currentChart = 'freshStore';
        let currentFilteredDates = [];
        let currentFilteredSeries = [];
        let chartsData = {};
        let currentDataSource = 'R1';

        // 获取数据并重新加载分类数据
        function fetchData(dataSource, chartKey = currentChart) {
            const url = \`https://raw.githubusercontent.com/gangbaRuby/simcompanies-saturation-record/main/data/\${dataSource}_saturation.json?timestamp=\${new Date().getTime()}\`;
            return fetch(url)
                .then(response => response.json())
                .then(data => {
                    const dates = Object.keys(data).sort((a, b) => new Date(a) - new Date(b));
                    Object.entries(idMappings).forEach(([key, ids]) => {
                        const seriesData = ids.map(id => ({
                            name: Object.keys(idToName).find(name => idToName[name] === id),
                            type: 'line',
                            data: dates.map(date => data[date][id] || 0),
                            label: {
                                position: 'top',
                                formatter: (value) => {
                                    if (labelState === 0) return '';
                                    if (labelState === 1) return value.data;
                                    return parseFloat(value.data).toFixed(2);
                                },
                                fontSize: 10,
                                show: labelState !== 0
                            }
                        }));
                        chartsData[key] = {
                            title: {
                                freshStore: '生鲜商店',
                                hardwareStore: '五金商店',
                                gasStation: '加油站',
                                fashionStore: '时装商店',
                                electronicsStore: '电子产品商店',
                                carDealership: '车行',
                                aerospace: '航天'
                            }[key] + ' 饱和度',
                            dates: dates,
                            seriesData: seriesData
                        };
                    });
                    showChart(chartKey); // 更新当前分类的数据
                });
        }

        const chartContainer = document.getElementById('chart');
        const chartInstance = echarts.init(chartContainer);
        fetchData(currentDataSource);

        // 切换数据源时，重新加载数据
        document.getElementById('dataSource').addEventListener('change', (e) => {
            currentDataSource = e.target.value;
            fetchData(currentDataSource);
        });

        // 切换分类时，显示当前数据源下的分类数据
        document.querySelectorAll('.btn-group .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.btn-group .btn').forEach(item => item.classList.remove('btn-primary'));
                document.querySelectorAll('.btn-group .btn').forEach(item => item.classList.add('btn-secondary'));
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-secondary');
                currentChart = btn.getAttribute('data-chart');
                showChart(currentChart);
            });
        });

        const toggleButton = document.querySelector('.toggle-label-button');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => {
                labelState = (labelState + 1) % 3;
                chartInstance.setOption({
                    series: currentFilteredSeries.map(series => ({
                        ...series,
                        label: {
                            ...series.label,
                            show: labelState !== 0
                        }
                    }))
                });
            });
        }

        document.getElementById('timeRange').addEventListener('change', () => {
            showChart(currentChart);
        });

        function showChart(chartKey) {
            const chartData = chartsData[chartKey];
            if (chartData) {
                const timeRange = document.getElementById('timeRange').value;
                if (timeRange === 'all') {
                    currentFilteredDates = chartData.dates;
                    currentFilteredSeries = chartData.seriesData;
                } else {
                    const range = parseInt(timeRange, 10);
                    const startIndex = Math.max(chartData.dates.length - range, 0);
                    currentFilteredDates = chartData.dates.slice(startIndex);
                    currentFilteredSeries = chartData.seriesData.map(series => ({
                        ...series,
                        data: series.data.slice(startIndex)
                    }));
                }
                const legendCount = currentFilteredSeries.length;
                const bottomPadding = Math.ceil(legendCount / 4) * 30; // 动态调整底部padding，每4个图例一行
                document.getElementById('chartTitle').innerText = chartData.title;
                chartInstance.clear();
                // 默认隐藏 ID 为 67 和 144 的图例
                const selectedLegend = {};
                currentFilteredSeries.forEach(series => {
                    const id = idToName[series.name];
                    selectedLegend[series.name] = ![67, 144].includes(id); // 设置为 false 隐藏
                });

                chartInstance.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '5%',
                        right: '5%',
                        top: '10%',
                        bottom: bottomPadding + 80, // 为滚动条和图例留出额外空间
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: currentFilteredDates,
                        axisLabel: {
                            fontSize: 10,
                            rotate: 0
                        }
                    },
                    yAxis: {
                        type: 'value',
                        minInterval: 0.01,
                        maxInterval: 0.5,
                        scale: true,
                        axisLabel: {
                            fontSize: 10
                        }
                    },
                    series: currentFilteredSeries,
                    legend: {
                        data: currentFilteredSeries.map(series => series.name),
                        selected: selectedLegend, // 设置图例的初始显示状态
                        type: 'plain',
                        bottom: 60, // 图例现在位于滚动条之上
                        textStyle: {
                            fontSize: 12
                        },
                        width: '100%',
                        orient: 'horizontal',
                        align: 'left',
                        itemGap: 10,
                        // 启用图例自动换行
                        formatter: function (name) {
                            return name;
                        }
                    },
                    dataZoom: [{
                        type: 'slider',
                        xAxisIndex: [0],
                        start: 0,
                        end: 100,
                        bottom: 20 // 滚动条在图例之下
                    }]
                });
            }
        }

        window.addEventListener('resize', () => {
            chartInstance.resize();
        });
    </script>
</body>

</html>
`;

serve((req) => {
    return new Response(htmlContent, {
        headers: { "content-type": "text/html" },
    });
});
