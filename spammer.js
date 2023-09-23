let isSpamming = false;
let intervalId;

function startSpam() {
    const webhookUrl = document.getElementById('webhookUrl').value;
    const message = document.getElementById('message').value;
    const messageRate = document.getElementById('messageRate').value;

    if (!webhookUrl || !message || !messageRate) {
        document.getElementById('warningDiv').innerHTML = '⚠️ Fill in all fields.';
        return;
    }

    isSpamming = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('stopButton').disabled = false;
    document.getElementById('warningDiv').innerHTML = '';

    const logContainer = document.getElementById('logContainer');
    
    intervalId = setInterval(() => {
        if (isSpamming) {
            // Send the message and handle rate limiting
            const timestamp = getTimeStamp();
            const delay = calculateDelay(messageRate);
            
            if (Math.random() < 0.1) {
                logContainer.innerHTML += `<span class="errorText">[${timestamp}] Rate limited!</span>\n`;
            } else {
                logContainer.innerHTML += `[${timestamp}] Message sent successfully: ${message}\n`;
            }
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }, 1000);
}

function stopSpam() {
    isSpamming = false;
    clearInterval(intervalId);
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
    document.getElementById('warningDiv').innerHTML = '';
}

function getTimeStamp() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${padZero(minutes)}:${padZero(seconds)} ${amPm}`;
}

function padZero(value) {
    return value < 10 ? `0${value}` : value;
}

function calculateDelay(messageRate) {
    if (messageRate <= 2) {
        return 1000 / messageRate;
    } else {
        return (messageRate - 2) * 1000;
    }
}
