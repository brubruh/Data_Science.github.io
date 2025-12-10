// ========================================
// Main Scrollytelling Script
// ========================================

// Initialize Scrollama
const scroller = scrollama();

// Current step state
let currentStep = 'intro';

// Initialize the scrollytelling
function init() {
    setupScrollama();
    updateVisualization('intro');
}

// Setup Scrollama
function setupScrollama() {
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            debug: false,
        })
        .onStepEnter(handleStepEnter)
        .onStepExit(handleStepExit);

    // Setup resize listener
    window.addEventListener('resize', scroller.resize);
}

// Handle step enter
function handleStepEnter(response) {
    const { element, index, direction } = response;
    
    // Remove active class from all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Add active class to current step
    element.classList.add('active');
    
    // Get the step identifier
    const stepId = element.getAttribute('data-step');
    currentStep = stepId;
    
    // Update visualization based on step
    updateVisualization(stepId);
}

// Handle step exit
function handleStepExit(response) {
    // Can add additional logic here if needed
}

// Update visualization based on current step
function updateVisualization(stepId) {
    console.log('Updating visualization for step:', stepId);
    
    switch(stepId) {
        case 'intro':
            showIntroVisualization();
            break;
        case 'data-overview':
            showDataOverview();
            break;
        case 'borough-distribution':
            showBoroughDistribution();
            break;
        case 'complaint-types':
            showComplaintTypes();
            break;
        case 'time-trends':
            showTimeTrends();
            break;
        case 'rent-overview':
            showRentOverview();
            break;
        case 'correlation':
            showCorrelation();
            break;
        case 'scatter':
            showScatterPlot();
            break;
        case 'regression':
            showRegressionResults();
            break;
        case 'borough-breakdown':
            showBoroughBreakdown();
            break;
        case 'model-performance':
            showModelPerformance();
            break;
        case 'insights':
            showKeyInsights();
            break;
        case 'limitations':
            showLimitations();
            break;
        case 'conclusion':
            showConclusion();
            break;
        case 'methodology':
            showMethodology();
            break;
        case 'credits':
            showCredits();
            break;
        default:
            showIntroVisualization();
    }
}

// Load actual data from your analysis
async function loadData() {
    try {
        // Try to load your actual data files
        // You'll need to generate JSON files from your Python analysis
        const noiseData = await d3.csv('data/noise_summary.csv');
        const rentData = await d3.csv('data/rent_summary.csv');
        const regressionData = await d3.csv('data/regression_results.csv');
        
        return {
            noise: noiseData,
            rent: rentData,
            regression: regressionData
        };
    } catch (error) {
        console.log('Using sample data:', error);
        return getSampleData();
    }
}

// Sample data (replace with your actual data)
function getSampleData() {
    return {
        boroughs: [
            { name: 'Manhattan', complaints: 2500000, avgRent: 3800, color: '#e94560' },
            { name: 'Brooklyn', complaints: 2000000, avgRent: 2900, color: '#0f3460' },
            { name: 'Queens', complaints: 1800000, avgRent: 2400, color: '#16213e' },
            { name: 'Bronx', complaints: 900000, avgRent: 2100, color: '#1a1a2e' },
            { name: 'Staten Island', complaints: 300000, avgRent: 2000, color: '#533483' }
        ],
        complaintTypes: [
            { type: 'Loud Music/Party', count: 2800000 },
            { type: 'Banging/Pounding', count: 1500000 },
            { type: 'Loud Talking', count: 1200000 },
            { type: 'Barking Dog', count: 800000 },
            { type: 'Construction', count: 600000 },
            { type: 'Vehicle', count: 500000 },
            { type: 'Other', count: 300000 }
        ],
        timeData: generateTimeSeriesData(),
        scatterData: generateScatterData(),
        regressionResults: {
            r2: 0.6234,
            correlation: -0.7896,
            pValue: 0.0001,
            slope: -0.45,
            intercept: 3200,
            rmse: 450,
            mae: 380
        }
    };
}

function generateTimeSeriesData() {
    const data = [];
    const startYear = 2010;
    const endYear = 2024;
    
    for (let year = startYear; year <= endYear; year++) {
        for (let month = 1; month <= 12; month++) {
            const date = new Date(year, month - 1);
            const baseComplaints = 45000;
            const trend = (year - startYear) * 1000;
            const seasonal = Math.sin(month * Math.PI / 6) * 5000;
            const covid = (year === 2020 && month >= 3) ? 15000 : 0;
            const noise = (Math.random() - 0.5) * 3000;
            
            data.push({
                date: date,
                complaints: Math.max(0, baseComplaints + trend + seasonal + covid + noise)
            });
        }
    }
    
    return data;
}

function generateScatterData() {
    const data = [];
    const boroughs = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'];
    const colors = { 
        'Manhattan': '#e94560', 
        'Brooklyn': '#0f3460', 
        'Queens': '#16213e', 
        'Bronx': '#1a1a2e',
        'Staten Island': '#533483'
    };
    
    for (let i = 0; i < 100; i++) {
        const borough = boroughs[Math.floor(Math.random() * boroughs.length)];
        const baseRent = borough === 'Manhattan' ? 3800 : 
                        borough === 'Brooklyn' ? 2900 :
                        borough === 'Queens' ? 2400 :
                        borough === 'Bronx' ? 2100 : 2000;
        
        const complaints = Math.random() * 50000;
        const noise = (Math.random() - 0.5) * 400;
        const rent = Math.max(1500, baseRent - (complaints * 0.01) + noise);
        
        data.push({
            complaints: Math.round(complaints),
            rent: Math.round(rent),
            borough: borough,
            color: colors[borough]
        });
    }
    
    return data;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    init();
    
    // Add smooth scroll for hero scroll indicator
    document.querySelector('.scroll-indicator').addEventListener('click', () => {
        document.querySelector('#scrolly').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Update dynamic values
    loadData().then(data => {
        // Update hero statistics if needed
        updateHeroStats(data);
        
        // Update regression values
        if (data.regressionResults) {
            const corrEl = document.getElementById('correlation-value');
            const r2El = document.getElementById('r2-value');
            const pEl = document.getElementById('p-value');
            
            if (corrEl) corrEl.textContent = data.regressionResults.correlation.toFixed(4);
            if (r2El) r2El.textContent = data.regressionResults.r2.toFixed(4);
            if (pEl) pEl.textContent = data.regressionResults.pValue < 0.001 ? '< 0.001' : data.regressionResults.pValue.toFixed(4);
        }
    });
});

function updateHeroStats(data) {
    // You can update hero statistics here if you have dynamic data
    console.log('Hero stats updated');
}

// Handle window resize
window.addEventListener('resize', () => {
    scroller.resize();
    // Redraw current visualization
    updateVisualization(currentStep);
});