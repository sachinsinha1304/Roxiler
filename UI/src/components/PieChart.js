import React from 'react';
import { VictoryPie } from 'victory';

const PieChart = ({pie_data, month}) => {
    const data = [];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#5FCE56','#5DCE56', '#AFCE56', '#9FCE56','#51CE56'];

    for (let ele of pie_data){
        let temp = {x:ele['category'], y:ele['count(*)']}
        data.push(temp)
    }
    const total = data.reduce((acc, curr) => acc + curr.y, 0);
    const formattedData = data.map(d => ({
        ...d,
        percentage: ((d.y / total) * 100).toFixed(1), // Calculate percentage
      }));

    return (
        <>
            <div className='chart-container-margin'>
                <h1>Pie Chart - {month} </h1>
            </div>
            <div className='chart-container-chart'>
                <VictoryPie 
                data={formattedData}
                style={{
                    data: {
                    fill: ({ datum }) => colors[formattedData.findIndex(d => d.x === datum.x)] // Assign color based on index
                    },
                    
                    labels: { fill: 'black',fontSize:8 }, // Customize label color if needed
                    fontSize: 7,
                }}
                labelRadius={80}
                labels={({ datum }) => `${datum.x}\n ${datum.percentage}%`}
                />
             </div>
        </>
    );
};

export default PieChart;
