let canvas=document.getElementById('chartCanvas');
let context=canvas.getContext("2d");
var window_height=window.innerHeight;
var window_width=window.innerWidth;
canvas.style.background="#ff8";
const url_chart='https://stocks3.onrender.com/api/stocks/getstocksdata';


let st = "AAPL";
const list = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'PYPL', 'TSLA', 'JPM', 'NVDA', 'NFLX', 'DIS'];
const stockList = document.getElementsByClassName('stock-list');
const values = document.getElementById('values');
const appendingBtn = document.getElementById('appendingBtn');
const name1= document.getElementById('name');
const profit= document.getElementById('profit');
const bookValue= document.getElementById('bookValue');
const buttons= document.getElementById('buttons');
const url1 = 'https://stocks3.onrender.com/api/stocks/getstockstatsdata';
const onedaybtn = document.getElementById("btn1d");
const onemonbtn = document.getElementById("btn1mo");
const oneyrbtn = document.getElementById("btn1y");
const fiveyrbtn = document.getElementById("btn5y");

onedaybtn.addEventListener('click',()=>{
  fetchAndCreate("1mo",st);
})
onemonbtn.addEventListener('click',()=>{
  fetchAndCreate("3mo",st);
})
oneyrbtn.addEventListener('click',()=>{
  fetchAndCreate("1y",st);
})
fiveyrbtn.addEventListener('click',()=>{
  fetchAndCreate("5y",st);
})

// Function to add stock values
async function addValues(symbol) {
    try {
        const response = await fetch(url1, {
            headers: {
                Accept: "application/json",
            },
        });
        const result = await response.json();
        console.log(result);
        const stockData = result.stocksStatsData[0][symbol];
        if (stockData) {
            const pEle = document.createElement('p');
            pEle.textContent = `$${stockData.bookValue}   ${stockData.profit}`;
            pEle.classList.add('java-p-req');
            values.append(pEle);
        }
    } catch (error) {
        console.error('Error fetching stock stats data:', error);
    }
}
async function addValuesToSummary(symbol){
    try{
        const response = await fetch(url1, {
            headers: {
                Accept: "application/json",
            },
        });
        const result = await response.json();
        console.log(result);
        const stockData = result.stocksStatsData[0][symbol];
        profit.textContent=stockData.profit;
        bookValue.textContent=stockData.bookValue;
    }catch (error) {
        console.error('Error fetching stock stats data:', error);
    }
}

// Adding stock values for each symbol in the list
list.forEach((symbol) => {
    addValues(symbol);
});

// Create buttons for each stock symbol
list.forEach((currEle) => {
    const btn = document.createElement('button');
    btn.textContent = currEle;
    btn.classList.add("java-button-req");
    appendingBtn.appendChild(btn);
});

// Event listener for stock buttons
const getDetails = (e) => {
    if (e.target.tagName === 'BUTTON') {
        name1.textContent=e.target.innerHTML;
        fetchAndCreate('5y', e.target.innerHTML);
    }
};
appendingBtn.addEventListener('click', getDetails);
buttons.addEventListener('click',getDetailsTime);
const getDetailsTime=(e)=>{
    fetchAndCreate(e.target.innerHTML,symbol);
}

// Fetch and create chart data
async function fetchAndCreate(range = "5y", symbol = "AAPL") {
    const url = 'https://stocks3.onrender.com/api/stocks/getstocksdata';
    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
        });
        const result = await response.json();
        console.log(result);

        if (result.stocksData[0][symbol] && result.stocksData[0][symbol][range]) {
            let chartData = result.stocksData[0][symbol][range].value;
            let labels = result.stocksData[0][symbol][range].timeStamp;
            labels = labels.map((timestamp) => new Date(timestamp * 1000).toLocaleDateString());
            let dataLength=labels.length;

            // Call your chart drawing function here
            drawChart(labels, chartData,dataLength);
        }
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }

    await getStocks(symbol);
    await addValuesToSummary(symbol);
}
function drawChart(labels, chartData, dataLength) {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
    const distance = canvas.width / (dataLength - 1); // Calculate horizontal spacing
    const maxValue = Math.max(...chartData);
    const minValue = Math.min(...chartData);
    const yScale = canvas.height / (maxValue - minValue);
  
    context.beginPath();
    context.moveTo(0, canvas.height - (chartData[0] - minValue) * yScale);
  
    chartData.forEach((value, index) => {
      const x = index * distance;
      const y = canvas.height - (value - minValue) * yScale;
      context.lineTo(x, y);
    });
  
    context.stroke();
  }
// function drawChart(labels,chartData,dataLength){
//     const start_point=labels[0];
//     const distance=canvas.width/dataLength;
//     context.beginPath();
//     const start_value=chartData[0];
//     context.moveTo(start_point,start_value);
//     chartData.forEach((element,index)=>{
//         const new_distance=start_point+distance*(index+1);
//         context.lineTo(new_distance,element)
//     });
//     // context.strokeStyle="#fff";
//     context.stroke();
// }

// Fetch stock summary
async function getStocks(symbol) {
    name1.textContent=symbol;
    st=symbol;
    try {
        const response = await fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata', {
            headers: {
                Accept: "application/json",
            }
        });
        const summ = await response.json();
        console.log(summ);

        const para = document.querySelector('#para');

        if (summ.stocksProfileData[0][symbol]) {
            para.textContent = summ.stocksProfileData[0][symbol].summary;
        } else {
            para.textContent = "Summary not available.";
        }
    } catch (error) {
        console.error('Error fetching stock profile data:', error);
    }
}

// Initial fetch for default stock
fetchAndCreate('5y',"AAPL");
// getStocks("AAPL");

