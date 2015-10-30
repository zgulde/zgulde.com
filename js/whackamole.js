$(document).ready(function(){
	function getRandomNumber(min,max){
        return Math.floor( (Math.random() * (max-min+1) + min) );
    }

	var whackamole = {

		gameTiles: [],
		score: 0,
		roundInterval: 0,
		roundTimeout: 0,
		molesToWhack: 0,
		currentRound: 0,
		molesWhacked: 0,
		whackingPercentage: 0,
		molesShown: 0,
		instructions: 'You lose when the moles cover your selected percentage of the board',

		options: {
			numberOfTiles: 0,
			roundLength: 0, // in ms
			percentLoss: 0 // %
		},

		GameTile: function(idNumber){
			
			this.setActive = function(){
				var gameTile = this;
				gameTile.isActive = true;
				$(gameTile.id).addClass('active');
			}

			this.setInactive = function(){
				this.isActive = false;
				$(this.id).removeClass('active');
			}

			this.$html = $('<div>').addClass('game-tile').attr('id','tile'+idNumber).attr('data-value',idNumber);
			this.id = '#tile' + idNumber;
			this.isActive = false;
		},

		getGameAreaHeight: function(){
			var height = $('#whackamole-game').css('height');
			return parseFloat(height);
		},

		getGameAreaWidth: function(){
			var width = $('#whackamole-game').css('width');
			return parseFloat(width);
		},

		buildGameArea: function(){
			var $gameArea = $('<div>').attr('id','game-area');
			$gameArea.css('height',whackamole.getGameAreaHeight());
			$gameArea.css('width',whackamole.getGameAreaWidth());
			return $gameArea;
		},

		buildOptionsArea: function(){
			var $optionsArea = $('<div>').attr('id','options-area');
			$optionsArea.css('width',whackamole.getGameAreaWidth());
			$optionsArea.css('width',whackamole.getGameAreaWidth());
			return $optionsArea;
		},

		//numOfTiles must be a perfect square!
		buildGame: function(numOfTiles){
			var $gameArea = whackamole.buildGameArea();
			var $optionsArea = whackamole.buildOptionsArea();
			var tileHeight = whackamole.getGameAreaHeight()/Math.sqrt(numOfTiles);
			var tileWidth = whackamole.getGameAreaWidth()/Math.sqrt(numOfTiles);


			for(var i = 0; i < numOfTiles; i++){
				
				var gameTile = new whackamole.GameTile(i);

				gameTile.$html.css('height',tileHeight);
				gameTile.$html.css('width',tileWidth);

				gameTile.$html.appendTo($gameArea);
				whackamole.gameTiles.push(gameTile);
			}

			$('#whackamole-game').html('<div id="graphic-timer"></div>');
			$gameArea.css('position','absolute');
			$gameArea.appendTo($('#whackamole-game'));

		},

		//if you call this while all tiles are active it will create
		//an infinite loop!
		//returns a GameTile object
		getRandomInactiveTile: function(){
			var i = getRandomNumber(0, (this.gameTiles.length-1) );
			if(this.gameTiles[i].isActive){
				return this.getRandomInactiveTile();
			} else {
				return this.gameTiles[i];
			}
		},

		//if percentLoss*numOfTiles are active return true else return false
		isGameLost: function(){
			var game = this;
			var numActive = 0;
			game.gameTiles.forEach(function(tile){
				if (tile.isActive) numActive++;
			});
			if ( numActive >= (game.gameTiles.length * game.options.percentLoss) ){
				return true;
			} else {
				return false;
			}
		},

		startNewRound: function(){
			var game = this;
			game.currentRound++;
			game.animateMessage($('#message-display'),'Round ' + game.currentRound,4100);
			game.eraseMessage($('#message-display'),3000);
			game.eraseMessage($('#moles-whacked'),2000);
			game.eraseMessage($('#moles-shown'),1000);
			game.eraseMessage($('#score-display'));
			
			game.startRoundTimer();

			game.roundInterval = setInterval(function(){
				if ( game.isGameLost() ) {
					game.endGame();
				} else {
					game.getRandomInactiveTile().setActive();
					game.molesShown++;
				}
			}, (game.options.roundLength/game.molesToWhack) );
				
			game.roundTimeout = setTimeout( function(){
				game.endRound();
			}, game.options.roundLength);
		},

		setWhackingPercentage: function(){
			var game = this;
			var roundWhackingPercentage = game.molesWhacked / game.molesShown;
			if (game.currentRound === 1){
				game.whackingPercentage = roundWhackingPercentage;
			} else {
				game.whackingPercentage = ( (game.whackingPercentage * (game.currentRound-1) ) + roundWhackingPercentage ) / game.currentRound;
			}
			game.molesWhacked = 0;
			game.molesShown = 0;
		},

		endRound: function(){
			var game = this;
			game.animateMessage($('#moles-whacked'),'Moles Whacked: ' + game.molesWhacked);
			game.animateMessage($('#moles-shown'),'Moles Shown: ' + game.molesShown,1000);
			game.animateMessage($('#score-display'),'Score: ' + game.score,2000);

			game.setWhackingPercentage();
			game.molesToWhack += (game.gameTiles.length/2);
			
			clearInterval(game.roundInterval);
			game.gameTiles.forEach(function(tile){
				tile.setInactive(tile);
			});

			game.startBreakTimer();
			setTimeout( function(){
				game.startNewRound();
			}, 5000);
		},

		endGame: function(){
			var game = this;
			game.animateMessage($('#message-display'),'Game Over!',0,2);
			$('#moles-shown').html('');
			game.setWhackingPercentage();
			game.animateMessage($('#moles-whacked'),'Whacking Percentage: ' + parseInt( (game.whackingPercentage*100) ) + '%',1000);
			game.animateMessage($('#moles-shown'),'Score: ' + game.score,2000);
			clearInterval(game.roundInterval);
			clearInterval(game.roundTimeout);
			setTimeout( function(){
				$('#options-area').slideDown();
			}, 5000);
			$('.game-tile').off('click',game.tileClicked);
		},

		tileClicked: function(){
			var gameTile = whackamole.gameTiles[$(this).attr('data-value')];

			if (gameTile.isActive){	
				whackamole.score++;
				whackamole.molesWhacked++;
				gameTile.setInactive(gameTile);
			}
		},

		startBreakTimer: function(){
			var $timer = $('#graphic-timer');
			$timer.height(whackamole.getGameAreaHeight() + 'px');
			$timer.animate({height:'0'}, (5000 - 100) ,'linear');
		},

		startRoundTimer: function(){
			var $timer = $('#graphic-timer');
			$timer.height(whackamole.getGameAreaHeight() + 'px');
			$timer.animate({height:'0'}, (whackamole.options.roundLength - 100) ,'linear');
		},

		animateMessage: function($display,string,delay,duration){
			var $span = $('<span>').addClass('typing-span');
			if(!delay) delay = 0;
			if(!duration) duration = 1;

			setTimeout( function(){
				$display.text(string); 
				$span.html('&nbsp;');
				$span.appendTo($display);
				var steps = $display.text().length-1;
				$span.css('animation','typing '+duration+'s steps('+steps+',end)');
			}, delay);

			setTimeout( function(){
				$display.text(string);
			}, delay + (1000*duration + 300) ) ;
		},

		eraseMessage: function($display,delay,duration){
			var $span = $('<span>').addClass('typing-span');
			if(!delay) delay = 0;
			if(!duration) duration = 1;

			setTimeout( function(){
				$span.html('&nbsp;');
				$span.appendTo($display);
				var steps = $display.text().length-1;
				$span.css('animation','typing '+duration+'s reverse steps('+steps+',end)');
			}, delay);

			setTimeout( function(){
				$display.html('');
			}, delay + (1000*duration) - 10 ) ;
		},

		showIntructions: function(){
			var game = this;
			$('#options-area').hide();
			game.animateMessage($('#moles-whacked'),'You lose when the moles',0,1);
			game.animateMessage($('#moles-shown'),'cover your selected',1000,1);
			game.animateMessage($('#score-display'),'percentage of the board.',2000,1);
			setTimeout( function(){
				$('#options-area').slideDown();
			}, 3000);
		},

		init: function(){
			var game = this;

			game.molesWhacked = 0;
			game.molesShown = 0;
			game.whackingPercentage = 0;
			game.currentRound = 0;
			game.score = 0;
			game.molesToWhack = 0;
			game.gameTiles = [];

			game.options.numberOfTiles = parseInt($('#number-of-tiles-select').val());
			game.options.percentLoss = parseFloat($('#percent-loss-select').val());
			game.options.roundLength = parseInt($('#round-length-select').val());
			game.molesToWhack = game.options.numberOfTiles;

			game.eraseMessage($('#moles-whacked'),2000);
			game.eraseMessage($('#moles-shown'),1000);
			game.eraseMessage($('#score-display'));
			
			game.buildGame(game.options.numberOfTiles);
			$('.game-tile').on('click',game.tileClicked);
			game.startNewRound();
			$('#options-area').slideUp();
		}

	}

	$('#start-btn').click(function(){
		whackamole.init();
	});

	whackamole.showIntructions();

	$('#options-area h2').next().slideUp();
	$('#options-area h2').click(function(){
		$(this).next().slideToggle();
	});
	
});