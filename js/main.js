$(document).ready(function(){
	var $body = $('body');
	var $window = $(window);
	var navOffsetTop = $('#navbar').offset().top;


	function resize() {
		$body.removeClass('navbar-docked');
		navOffsetTop = $('#navbar').offset().top;
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

	function toggleModal($modal){
		console.log($modal);
		$modal.toggleClass('modal-open');
		setTimeout( function(){
			$(document).on('click',function(e){
				console.log("document clicked!");
				if ( e.target != $modal.get(0) ) {
				    $modal.toggleClass('modal-open');
				    $(document).off('click')
				}
			});
		}, 300);
	}

	$('.modal-trigger').on('click',function(){
		var $modal = $('#'+$(this).attr('target'));
		toggleModal($modal);
	});

	$window.on('scroll', onScroll);
    $window.on('resize', resize);
});