let row_count;
let col_count;
let game_end = true;
let board_made = false;

function setup(){
    if($("#row_count").val().trim()=="" || $("#column_count").val().trim()==""){
        alert("Make sure to submit both a row and column count!");}
    else{     
        row_count = parseInt($("#row_count").val().trim());
        col_count = parseInt($("#column_count").val().trim());
        $.get('setup.php', 
        { row_count, col_count }, 
        setBoardTiles, 
        'json');
    }  
}

function setBoardTiles(data){
    let game_board;
    if (!board_made){
        //make a board container
        game_board = $('<div id="game_board"></div>');
        $('.main-container').append(game_board);
        board_made = true;
    }
    else{
        //get and clear out the existing game board
        game_board = $("#game_board")
        game_board.empty();
    }
    let box_count = 0;
    //make the boxes
    for (let r = 0; r < row_count; r++) {
        const $row = $('<div class="row"></div>');
        for (let c = 0; c < col_count; c++) {
            //check if box is assigned to be on or off
            let state = Object.values(data[box_count])[0];
            console.log(state);
            let $square;
            if (state=="on"){
                $square = $('<button class="on_box"></button>').attr('id', box_count).on("click", function () {handleSwitch();});
            }
            else{
                $square = $('<button class="off_box"></button>').attr('id', box_count).on("click", function () {handleSwitch();});
            }
            $row.append($square);
            box_count++;
        }
        $(game_board).append($row);
    }
    game_end = false; 
    $('.main-container').append(game_board);
}

function handleSwitch(){
    //do not let buttons be toggled if the game has ended
    if (game_end){
        return;
    }
    let box = parseInt(event.target.id);
    //put coordinates of the 4 corresponding boxes into an array, and add the current box too
    let boxNumbers = [(box - col_count),(box + col_count),(box - 1),(box + 1),box];
    //loop through 4 neighboring boxes and change their classes
    boxNumbers.forEach(function (box_num){
    if (box_num>=0 && box_num<(row_count*col_count)){
        let neighbor = $('#' + box_num);
        //check if the box to the right is in the next row
        if ( (box_num == (box+1)) && (box_num % col_count == 0)){
            //do nothing
        }
        //check if the box to the left is in the previous row
        else if((box_num == (box-1))&& (box % col_count==0)){
            //do nothing
        }
        //otherwise, flip the boxes
        else if (neighbor.hasClass("on_box")){
            neighbor.removeClass("on_box");
            neighbor.addClass("off_box");
        }
        else{
            neighbor.removeClass("off_box");
            neighbor.addClass("on_box");
        }
    }
});
    if (checkGameEnd()){
        resetBoard();
    }
}

function checkGameEnd(){
    let total = row_count * col_count;
    for (let x = 0; x < total; x++) {
        let box = $('#' +x);
        if (box.hasClass("on_box")){
            return false;
        }
    }
    return true;
}

function resetBoard(){
    game_end = true;
    $("#form").remove();
    const container = $('<div class"d-flex justify-content-center mt-3">');
    const message = $('<div id="win-message" class="text-center my-4"><h2>You won!</h2>');
    const button =$('<button id="play-again" class="btn btn-primary">Play Again</button>');

    //when the new button gets clicked, regenerate the same form I had earlier
    button.on('click', function(){
    $('.main-container').empty();
    $('.main-container').append(`
        <form id="form" class="container mt-4">
        <div class="row">
            <div class="col-12 mb-3">
            <label for="row_count" class="form-label">Enter your number of rows:</label>
            <input type="number" class="form-control" id="row_count">
            </div>
            <div class="col-12 mb-3">
            <label for="column_count" class="form-label">Enter your number of columns:</label>
            <input type="number" class="form-control" id="column_count">
            </div>
            <div class="col-12">
            <button type="button" onclick="setup();" class="btn btn-primary w-100">Start Game</button>
            </div>
        </div>
        </form>
    `);
    });
    //add starting screen elements back to the DOM
    $('.main-container').prepend(container);
    $(container).append(message);
    $(container).append(button);
}