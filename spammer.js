document.addEventListener("DOMContentLoaded", function () {
    const webhookUrlInput = document.getElementById("webhookUrl");
    const messageInput = document.getElementById("message");
    const secondsPerMessageInput = document.getElementById("secondsPerMessage");
    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");
    const warningDiv = document.getElementById("warningDiv");
    const logContainer = document.getElementById("logContainer");
    const form = document.getElementById("spammerForm");

    let intervalId;

    startButton.addEventListener("click", function (e) {
        e.preventDefault();
        const webhookUrl = webhookUrlInput.value;
        const message = messageInput.value;
        const secondsPerMessage = parseInt(secondsPerMessageInput.value);

        if (!webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
            warningDiv.innerHTML = '⚠️ Invalid webhook URL. Please enter a valid one.';
            startButton.classList.add("invalidUrl");
            stopButton.classList.remove("invalidUrl");
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
        }, (secondsPerMessage < 3 ? secondsPerMessage * 500 : secondsPerMessage * 1000));

        startButton.disabled = true;
        stopButton.disabled = false;
        startButton.classList.add("running");
        stopButton.classList.remove("running");

        logContainer.textContent = '';
    });

    stopButton.addEventListener("click", function () {
        clearInterval(intervalId);
        startButton.disabled = false;
        stopButton.disabled = true;
        startButton.classList.remove("running");
        stopButton.classList.add("running");
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
                if (response.status === 404) {
                    warningDiv.innerHTML = '⚠️ Invalid webhook URL. Please enter a valid one.';
                    startButton.classList.add("invalidUrl");
                    stopButton.classList.remove("invalidUrl");
                } else {
                    warningDiv.innerHTML = '⚠️ Error sending message: ' + response.statusText;
                }
                // Log the error
                logContainer.textContent += `Error sending message: ${response.statusText}\n`;
                if (response.status === 429) {
                    logContainer.textContent += `The API is being rate limited!\n`;
                }
            } else {
                // Log success
                logContainer.textContent += `Message sent successfully\n`;
            }
        })
        .catch(error => {
            warningDiv.innerHTML = '⚠️ Error sending message: ' + error.message;
            // Log the error
            logContainer.textContent += `Error sending message: ${error.message}\n`;
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
                if (response.status === 404) {
                    warningDiv.innerHTML = '⚠️ Invalid webhook URL. Please enter a valid one.';
                    startButton.classList.add("invalidUrl");
                    stopButton.classList.remove("invalidUrl");
                } else {
                    warningDiv.innerHTML = '⚠️ Error sending message: ' + response.statusText;
                }
                // Log the error
                logContainer.textContent += `Error sending message: ${response.statusText}\n`;
                if (response.status === 429) {
                    logContainer.textContent += `The API is being rate limited!\n`;
                }
            } else {
                // Log success
                logContainer.textContent += `Message sent successfully\n`;
            }
        })
        .catch(error => {
            warningDiv.innerHTML = '⚠️ Error sending message: ' + error.message;
            // Log the error
            logContainer.textContent += `Error sending message: ${error.message}\n`;
        });
    }
});
