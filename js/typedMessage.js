function TypedMessage($display, message, animationDelay, animationDuration){

    // set default values if they are not passed
    this.message = (!message) ? 'Hello, world!' : message;
    this.$display = (!$display) ? 'display element not set!' : $display;
    this.animationDelay = (!animationDelay) ? 0 : animationDelay*1000;
    this.animationDuration = (!animationDuration) ? 3 : animationDuration;

    // create the animated span
    this.$span = $('<span>').css({
        'position': 'absolute',
        'top': '0',
        'right': '0',
        'width': '0',
        'height': '100%',
        'background-color': 'white',
        'border-left': '1px solid black',
        'animation': 'typing '+this.animationDuration+'s steps('+this.message.length+',end)'
    }).html('&nbsp;');

    // this function 'outputs' the message forwards (show) or backwards (erase) based on direction passed
    this.output = function(direction){
        var $span = this.$span;
        var message = this.message;
        var $display = this.$display;
        $span.css('animation-direction', direction);

        setTimeout( function(){
            $display.text(message);
            $span.appendTo($display);
        }, this.animationDelay);

        setTimeout( function(){
            if (direction == 'reverse') {
                $display.html('');
                animationDelay = 0;
            } else {
                $display.text(message);
            }
        }, this.animationDelay + (1000*this.animationDuration) ) ;

        return this;
    };

    this.delay = function(delay){
        if ( (typeof delay) === 'undefined') {
            return (this.animationDelay / 1000);
        } else {
            this.animationDelay = delay * 1000;
            return this;
        }
    };

    this.duration = function(duration){
        if (!duration) {
            return this.animationDuration;
        } else {
            this.animationDuration = duration;
            this.$span.css('animation-duration',this.animationDuration+'s');
            return this;
        }
    };

    this.text = function(text){
        if (!text) {
            return this.message;
        } else {
            this.message = text;
            this.$span.css('animation-timing-function','steps('+text.length+',end)');
            return this;
        }
    };

    this.display = function($display){
        if (!$display) {
            return this.$display;
        } else {
            this.$display = $display;
            return this;
        }
    };
}