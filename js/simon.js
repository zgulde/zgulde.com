"use strict";
$(document).ready(function(){

    //array of strings of color names eg 'red'
    //pushed to in addRandomColor
    var colorsLit = [];

    var colorsIndex = 0; //used in checkClicks, startNewRound, endGame

    var lightUpSpeed = 350;

    var lossSound = new Audio('../media/mario_game_over.mp3');

    //'C 2','C#2',...'C 5' all sharps, no flats
    var musicalNotes = {
        "C 2": new Audio('../media/C2.mp3'),
        "C#2": new Audio('../media/CS2.mp3'),
        "D 2": new Audio('../media/D2.mp3'),
        "D#2": new Audio('../media/DS2.mp3'),
        "E 2": new Audio('../media/E2.mp3'),
        "F 2": new Audio('../media/F2.mp3'),
        "F#2": new Audio('../media/FS2.mp3'),
        "G 2": new Audio('../media/G2.mp3'),
        "G#2": new Audio('../media/GS2.mp3'),
        "A 2": new Audio('../media/A2.mp3'),
        "A#2": new Audio('../media/AS2.mp3'),
        "B 2": new Audio('../media/B2.mp3'),
        "C 3": new Audio('../media/C3.mp3'),
        "C#3": new Audio('../media/CS3.mp3'),
        "D 3": new Audio('../media/D3.mp3'),
        "D#3": new Audio('../media/DS3.mp3'),
        "E 3": new Audio('../media/E3.mp3'),
        "F 3": new Audio('../media/F3.mp3'),
        "F#3": new Audio('../media/FS3.mp3'),
        "G 3": new Audio('../media/G3.mp3'),
        "G#3": new Audio('../media/GS3.mp3'),
        "A 3": new Audio('../media/A3.mp3'),
        "A#3": new Audio('../media/AS3.mp3'),
        "B 3": new Audio('../media/B3.mp3'),
        "C 4": new Audio('../media/C4.mp3'),
        "C#4": new Audio('../media/CS4.mp3'),
        "D 4": new Audio('../media/D4.mp3'),
        "D#4": new Audio('../media/DS4.mp3'),
        "E 4": new Audio('../media/E4.mp3'),
        "F 4": new Audio('../media/F4.mp3'),
        "F#4": new Audio('../media/FS4.mp3'),
        "G 4": new Audio('../media/G4.mp3'),
        "G#4": new Audio('../media/GS4.mp3'),
        "A 4": new Audio('../media/A4.mp3'),
        "A#4": new Audio('../media/AS4.mp3'),
        "B 4": new Audio('../media/B4.mp3'),
        "C 5": new Audio('../media/C5.mp3')
    }
    
    //set after selects are built by changeAndUpdateSounds
    //changed in the select event handlers
    //returned from getSoundFromColorName
    var blueSound, yellowSound, redSound, greenSound; 

    var spinSpeed; // set in startGame, decremented and used in startNewRound

    //set in shakeBodyRandomly and fadeGameRandomly, respectively
    //cleared in endGame
    var shakingInterval; 
    var fadingInterval;


    function randomNumber(min,max){
        return Math.floor( (Math.random() * (max-min+1) + min) );
    }

    function changeAndUpdateSounds(blueNoteName,yellowNoteName,redNoteName,greenNoteName){
        blueSound = musicalNotes[blueNoteName];
        $('#change-blue-note').val(blueNoteName);

        yellowSound = musicalNotes[yellowNoteName];
        $('#change-yellow-note').val(yellowNoteName);
        
        redSound = musicalNotes[redNoteName];
        $('#change-red-note').val(redNoteName);
        
        greenSound = musicalNotes[greenNoteName];
        $('#change-green-note').val(greenNoteName);
    }

    function shakeBodyRandomly () {
        shakingInterval = setInterval(function(){
            if(randomNumber(1,5) === 1){
                $('body').css('transform','rotate(15deg)');
                setTimeout( function(){
                    $('body').css('transform','rotate(0)');
                }, 300);
            }
        },1500);
    }

    function fadeGameRandomly () {
        fadingInterval = setInterval(function(){
            if(randomNumber(1,5) === 1){
                $('#game').css('opacity','0');
                setTimeout(function(){
                    $('#game').css('opacity','1');
                },300);
            }
        },1500);
    }

    function playThenPause (sound,duration) {
        if(!duration) duration = 300;
        sound.play();
        setTimeout( function(){
            sound.pause();
            sound.load();
        }, duration);
    }

    function getSoundFromColorName (color) {
        switch (color){
            case "blue":
                return blueSound;
                break;
            case "yellow":
                return yellowSound;
                break;
            case "red":
                return redSound;
                break;
            case "green":
                return greenSound;
                break;
        }
    }

    //also plays the coresponding sound
    function lightUp($color,duration){
        var sound = getSoundFromColorName($color.attr('id'));

        if(!duration) duration = lightUpSpeed;
        
        playThenPause(sound);
        $color.addClass('light-up');
        $color.addClass($color.attr('id') + '-lit');
        
        setTimeout( function(){
            $color.removeClass('light-up')
            $color.removeClass($color.attr('id') + '-lit');
        }, duration);
    }

    function lightUpAllInSequence () {
        lightUp($('#blue'),500);
        setTimeout( function(){ lightUp($('#yellow'),500); }, 500);
        setTimeout( function(){ lightUp($('#red'),500); }, 1000);
        setTimeout( function(){ lightUp($('#green'),500); }, 1500);
    }

    //also reattaches the checkClicks event handler to the 
    //color btn divs
    function showCurrentSequence () {
        var i = 0;
        var showingSequence = setInterval(function(){
            lightUp( $('#'+colorsLit[i]) ); //convert color name to jquery selector for that div
            i++;
            if(i === colorsLit.length){
                $('.color-btn').on('click',checkClicks);    
                clearInterval(showingSequence);
            } 
        },lightUpSpeed*2)
    }

    function addRandomColor () {
        var colors = ['green','red','yellow','blue']
        var colorToAdd = colors[randomNumber(0,3)];
        colorsLit.push(colorToAdd);
    }

    //calls startNewRound or endGame
    //also adds the class to animate the game flipping
    function checkClicks () {
        if ($(this).attr('id') === colorsLit[colorsIndex]) {
            colorsIndex += 1;
            if (colorsIndex === colorsLit.length) {
                startNewRound();
                $('#game').addClass('flip');
                setTimeout( function(){ $('#game').removeClass('flip'); }, 300);
            }
        } else {
            colorsIndex = 0;
            endGame();
        }
    }

    //decrements spinSpeed and resets colorIndex
    //adds difficulty effects based on the round number
    //updates middle-btn text and spinSpeed
    //removes the checkClicks handler on the color-btn divs
    //calls addRandomColor and showCurrentSequence
    function startNewRound () {
        spinSpeed -= 1;
        colorsIndex = 0;

        if(colorsLit.length === 2) fadeGameRandomly();
        if(colorsLit.length === 4) shakeBodyRandomly();
        if(colorsLit.length === 6) $('#game').addClass('moving');
        
        $('#middle-btn-text').html('Round ' + '<br>' + (colorsLit.length+1));
        $('.moving').css('animation-duration',spinSpeed + 's');
        $('.color-btn').off('click',checkClicks);
        
        addRandomColor();
        showCurrentSequence();
    }

    //resets spinSpeed and colorsLit
    //removes click listener from middle-btn
    //calls startNewRound
    function startGame () {
        spinSpeed = 20;
        colorsLit = [];
        $('#middle-btn').off('click');
        startNewRound();
    }

    //plays the lossSound, changes middle-btn text, removes checkClicks
    //removes all difficulty effects and lights up the color the user was
    //supposed to click
    function endGame () {
        var $lastColor =$('#' + colorsLit[colorsIndex]);
        lossSound.play();
        $('#game').addClass('end-game-anim');

        $('#middle-btn-text').text('Score ' + (colorsLit.length - 1) );
        $('.color-btn').off('click',checkClicks);

        $('#game').removeClass('moving');
        clearInterval(shakingInterval);
        clearInterval(fadingInterval);
        
        //after the lossSound is played light up what would have been the 
        //correct color 3 times and reattach the startGame handler
        setTimeout( function(){
            lightUp($lastColor,500);
            setTimeout( function(){lightUp($lastColor,500);}, 600);
            setTimeout( function(){
                lightUp($lastColor,500);
                $('#middle-btn-text').text('Again?');
                $('#middle-btn').on('click',startGame);
                $('#game').removeClass('end-game-anim');
            }, 1200);
        }, 3400);   
    }

    function playSmokeOnTheWater () {
        lightUp($('#blue'),450);
        setTimeout( function(){ lightUp($('#yellow'),450); }, 500);
        setTimeout( function(){ lightUp($('#red'),700); }, 1000);
        setTimeout( function(){ lightUp($('#blue'),450); }, 1750);
        setTimeout( function(){ lightUp($('#yellow'),450); }, 2250);
        setTimeout( function(){ lightUp($('#green'),250); }, 2750);
        setTimeout( function(){ lightUp($('#red'),700); }, 3000);
        setTimeout( function(){ lightUp($('#blue'),450); }, 3750);
        setTimeout( function(){ lightUp($('#yellow'),450); }, 4250);
        setTimeout( function(){ lightUp($('#red'),700); }, 4750);
        setTimeout( function(){ lightUp($('#yellow'),450); }, 5500);
        setTimeout( function(){ lightUp($('#blue'),700); }, 6000);
    }

    function playLittleLamb () {
        lightUp($('#red'),300);
        setTimeout( function(){ lightUp($('#yellow'),400); }, 500);
        setTimeout( function(){ lightUp($('#blue'),400); }, 1000);
        setTimeout( function(){ lightUp($('#yellow'),400); }, 1500);
        setTimeout( function(){ lightUp($('#red'),400); }, 2000);
        setTimeout( function(){ lightUp($('#red'),400); }, 2500);
        setTimeout( function(){ lightUp($('#red'),400); }, 3000);
        setTimeout( function(){ lightUp($('#yellow'),400); }, 4000);
        setTimeout( function(){ lightUp($('#yellow'),400); }, 4500);
        setTimeout( function(){ lightUp($('#yellow'),400); }, 5000);
        setTimeout( function(){ lightUp($('#red'),400); }, 6000);
        setTimeout( function(){ lightUp($('#green'),400); }, 6500);
        setTimeout( function(){ lightUp($('#green'),400); }, 7000);
    }

    //build the note selects
    (function(){
        $('.change-note').each(function(index,element){
            var $select = $(this);
            for(var note in musicalNotes){  
                $select.append('<option value="'+note+'">' +
                    note + '</option>');
            }
        });
        changeAndUpdateSounds('C 3','G 3','B 3','C 4');
    })();
    //add event listeners
    (function(){
        $('#middle-btn').click(startGame);
        $('.color-btn').click(function(){
            var sound = getSoundFromColorName($(this).attr('id'));
            playThenPause(sound,200);
        });
        $('#change-blue-note').change(function(){
            blueSound = musicalNotes[$(this).val()];
            playThenPause(blueSound);
            lightUp($('#blue'));
        });
        $('#change-yellow-note').change(function(){
            yellowSound = musicalNotes[$(this).val()];
            playThenPause(yellowSound);
            lightUp($('#yellow'));
        });
        $('#change-red-note').change(function(){
            redSound = musicalNotes[$(this).val()];
            playThenPause(redSound);
            lightUp($('#red'));
        });
        $('#change-green-note').change(function(){
            greenSound = musicalNotes[$(this).val()];
            playThenPause(greenSound);
            lightUp($('#green'));
        });
        $('#original-simon-btn').click(function(){
            changeAndUpdateSounds('E 2','C#3','A 3','E 4');
            lightUpAllInSequence();
        });
        $('#latest-simon-btn').click(function(){
            changeAndUpdateSounds('G 2','C 3','E 3','G 3');
            lightUpAllInSequence();
        });
        $('#amin-btn').click(function(){
            changeAndUpdateSounds('A 3','C 4','E 4','A 4');
            lightUpAllInSequence();
        });
        $('#edim-btn').click(function(){
            changeAndUpdateSounds('E 3','A#3','E 4','A#4');
            lightUpAllInSequence();
        });
        $('#fifths-btn').click(function(){
            changeAndUpdateSounds('C 3','G 3','D 4','A 4');
            lightUpAllInSequence();
        });
        $('#smoke-on-the-water-btn').click(function(){
            changeAndUpdateSounds('A 3','C 4','D 4','D#4');
            playSmokeOnTheWater();
        });
        $('#little-lamb-btn').click(function(){
            changeAndUpdateSounds('C 4','D 4','E 4','G 4');
            playLittleLamb();
        });
    })();
    //audio loading barx
    (function(){
        var x = 0;
        var $loadingBar = $('#loading-bar');
        var maxWidth = $loadingBar.width();
        $loadingBar.width(0);
        for(var note in musicalNotes){
            musicalNotes[note].oncanplaythrough = function(){
                x++;
                $loadingBar.width( (x / 37) * maxWidth );
                $loadingBar.text( (x/37*100).toFixed(0) + '%' );
                if($loadingBar.width() === maxWidth) $loadingBar.fadeOut(500);
            }
        }
    })();
});