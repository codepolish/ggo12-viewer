var forksList;

var options = {
	item : 'fork-item',
	plugins : [['fuzzySearch']]
};

$.getJSON("data/forks.json", function(_forks) {
	var i, length, _results;
	aa = _forks
	urls = []
	urlsStr = ""
	for ( i = 0, length = _forks.length; i < length; i += 1) {
		if (_forks[i].homepage !== "https://github.com/blog/1303-github-game-off") {
			urls.push(_forks[i].html_url)
			urlsStr += ',"' + _forks[i].html_url + '"'
		}
	}
	$.getJSON("https://api.facebook.com/method/fql.query?&callback=?", {
		format : "json",
		query : "select total_count, url from link_stat where url in (" + urlsStr.replace(",", "") + ")"
	}, function(data) {
		votes = {}
		for (var i = 0; i < data.length; i++) {
			votes[data[i].url] = data[i].total_count;
		}
		_forks.sort(function(a, b) {
			return votes[a.html_url] > votes[b.html_url]
		})
		_forks.reverse()
		forks = [];
		for ( i = 0, length = _forks.length; i < length; i += 1) {
			if (_forks[i].homepage !== "https://github.com/blog/1303-github-game-off") {
				forks.push({
					votes : '<div>Likes: ' + votes[_forks[i].html_url] + ' - <a class="like-tmp" href=' + _forks[i].html_url + '>like</a></div>', //'<div class="fb-like" data-href="'+_forks[i].html_url+'" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div>',
					full_name : '<a href="' + _forks[i].html_url + '">' + _forks[i].full_name + '</a>',
					avatar_url : '<img src="' + _forks[i].owner.avatar_url + '" height="80" width="80"/>',
					homepage : '<a href="' + _forks[i].homepage + '">' + _forks[i].homepage + '</a>',
					description : _forks[i].description
				});
			}
		}
		$('#counter').html('(' + forks.length + ' entries)')
		$("#loadinggif").hide();
		forksList = new List('forks-list', options, forks);
		$("li").bind("mouseover", function(e) {
			if ($(this).find(".like-tmp")[0]) {
				$(this).find(".like-tmp").html('<fb:like href="' + $(this).find(".like-tmp")[0].href + '" layout="button_count" show_faces="false" width="450" height="35" action="like" colorscheme="light" font="trebuchet ms" allowTransparency="true"></fb:like>').removeClass("like-tmp")
				addLike(this);
			}
		})
	});

});

function addLike(el) {
	FB.XFBML.parse($(el).get(0));
}
