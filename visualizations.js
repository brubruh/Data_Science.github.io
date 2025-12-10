// ========================================
// D3.js Visualizations
// ========================================

// Chart dimensions and margins
const margin = { top: 40, right: 60, bottom: 60, left: 80 };

// Get container dimensions
function getChartDimensions() {
    const container = document.getElementById('chart-container');
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;
    return { width, height };
}

// Clear the chart container
function clearChart() {
    d3.select('#chart-container').html('');
}

// Create SVG element
function createSVG() {
    const { width, height } = getChartDimensions();
    
    const svg = d3.select('#chart-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    return { svg, width, height };
}

// ========================================
// Visualization Functions
// ========================================

function showIntroVisualization() {
    clearChart();
    
    const container = d3.select('#chart-container');
    
    container.append('div')
        .attr('class', 'intro-visual')
        .style('text-align', 'center')
        .style('padding', '3rem')
        .html(`
            <div style="font-size: 6rem; margin-bottom: 2rem;">🏙️</div>
            <h2 style="font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem;">NYC Noise & Rent Analysis</h2>
            <p style="font-size: 1.3rem; color: #666;">Exploring the relationship between quality of life and cost of living</p>
        `);
}

function showDataOverview() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    // Create a simple data overview visualization
    const datasets = [
        { name: '311 Noise\nComplaints', records: 7700000, icon: '📢', color: '#e94560' },
        { name: 'Rental\nPrices', records: 15000, icon: '🏠', color: '#0f3460' }
    ];
    
    const boxWidth = width / 3;
    const boxHeight = height / 2;
    
    const datasetGroups = svg.selectAll('.dataset')
        .data(datasets)
        .enter()
        .append('g')
        .attr('class', 'dataset')
        .attr('transform', (d, i) => `translate(${width / 4 + i * width / 2},${height / 3})`);
    
    // Background boxes
    datasetGroups.append('rect')
        .attr('x', -boxWidth / 2)
        .attr('y', -boxHeight / 2)
        .attr('width', boxWidth)
        .attr('height', boxHeight)
        .attr('rx', 15)
        .attr('fill', d => d.color)
        .attr('opacity', 0.1)
        .attr('stroke', d => d.color)
        .attr('stroke-width', 3);
    
    // Icons
    datasetGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -40)
        .style('font-size', '4rem')
        .text(d => d.icon);
    
    // Dataset names
    datasetGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 30)
        .style('font-size', '1.3rem')
        .style('font-weight', '700')
        .style('fill', d => d.color)
        .selectAll('tspan')
        .data(d => d.name.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', (d, i) => i * 25)
        .text(d => d);
    
    // Record counts
    datasetGroups.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 90)
        .style('font-size', '1.8rem')
        .style('font-weight', '900')
        .style('fill', '#333')
        .text(d => d.records.toLocaleString() + ' records');
}

function showBoroughDistribution() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    const data = getSampleData().boroughs;
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5rem')
        .style('font-weight', '700')
        .style('fill', '#1a1a2e')
        .text('Noise Complaints by Borough');
    
    // Create scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.complaints)])
        .nice()
        .range([height, 0]);
    
    // Add bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .attr('rx', 5)
        .transition()
        .duration(1000)
        .attr('y', d => y(d.complaints))
        .attr('height', d => height - y(d.complaints));
    
    // Add value labels
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', d => y(d.complaints) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '0.9rem')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(d => (d.complaints / 1000000).toFixed(1) + 'M')
        .transition()
        .delay(1000)
        .duration(500)
        .style('opacity', 1);
    
    // Add axes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', '0.9rem')
        .style('font-weight', '600');
    
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).tickFormat(d => (d / 1000000) + 'M'))
        .selectAll('text')
        .style('font-size', '0.9rem');
    
    // Y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '600')
        .text('Number of Complaints');
}

function showComplaintTypes() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    const data = getSampleData().complaintTypes.slice(0, 7);
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5rem')
        .style('font-weight', '700')
        .style('fill', '#1a1a2e')
        .text('Most Common Complaint Types');
    
    // Create horizontal bar chart
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([0, width]);
    
    const y = d3.scaleBand()
        .domain(data.map(d => d.type))
        .range([0, height])
        .padding(0.2);
    
    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.type))
        .range(['#e94560', '#0f3460', '#16213e', '#1a1a2e', '#533483', '#c44569', '#774c60']);
    
    // Add bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => y(d.type))
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .attr('fill', d => colorScale(d.type))
        .attr('rx', 5)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 100)
        .attr('width', d => x(d.count));
    
    // Add value labels
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.count) + 10)
        .attr('y', d => y(d.type) + y.bandwidth() / 2 + 5)
        .style('font-size', '0.9rem')
        .style('font-weight', '600')
        .style('opacity', 0)
        .text(d => (d.count / 1000000).toFixed(1) + 'M')
        .transition()
        .delay(1000)
        .duration(500)
        .style('opacity', 1);
    
    // Add Y axis (complaint types)
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', '0.9rem')
        .style('font-weight', '600');
}

function showTimeTrends() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    const data = getSampleData().timeData;
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5rem')
        .style('font-weight', '700')
        .style('fill', '#1a1a2e')
        .text('Noise Complaints Over Time');
    
    // Create scales
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.complaints)])
        .nice()
        .range([height, 0]);
    
    // Create line generator
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.complaints))
        .curve(d3.curveMonotoneX);
    
    // Add area under the line
    const area = d3.area()
        .x(d => x(d.date))
        .y0(height)
        .y1(d => y(d.complaints))
        .curve(d3.curveMonotoneX);
    
    svg.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('fill', '#e94560')
        .attr('fill-opacity', 0.2)
        .attr('d', area);
    
    // Add the line
    const path = svg.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', '#e94560')
        .attr('stroke-width', 3)
        .attr('d', line);
    
    // Animate the line
    const pathLength = path.node().getTotalLength();
    path.attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
    
    // Add axes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(8))
        .selectAll('text')
        .style('font-size', '0.8rem')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');
    
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).tickFormat(d => (d / 1000).toFixed(0) + 'K'))
        .selectAll('text')
        .style('font-size', '0.9rem');
    
    // Add COVID-19 annotation
    const covidDate = new Date(2020, 2); // March 2020
    svg.append('line')
        .attr('x1', x(covidDate))
        .attr('x2', x(covidDate))
        .attr('y1', 0)
        .attr('y2', height)
        .attr('stroke', '#666')
        .attr('stroke-dasharray', '5,5')
        .attr('stroke-width', 2)
        .attr('opacity', 0.5);
    
    svg.append('text')
        .attr('x', x(covidDate) + 10)
        .attr('y', 20)
        .style('font-size', '0.8rem')
        .style('font-style', 'italic')
        .style('fill', '#666')
        .text('COVID-19 Lockdown');
    
    // Axis labels
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '600')
        .text('Monthly Complaints');
}

function showRentOverview() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    const data = getSampleData().boroughs;
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5rem')
        .style('font-weight', '700')
        .style('fill', '#1a1a2e')
        .text('Average Rent by Borough');
    
    // Create scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.avgRent) * 1.1])
        .nice()
        .range([height, 0]);
    
    // Add bars
    svg.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .attr('rx', 5)
        .transition()
        .duration(1000)
        .attr('y', d => y(d.avgRent))
        .attr('height', d => height - y(d.avgRent));
    
    // Add value labels
    svg.selectAll('.label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', d => y(d.avgRent) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '700')
        .style('opacity', 0)
        .text(d => '$' + d.avgRent.toLocaleString())
        .transition()
        .delay(1000)
        .duration(500)
        .style('opacity', 1);
    
    // Add axes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .style('font-size', '0.9rem')
        .style('font-weight', '600');
    
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).tickFormat(d => '$' + d.toLocaleString()))
        .selectAll('text')
        .style('font-size', '0.9rem');
    
    // Y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '600')
        .text('Average Monthly Rent');
}

function showCorrelation() {
    clearChart();
    
    const container = d3.select('#chart-container');
    
    container.append('div')
        .style('text-align', 'center')
        .style('padding', '3rem')
        .html(`
            <div style="font-size: 5rem; margin-bottom: 2rem;">📊</div>
            <h2 style="font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem;">Correlation Analysis</h2>
            <p style="font-size: 1.3rem; color: #666; margin-bottom: 2rem;">Testing the hypothesis:</p>
            <p style="font-size: 1.8rem; font-weight: 700; color: #e94560;">More Noise = Lower Rent?</p>
        `);
}

function showScatterPlot() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    const data = getSampleData().scatterData;
    const results = getSampleData().regressionResults;
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5rem')
        .style('font-weight', '700')
        .style('fill', '#1a1a2e')
        .text('Noise Complaints vs Rent Prices');
    
    // Create scales
    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.complaints)])
        .nice()
        .range([0, width]);
    
    const y = d3.scaleLinear()
        .domain([d3.min(data, d => d.rent) * 0.9, d3.max(data, d => d.rent) * 1.1])
        .nice()
        .range([height, 0]);
    
    // Add grid
    svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.2)
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));
    
    svg.append('g')
        .attr('class', 'grid')
        .attr('opacity', 0.2)
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height).tickFormat(''));
    
    // Add regression line
    const x1 = 0;
    const x2 = d3.max(data, d => d.complaints);
    const y1 = results.intercept + results.slope * x1;
    const y2 = results.intercept + results.slope * x2;
    
    svg.append('line')
        .attr('class', 'regression-line')
        .attr('x1', x(x1))
        .attr('y1', y(y1))
        .attr('x2', x(x2))
        .attr('y2', y(y2))
        .attr('stroke', '#e94560')
        .attr('stroke-width', 3)
        .attr('opacity', 0.6);
    
    // Create tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Add scatter dots
    svg.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.complaints))
        .attr('cy', d => y(d.rent))
        .attr('r', 0)
        .attr('fill', d => d.color)
        .attr('opacity', 0.7)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('r', 8)
                .attr('stroke-width', 3);
            
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`
                <strong>${d.borough}</strong><br/>
                Complaints: ${d.complaints.toLocaleString()}<br/>
                Rent: $${d.rent.toLocaleString()}
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
            d3.select(this)
                .attr('r', 5)
                .attr('stroke-width', 1.5);
            
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);
        })
        .transition()
        .duration(800)
        .delay((d, i) => i * 10)
        .attr('r', 5);
    
    // Add axes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d => (d / 1000).toFixed(0) + 'K'))
        .selectAll('text')
        .style('font-size', '0.9rem');
    
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).tickFormat(d => '$' + d.toLocaleString()))
        .selectAll('text')
        .style('font-size', '0.9rem');
    
    // Axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 45)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '600')
        .text('Total Noise Complaints');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '600')
        .text('Median Rent ($)');
    
    // Add legend
    const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
    const colors = { 
        'Manhattan': '#e94560', 
        'Brooklyn': '#0f3460', 
        'Queens': '#16213e', 
        'Bronx': '#1a1a2e',
        'Staten Island': '#533483'
    };
    
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 120}, 10)`);
    
    boroughs.forEach((borough, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);
        
        legendRow.append('circle')
            .attr('r', 6)
            .attr('fill', colors[borough])
            .attr('opacity', 0.7);
        
        legendRow.append('text')
            .attr('x', 15)
            .attr('y', 5)
            .style('font-size', '0.8rem')
            .text(borough);
    });
}

function showRegressionResults() {
    showScatterPlot(); // Same visualization but will be paired with regression stats in the text
}

function showBoroughBreakdown() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    const data = getSampleData().boroughs;
    
    // Create a grouped bar chart
    const categories = ['Complaints', 'Rent'];
    const x0 = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([0, width])
        .padding(0.2);
    
    const x1 = d3.scaleBand()
        .domain(categories)
        .range([0, x0.bandwidth()])
        .padding(0.05);
    
    // Normalize data for comparison
    const maxComplaints = d3.max(data, d => d.complaints);
    const maxRent = d3.max(data, d => d.avgRent);
    
    const y = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5rem')
        .style('font-weight', '700')
        .style('fill', '#1a1a2e')
        .text('Complaints vs Rent by Borough (Normalized)');
    
    // Create groups for each borough
    const boroughGroups = svg.selectAll('.borough-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'borough-group')
        .attr('transform', d => `translate(${x0(d.name)},0)`);
    
    // Add bars for complaints
    boroughGroups.append('rect')
        .attr('x', x1('Complaints'))
        .attr('width', x1.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', '#e94560')
        .attr('opacity', 0.8)
        .transition()
        .duration(1000)
        .attr('y', d => y((d.complaints / maxComplaints) * 100))
        .attr('height', d => height - y((d.complaints / maxComplaints) * 100));
    
    // Add bars for rent
    boroughGroups.append('rect')
        .attr('x', x1('Rent'))
        .attr('width', x1.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', '#0f3460')
        .attr('opacity', 0.8)
        .transition()
        .duration(1000)
        .delay(200)
        .attr('y', d => y((d.avgRent / maxRent) * 100))
        .attr('height', d => height - y((d.avgRent / maxRent) * 100));
    
    // Add axes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x0))
        .selectAll('text')
        .style('font-size', '0.9rem')
        .style('font-weight', '600');
    
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y).tickFormat(d => d + '%'))
        .selectAll('text')
        .style('font-size', '0.9rem');
    
    // Add legend
    const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 150}, 10)`);
    
    const legendData = [
        { label: 'Noise Complaints', color: '#e94560' },
        { label: 'Average Rent', color: '#0f3460' }
    ];
    
    legendData.forEach((item, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);
        
        legendRow.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', item.color)
            .attr('opacity', 0.8);
        
        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '0.9rem')
            .text(item.label);
    });
}

function showModelPerformance() {
    clearChart();
    const { svg, width, height } = createSVG();
    
    const models = [
        { name: 'OLS', r2: 0.6234, rmse: 450, mae: 380, color: '#e94560' },
        { name: 'Ridge', r2: 0.6289, rmse: 445, mae: 375, color: '#0f3460' },
        { name: 'Lasso', r2: 0.6198, rmse: 455, mae: 385, color: '#16213e' },
        { name: 'Elastic Net', r2: 0.6256, rmse: 448, mae: 378, color: '#1a1a2e' }
    ];
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '1.5rem')
        .style('font-weight', '700')
        .style('fill', '#1a1a2e')
        .text('Model Performance Comparison');
    
    // Create scales
    const x = d3.scaleBand()
        .domain(models.map(d => d.name))
        .range([0, width])
        .padding(0.3);
    
    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Add R² bars
    svg.selectAll('.r2-bar')
        .data(models)
        .enter()
        .append('rect')
        .attr('class', 'r2-bar')
        .attr('x', d => x(d.name))
        .attr('width', x.bandwidth())
        .attr('y', height)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .attr('rx', 5)
        .transition()
        .duration(1000)
        .attr('y', d => y(d.r2))
        .attr('height', d => height - y(d.r2));
    
    // Add R² value labels
    svg.selectAll('.r2-label')
        .data(models)
        .enter()
        .append('text')
        .attr('class', 'r2-label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', d => y(d.r2) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '700')
        .style('opacity', 0)
        .text(d => d.r2.toFixed(4))
        .transition()
        .delay(1000)
        .duration(500)
        .style('opacity', 1);
    
    // Add model name labels
    svg.selectAll('.model-label')
        .data(models)
        .enter()
        .append('text')
        .attr('class', 'model-label')
        .attr('x', d => x(d.name) + x.bandwidth() / 2)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '700')
        .text(d => d.name);
    
    // Add axes
    svg.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(y))
        .selectAll('text')
        .style('font-size', '0.9rem');
    
    // Y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '1rem')
        .style('font-weight', '600')
        .text('R² Score');
    
    // Add RMSE and MAE info boxes
    const infoBox = svg.append('g')
        .attr('transform', `translate(${width - 180}, ${height - 120})`);
    
    infoBox.append('rect')
        .attr('width', 170)
        .attr('height', 100)
        .attr('fill', '#f8f9fa')
        .attr('stroke', '#ccc')
        .attr('rx', 8);
    
    infoBox.append('text')
        .attr('x', 10)
        .attr('y', 20)
        .style('font-size', '0.9rem')
        .style('font-weight', '700')
        .text('Best Model: Ridge');
    
    infoBox.append('text')
        .attr('x', 10)
        .attr('y', 45)
        .style('font-size', '0.85rem')
        .text('RMSE: $445');
    
    infoBox.append('text')
        .attr('x', 10)
        .attr('y', 65)
        .style('font-size', '0.85rem')
        .text('MAE: $375');
    
    infoBox.append('text')
        .attr('x', 10)
        .attr('y', 85)
        .style('font-size', '0.85rem')
        .text('R²: 0.6289');
}

function showKeyInsights() {
    clearChart();
    
    const container = d3.select('#chart-container');
    
    container.append('div')
        .style('text-align', 'center')
        .style('padding', '3rem')
        .html(`
            <div style="font-size: 5rem; margin-bottom: 2rem;">💡</div>
            <h2 style="font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem;">Key Insights</h2>
            <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(15, 52, 96, 0.1)); border-radius: 10px; text-align: left;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📉</div>
                    <p style="font-size: 1.1rem; color: #333; font-weight: 600;">Negative correlation confirmed between noise complaints and rent prices</p>
                </div>
                <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(15, 52, 96, 0.1), rgba(233, 69, 96, 0.1)); border-radius: 10px; text-align: left;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">🏙️</div>
                    <p style="font-size: 1.1rem; color: #333; font-weight: 600;">Manhattan defies the trend due to prestige and location factors</p>
                </div>
                <div style="padding: 1.5rem; background: linear-gradient(135deg, rgba(233, 69, 96, 0.1), rgba(15, 52, 96, 0.1)); border-radius: 10px; text-align: left;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                    <p style="font-size: 1.1rem; color: #333; font-weight: 600;">Strongest relationship observed in Brooklyn and Queens neighborhoods</p>
                </div>
            </div>
        `);
}

function showLimitations() {
    clearChart();
    
    const container = d3.select('#chart-container');
    
    container.append('div')
        .style('text-align', 'center')
        .style('padding', '3rem')
        .html(`
            <div style="font-size: 5rem; margin-bottom: 2rem;">⚠️</div>
            <h2 style="font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem;">Study Limitations</h2>
            <p style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">
                Important considerations when interpreting these results
            </p>
        `);
}

function showConclusion() {
    clearChart();
    
    const container = d3.select('#chart-container');
    
    container.append('div')
        .style('text-align', 'center')
        .style('padding', '3rem')
        .html(`
            <div style="font-size: 6rem; margin-bottom: 2rem;">✅</div>
            <h2 style="font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem;">Conclusion</h2>
            <p style="font-size: 1.5rem; color: #e94560; font-weight: 700; max-width: 600px; margin: 1rem auto;">
                Peace and Quiet Have a Price Tag in NYC
            </p>
            <p style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 1rem auto;">
                Statistical evidence supports the relationship between noise levels and rental prices
            </p>
        `);
}

function showMethodology() {
    clearChart();
    
    const container = d3.select('#chart-container');
    
    container.append('div')
        .style('text-align', 'center')
        .style('padding', '3rem')
        .html(`
            <div style="font-size: 5rem; margin-bottom: 2rem;">🔬</div>
            <h2 style="font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem;">Methodology</h2>
            <p style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">
                Rigorous data science approach combining statistical analysis and machine learning
            </p>
        `);
}

function showCredits() {
    clearChart();
    
    const container = d3.select('#chart-container');
    
    container.append('div')
        .style('text-align', 'center')
        .style('padding', '3rem')
        .html(`
            <div style="font-size: 5rem; margin-bottom: 2rem;">👥</div>
            <h2 style="font-size: 2.5rem; color: #1a1a2e; margin-bottom: 1rem;">About This Project</h2>
            <p style="font-size: 1.2rem; color: #666; max-width: 600px; margin: 0 auto;">
                A data-driven exploration of NYC's noise and housing landscape
            </p>
        `);
}