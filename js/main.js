$(document).ready(function(){
	$body = $('body');
	$window = $(window);
	navOffsetTop = $('#navbar').offset().top;


	function resize() {
		$body.removeClass('navbar-docked');
		navOffsetTop = $nav.offset().top;
		onScroll();
	}

	function onScroll() {
		if(navOffsetTop < $window.scrollTop() && !$body.hasClass('navbar-docked')) {
			$body.addClass('navbar-docked');
		}
		if(navOffsetTop > $window.scrollTop() && $body.hasClass('navbar-docked')) {
			$body.removeClass('navbar-docked');
		}
	}

	$window.on('scroll', onScroll);
    $window.on('resize', resize);
});