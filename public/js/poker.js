/*
This file contains the code for Poker
This is for Texas Hold 'Em
*/

//Value Tracker
currentValues = {
    deck_id: null,
    finalCard: false,
    highestBet: 0,
    betPool: 0,
    ready: false,
    round: 1,
    communityCards: {
        current: [null, null, null, null, null],
        stage: 0,
    },
    p1: {
        current: [null, null],
        status: 0,
        balance: 100,
        fold: false,
        bet: 0,
        hand: null,
    },
    p2: {
        current: [null, null],
        status: 0,
        balance: 100,
        fold: false,
        bet: 0,
        hand: null,

    },
    p3: {
        current: [null, null],
        status: 0,
        balance: 100,
        fold: false,
        bet: 0,
        hand: null,
    },
    player: {
        current: [null, null],
        status: 0,
        balance: null,
        fold: false,
        bet: 0,
        hand: null,
    },
}
let user = sessionStorage.getItem("user");

let allReady

/**
 * Sets Up game
 * Gets a new deck of cards and deals 2 cards to the player
 */
const initialize = async () => {
    console.log("Entering initalize")
    //uses deck of cards api to get a new deck
    const {deck_id} = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1").then(res => res.json())
    //assigns the new deck id to currentValues.deck_id
    currentValues.deck_id = deck_id
    console.log("draw")
    //draws 2 cards for the player
    await draw('player', 2)
    await draw('p1', 2)
    await draw('p2', 2)
    await draw('p3', 2)

    console.log("end initialize")

}

//async (we are making a request)
/**
 * Draws a card
 * @param {*} person the player you want to draw a card for
 * @param {*} count the number of cards you want to draw
 */
const draw = async(person, count) => {
    return new Promise(async (done) => {
        console.log("enter draw")
        //uses deck of cards api to draw a card
        const {cards} = await fetch(`https://www.deckofcardsapi.com/api/deck/${currentValues.deck_id}/draw/?count=${count}`).then(res => res.json())
        //for each card drawn, adds it to the player
        cards.forEach(card => {
            newCard(person, card)
        })
        update() //calls update function
        console.log("end of draw")
        done()
    })
};

//function to add a new card to a person
/**
 * 
 * @param {*} person Player you want to add the card to
 * @param {*} card The card that is being delt to the player
 */
const newCard = (person, card) => {
    console.log('Adding new card for:', person);
    //chekcs if the first element is null
    
    if (currentValues[person].current[0] === null){
        currentValues[person].current.splice(0,1)
    }
    //pushes the card info to the person
   //currentValues[person].current.push(card.code)
   currentValues[person].current.push(card.code)
}

//updates everything --> updates all images and text
/**
 * Updates Everything on Screen! Updates all card images and text
 */
const update = () => {
    console.log("enter update")

    //updates the cards, balance, bet, and option for P1 
    const p1Cards = document.getElementById("p1Cards")
    const p1Balance = document.getElementById("p1Balance")
    const p1Bet = document.getElementById("p1Bet")
    const p1Option = document.getElementById("p1Option")

    //updates the cards, balance, bet, and option for P2 
    const p2Cards = document.getElementById("p2Cards")
    const p2Balance = document.getElementById("p2Balance")
    const p2Bet = document.getElementById("p2Bet")
    const p2Option = document.getElementById("p2Option")


    //updates the cards, balance, bet, and option for P3
    const p3Cards = document.getElementById("p3Cards")
    const p3Balance = document.getElementById("p3Balance")
    const p3Bet = document.getElementById("p3Bet")
    const p3Option = document.getElementById("p3Option")

    //updates the cards, balance, bet, and option for player
    const playerCards = document.getElementById("playerCards")
    const playerBalance = document.getElementById("playerBalance")
    const playerBet = document.getElementById("playerBet")
    const playerOption = document.getElementById("playerOption")

    //updates the community cards
    const communityCards = document.getElementById("cCards")

    // Clearcards
    p1Cards.innerHTML = '';
    p2Cards.innerHTML = '';
    p3Cards.innerHTML = '';
    playerCards.innerHTML = '';
    communityCards.innerHTML ='';


    //displays the current balance
    p1Balance.innerHTML = `Balance: ${currentValues.p1.balance}`;
    p2Balance.innerHTML = `Balance: ${currentValues.p2.balance}`;
    p3Balance.innerHTML = `Balance: ${currentValues.p3.balance}`;
    playerBalance.innerHTML = `Balance: ${currentValues.player.balance}`;

    highestBet.innerHTML = `Highest Bet: ${currentValues.highestBet}`;

    //displays the bet
    if(!currentValues.p1.fold){
        p1Bet.innerHTML = `Bet: ${currentValues.p1.bet}`;
    } else {
        p1Bet.innerHTML = `Folded`;
    }
    if(!currentValues.p2.fold){
        p2Bet.innerHTML = `Bet: ${currentValues.p2.bet}`;
    } else {
        p2Bet.innerHTML = `Folded`;
    }
    if(!currentValues.p3.fold){
        p3Bet.innerHTML = `Bet: ${currentValues.p3.bet}`;
    } else {
        p3Bet.innerHTML = `Folded`;
    }
    if(!currentValues.player.fold){
        playerBet.innerHTML = `Bet: ${currentValues.player.bet}`;
    } else {
        playerBet.innerHTML = `Folded`;
    }


    if(currentValues.finalCard){
        //set card images for p1
        currentValues.p1.current.forEach(card => {
            const cardImg = document.createElement("img")
            const src = card === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png" : `https://deckofcardsapi.com/static/img/${card}.png`
            cardImg.setAttribute("src", src)
            p1Cards.appendChild(cardImg)
        })


        //sets card images for p2
        currentValues.p2.current.forEach(card => {
            const cardImg = document.createElement("img")
            const src = card === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png" : `https://deckofcardsapi.com/static/img/${card}.png`
            cardImg.setAttribute("src", src)
            p2Cards.appendChild(cardImg)
        })


        //set card images for p3
        currentValues.p3.current.forEach(card => {
            const cardImg = document.createElement("img")
            const src = card === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png" : `https://deckofcardsapi.com/static/img/${card}.png`
            cardImg.setAttribute("src", src)
            p3Cards.appendChild(cardImg)
        })


    } else {
        //set card images for p1
        currentValues.p1.current.forEach(card => {
            const cardImg = document.createElement("img")
            const src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png";
            cardImg.setAttribute("src", src)
            p1Cards.appendChild(cardImg)
        })


        //sets card images for p2
        currentValues.p2.current.forEach(card => {
            const cardImg = document.createElement("img")
            const src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png";
            cardImg.setAttribute("src", src)
            p2Cards.appendChild(cardImg)
        })


        //set card images for p3
        currentValues.p3.current.forEach(card => {
            const cardImg = document.createElement("img")
            const src = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png";
            cardImg.setAttribute("src", src)
            p3Cards.appendChild(cardImg)
        })

    }

    //sets card image for community cards
    currentValues.communityCards.current.forEach(card => {
        const cardImg = document.createElement("img")
        const src = card === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png" : `https://deckofcardsapi.com/static/img/${card}.png`
        cardImg.setAttribute("src", src)
        communityCards.appendChild(cardImg)
    })

    //sets card images for player 
    currentValues.player.current.forEach(card => {
        const cardImg = document.createElement("img")
        const src = card === null ? "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/1200px-Card_back_01.svg.png" : `https://deckofcardsapi.com/static/img/${card}.png`
        cardImg.setAttribute("src", src)
        playerCards.appendChild(cardImg)
    })



    console.log("end of update")
}


/**
 * update balance
 */
const updateBalance = async () =>{
    await fetch(`/users/${user}/adjustbalance/${currentValues.player.balance}`, {
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
    console.log("userInfo",userInfo)
    currentValues.player.balance = userInfo.balance;
}
/**
 * Plays Game! 
 * Calls all game playing functions in the correct order
 */
const playGame = async () => {
    //starts game
    refreshRound()
    updateBalance()
    await initialize()
    console.log("starting round 1 betting")
    console.log("Round: ",currentValues.round)
    //round 1
    await betting()
    update()
    refreshRound()
    //round 2
    currentValues.round += 1
    await draw('communityCards', 3)
    console.log("starting round 2 betting")
    console.log("Round: ",currentValues.round)
    await betting()
    update()
    refreshRound()
    //round 3
    currentValues.round += 1
    await draw('communityCards', 1)
    console.log("Round: ",currentValues.round)
    await betting()
    update()
    refreshRound()
    //round 4
    currentValues.round += 1
    await draw('communityCards', 1)
    console.log("Round: ",currentValues.round)
    await betting()
    update()
    currentValues.round += 1
    //Game Ends --> winner is calculated
    endGame()

}

/**
 * 
 * @param {*} time time in ms desired 
 * @returns has a wait time -- used for computer turns
 */
const wait = (time) => {
    //uses a promise to set up a wait
    return new Promise(done => setTimeout(done, time) )
}

/**
 * Does a betting round
 * Has player take their turn, then each computer player takes their turn
 * Is recursive, until it is ready for the next round
 */
const betting =  async () => {
    console.log("entering betting")
    //Real Player's Turn
    await realPlayerTurn()
    updateBalance()

    //Goes through all computer players -- to have all of them take their turn
    const compPlayers = ['p1', 'p2', 'p3']
    for(compPlayer of compPlayers) {
        //if a player folded, they are skipped
        if(currentValues[compPlayer].fold){
            await wait (500)
        } else {
            //If a player is still in, their turn is taken
            await wait(2500)
            await compPlayerTurn(compPlayer)
        }
    }

    //calls checkReady --> to see if the game can move on to the next round or if more betting is needed 
    await checkReady()
    if (!currentValues.ready){
        //calls betting again
        console.log("not READY - in betting")
        await betting()
    }


    console.log("leaving betting")
}


/**
 * Call this to end the game
 * It should be called after all round have happened.
 * It will calculate the winner using the pokersolver library and then display it
 */
const endGame = async () => {
    console.log("Entering EndGame")
    currentValues.finalCard = true
    //array of ll players
    const allPeople = ['p1', 'p2', 'p3', 'player']
    //array of all computer players
    const allCompPlayers = ['p1', 'p2', 'p3']
    //array to store all computer players that are still in
    const inCompPlayers = []
    //array to store all players that are still in
    const inPlayers = []

    //adds to an array with all players still in
    allPeople.forEach(person => {
        if(!currentValues[person].fold){
            inPlayers.push(person)
        }
    })
    console.log("All In Players",inPlayers)
    //adds to an array with all computer players still in
    allCompPlayers.forEach(person => {
        if(!currentValues[person].fold){
            inCompPlayers.push(person)
        }
    })
    console.log("In Computer Players",inCompPlayers)

    //draws cards for the computer players that are still in
    inCompPlayers.forEach(async person => {
        await draw(person, 2)
    })
    //variables for solved hands
    let playerSolvedHand
    let p1SolvedHand
    let p2SolvedHand
    let p3SolvedHand

    let handTitle

    const solvedHands = []


    //solves the hand of each player
    inPlayers.forEach(person => {
        //puts the community cards into the communityCard var
        const communityCards = currentValues.communityCards.current
        console.log("Community Cards: ", communityCards)
        //puts the player's cards in the playerCards var 
        const playerCards = currentValues[person].current
        console.log(person," Cards: ", playerCards)
        //combines the community cards and the player cards
        const cardsToSolve = communityCards.concat(playerCards);
        console.log("Hand to Solve ", cardsToSolve)
        //Solves the hands
        if(person == 'p1'){
            p1SolvedHand = Hand.solve(cardsToSolve)
            handTitle = p1SolvedHand.name
            solvedHands.push(p1SolvedHand)
        } else if (person == 'player'){
            playerSolvedHand = Hand.solve(cardsToSolve)
            handTitle = playerSolvedHand.name
            solvedHands.push(playerSolvedHand)
        } else if (person == 'p2'){
            p2SolvedHand = Hand.solve(cardsToSolve)
            handTitle = p2SolvedHand.name
            solvedHands.push(p2SolvedHand)
        } else if (person == 'p3'){
            p3SolvedHand = Hand.solve(cardsToSolve)
            handTitle = p3SolvedHand.name
            solvedHands.push(p3SolvedHand)
        }
        //assigns the type of hand to currentValues[person].hand
        currentValues[person].hand = handTitle
        console.log(person, " hand title ", currentValues[person].hand)

        //const hand1 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', '3c', 'Kd'])
        //const hand2 = Hand.solve(['Ad', 'As', 'Jc', 'Th', '2d', 'Qs', 'Qd'])
        //var winner = Hand.winners([hand1, hand2]); // hand2
    })

    //assigns the winning hand type to handWinner
    var handWinner = Hand.winners(solvedHands)
    console.log("Hand Winner: ", handWinner)
    const stringHandWinner = handWinner[0]
    console.log("element 0 of hand winner: ", stringHandWinner)
    const playerWinHand = stringHandWinner.name
    console.log("playerWinHand ", playerWinHand)
    let playerWinner
    //assigns the winning player to playerWinner
    allPeople.forEach(person => {
        if(playerWinHand === currentValues[person].hand){
            playerWinner = person
        }
    })
    console.log(playerWinner)
    currentValues[playerWinner].balance += currentValues.betPool
    updateBalance()

    //Clears Screen
    beginScreen()

    //Hides start button
    //const startButton = document.getElementById("startButton")
    //startButton.style.display = 'hidden'
    //displays the winner element
    const winner = document.getElementById("winner")
    winner.style.visibility ='visible'
    winner.style.display = 'block'

    //updates the winner element to display the winning player's name
    winner.innerHTML = `Winner: ${playerWinner}`
    console.log("winner :", playerWinner)
    await wait(2000)

    //shows the play again button
    const playAgain = document.getElementById("playAgain")
    playAgain.style.display = 'block'
}


//comp player's turn
/**
 * Does one betting turn for a computer player
 * @param {*} person The player whos turn it is
 * @returns 
 */
const compPlayerTurn = (person) => {
    console.log("enting compPlayerTurn")
    //hides the buttons
    hideButtons()
    //sets up a promise that will return when the player finishes its turn
    return new Promise((done) => {
        //if the player already folded, it skipps their turn
        if (currentValues[person].fold){
            console.log("computer - already fold")
            done()
        //if the players bet is not equal to the highest bet, they can call, raise, or fold
        } else if (currentValues[person].bet != currentValues.highestBet){
            num = Math.floor(Math.random() * 7);
            console.log("num =",num)
            //random pick call, raise, fold
            if(num == 0 || num == 1 || num == 2){
                call(person)
                choice.innerHTML = `${person}: Call (Increased their bet by 10)`;
                update()
                done()
            } else if (num == 3 || num == 4 || num == 5){
                raise(person)
                choice.innerHTML = `${person}: Raise (Increased their bet by 20)`;
                update()
                done()
            } else {
                fold(person)
                choice.innerHTML = `${person}: Fold`;
                update()
                done()
            }

        } else {
            num = Math.floor(Math.random() * 7);
            console.log("num =",num)
            //random pick check, bet, fold
            if(num == 0 || num == 1 || num == 2){
                check(person)
                choice.innerHTML = `${person}: Check`;
                update()
                done()
            } else if (num == 3 || num == 4 || num == 5){
                bet(person)
                choice.innerHTML = `${person}: Bet (Increased their bet by 10)`;
                update()
                done()
            } else {
                fold(person)
                choice.innerHTML = `${person}: Fold`;
                update()
                done()
            }
        }
        console.log("exit compPlayerTurn")
    })

}

let playerDone;

//player chooses option
/**
 * For when it is the players turn
 * @returns 
 */
const realPlayerTurn = () => {
    //makes the choice buttons visable
    showButtons()
    console.log("entering realPlayerTurn")
    //tells the player it is their turn
    choice.innerHTML = `Your Turn!`;
    //new promise that will not be done until the player made their choice
    return new Promise((done) => {
        console.log("entering realPlayerTurn Promise ")
        playerDone = done
        //displays the correct buttons (only ones that can be the option)
        displayCorrectButtons()
        currentValues.player.status += 1
        //if the player is already folded, they don't have a turn
        if (currentValues.player.fold){
            console.log("player - already fold")
            if (typeof playerDone === 'function') {
                playerDone()
            }        
        }

        console.log("leaving realPlayerTurn")

    })

}

/**
 * Sets up the option buttons
 * Sets up the event listners 
 */
const setUpButtons = () => {
    console.log("Set up Buttons Start")

        //check
        //if the check button is pressed
        document.getElementById('check').addEventListener('click', function(){
            console.log("player - check")
            //calls check on the player
            check('player')
            //updates
            update()
            if (typeof playerDone === 'function') {
                playerDone()
            }
        })

        //bet
        //if the bet button is pressed
        document.getElementById('bet').addEventListener('click', function(){
            console.log("player - bet")

            //calls bet for the player
            bet('player')
            update()
            if (typeof playerDone === 'function') {
                playerDone()
            }
        })

        //fold
        //if the fold button is pressed
        document.getElementById('fold').addEventListener('click', function(){
            console.log("player - fold")

            fold('player')
            update()
            if (typeof playerDone === 'function') {
                playerDone()
            }
        })

        //raise
        //if the raise button is pressed
        document.getElementById('raise').addEventListener('click', function(){
            console.log("player - raise")

            raise('player')
            update()
            if (typeof playerDone === 'function') {
                playerDone()
            }
        })

        //call
        //if the call button is pressed
        document.getElementById('call').addEventListener('click', function(){
            console.log("player - call")

            call('player')
            update()
            if (typeof playerDone === 'function') {
                playerDone()
            }
        })

        console.log("Set up Buttons End")

}

/**
 * Performs bet for the player who choose it
 * @param {*} person player who choose bet
 */
const bet = (person) => {
    currentValues[person].bet += 10
    currentValues[person].balance -= 10
    currentValues.betPool += 10
    currentValues.highestBet += 10
    update()
}

/**
 * Does check for the player who choose it
 * @param {*} person player who choose check
 */
const check = (person) => {
    update()

}

/**
 * Does fold for the player who choose it
 * @param {*} person player who choose fold
 */
const fold = (person) => {
    currentValues[person].bet = 0
    currentValues[person].fold = true
    update()
}

/**
 * Does raise for the player who choose it
 * @param {*} person player who choose raise
 */
const raise = (person) => {
    callAmount = currentValues.highestBet - currentValues[person].bet
    raiseAmount = callAmount + 10
    currentValues[person].bet += raiseAmount
    currentValues[person].balance -= raiseAmount
    currentValues.betPool += raiseAmount
    currentValues.highestBet += 10
    update()
}

/**
 * Does call for the player who choose it
 * @param {*} person player who choose call
 */
const call = (person) => {
    callAmount = currentValues.highestBet - currentValues[person].bet
    currentValues[person].bet += callAmount
    currentValues[person].balance -= callAmount
    currentValues.betPool += callAmount
    update()
}

/**
 * Checks if the game can move on to the next round
 * @returns 
 */
const checkReady = ()=> {
    //new promise that returns after checking if all the players are ready
    return new Promise((done) => {
        people = ['p1', 'p2', 'p3', 'player']
        console.log("entering checkReady")

        currentValues.ready = true
        people.forEach(person => {
            //if the player has not folded
            if(!currentValues[person].fold){
                //if the player's bet is not the same at the current highest bet --> player not ready
                if(currentValues[person].bet != currentValues.highestBet){
                    console.log("a player is not ready")
                    //allReady = false
                    currentValues.ready = false

                    //return false;
                }

            }

        })
        if(currentValues.player.status == 2){
            currentValues.ready = true
        }
        console.log(currentValues.player.bet)
        done()

        //return true
    })
}


/**
 * Hides all the option buttons
 * This is for when it is not the players turn (so they don't select somthing when they aren't supposed to)
 */
const hideButtons= () => {
    const preBetButtons = document.getElementById("preBetButtons")
    const postBetButtons = document.getElementById("postBetButtons")
    console.log("in hide buttons")
    //hides the buttons
    preBetButtons.style.display = 'none';
    postBetButtons.style.display = 'none';
}

/**
 * Shows all the buttons
 * The pre bet buttons and the post bet buttons
 */
const showButtons= () => {
    const preBetButtons = document.getElementById("preBetButtons")
    const postBetButtons = document.getElementById("postBetButtons")
    preBetButtons.style.display = 'block';
    postBetButtons.style.display = 'block';
}

/**
 * Only shows the correct buttons
 * Either pre or post bet or no buttons
 */
const displayCorrectButtons = () => {
    const preBetButtons = document.getElementById("preBetButtons")
    const postBetButtons = document.getElementById("postBetButtons")

    //if the player folded -- no buttons are shown
    if (currentValues.player.fold){
        preBetButtons.style.display = 'none';
        postBetButtons.style.display = 'none';

    //if the player's bet is equal to the curent highest bet --> the pre bet buttons are shown
    } else if (currentValues.player.bet == currentValues.highestBet) {
        preBetButtons.style.display = 'block';
        postBetButtons.style.display = 'none';
    } else {
        //the post bet buttons are shown
        preBetButtons.style.display = 'none';
        postBetButtons.style.display = 'block';
    }
}
  
/**
 * Refreshes the values between betting rounds
 * Resets the play rady status and the general ready status
 */
const refreshRound = () => {
    console.log("entering refresh round")
    currentValues.player.status = 0

    currentValues.ready = false
    console.log("end of refresh round")
}

/**
 * Resests the values and updates the game
 * This is used between games (not betting rounds)
 */
const refreshGame = () => {
    //resets the values
    currentValues = {
        deck_id: null,
        highestBet: 0,
        finalCard: false,
        betPool: 0,
        ready: false,
        round: 1,
        communityCards: {
            current: [null, null, null, null, null],
            stage: 0,
        },
        p1: {
            current: [null, null],
            status: 0,
            balance: 100,
            fold: false,
            bet: 0,
            hand: null,
        },
        p2: {
            current: [null, null],
            status: 0,
            balance: 100,
            fold: false,
            bet: 0,
            hand: null,

        },
        p3: {
            current: [null, null],
            status: 0,
            balance: 100,
            fold: false,
            bet: 0,
            hand: null,
        },
        player: {
            current: [null, null],
            status: 0,
            balance: null,
            fold: false,
            bet: 0,
            hand: null,
        },
    }
    update()

}


//hides everything besides the start button
/**
 * Hides all game elements
 * Only displays the start button
 */
const beginScreen = () => {
    const choice = document.getElementById("choice")
    choice.style.visibility = 'hidden'
    const playerBalance = document.getElementById("playerBalance")
    playerBalance.style.visibility = 'hidden'
    const playerBet = document.getElementById("playerBet")
    playerBet.style.visibility = 'hidden'
    const comPlayerCont = document.getElementById("comPlayerCont")
    const highBet = document.getElementById("highBet")
    preBetButtons.style.visibility = 'hidden'
    postBetButtons.style.visibility = 'hidden'
    comPlayerCont.style.visibility = 'hidden'
    highBet.style.visibility = 'hidden'
    winner.style.visibility = 'hidden'
}

//shows everything needed for game
/**
 * Shows all game elements needed for the game 
 */
const gameScreen = () => {
    choice.style.visibility = 'visible'
    playerBet.style.visibility = 'visible'
    playerBalance.style.visibility = 'visible'
    preBetButtons.style.visibility = 'visible'
    postBetButtons.style.visibility = 'visible'
    comPlayerCont.style.visibility = 'visible'
    highBet.style.visibility = 'visible'
}



/**
 * Window Onload function
 */
window.onload = async function () {

    //Sets up buttons
    const startButton = document.getElementById("startButton")
    const preBetButtons = document.getElementById("preBetButtons")
    const postBetButtons = document.getElementById("postBetButtons")
    const playAgain = document.getElementById("playAgain")
    const winner = document.getElementById("winner")
    //hides select elements
    playAgain.style.display = 'none'
    winner.style.display = 'none'

    console.log("enter onload")

    
    //document.getElementById("startBal").innerHTML = "Your balance is: " + currBal;

    //sets up the buttons
    setUpButtons()
    //sets it to the begin screen
    beginScreen()
    
    //on event listner for the start button
    document.getElementById('startButton').addEventListener('click', function() {
        const playerBalance = document.getElementById("playerBalance")
        playerBalance.style.visibility = 'visable'
        playerBalance.style.display = 'block'
        console.log("start button clicked")
        //refreshes the game
        refreshGame()
        //hides the start button
        this.style.display = 'none'
        //sets it to the game screen
        gameScreen()
        //starts the game
        playGame()
    })

    //on event listner for the play again button
    document.getElementById('playAgain').addEventListener('click', function() {
        //refreshs the game
        refreshGame()
        //starts the game
        playGame()
        //hides the play again button
        playAgain.style.display = 'none'
        const winner = document.getElementById("winner")
        //hides the winner 
        winner.style.display='none'
        //sets up the game screen
        gameScreen()

    })
}
