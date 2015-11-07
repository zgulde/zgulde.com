"use strict";
$(document).ready(function(){
	var $body = $('body');
	var $window = $(window);
	var $dom = $(document);
	var navOffsetTop = $('#navbar').offset().top;


	function resize() {
		$body.removeClass('navbar-docked');
		navOffsetTop = $('#navbar').offset().top;
		onScroll();
	}

	$('#projects').text('color','red');

	function onScroll() {
		var windowPosition = $window.scrollTop();
		var projectsOffset = $('#projects').offset().top;
		var personalOffset = $('#personal').offset().top;
		var contactOffset = $('#contact').offset().top;

		//set current navlink
		$('#navbar a').removeClass('nav-current');
		if(windowPosition >= projectsOffset && windowPosition < personalOffset){
			$('#projects-nav').addClass('nav-current');
		}
		if(windowPosition >= personalOffset && windowPosition < contactOffset){
			$('#personal-nav').addClass('nav-current');
		}
		if(windowPosition >= contactOffset){
			$('#contact-nav').addClass('nav-current');
		}

		//navbar docking
		if(navOffsetTop < windowPosition && !$body.hasClass('navbar-docked')) {
			$body.addClass('navbar-docked');
		}
		if(navOffsetTop > windowPosition && $body.hasClass('navbar-docked')) {
			$body.removeClass('navbar-docked');
		}
	}

	function openModal($modal){
		$modal.addClass('modal-open');
		setTimeout( function(){
			$dom.on('click',function(e){
				if ( (e.target != $modal.get(0) ) && (e.target != $modal.children().get(0) ) ) {
				    $modal.removeClass('modal-open');
				    $dom.off('click')
				}
			});
		}, 300);
	}

	$('.modal-trigger').on('click',function(){
		var $modal = $('#'+$(this).attr('target'));
		openModal($modal);
	});

	$window.on('scroll', onScroll);
    $window.on('resize', resize);

    $('#navbar a').on('click',function(e){
    	var scrollTo = $( $(this).attr('href') ).offset().top;
    	e.preventDefault();
    	if ($window.scrollTop() < navOffsetTop) scrollTo+=20;
    	$('body, html').animate({"scrollTop": scrollTo},500);
    });


});