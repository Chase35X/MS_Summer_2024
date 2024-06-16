async function make_sheet(){
    
    clearOutputBox()
    
    
    tickerInput = document.getElementById('tickerInput').value

    const regex = /[a-zA-Z]/;

    if(regex.test(tickerInput)){
        console.log('Contains a ticker')
    } 

    else{
        setErrorAnimation()
        return
    }

    var tickerList;

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


    console.log(tickerList)


    
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

    var estimatedWaitTime = calculateEstimatedWaitTime(tickerList)

    setLoadingAnimation(estimatedWaitTime)

    console.log(tickers)

    var response = await APIcall(tickers)
    console.log(response)

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

function setErrorAnimation(){
    const output = document.getElementById('outputText')
    output.classList.remove('loading-circle')

    const waitTime = document.getElementById('estimatedWaitTime')
    waitTime.style.display = 'none'

    const loading = document.getElementById('loadingTitle')
    loading.style.display = 'none'

    output.innerHTML = '❌ <br> Sorry...there has been an error. Try again or ask Chase for help.'
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

async function APIcall(tickers){

    var url = 'https://6159-2601-83-8100-ec80-2d3e-367d-bba4-6923.ngrok-free.app/make_sheet?tickers=' + tickers

    const timeout = 5000000000000; // Timeout in milliseconds (5 seconds)

    const controller = new AbortController();
    const signal = controller.signal;

    // Set a timeout to abort the request
    const fetchTimeout = setTimeout(() => {
        controller.abort();
    }, timeout);

    let response = await fetch(url,{
        method: "GET",
        headers:{
            "ngrok-skip-browser-warning": 'True'
        },
        signal: signal
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
        
        const downloadURL = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = downloadURL
        a.download = 'workbook.xlsx'

        document.body.appendChild(a)
        a.click()

        document.body.removeChild(a)
        window.URL.revokeObjectURL(downloadURL)
    })

    clearTimeout(fetchTimeout);

    return response
    
}

// async function getTime(tickerList){

//     var tickers = ''
//     for(var ticker = 0; ticker < tickerList.length; ticker++){

//         if(ticker == tickerList.length-1){
//             var tickerItem = tickerList[ticker]
//             tickers += tickerItem
//         }

//         else{
//             var tickerItem = tickerList[ticker]
//             tickers += tickerItem + ','
//         }
        
//     }

//     var startTime = new Date()
//     startTime = startTime.getTime()

//     var response = await APIcall(tickers)
//     console.log(response)

//     var endTime = new Date()
//     endTime = endTime.getTime()
//     console.log(startTime)
//     console.log(endTime)
//     console.log('Difference in time = ')
//     var change = (endTime - startTime) / 1000
//     return change
// }

// async function makeGraph(){
//     var tickerList = ["MSFT","NVDA","AAPL","AMZN","META","GOOGL","GOOG","BRK","B","LLY","JPM","AVGO","XOM","TSLA","UNH","V","PG","MA","COST","JNJ","HD","MRK","ABBV","WMT","BAC","NFLX","CVX","AMD","KO","PEP","QCOM","CRM","TMO","WFC","LIN","ADBE","ORCL","CSCO","MCD","DIS","ABT","AMAT","ACN","TXN","GE","VZ","DHR","CAT","PFE","AMGN","PM","NEE","INTU","CMCSA","IBM","GS","RTX","ISRG","MU","UNP","SPGI","AXP","NOW","COP","HON","BKNG","UBER","ETN","T","INTC","ELV","LOW","LRCX","PGR","MS","VRTX","TJX","C","NKE","SYK","ADI","BSX","MDT","BLK","CB","SCHW","BA","REGN","KLAC","MMC","LMT","ADP","UPS","CI","PLD","DE","SBUX","PANW","AMT","MDLZ","TMUS","FI","SO","BX","SNPS","BMY","CMG","MO","DUK","ZTS","GILD","APH","CDNS","ICE","CL","CVS","MCK","FCX","ANET","TDG","WM","TT","CME","SHW","TGT","EQIX","EOG","NXPI","BDX","PYPL","GD","CEG","PH","HCA","CSX","ITW","MPC","ABNB","NOC","MCO","SLB","EMR","USB","PNC","MSI","APD","PSX","ECL","CTAS","WELL","FDX","ROP","ORLY","MAR","AON","PCAR","MMM","AIG","AJG","EW","GM","VLO","COF","CARR","MCHP","NSC","HLT","WMB","SPG","TFC","MRNA","JCI","SRE","NEM","TRV","AZO","ROST","F","AEP","AFL","OKE","GEV","TEL","DLR","CPRT","KMB","BK","FIS","ADSK","D","CCI","HUM","DXCM","O","DHI","MET","PSA","AMP","PRU","ALL","URI","LHX","HES","NUE","IDXX","STZ","OTIS","OXY","LEN","IQV","PWR","DOW","GWW","YUM","CTVA","PCG","MSCI","SMCI","PAYX","GIS","A","AME","COR","MNST","CNC","RSG","ACGL","KMI","CMI","FTNT","PEG","EXC","KVUE","VRSK","FAST","IR","SYY","KDP","RCL","LULU","MPWR","MLM","DD","FANG","KR","VMC","BIIB","XYL","HWM","ADM","IT","CTSH","GEHC","DAL","EA","ED","BKR","FICO","CSGP","ON","VST","HAL","PPG","DFS","HPQ","EXR","DG","HIG","RMD","XEL","ODFL","MTD","DVN","CDW","VICI","WAB","ROK","HSY","EIX","FSLR","TSCO","EL","GLW","EFX","CHTR","KHC","DECK","EBAY","ANSS","AVB","WTW","CHD","TROW","TRGP","TTWO","GPN","CBRE","FTV","WEC","DOV","AWK","DLTR","FITB","GRMN","NTAP","MTB","IFF","PHM","CAH","WST","NVR","LYB","WDC","DTE","KEYS","ZBH","ETR","APTV","IRM","BR","HPE","RJF","STT","STE","EQR","NDAQ","BALL","VLTO","WY","TER","PPL","SBAC","BRO","ES","CTRA","FE","PTC","HUBB","GPC","STLD","VTR","INVH","LDOS","TYL","AXON","HBAN","CNP","AEE","ULTA","BLDR","COO","CPAY","TDY","WBD","CBOE","ARE","WAT","AVY","CMS","CINF","DPZ","DRI","ALGN","MKC","MOH","SYF","OMC","PFG","NRG","STX","EXPD","RF","HOLX","J","ENPH","NTRS","UAL","BAX","ATO","TXT","BBY","EQT","ESS","EG","MRO","LVS","LH","LUV","PKG","WRB","ILMN","TSN","CLX","CFG","CCL","K","ZBRA","IP","DGX","BG","VRSN","IEX","MAA","CF","MAS","EXPE","FDS","JBL","AMCR","CE","SWKS","SNA","ALB","CAG","DOC","GEN","POOL","AES","WRK","L","AKAM","TRMB","RVTY","LYV","SWK","KEY","PNR","JBHT","KIM","ROL","LNT","HST","VTRS","PODD","LW","EVRG","NDSN","TECH","JKHY","BBWI","UDR","IPG","EMN","NI","LKQ","WBA","SJM","UHS","JNPR","KMX","CPT","MGM","INCY","CRL","ALLE","NWSA","REG","CHRW","TPR","TFX","AOS","EPAM","MOS","HII","TAP","FFIV","CTLT","QRVO","HSIC","WYNN","AIZ","APA","HRL","CPB","GNRC","PNW","FOXA","BXP","BWA","MTCH","BF","B","SOLV","DVA","ETSY","DAY","CZR","AAL","HAS","MKTX","FRT","FMC","RL","NCLH","PAYC","GL","IVZ","RHI","BEN","CMA","MHK","PARA","BIO","FOX","NWS"]

//     var xyValues = [
        
//     ]

//     for(var i = 1; i<505; i++){
//         var newList = tickerList.slice(0,i)
//         var time = await getTime(newList)
//         xyValues.push({x:newList.length, y:time})
//     }

//     console.log(xyValues)
      
//     new Chart("myChart", {
//     type: "scatter",
//     data: {
//         datasets: [{
//         pointRadius: 4,
//         pointBackgroundColor: "rgba(0,0,255,1)",
//         data: xyValues
//         }]
//     },
//     });
// }

function fillInput(etf){
    var tickerList;
    if(etf == 'SPY'){
        tickerList = ['MMM', 'AOS', 'ABT', 'ABBV', 'ACN', 'ADBE', 'AMD', 'AES', 'AFL', 'A', 'APD', 'ABNB', 'AKAM', 'ALB', 'ARE', 'ALGN', 'ALLE', 'LNT', 'ALL', 'GOOGL', 'GOOG', 'MO', 'AMZN', 'AMCR', 'AEE', 'AAL', 'AEP', 'AXP', 'AIG', 'AMT', 'AWK', 'AMP', 'AME', 'AMGN', 'APH', 'ADI', 'ANSS', 'AON', 'APA', 'AAPL', 'AMAT', 'APTV', 'ACGL', 'ADM', 'ANET', 'AJG', 'AIZ', 'T', 'ATO', 'ADSK', 'ADP', 'AZO', 'AVB', 'AVY', 'AXON', 'BKR', 'BALL', 'BAC', 'BK', 'BBWI', 'BAX', 'BDX', 'BRK.B', 'BBY', 'BIO', 'TECH', 'BIIB', 'BLK', 'BX', 'BA', 'BKNG', 'BWA', 'BXP', 'BSX', 'BMY', 'AVGO', 'BR', 'BRO', 'BF.B', 'BLDR', 'BG', 'CDNS', 'CZR', 'CPT', 'CPB', 'COF', 'CAH', 'KMX', 'CCL', 'CARR', 'CTLT', 'CAT', 'CBOE', 'CBRE', 'CDW', 'CE', 'COR', 'CNC', 'CNP', 'CF', 'CHRW', 'CRL', 'SCHW', 'CHTR', 'CVX', 'CMG', 'CB', 'CHD', 'CI', 'CINF', 'CTAS', 'CSCO', 'C', 'CFG', 'CLX', 'CME', 'CMS', 'KO', 'CTSH', 'CL', 'CMCSA', 'CMA', 'CAG', 'COP', 'ED', 'STZ', 'CEG', 'COO', 'CPRT', 'GLW', 'CPAY', 'CTVA', 'CSGP', 'COST', 'CTRA', 'CCI', 'CSX', 'CMI', 'CVS', 'DHR', 'DRI', 'DVA', 'DAY', 'DECK', 'DE', 'DAL', 'DVN', 'DXCM', 'FANG', 'DLR', 'DFS', 'DG', 'DLTR', 'D', 'DPZ', 'DOV', 'DOW', 'DHI', 'DTE', 'DUK', 'DD', 'EMN', 'ETN', 'EBAY', 'ECL', 'EIX', 'EW', 'EA', 'ELV', 'LLY', 'EMR', 'ENPH', 'ETR', 'EOG', 'EPAM', 'EQT', 'EFX', 'EQIX', 'EQR', 'ESS', 'EL', 'ETSY', 'EG', 'EVRG', 'ES', 'EXC', 'EXPE', 'EXPD', 'EXR', 'XOM', 'FFIV', 'FDS', 'FICO', 'FAST', 'FRT', 'FDX', 'FIS', 'FITB', 'FSLR', 'FE', 'FI', 'FMC', 'F', 'FTNT', 'FTV', 'FOXA', 'FOX', 'BEN', 'FCX', 'GRMN', 'IT', 'GE', 'GEHC', 'GEV', 'GEN', 'GNRC', 'GD', 'GIS', 'GM', 'GPC', 'GILD', 'GPN', 'GL', 'GS', 'HAL', 'HIG', 'HAS', 'HCA', 'DOC', 'HSIC', 'HSY', 'HES', 'HPE', 'HLT', 'HOLX', 'HD', 'HON', 'HRL', 'HST', 'HWM', 'HPQ', 'HUBB', 'HUM', 'HBAN', 'HII', 'IBM', 'IEX', 'IDXX', 'ITW', 'ILMN', 'INCY', 'IR', 'PODD', 'INTC', 'ICE', 'IFF', 'IP', 'IPG', 'INTU', 'ISRG', 'IVZ', 'INVH', 'IQV', 'IRM', 'JBHT', 'JBL', 'JKHY', 'J', 'JNJ', 'JCI', 'JPM', 'JNPR', 'K', 'KVUE', 'KDP', 'KEY', 'KEYS', 'KMB', 'KIM', 'KMI', 'KLAC', 'KHC', 'KR', 'LHX', 'LH', 'LRCX', 'LW', 'LVS', 'LDOS', 'LEN', 'LIN', 'LYV', 'LKQ', 'LMT', 'L', 'LOW', 'LULU', 'LYB', 'MTB', 'MRO', 'MPC', 'MKTX', 'MAR', 'MMC', 'MLM', 'MAS', 'MA', 'MTCH', 'MKC', 'MCD', 'MCK', 'MDT', 'MRK', 'META', 'MET', 'MTD', 'MGM', 'MCHP', 'MU', 'MSFT', 'MAA', 'MRNA', 'MHK', 'MOH', 'TAP', 'MDLZ', 'MPWR', 'MNST', 'MCO', 'MS', 'MOS', 'MSI', 'MSCI', 'NDAQ', 'NTAP', 'NFLX', 'NEM', 'NWSA', 'NWS', 'NEE', 'NKE', 'NI', 'NDSN', 'NSC', 'NTRS', 'NOC', 'NCLH', 'NRG', 'NUE', 'NVDA', 'NVR', 'NXPI', 'ORLY', 'OXY', 'ODFL', 'OMC', 'ON', 'OKE', 'ORCL', 'OTIS', 'PCAR', 'PKG', 'PANW', 'PARA', 'PH', 'PAYX', 'PAYC', 'PYPL', 'PNR', 'PEP', 'PFE', 'PCG', 'PM', 'PSX', 'PNW', 'PNC', 'POOL', 'PPG', 'PPL', 'PFG', 'PG', 'PGR', 'PLD', 'PRU', 'PEG', 'PTC', 'PSA', 'PHM', 'QRVO', 'PWR', 'QCOM', 'DGX', 'RL', 'RJF', 'RTX', 'O', 'REG', 'REGN', 'RF', 'RSG', 'RMD', 'RVTY', 'RHI', 'ROK', 'ROL', 'ROP', 'ROST', 'RCL', 'SPGI', 'CRM', 'SBAC', 'SLB', 'STX', 'SRE', 'NOW', 'SHW', 'SPG', 'SWKS', 'SJM', 'SNA', 'SOLV', 'SO', 'LUV', 'SWK', 'SBUX', 'STT', 'STLD', 'STE', 'SYK', 'SMCI', 'SYF', 'SNPS', 'SYY', 'TMUS', 'TROW', 'TTWO', 'TPR', 'TRGP', 'TGT', 'TEL', 'TDY', 'TFX', 'TER', 'TSLA', 'TXN', 'TXT', 'TMO', 'TJX', 'TSCO', 'TT', 'TDG', 'TRV', 'TRMB', 'TFC', 'TYL', 'TSN', 'USB', 'UBER', 'UDR', 'ULTA', 'UNP', 'UAL', 'UPS', 'URI', 'UNH', 'UHS', 'VLO', 'VTR', 'VLTO', 'VRSN', 'VRSK', 'VZ', 'VRTX', 'VTRS', 'VICI', 'V', 'VST', 'VMC', 'WRB', 'GWW', 'WAB', 'WBA', 'WMT', 'DIS', 'WBD', 'WM', 'WAT', 'WEC', 'WFC', 'WELL', 'WST', 'WDC', 'WRK', 'WY', 'WMB', 'WTW', 'WYNN', 'XEL', 'XYL', 'YUM', 'ZBRA', 'ZBH', 'ZTS']
    }

    else if(etf == 'Russell1000'){
        tickerList = ['TXG', 'MMM', 'ABT', 'ABBV', 'ACHC', 'ACN', 'AYI', 'ADM', 'ADBE', 'ADP', 'ADT', 'AAP', 'WMS', 'ACM', 'AES', 'AFRM', 'AFL', 'AGCO', 'A', 'AGL', 'ADC', 'AGNC', 'AIG', 'AL', 'APD', 'ABNB', 'AKAM', 'ALK', 'ALB', 'ACI', 'AA', 'ARE', 'ALGN', 'ALLE', 'ALGM', 'LNT', 'ALSN', 'ALL', 'ALLY', 'ALNY', 'GOOGL', 'GOOG', 'MO', 'AMZN', 'AMC', 'AMCR', 'AMD', 'DOX', 'AMED', 'AEE', 'AAL', 'AEP', 'AXP', 'AFG', 'AMH', 'AMT', 'AWK', 'COLD', 'AMP', 'AME', 'AMG', 'AMGN', 'APH', 'ADI', 'NLY', 'ANSS', 'AM', 'AR', 'AON', 'APA', 'AIRC', 'APLS', 'APO', 'AAPL', 'AMAT', 'APP', 'ATR', 'APTV', 'ARMK', 'ACGL', 'AMBP', 'ARES', 'ANET', 'AWI', 'ARW', 'AJG', 'ASH', 'AZPN', 'AIZ', 'AGO', 'T', 'TEAM', 'ATO', 'ADSK', 'AN', 'AZO', 'AVB', 'AGR', 'AVTR', 'AVY', 'CAR', 'AVT', 'AXTA', 'AXS', 'AXON', 'AZEK', 'AZTA', 'BKR', 'BALL', 'BAC', 'OZK', 'BBWI', 'BAX', 'BDX', 'BSY', 'WRB', 'BRK.B', 'BERY', 'BBY', 'BILL', 'BIO', 'TECH', 'BIIB', 'BMRN', 'BIRK', 'BJ', 'BLK', 'BX', 'HRB', 'SQ', 'OWL', 'BK', 'BA', 'BOKF', 'BKNG', 'BAH', 'BWA', 'SAM', 'BXP', 'BSX', 'BYD', 'BFAM', 'BHF', 'BMY', 'BRX', 'AVGO', 'BR', 'BEPC', 'BRO', 'BF.A', 'BF.B', 'BRKR', 'BC', 'BLDR', 'BG', 'BURL', 'BWXT', 'CHRW', 'CABO', 'CACI', 'CDNS', 'CZR', 'CPT', 'CPB', 'COF', 'CPRI', 'CAH', 'CSL', 'CG', 'KMX', 'CCL', 'CARR', 'CRI', 'CASY', 'CTLT', 'CAT', 'CAVA', 'CBOE', 'CBRE', 'CCCS', 'CDW', 'CE', 'CELH', 'COR', 'CNC', 'CNP', 'CERT', 'CF', 'CHPT', 'CRL', 'SCHW', 'CHTR', 'CHE', 'CC', 'LNG', 'CHK', 'CVX', 'CMG', 'CHH', 'CB', 'CHD', 'CHDN', 'CIEN', 'CI', 'CINF', 'CTAS', 'CRUS', 'CSCO', 'C', 'CFG', 'CLVT', 'CLH', 'CWEN.A', 'CWEN', 'CLF', 'CLX', 'NET', 'CME', 'CMS', 'CNA', 'CNH', 'KO', 'CGNX', 'CTSH', 'COHR', 'COIN', 'CL', 'COLB', 'COLM', 'CMCSA', 'CMA', 'CBSH', 'ED', 'CAG', 'CNXC', 'CFLT', 'COP', 'STZ', 'CEG', 'COO', 'CPRT', 'CNM', 'GLW', 'CPAY', 'CTVA', 'CSGP', 'COST', 'CTRA', 'COTY', 'CPNG', 'CUZ', 'CR', 'CXT', 'CACC', 'CROX', 'CRWD', 'CCI', 'CCK', 'CSX', 'CUBE', 'CMI', 'CW', 'CVS', 'DHI', 'DHR', 'DRI', 'DAR', 'DDOG', 'DVA', 'DAY', 'DECK', 'DE', 'DAL', 'XRAY', 'DVN', 'DXCM', 'FANG', 'DKS', 'DLR', 'DFS', 'DIS', 'DOCU', 'DLB', 'DG', 'DLTR', 'D', 'DPZ', 'DCI', 'DASH', 'DV', 'DOV', 'DOW', 'DOCS', 'DKNG', 'DRVN', 'DBX', 'DTM', 'DTE', 'DUK', 'DNB', 'DD', 'DXC', 'DT', 'EXP', 'EWBC', 'EGP', 'EMN', 'ETN', 'EBAY', 'ECL', 'EIX', 'EW', 'ELAN', 'ESTC', 'EA', 'ESI', 'ELV', 'EME', 'EMR', 'EHC', 'ENOV', 'ENPH', 'ENTG', 'ETR', 'NVST', 'EOG', 'EPAM', 'EPR', 'EQT', 'EFX', 'EQIX', 'EQH', 'ELS', 'EQR', 'ESAB', 'WTRG', 'ESS', 'EL', 'ETSY', 'EEFT', 'EVR', 'EG', 'EVRG', 'ES', 'EXAS', 'EXEL', 'EXC', 'EXPE', 'EXPD', 'EXR', 'XOM', 'FFIV', 'FDS', 'FAST', 'FRT', 'FDX', 'FERG', 'FICO', 'FNF', 'FITB', 'FAF', 'FCNCA', 'FHB', 'FHN', 'FR', 'FSLR', 'FE', 'FIS', 'FI', 'FIVE', 'FIVN', 'FND', 'FLO', 'FLS', 'FMC', 'FNB', 'F', 'FTNT', 'FTV', 'FTRE', 'FBIN', 'FOXA', 'FOX', 'BEN', 'FCX', 'FRPT', 'FYBR', 'CFR', 'FCN', 'GME', 'GLPI', 'GPS', 'GRMN', 'IT', 'GTES', 'GE', 'GEHC', 'GEV', 'GEN', 'GNRC', 'GD', 'GIS', 'GM', 'G', 'GNTX', 'GPC', 'GILD', 'DNA', 'GTLB', 'GPN', 'GFS', 'GLOB', 'GL', 'GMED', 'GDDY', 'GS', 'GGG', 'GWW', 'LOPE', 'GPK', 'GO', 'GWRE', 'GXO', 'HAL', 'THG', 'HOG', 'HIG', 'HAS', 'HCP', 'HE', 'HAYW', 'HCA', 'HR', 'DOC', 'HEI.A', 'HEI', 'JKHY', 'HSY', 'HTZ', 'HES', 'HPE', 'HXL', 'DINO', 'HIW', 'HLT', 'HOLX', 'HD', 'HON', 'HRL', 'HST', 'HLI', 'HHH', 'HWM', 'HPQ', 'HUBB', 'HUBS', 'HUM', 'HBAN', 'HII', 'HUN', 'H', 'IAC', 'IBM', 'ICLR', 'ICUI', 'IDA', 'IEX', 'IDXX', 'ITW', 'ILMN', 'INCY', 'INFA', 'IR', 'INGR', 'INSP', 'PODD', 'IART', 'INTC', 'IBKR', 'ICE', 'IFF', 'IP', 'INTU', 'ISRG', 'IVZ', 'INVH', 'IONS', 'IPG', 'IPGP', 'IQV', 'IRDM', 'IRM', 'ITT', 'JBL', 'J', 'JHG', 'JAZZ', 'JBHT', 'JEF', 'JNJ', 'JCI', 'JLL', 'JPM', 'JNPR', 'KBR', 'K', 'KMPR', 'KVUE', 'KDP', 'KEY', 'KEYS', 'KRC', 'KMB', 'KIM', 'KMI', 'KNSL', 'KEX', 'KKR', 'KLAC', 'KNX', 'KSS', 'KHC', 'KR', 'KD', 'LHX', 'LH', 'LRCX', 'LAMR', 'LW', 'LSTR', 'LVS', 'LSCC', 'LAZ', 'LEA', 'LEG', 'LDOS', 'LEN', 'LEN.B', 'LII', 'LBRDA', 'LBRDK', 'FWONA', 'FWONK', 'LLYVA', 'LLYVK', 'LSXMA', 'LSXMK', 'LLY', 'LECO', 'LNC', 'LIN', 'LAD', 'LFUS', 'LYV', 'LKQ', 'LMT', 'L', 'LPX', 'LOW', 'LPLA', 'LCID', 'LULU', 'LITE', 'LYFT', 'LYB', 'MTB', 'M', 'MSGS', 'MANH', 'MAN', 'CART', 'MRO', 'MPC', 'MRVI', 'MKL', 'MKTX', 'MAR', 'VAC', 'MMC', 'MLM', 'MRVL', 'MAS', 'MASI', 'MTZ', 'MA', 'MTCH', 'MAT', 'MKC', 'MCD', 'MCK', 'MDU', 'MPW', 'MEDP', 'MDT', 'MRK', 'MRCY', 'META', 'MET', 'MTD', 'MTG', 'MGM', 'MCHP', 'MU', 'MSFT', 'MAA', 'MIDD', 'MCW', 'MKSI', 'MRNA', 'MHK', 'MOH', 'TAP', 'MDLZ', 'MDB', 'MPWR', 'MNST', 'MCO', 'MS', 'MORN', 'MOS', 'MSI', 'MP', 'MSA', 'MSM', 'MSCI', 'MUSA', 'NDAQ', 'NTRA', 'NFG', 'NSA', 'NCNO', 'NATL', 'VYX', 'NLOP', 'NTAP', 'NFLX', 'NBIX', 'NFE', 'NYCB', 'NYT', 'NWL', 'NEU', 'NEM', 'NWSA', 'NWS', 'NXST', 'NEE', 'NKE', 'NI', 'NNN', 'NDSN', 'JWN', 'NSC', 'NTRS', 'NOC', 'NCLH', 'NOV', 'NVCR', 'NRG', 'NU', 'NUE', 'NTNX', 'NVT', 'NVDA', 'NVR', 'ORLY', 'OXY', 'OGE', 'OKTA', 'OLPX', 'ODFL', 'ORI', 'OLN', 'OLLI', 'OHI', 'OMC', 'ON', 'OMF', 'OKE', 'ORCL', 'OGN', 'OSK', 'OTIS', 'OVV', 'OC', 'PCAR', 'PKG', 'PLTR', 'PANW', 'PARAA', 'PARA', 'PK', 'PH', 'PAYX', 'PAYC', 'PYCR', 'PCTY', 'PYPL', 'PEGA', 'PTON', 'PENN', 'PAG', 'PNR', 'PEN', 'PEP', 'PFGC', 'PRGO', 'WOOF', 'PFE', 'PCG', 'PM', 'PSX', 'PHIN', 'PPC', 'PNFP', 'PNW', 'PINS', 'PLNT', 'PLTK', 'PLUG', 'PNC', 'PII', 'POOL', 'BPOP', 'POST', 'PPG', 'PPL', 'PINC', 'TROW', 'PRI', 'PFG', 'PCOR', 'PG', 'PGR', 'PLD', 'PB', 'PRU', 'PTC', 'PSA', 'PEG', 'PHM', 'PSTG', 'PVH', 'QGEN', 'QRVO', 'QCOM', 'PWR', 'QS', 'DGX', 'QDEL', 'RCM', 'RL', 'RRC', 'RJF', 'RYN', 'RTX', 'RBC', 'O', 'RRX', 'REG', 'REGN', 'RF', 'RGA', 'RS', 'RNR', 'RGEN', 'RSG', 'RMD', 'RVTY', 'REXR', 'REYN', 'RH', 'RNG', 'RBA', 'RITM', 'RIVN', 'RLI', 'RHI', 'HOOD', 'RBLX', 'RKT', 'ROK', 'ROIV', 'ROKU', 'ROL', 'ROP', 'ROST', 'RCL', 'RGLD', 'RPRX', 'RPM', 'RYAN', 'R', 'SPGI', 'SAIA', 'SAIC', 'CRM', 'SLM', 'SRPT', 'SBAC', 'HSIC', 'SLB', 'SNDR', 'SMG', 'SEB', 'SEE', 'SEIC', 'SRE', 'ST', 'S', 'SCI', 'NOW', 'SHW', 'FOUR', 'SLGN', 'SPG', 'SIRI', 'SITE', 'SKX', 'SWKS', 'SMAR', 'AOS', 'SJM', 'SNA', 'SNOW', 'SOFI', 'SOLV', 'SON', 'SHC', 'SO', 'SCCO', 'LUV', 'SWN', 'SPB', 'SPR', 'SPOT', 'SSNC', 'SSRM', 'STAG', 'SWK', 'SBUX', 'STWD', 'STT', 'STLD', 'SRCL', 'STE', 'SF', 'SYK', 'SUI', 'RUN', 'SYF', 'SNPS', 'SNV', 'SYY', 'TMUS', 'TTWO', 'TNDM', 'TPR', 'TRGP', 'TGT', 'SNX', 'FTI', 'TDOC', 'TDY', 'TFX', 'TPX', 'THC', 'TDC', 'TER', 'TSLA', 'TTEK', 'TXN', 'TPL', 'TXRH', 'TXT', 'TMO', 'TFSL', 'THO', 'TKR', 'TJX', 'TKO', 'TOST', 'TOL', 'BLD', 'TTC', 'TPG', 'TSCO', 'TTD', 'TW', 'TT', 'TDG', 'TRU', 'TNL', 'TRV', 'TREX', 'TRMB', 'TRIP', 'TFC', 'TWLO', 'TYL', 'TSN', 'UHAL', 'UHAL.B', 'X', 'UBER', 'UI', 'UDR', 'UGI', 'PATH', 'ULTA', 'RARE', 'UAA', 'UA', 'UNP', 'UAL', 'UPS', 'URI', 'UTHR', 'UWMC', 'UNH', 'U', 'OLED', 'UHS', 'UNM', 'USB', 'USFD', 'MTN', 'VLO', 'VMI', 'VVV', 'VEEV', 'VTR', 'VLTO', 'VRSN', 'VRSK', 'VZ', 'VRTX', 'VRT', 'VSTS', 'VFC', 'VSAT', 'VTRS', 'VICI', 'VSCO', 'VIRT', 'V', 'VST', 'VNT', 'VNO', 'VOYA', 'VMC', 'WPC', 'WAB', 'WBA', 'WMT', 'WBD', 'WM', 'WAT', 'WSO', 'W', 'WBS', 'WEC', 'WFC', 'WELL', 'WEN', 'WCC', 'WST', 'WAL', 'WDC', 'WU', 'WLK', 'WRK', 'WEX', 'WY', 'WHR', 'WTM', 'WMB', 'WSM', 'WTW', 'WSC', 'WING', 'WTFC', 'KLG', 'WOLF', 'WWD', 'WDAY', 'WH', 'WYNN', 'XEL', 'XP', 'XPO', 'XYL', 'YETI', 'YUM', 'ZBRA', 'ZG', 'Z', 'ZBH', 'ZION', 'ZTS', 'ZM', 'ZI', 'ZS']        
    }

    var stringFill = ''

    for(var i=0; i<tickerList.length; i++){

        if(i == tickerList.length - 1){
            stringFill += tickerList[i]
        }

        else{
            stringFill += tickerList[i] + '\n'
        }
        
    }

    var inputBox = document.getElementById('tickerInput')
    inputBox.value = stringFill
}


const submitButton = document.getElementById('submitButton');
submitButton.addEventListener('click', make_sheet);

const clearButton = document.getElementById('clearButton');
clearButton.addEventListener('click', clearInput);

const SPYbutton = document.getElementById('SP500')
SPYbutton.addEventListener('click', fillInput.bind(this, 'SPY'))
const Russell1000button = document.getElementById('Russell1000')
Russell1000button.addEventListener('click', fillInput.bind(this, 'Russell1000'))

