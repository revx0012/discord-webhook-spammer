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
            const timestamp = getTimeStamp();
            const delay = calculateDelay(messageRate);

            const payload = {
                content: message
            };

            fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (response.status === 204) {
                        logContainer.innerHTML += `[${timestamp}] Message sent successfully: ${message}\n`;
                    } else {
                        logContainer.innerHTML += `<span class="errorText">[${timestamp}] Error sending message: ${response.status}\n</span>`;
                    }
                    logContainer.scrollTop = logContainer.scrollHeight;
                })
                .catch(error => {
                    logContainer.innerHTML += `<span class="errorText">[${timestamp}] Error sending message: ${error}\n</span>`;
                    logContainer.scrollTop = logContainer.scrollHeight;
                });
        }
    }, delay);
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
