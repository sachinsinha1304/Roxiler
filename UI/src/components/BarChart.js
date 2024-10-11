// BarChart.js
import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

const BarChart = ({bar_data, month}) => {
  // Sample data for the Bar Chart
  console.log(bar_data)
  const data = [
    { x: '0 - 100', y: 0 },
    { x: '101 - 200', y: 0 },
    { x: '201 - 300', y: 0 },
    { x: '301 - 400', y: 0 },
    { x: '401 - 500', y: 0 },
    { x: '501 - 600', y: 0 },
    { x: '601 - 700', y: 0 },
    { x: '701 - 800', y: 0 },
    { x: '801 - 900', y: 0 },
    { x: '901 - above', y: 0}
  ];

  for (let i=0 ; i<data.length ; i++){
    for (let j=0 ; j<bar_data.length ; j++){
        if (data[i]['x'] === bar_data[j]['price_range']){
            data[i]['y'] = bar_data[j]['count']
        }
    }
  }

  return (
    <div>
        <div className='chart-container-margin'>
            <h2>Bar Chart - {month}</h2>
        </div>
        <div className='chart-container-chart'>
        <VictoryChart
            theme={VictoryTheme.material} // Optional: apply a theme
            domainPadding={20} // Adds padding to the domain
        >
            <VictoryAxis // X-axis
            //   label="Pets"
            style={{
                axisLabel: {
                    padding: 30,
                    fontSize: 6,
                    fontFamily: 'Arial, sans-serif', // Change font family for axis label
                  },
                tickLabels: {
                fontSize: 6,
                angle: 45, // Rotate tick labels by 45 degrees
                textAnchor: 'start', // Align text to start
                verticalAnchor: 'middle', // Center text vertically
                },
            }}
            />
            <VictoryAxis // Y-axis
            dependentAxis
            style={{
                axisLabel: { padding: 40, fontSize:10 }, // Style for axis label
                tickLabels: {
                    padding: 15,
                    fontSize: 9,
                    textAnchor: 'start', // Align text to start
                    verticalAnchor: 'middle', // Center text vertically
                },
            }}
            />
            <VictoryBar // Create the bar chart
            data={data}
            style={{
                data: {
                fill: '#4caf50', // Color of the bars
                width: 20, // Width of the bars
                },
                labels: {
                fontSize: 8, // Size of the labels
                },
            }}
            labels={({ datum }) => `${datum.y}`} // Customize labels to show count
            />
        </VictoryChart>
        </div>
      
      
    </div>
  );
};

export default BarChart;
