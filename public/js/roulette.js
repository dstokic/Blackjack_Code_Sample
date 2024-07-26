window.onload = async function () {
    let oddButton = document.getElementById('odd');
    let evenButton = document.getElementById('even');
    let lowButton = document.getElementById('low');
    let highButton = document.getElementById('high');
    let redButton = document.getElementById('red');
    let blackButton = document.getElementById('black');
    let greenButton = document.getElementById('green');
    let numberButton = document.getElementById('number');

    oddButton.onclick = async function () {
        $('#betmodal').modal('show');
        $('#betmodal').modal({
            onHidden: function () {
                sendBet('odd', document.getElementById('amount').value);
            }
        }
        );
    };

    evenButton.onclick = async function () {
        $('#betmodal').modal('show');
        $('#betmodal').modal({
            onHidden: function () {
                sendBet('even', document.getElementById('amount').value);
            }
        }
        );
    };

    lowButton.onclick = async function () {
        $('#betmodal').modal('show');
        $('#betmodal').modal({
            onHidden: function () {
                sendBet('low', document.getElementById('amount').value);
            }
        }
        );
    };
    highButton.onclick = async function () {
        $('#betmodal').modal('show');
        $('#betmodal').modal({
            onHidden: function () {
                sendBet('high', document.getElementById('amount').value);
            }
        }
        );
    };
    redButton.onclick = async function () {
        $('#betmodal').modal('show');
        $('#betmodal').modal({
            onHidden: function () {
                sendBet('red', document.getElementById('amount').value);
            }
        }
        );
    };
    blackButton.onclick = async function () {
        $('#betmodal').modal('show');
        $('#betmodal').modal({
            onHidden: function () {
                sendBet('black', document.getElementById('amount').value);
            }
        }
        );

    };
    greenButton.onclick = async function () {
        $('#betmodal').modal('show');
        $('#betmodal').modal({
            onHidden: function () {
                sendBet('green', document.getElementById('amount').value);
            }
        }
        );
    };
    numberButton.onkeydown = async function (event) {
        if (event.keyCode === 13) {
            $('#betmodal').modal('show');
            $('#betmodal').modal({
                onHidden: function () {
                    sendBet(document.getElementById('number').value, document.getElementById('amount').value);
                }
            }
            );
        }
    };

    async function sendBet(betType, wager) {
        const balance = await fetch(`http://localhost:3000/users/${sessionStorage.getItem('user')}`, {
            method: 'GET',
        }).then(response => response.json()).then(data => {
            return data.balance;
        });
        console.log(balance)
        console.log(wager)
        if (wager > balance) {
            alert('You do not have enough money to make this bet.');
        }
        sessionStorage.setItem('balance', balance - wager);
        const result = await fetch(`https://www.roulette.rip/api/play?bet=${betType}&wager=${wager}`, {
            method: 'GET',
            // mode: 'no-cors',
            headers: {
                // "Accept": 
                // "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                // "Access-Control-Allow-Origin": "*",
                // 'Content-Type': 'application/json',
                // 'Access-Control-Allow-Origin': 'http://localhost:3000',
                // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                // 'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                // "Content-Type": "application/json",
            },
        });
        console.log(result);
        const resultJson = await result.json();
        console.log(resultJson);
        if (resultJson.bet.win === 'true') {
            sessionStorage.setItem('balance', resultJson.bet.payout + balance);
            alert('You won!');
            sendToServer(resultJson.bet.payout + balance);
        }
        else if (resultJson.bet.win === 'false') {
            alert('You lost!');
            sendToServer(balance);
        }
        else {
            alert('Something went wrong!');
        }
    }

    async function sendToServer(newBal) {
        const result = await fetch(`http://localhost:3000/users/${sessionStorage.getItem('user')}/adjustbalance/${newBal}`, {
            method: 'PUT',
            body: JSON.stringify({ "balance": newBal }),
        });
        if (result.ok) {
            console.log("Balance updated");
        }
        else {
            console.log("Something went wrong");
        }
    }
}