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


    email = document.getElementById('emailInput').value

    var estimatedWaitTime = calculateEstimatedWaitTime(tickerList)

    setLoadingAnimation(estimatedWaitTime)

    // Input API call that makes sheet and sends email
    var makeSheetAPIURL = 'https://chase35x.pythonanywhere.com/make_sheet?param=AAPL&email=chaselen@bu.edu'

    let response = await fetch(makeSheetAPIURL)
        .then(data => {
            return data;
        })           //api for the get request
    
    const result = await response.json() 
    console.log(result)

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

    output.innerHTML = '✅ <br> Check your email! <br> Emails can be delayed up to a few minutes, please do not retry for a little while.'
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




// put in ngrok link
// in header must put something look on incognito browser for it (there is a popup before you can access api link)
// if this doesnt work must pay for ngrok
async function testFunc(){
    // Input API call that makes sheet and sends email
    var url = 'https://3d08-2601-83-8100-ec80-7918-a333-bcb6-adb6.ngrok-free.app/make_sheet?tickers=AAPL,MSFT'

    let response = await fetch(url,{
        // method: "GET",
        headers: {
            "ngrok-skip-browser-warning": '',
            "Access-Control-Allow-Origin": 'http://localhost:3000'
        }
    })
        .then(data => {
            return data;
        })           //api for the get request

    const result = await response.json() 
    console.log(result)
    console.log(data)
}

testFunc()
