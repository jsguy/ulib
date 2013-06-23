//	jQuery plugin for our slideshow (could be using any library, but jQuery is easy and popular)
$.fn.slideShow = function(args) {
	//	Test slide show
	var that = this,
		currentImg = 0,
		imageList = [],
		//	Template for slideshow
		template = ["<div class=\"slideShowSurround\">",
		"	<div class=\"mainImageSurround\">",
		"		<button class=\"slideButton prevButton\"></button>",
		"		<button class=\"slideButton nextButton\"></button>",
		"		<img class=\"mainImage\" src=\"\"/>",
		"	</div>",
		"	<div class=\"imageList\">",
		"		<% for ( var i = 0; i < images.length; i += 1 ) { %>",
		"		<div class=\"slideImage\"><img src=\"<%=images[i]%>\"/></div>",
		"		<% } %>",
		"	</div>",
		"</div>"].join(""),
		//	Updates indicator on thumb for selected image
		updateSelectedImage = function(){
			$('.imageList', that).find('.slideImage').each(function(idx, ele) {
				if(idx === currentImg) {
					$(ele).addClass('selectedImg');
				} else {
					$(ele).removeClass('selectedImg');
				}
			});
		},
		//	Sets the selected image
		updateImage = function() {
			$('.mainImage', that).attr({
				src: imageList[currentImg]
			});
		},
		adCount = 0,
		//	Creates an "ad"
		getAd = function(index) {
			//	Pretend we load an ad from the adserver and place in adholder
			//	Note: could pass image info to ad server based on index
			var ad = {
				link: "#",
				text: "Buy something!"
			};

			adCount += 1;

			$('#adHolder').html("<a href='" + ad.link + "'>" + ad.text + " (" + adCount + ")</a>");
			return;
		},
		//	Do everything we need for setting an image
		setImage = function(index) {
			currentImg = index;
			getAd(currentImg);
			updateImage();
			updateSelectedImage();
		};

	//	Load a list of images using ajax, and trigger the "imageListLoaded" event
	$.ajax({
		url: 'imagelist.php',
		dataType: 'jsonp',
		success: function(data) {
			//	Use our template to create the slide show
			$(that).html(tmpl(template, {
				images: data
			}));

			//	Find each thumbnail and use as image list
			$('.imageList', that).find('img').each(function(idx, ele) {
				imageList.push($(ele).attr('src'));
			});

			//	Setup initial image
			setImage(currentImg);

			//	Prev image
			$('.prevButton', that).click(function() {
				currentImg -= 1;
				if(currentImg < 0) {
					currentImg = imageList.length - 1;
				}
				setImage(currentImg);
			})

			//	Next image
			$('.nextButton', that).click(function() {
				currentImg += 1;
				if(currentImg > imageList.length - 1) {
					currentImg = 0;
				}
				setImage(currentImg);
			});

			//	Jump to image
			$('.slideImage', that).click(function() {
				var clickedEl = this;
				$('.slideImage', that).each(function(idx, el){
					if(clickedEl === el) {
						currentImg = idx;
						return false;
					}
				});
				setImage(currentImg);
			});
		}
	});
};

//	To initialise
//$('#mySlideshow').slideShow();
