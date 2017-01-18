
// clean up indents
// send email when ready

var state = {
  url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
  searchTermArr: [],
  searchResults: [],
  favoriteArticles: []
}


function getDataFromApi(searchTerm, callback, sort) {
  var query = {
    'api-key': 'd652729a81b34da49032608ce4b8cc0d',
    q: searchTerm
  }
  if (sort) {
  	query.sort = sort;
  }
  $.getJSON(state.url, query, callback);
}


function renderHome() {
  var resultElement = 
  '<div id="start-page">' +
      '<h1>My NY Times</h1>'+
      "<p>Input the topics you'd like to read about today, clicking the + button after each one. When you're finished, click Next.</p>" +
      '<form action="#" class="js-submit-form">' +
      '<label for="query"></label>' +
         '<input id="clear-me" type="text" class="js-query">'+
         '<button type="submit">&#10133;</button></br>'+
       '</form>'+
       '<button class="next">Next</button>'+
     '</div>'+
     '<p class="hide-me">Or search for an article directly...</p>'+
     '<div id="start-page-search">'+
       '<form action="#" class="js-search-form">'+
       '<label for="query"></label>'+
       '<input type="text" class="js-query">'+
       '<button type="submit">Search</button>'+
       '<label><input type="radio" name="article-search-type" id="new-box" value="first_checkbox" required>Show newest first</label>'+
        '<input type="radio" name="article-search-type" id="relevant-box" value="second_checkbox" required> <label for="cbox2">Show most relevant first</label>'+
     '</form>'+
  '</div>';
  $('#home').html(resultElement);
}


function renderHeader() {
  var resultElement = '<div><button class="start-over">New Search</button></div>';
  $('#header').html(resultElement);
}


function renderSearchTermButton(searchTerms) {
	var resultElement = searchTerms.reduce(function(acc, item) {
      return acc += '<button class="search-term">' + item + '</button>';
    }, '')
	$('#search-terms').html(resultElement);
}


function renderSearchData(data) {
  var resultElement = ''; 
  if (data.response.docs) { 
    resultElement = data.response.docs.reduce(function(acc, item) {
      var currentDate = moment(item.pub_date).fromNow(); // .format('MMM Do YYYY')
      if (item.headline.main === undefined) {
 	     return acc += '<div><a target="_blank" href="' + item.web_url + '"><h3>' + 
       item.headline.name + '</h3></a><p>' + currentDate + '</p><p>' 
	     + item.snippet + '</p></div>'
  	  }
	     else {
  	    return acc += '<div><a target="_blank" href="' + item.web_url + '"><h3>' + 
  	    item.headline.main + '</h3></a><button data-article-id="' + item._id + '">&#10133;</button><p>' + currentDate + '</p><p>' 
  	    + item.snippet + '</p></div>'
      }
    }, '')
  }
  else {
    resultElement += '<p>No results</p>';
  }
  $('#js-search-results').html(resultElement);
}


function watchSubmit() {
  $(document).on('submit', '.js-submit-form', function(e) {
    e.preventDefault();
     $( "#start-page-search" ).hide();
    $( ".hide-me" ).hide();
    var query = $(this).find('.js-query').val();
    state.searchTermArr.push(query);
    renderSearchTermButton(state.searchTermArr);
  });
}


function watchSearchBox() {
  $(document).on('submit', '.js-search-form', function(e) {
    e.preventDefault();
    $( "#start-page" ).hide();
    $( "p.hide-me" ).hide();
    $(function(){renderHeader();});
    var query = $(this).find('.js-query').val();
    if($('#new-box').prop('checked')) {
      getDataFromApi(query, renderSearchData, 'newest');
    }
    if($('#relevant-box').prop('checked')) {
      getDataFromApi(query, renderSearchData);
    }
  });
}


function watchSearchTermButton() {
	$(document).on('click', 'button.search-term', function(event) { 
  	event.preventDefault();
  	var searchTerm = $(this).text();
  	getDataFromApi(searchTerm, renderSearchData, 'newest')
  });
	}


$( document ).ready(function() {
  renderHome();
  watchSubmit();
  $(function(){watchSearchBox();});
  $(document).on('click', 'button.next', function(event) { 
        $( "#start-page-search" ).hide();
        renderHeader();
        $("#search-terms").prepend("<p>Click on a search term to see the latest articles:</p>");
        $( "#start-page" ).hide();
        watchSearchTermButton();
    });
    $(document).on('click', 'button.start-over', function(event) { 
        $('#js-search-results').empty();
        $('#search-terms').empty();
        $( "#header" ).hide();
        renderHome();
        state.searchTermArr = [];
});
});

