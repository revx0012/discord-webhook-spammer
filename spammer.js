document.addEventListener("DOMContentLoaded", function () {
    const webhookUrlInput = document.getElementById("webhookUrl");
    const messageInput = document.getElementById("message");
    const secondsPerMessageInput = document.getElementById("secondsPerMessage");
    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");
    const warningDiv = document.getElementById("warningDiv");
    const form = document.getElementById("spammerForm");

    let intervalId;

    startButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent form submission
        const webhookUrl = webhookUrlInput.value;
        const message = messageInput.value;
        const secondsPerMessage = parseInt(secondsPerMessageInput.value);

        if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
            warningDiv.innerHTML = '⚠️ Invalid webhook URL. Please enter a valid one.';
            return;
        }

        if (!message || !secondsPerMessage) {
            warningDiv.innerHTML = '⚠️ Please enter a message and seconds per message.';
            return;
        }

        if (secondsPerMessage >= 1 && secondsPerMessage <= 2) {
            warningDiv.innerHTML = '⚠️ Be careful, it might get rate limited.';
        } else {
            warningDiv.innerHTML = '';
        }

        intervalId = setInterval(function () {
            if (!message) {
                sendMessage(webhookUrl);
            } else {
                sendMessageWithMessage(webhookUrl, message);
            }
        }, secondsPerMessage * 1000);

        startButton.disabled = true;
        stopButton.disabled = false;
    });

    stopButton.addEventListener("click", function () {
        clearInterval(intervalId);
        startButton.disabled = false;
        stopButton.disabled = true;
        warningDiv.innerHTML = '';
    });

    function sendMessage(webhookUrl) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: '' }),
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error sending message:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    }

    function sendMessageWithMessage(webhookUrl, message) {
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: message }),
        })
        .then(response => {
            if (!response.ok) {
                console.error('Error sending message:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    }
});
