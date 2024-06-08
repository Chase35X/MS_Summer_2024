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

    


    email = document.getElementById('emailInput').value

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
    var url = 'https://3d08-2601-83-8100-ec80-7918-a333-bcb6-adb6.ngrok-free.app/make_sheet?tickers=' + tickers

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

    return response
    
}

