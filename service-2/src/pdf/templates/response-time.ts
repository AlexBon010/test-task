export const responseTimeTemplate = (avg: number, max: number, min: number, labels: string[], values: number[]) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Response Time Report</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { font-size: 20px; }
        canvas { margin-top: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f4f4f4; }
    </style>
</head>
<body>
    <h1>Response Time Analysis</h1>
    <p>Endpoint: <strong>GET:/api/files/getDataInFile</strong></p>
    <canvas id="chart" width="800" height="400"></canvas>

    <table>
        <thead>
            <tr><th>Metric</th><th>Value (ms)</th></tr>
        </thead>
        <tbody>
            <tr><td>Average Response Time</td><td>${avg}</td></tr>
            <tr><td>Maximum Response Time</td><td>${max}</td></tr>
            <tr><td>Minimum Response Time</td><td>${min}</td></tr>
        </tbody>
    </table>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ${JSON.stringify(labels)},
                datasets: [{
                    label: 'Response Time (ms)',
                    data: ${JSON.stringify(values)},
                    borderColor: '#0066cc',
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Response Time (ms)' } }
                }
            }
        });
    </script>
</body>
</html>
        `
}
