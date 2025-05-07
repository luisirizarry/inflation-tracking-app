import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LabelList, ResponsiveContainer
} from 'recharts';

function InflationBarChart({ data, title }) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="inflation-bar-chart">
      <h3>{title || 'Category Comparison'}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis axisLine={false} tick={false} />
          <YAxis
            label={{
              value: "Inflation Index",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            formatter={(value) => [`${parseFloat(value).toFixed(2)}`]}
            labelFormatter={(label) => label}
          />
          <Legend />
          <Bar
            dataKey="value"
            name="Inflation Value"
            isAnimationActive
            animationDuration={1000}
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={payload.color}
                />
              );
            }}
          >
            <LabelList
              dataKey="name"
              position="bottom"
              offset={10}
              angle={-45}
              style={{ fontSize: 12, textAnchor: 'end' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InflationBarChart;