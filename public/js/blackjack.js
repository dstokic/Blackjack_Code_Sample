//Run once broswer has loaded everything
window.onload = async function () {

    let user = sessionStorage.getItem("user");
    if(user == null){
        location.href = "http://localhost:3000"
    }

    deck = await shuffleDeck();

    // DOM object for the startModal
    var modal = document.getElementById("myModal");
    var playButton = document.getElementById("close");
    modal.style.display = "block";

    // 
    var betModal = document.getElementById("bet");
    var betbutton = document.getElementById("betPlaced");
    var betAmount = 0;

    let signupHeaders = new Headers;
    signupHeaders.append("Content-Type", "application/json");
    let userReq = new Request(`/users/${user}`, {
        method:'GET',
        headers: signupHeaders
    });
    let response = await fetch(userReq);
    let userInfo = await response.json();

    var currBal = userInfo.balance;
    document.getElementById("startBal").innerHTML = "Your balance is: " + currBal;

    // DOM objects for the endModal
    var endModal = document.getElementById("endModal");
    var playAgain = document.getElementById("again");
    var endRes = document.getElementById("endres");

    // DOM objects for the "Hit" and "Done" buttons
    var hitButton = document.getElementById("hit");
    var doneButton = document.getElementById("stay");
    var returnButton = document.getElementById("return");
    var return2 = document.getElementById("return2");

    // DOM objects for displaying player and dealer score
    var dScore = document.getElementById("dscore");
    var pScore = document.getElementById("pscore");

    // DOM objects for displaying player and dealer hands
    var dCards = document.getElementById("dcards");
    var pCards = document.getElementById("pcards");

    // DOM objects for displaying most recent card drawn
    var dRec = document.getElementById("drec");
    var pRec = document.getElementById("prec");

    // DOM objects for displaying the current standing
    var results = document.getElementById("results");
    var standings = document.getElementById("currstand");
    var updtRes = document.getElementById("updtRes");
    getScores();

    // Holds the current score for the player and dealer respectively
    var totalPlay = 0;
    var totalDeal = 0;

    // Arrays for holding the current player and dealer hands respectively
    var playerCards = [];
    var dealerCards = [];

    /**
     * When the user clicks the "Return to Casino" button, take them back to the home page
     */
    returnButton.onclick = function() {
        window.location.href = 'home.html';
    }

    /**
     * When the user clicks the "Return to Casino" button, take them back to the home page
     */
    return2.onclick = function() {
        window.location.href = 'home.html';
    }

    /**
     * When the user clicks the "Bet" button, switch to the bet screen
     */
    playButton.onclick = function() {
        modal.style.display = "none";
        betModal.style.display = "block";
    }

    /**
     * When the user clicks the "Bet" button, switch to the bet screen
     */
    playAgain.onclick = function() {
        endModal.style.display = "none";
        betModal.style.display = "block";
    }

    /**
     * Set the betting amount to the input value, and start the game.
     */
    betbutton.onclick = function() {
        betAmount = Number(document.getElementById("amountBet").value);
        betModal.style.display = "none";
        startGame();
    }

    /**
     * When the user clicks the "Hit" button, execute hitFunction()
     */
    hitButton.addEventListener("click", hitFunction);

    /**
     * When the user clicks the "Stay" button, execute stayFunction()
     */
    doneButton.addEventListener("click", stayFunction);

    /**
     * Get 6 shuffled decks of cards from he DeckOfCards API
     * @returns the response from the DeckOfCards API
     */
    async function shuffleDeck() {
        const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6");
        return response.json();
    }

    /**
     * Randomly draw a card from the deck
     * @param {*} deck Pass in the deck to use
     * @param {*} count Number of cards to draw (default to 1)
     * @returns the value of a card, the title of the card, and the card image
     */
    async function drawCard(deck, count = 1) {
        let response = await fetch(`https://www.deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=${count}`);
        let cardArr = await response.json();

        let card = cardArr.cards[0];
        let value = card.value;
        card.title = `${card.value} of ${card.suit}`;

        // Setting a numeric value for the face cards
        if(value == "JACK"){
            value = 10;
        } else if(value == "QUEEN") {
            value = 10;
        } else if(value == "KING") {
            value = 10;
        } else if(value == "ACE") {
            value = 11;
        }

        return [value, card.title, card.image];
    }

    /**
     * Update the dealer's score and cards
     */
    function updatePlayer(){
        pScore.innerHTML = `Score: ${totalPlay}`;
        pCards.innerHTML = `Cards: ${playerCards}`;
    }

    /**
     * Called when the user presses "hit"
     */
    function hitFunction() {
        drawCard(deck).then((cardValue) => {
            playerCards.push(cardValue[1]);

            if(Number(cardValue[0]) === 11) { // If the card drawn was an Ace
                if(totalPlay <= 10) { // If the player's hand won't bust with +11
                    totalPlay += Number(cardValue[0]);
                } else { // Otherwise use the value of 1
                    totalPlay += 1;
                }
            } else {
                totalPlay += Number(cardValue[0]);
            }

            pRec.src = `${cardValue[2]}`;
        });

        setTimeout(async () => {
            updatePlayer();

            if(totalPlay > 21) {
                clearBoard("You busted, dealer wins");
                let temp = Number(currBal) - Number(betAmount);
                await setUserBalance(temp);
            } 
        }, 500);

    }

    /**
     * The "Hit" function for the dealer
     * The main difference between this and the playerHitFunction is the hiding of the cards and score
     */
    async function dealerHitFunction() {
        drawCard(deck).then((cardValue) => {
            dealerCards.push(cardValue[1]);

            if(Number(cardValue[0]) === 11) { // If the card drawn was an Ace
                if(totalDeal <= 10) { // If the dealer's hand won't bust with +11
                    totalDeal += Number(cardValue[0]);
                } else { // Otherwise use the value of 1
                    totalDeal += 1;
                }
            } else {
                totalDeal += Number(cardValue[0]);
            }

            dRec.src = `${cardValue[2]}`;
            if(dealerCards.length === 1) {
                dRec.src = `${cardValue[2]}`;
            } else { // Only show the back of the card if we are beyond 1 card drawn
                dRec.src = "https://deckofcardsapi.com/static/img/back.png";
            }
        });

        if(dealerCards.length < 2) {
            dScore.innerHTML = `Score: ${totalDeal}`;
            dCards.innerHTML = `Cards: ${dealerCards}`;
        }

        if(totalDeal > 21) {
            clearBoard("Dealer busted, you win!!!");
            let temp = Number(currBal) + Number(betAmount);
            await setUserBalance(temp);
        }

    }

    /**
     * Update the dealer's score and cards
     */
    function updateDealer(){
        dScore.innerHTML = `Score: ${totalDeal}`;
        dCards.innerHTML = `Cards: ${dealerCards}`;
    }

    /**
     * Called when the user presses "Stay"
     */
    async function stayFunction() {
        updateDealer();

        while(totalDeal < 17) { // If the dealer's hand value is under 17, draw more
            await drawCard(deck).then((cardValue) => {
                dealerCards.push(cardValue[1]);
                totalDeal += Number(cardValue[0]);

                dRec.src=`${cardValue[2]}`;
            });
        }

        setTimeout(async () => { // Set timeout used to allow dealer score to be updated properly
            updateDealer();

            // Result of the game being determined
            if(totalDeal > totalPlay && totalDeal <= 21) {
                clearBoard("Dealer wins");
                let temp = Number(currBal) - Number(betAmount);
                await setUserBalance(temp);
            } else if(totalPlay > totalDeal || totalDeal > 21) {
                clearBoard("You win!!!");
                let temp = Number(currBal) + Number(betAmount);
                await setUserBalance(temp);
            } else {
                clearBoard("You push (it's a tie)");
            }
        }, 500);

    }

    /**
     * Display the endModal at the end of the game with the result and updated standings
     * @param {String} result Outcome of the game
     */
    function displayEnd(result) {
        endRes.innerHTML = `${result}`;
        startGame();
        endModal.style.display = "block";
    }


    /**
     * Draw the starting hands for the player and the dealer
     */
    function drawStart() { // Timeouts used to display cards individually
        setTimeout(() => {
            dealerHitFunction();
            updateDealer();
        }, 100)
        setTimeout(() => {
            dealerHitFunction();
        }, 600)

        setTimeout(() => {
            hitFunction();
            hitFunction();
        }, 1100)

        setTimeout(() => {
            updatePlayer();
        }, 1600)
    }


    /**
     * Reset the game once it has ended
     * @param {*} result The String result of the game
     */
    function clearBoard(result) {
        saveGameInDatabase(result);

        setTimeout(() => { // Set timeout to allow cards to populate correctly
            getScores();
            displayEnd(result);
        }, 500);
    }


    /**
     * Reset player and dealer hands, reset card score total to 0, reset images, reset displayed HTML
     * Update the game scores from the database
     */
    async function startGame() {
        playerCards = [];
        dealerCards = [];

        totalPlay = 0;
        totalDeal = 0;

        dRec.src = "";
        pRec.src = "";

        pScore.innerHTML = `Score: 0`;
        pCards.innerHTML = `Cards: `;

        dScore.innerHTML = `Score: 0`;
        dCards.innerHTML = `Cards: `;
        
        drawStart();
    }


    /**
     * Save the result of the game, and the hand and total of the player and dealer in the database
     * @param {*} result The String result of the game
     */
    function saveGameInDatabase(result) {

        const currGame = { // Hold the data of the ended game
            gameResult: result,
            user: user,
            playerHand: playerCards,
            playerScore: totalPlay,
            dealerHand: dealerCards,
            dealerScore: totalDeal
        }

        fetch('/games', { // POST the ended game into the database
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(currGame)
        })
        .then(resp => { 
            if (resp.status === 201) { // Game was successfully added to the table
                console.log("Game created successfully");
            } else { // There was an issue with the POST request
                console.log("There was an issues creating the game");
            }
        })
        .catch(error => console.error("Error creating the game", error));
    }


    /**
     * Get the game win totals from the MongoDB database
     */
    function getScores() {
        fetch('/games')
            .then(response => response.json())
            .then(async data => {
                playWins = 0;
                dealWins = 0;
                ties = 0;

                await data.map((item) => { // Go through and count all the results in the table
                    if((item.gameResult.includes("dealer wins") || item.gameResult.includes("Dealer wins")) && item.user === user) {
                        dealWins += 1;
                    } else if((item.gameResult.includes("you win")  || item.gameResult.includes("You win")) && item.user === user) {
                        playWins += 1;
                    } else if(item.user === user) {
                        ties += 1;
                    }
                });

                results.innerHTML = `Player Wins: ${playWins}, Dealer Wins: ${dealWins}, Ties: ${ties}`; // Updates the results on the start modal
                standings.innerHTML = `<strong>Player Wins:</strong> ${playWins}<br> <strong>Dealer Wins:</strong> ${dealWins}<br> <strong>Ties:</strong> ${ties}`; // Displays the results during the game
                updtRes.innerHTML = `Player Wins: ${playWins}, Dealer Wins: ${dealWins}, Ties: ${ties}`; // Updates the results on the end modal

            })
            .catch(error => console.error("Error reading games from routes", error))
    }

    async function setUserBalance(newValue) {
        await fetch(`/users/${user}/adjustbalance/${newValue}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
        });

        let signupHeaders = new Headers;
        signupHeaders.append("Content-Type", "application/json");
        let userReq = new Request(`/users/${user}`, {
            method:'GET',
            headers: signupHeaders
        });
        let response = await fetch(userReq);
        let userInfo = await response.json();

        document.getElementById("startBal").innerHTML = "Your balance is: " + userInfo.balance;
        currBal = userInfo.balance;
    }
};
