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
    logContainer.innerHTML = 'Spamming...\n';

    intervalId = setInterval(() => {
        if (isSpamming) {
            // Send the message and handle rate limiting
            simulateMessageSending(webhookUrl, message);
        }
    }, 1000 / messageRate);
}

function stopSpam() {
    isSpamming = false;
    clearInterval(intervalId);
    document.getElementById('startButton').disabled = false;
    document.getElementById('stopButton').disabled = true;
    document.getElementById('warningDiv').innerHTML = '';
}

function simulateMessageSending(webhookUrl, message) {
    // Simulate message sending here, log success or rate limit warnings
    const logContainer = document.getElementById('logContainer');
    const timestamp = new Date().toLocaleTimeString();

    if (Math.random() < 0.1) {
        logContainer.innerHTML += `<span class="errorText">[${timestamp}] Rate limited!</span>\n`;
    } else {
        logContainer.innerHTML += `[${timestamp}] Message sent successfully: ${message}\n`;
    }
    logContainer.scrollTop = logContainer.scrollHeight;
}
