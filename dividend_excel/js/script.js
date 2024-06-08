async function make_sheet(preset){
    var tickerList

    if(preset=='SPY'){
        tickerList = 'SPY'
    }

    else if(preset=='Russell1000'){
        tickerList = 'Russell1000'
    }
    
    else{
        tickerInput = document.getElementById('tickerInput').value

        if(tickerInput.includes(',')){
            tickerList = tickerInput.split(',')

            for(var i = 0; i<tickerList.length;i++){
                tickerList[i] = tickerList[i].replace(/\s/g, '');
            }
        }

        else{
            tickerList = tickerInput.split('\n')
            
            for(var i = 0; i<tickerList.length;i++){
                tickerList[i] = tickerList[i].replace(/\s/g, '');

                if(tickerList[i] == ''){
                    tickerList.splice(i, 1)
                }
            }
        }
    }


    if(tickerList !== 'SPY' && tickerList !== 'Russell1000'){
        var tickers = ''
        for(var ticker = 0; ticker < tickerList.length; ticker++){

            if(ticker == tickerList.length-1){
                var tickerItem = tickerList[ticker]
                tickers += tickerItem
            }

            else{
                var tickerItem = tickerList[ticker]
                tickers += tickerItem + ','
            }
            
        }
    }

    else{
        tickers = tickerList
    }

    var estimatedWaitTime = calculateEstimatedWaitTime(tickerList)

    setLoadingAnimation(estimatedWaitTime)

    console.log(tickers)

    var startTime = new Date()
    startTime = startTime.getTime()

    var response = await APIcall(tickers)
    console.log(response)

    var endTime = new Date()
    endTime = endTime.getTime()
    console.log(startTime)
    console.log(endTime)
    console.log('Difference in time = ')
    console.log((endTime - startTime) / 1000)


    setSuccessAnimation()


}




function setLoadingAnimation(estimatedWaitTime){
    const output = document.getElementById('outputText')
    output.classList.add('loading-circle')

    const waitTime = document.getElementById('estimatedWaitTime')
    waitTime.style.display = 'block'
    waitTime.innerHTML = 'Estimated Wait Time = ' + estimatedWaitTime

    const loading = document.getElementById('loadingTitle')
    loading.style.display = 'block'
}

function setSuccessAnimation(){
    const output = document.getElementById('outputText')
    output.classList.remove('loading-circle')

    const waitTime = document.getElementById('estimatedWaitTime')
    waitTime.style.display = 'none'

    const loading = document.getElementById('loadingTitle')
    loading.style.display = 'none'

    output.innerHTML = '✅ <br> Check your downloads above!'
}

function clearInput(){
    const input = document.getElementById('tickerInput')
    input.value = ""

    const emailInput = document.getElementById('emailInput')
    emailInput.value = ""

    clearOutputBox()
}

function clearOutputBox(){
    const output = document.getElementById('outputText')
    output.classList.remove('loading-circle')

    const waitTime = document.getElementById('estimatedWaitTime')
    waitTime.style.display = 'none'

    const loading = document.getElementById('loadingTitle')
    loading.style.display = 'none'

    output.innerHTML = ''

}

function calculateEstimatedWaitTime(tickerList){

    if(tickerList == 'SPY'){
        var length = 500
    }

    else if(tickerList == 'Russell1000'){
        var length = 1000
    }

    else{
        var length = tickerList.length
    }

    var waitTime

    if(length > 59){
        seconds = length % 60
        minutes = parseInt(length / 60)

        waitTime = minutes + ' minutes & ' + seconds + ' seconds'
    }

    else{
        waitTime = length + ' seconds'
    }

    return waitTime
}

const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', make_sheet);

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearInput);

const SPYbutton = document.getElementById('SP500')
SPYbutton.addEventListener('click', make_sheet.bind(this, 'SPY'))
const Russell1000button = document.getElementById('Russell1000')
Russell1000button.addEventListener('click', make_sheet.bind(this, 'Russell1000'))





async function APIcall(tickers){
    var url = 'https://6864-2601-83-8100-ec80-b049-542-5641-d438.ngrok-free.app/make_sheet?tickers=' + tickers

    let response = await fetch(url,{
        method: "GET",
        headers:{
            "ngrok-skip-browser-warning": 'True'
        }
    })
        .then(response => {
            console.log(response)

            if(!response.ok){
                throw new Error('Network response was not ok')
            }

            return response.blob();
        })           //api for the get request



    .then(blob => {

        if(blob.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
            throw new Error('Incorrect file type received')
        }
        
        // const downloadURL = window.URL.createObjectURL(blob)
        // const a = document.createElement('a')
        // a.style.display = 'none'
        // a.href = downloadURL
        // a.download = 'workbook.xlsx'

        // document.body.appendChild(a)
        // a.click()

        // document.body.removeChild(a)
        // window.URL.revokeObjectURL(downloadURL)
    })

    return response
    
}

async function getTime(tickerList){

    var tickers = ''
    for(var ticker = 0; ticker < tickerList.length; ticker++){

        if(ticker == tickerList.length-1){
            var tickerItem = tickerList[ticker]
            tickers += tickerItem
        }

        else{
            var tickerItem = tickerList[ticker]
            tickers += tickerItem + ','
        }
        
    }

    var startTime = new Date()
    startTime = startTime.getTime()

    var response = await APIcall(tickers)
    console.log(response)

    var endTime = new Date()
    endTime = endTime.getTime()
    console.log(startTime)
    console.log(endTime)
    console.log('Difference in time = ')
    return ((endTime - startTime) / 1000)
}

function makeGraph(){
    var tickerList = ["MSFT","NVDA","AAPL","AMZN","META","GOOGL","GOOG","BRK","B","LLY","JPM","AVGO","XOM","TSLA","UNH","V","PG","MA","COST","JNJ","HD","MRK","ABBV","WMT","BAC","NFLX","CVX","AMD","KO","PEP","QCOM","CRM","TMO","WFC","LIN","ADBE","ORCL","CSCO","MCD","DIS","ABT","AMAT","ACN","TXN","GE","VZ","DHR","CAT","PFE","AMGN","PM","NEE","INTU","CMCSA","IBM","GS","RTX","ISRG","MU","UNP","SPGI","AXP","NOW","COP","HON","BKNG","UBER","ETN","T","INTC","ELV","LOW","LRCX","PGR","MS","VRTX","TJX","C","NKE","SYK","ADI","BSX","MDT","BLK","CB","SCHW","BA","REGN","KLAC","MMC","LMT","ADP","UPS","CI","PLD","DE","SBUX","PANW","AMT","MDLZ","TMUS","FI","SO","BX","SNPS","BMY","CMG","MO","DUK","ZTS","GILD","APH","CDNS","ICE","CL","CVS","MCK","FCX","ANET","TDG","WM","TT","CME","SHW","TGT","EQIX","EOG","NXPI","BDX","PYPL","GD","CEG","PH","HCA","CSX","ITW","MPC","ABNB","NOC","MCO","SLB","EMR","USB","PNC","MSI","APD","PSX","ECL","CTAS","WELL","FDX","ROP","ORLY","MAR","AON","PCAR","MMM","AIG","AJG","EW","GM","VLO","COF","CARR","MCHP","NSC","HLT","WMB","SPG","TFC","MRNA","JCI","SRE","NEM","TRV","AZO","ROST","F","AEP","AFL","OKE","GEV","TEL","DLR","CPRT","KMB","BK","FIS","ADSK","D","CCI","HUM","DXCM","O","DHI","MET","PSA","AMP","PRU","ALL","URI","LHX","HES","NUE","IDXX","STZ","OTIS","OXY","LEN","IQV","PWR","DOW","GWW","YUM","CTVA","PCG","MSCI","SMCI","PAYX","GIS","A","AME","COR","MNST","CNC","RSG","ACGL","KMI","CMI","FTNT","PEG","EXC","KVUE","VRSK","FAST","IR","SYY","KDP","RCL","LULU","MPWR","MLM","DD","FANG","KR","VMC","BIIB","XYL","HWM","ADM","IT","CTSH","GEHC","DAL","EA","ED","BKR","FICO","CSGP","ON","VST","HAL","PPG","DFS","HPQ","EXR","DG","HIG","RMD","XEL","ODFL","MTD","DVN","CDW","VICI","WAB","ROK","HSY","EIX","FSLR","TSCO","EL","GLW","EFX","CHTR","KHC","DECK","EBAY","ANSS","AVB","WTW","CHD","TROW","TRGP","TTWO","GPN","CBRE","FTV","WEC","DOV","AWK","DLTR","FITB","GRMN","NTAP","MTB","IFF","PHM","CAH","WST","NVR","LYB","WDC","DTE","KEYS","ZBH","ETR","APTV","IRM","BR","HPE","RJF","STT","STE","EQR","NDAQ","BALL","VLTO","WY","TER","PPL","SBAC","BRO","ES","CTRA","FE","PTC","HUBB","GPC","STLD","VTR","INVH","LDOS","TYL","AXON","HBAN","CNP","AEE","ULTA","BLDR","COO","CPAY","TDY","WBD","CBOE","ARE","WAT","AVY","CMS","CINF","DPZ","DRI","ALGN","MKC","MOH","SYF","OMC","PFG","NRG","STX","EXPD","RF","HOLX","J","ENPH","NTRS","UAL","BAX","ATO","TXT","BBY","EQT","ESS","EG","MRO","LVS","LH","LUV","PKG","WRB","ILMN","TSN","CLX","CFG","CCL","K","ZBRA","IP","DGX","BG","VRSN","IEX","MAA","CF","MAS","EXPE","FDS","JBL","AMCR","CE","SWKS","SNA","ALB","CAG","DOC","GEN","POOL","AES","WRK","L","AKAM","TRMB","RVTY","LYV","SWK","KEY","PNR","JBHT","KIM","ROL","LNT","HST","VTRS","PODD","LW","EVRG","NDSN","TECH","JKHY","BBWI","UDR","IPG","EMN","NI","LKQ","WBA","SJM","UHS","JNPR","KMX","CPT","MGM","INCY","CRL","ALLE","NWSA","REG","CHRW","TPR","TFX","AOS","EPAM","MOS","HII","TAP","FFIV","CTLT","QRVO","HSIC","WYNN","AIZ","APA","HRL","CPB","GNRC","PNW","FOXA","BXP","BWA","MTCH","BF","B","SOLV","DVA","ETSY","DAY","CZR","AAL","HAS","MKTX","FRT","FMC","RL","NCLH","PAYC","GL","IVZ","RHI","BEN","CMA","MHK","PARA","BIO","FOX","NWS"]

    var xyValues = [
        {x:50, y:7},
    ];

    for(var i = 1; i<3; i++){
        var newList = tickerList.slice(0,i)
        var time = getTime(newList)
        xyValues.push({x:newList.length, y: time})
    }
      
    new Chart("myChart", {
    type: "scatter",
    data: {
        datasets: [{
        pointRadius: 4,
        pointBackgroundColor: "rgba(0,0,255,1)",
        data: xyValues
        }]
    },
    });
}

makeGraph()

