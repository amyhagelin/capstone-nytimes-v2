
// set quotations to either " or '
// update buttons with #id instead of class
// create watchNext and watchStartOver functions


var state = {
  url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
  searchTermArr: [],
  searchResults: [],
  favoriteArticles: []
}

if (localStorage) {
  state.favoriteArticles = JSON.parse(localStorage.getItem('articles'))
  console.log(state.favoriteArticles)
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

function getDataAndSaveResults(searchTerm, callback, sort) {
  getDataFromApi(searchTerm, function(result) {
    state.searchResults = result.response.docs;
    callback(result);
  }, sort);
}


function renderHome() {
  var resultElement = 
  '<div id="start-page">' +
      "<p>Input the topics you'd like to read about today, clicking the + button after each one. When you're finished, click Next.</p>" +
      '<form action="#" class="js-submit-form">' +
      '<label for="query"></label>' +
         '<input id="clear-me" type="text" class="js-query">'+
         '<button type="submit">&#10133;</button></br>'+
       '</form>'+
       '<button class="next">Next</button>'+
     '</div>'+
     '<p class="hide-me">Or search for an article directly:</p>'+
     '<div id="start-page-search">'+
       '<form action="#" class="js-search-form">'+
       '<label for="query"></label>'+
       '<input type="text" class="js-query">'+
       '<button type="submit">Search</button>'+
       '<label><input class="search-type" type="radio" name="article-search-type" id="new-box" value="first_checkbox" required>Show newest first</label>'+
        '<input class="search-type" type="radio" name="article-search-type" id="relevant-box" value="second_checkbox" required> <label for="cbox2">Show most relevant first</label>'+
     '</form>'+
  '</div>';
  $('#home').html(resultElement);
}


function renderHeader() {
  var resultElement = '<div><h1>My NY Times</h1><div class="header-buttons"><button class="favorites">My Reading List</button><button class="new-search">New Search</button></div></div>';
  $('#header').html(resultElement);
}

// function renderFavoritesButton() {
//   var resultElement = '<div><button class="favorites">My Reading List</button></div>';
//   $('#favorites').html(resultElement);
// }

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
 	     return acc += '<div class="article"><a target="_blank" href="' + item.web_url + '"><h3>' + 
       item.headline.name + '</h3></a><div class="second-line"><p>' + currentDate +
       '<button title="Add to My Reading List" class="add-to-fav-button" data-article-id="' + item._id + '">&#10133;</button></p></div><p>' 
	     + item.snippet + '</p></div>'
  	  }
	     else {
  	    return acc += '<div class="article"><a target="_blank" href="' + item.web_url + '"><h3>' + 
  	    item.headline.main + '</h3></a><div class="second-line"><p>' + currentDate +
        '<button title="Add to My Reading List" class="add-to-fav-button" data-article-id="' + item._id + '">&#10133;</button></p></div><p>'
  	    + item.snippet + '</p></div>'
      }
    }, '')
  }
  else {
    resultElement += '<p>No results</p>';
  }
  $('#js-search-results').html(resultElement);
}


function renderFavorites(data) {
  console.log(data)
  var resultElement = ''; 
  resultElement = data.reduce(function(acc, item) {
      if (item[0].headline.main === undefined) {
       return acc += '<div class="article"><a target="_blank" href="' + item[0].web_url + '"><h3 class="article-headline">' + 
       item[0].headline.name + '</h3></a><p>' + item[0].snippet + '</p></div>'
      }
       else {
        return acc += '<div class="article"><a target="_blank" href="' + item[0].web_url + '"><h3 class="article-headline">' + 
        item[0].headline.main + '</h3></a><p>' + item[0].snippet + '</p></div>'
      }
    }, '');
  $('#js-search-results').html(resultElement);
}

function watchSubmit() {
  $(document).on('submit', '.js-submit-form', function(e) {
    e.preventDefault();
     $( '#start-page-search' ).hide();
    $( '.hide-me' ).hide();
    var query = $(this).find('.js-query').val();
    state.searchTermArr.push(query);
    renderSearchTermButton(state.searchTermArr);
    $('.js-query').val('');
  });
}


function watchSearchBox() {
  $(document).on('submit', '.js-search-form', function(e) {
    e.preventDefault();
    $( "#start-page" ).hide();
    $( "p.hide-me" ).hide();
    renderHeader();
    var query = $(this).find('.js-query').val();
    if($('#new-box').prop('checked')) {
      getDataAndSaveResults(query, renderSearchData, 'newest');
    }
    if($('#relevant-box').prop('checked')) {
      getDataAndSaveResults(query, renderSearchData);
    }
    $('.js-query').val('');
  });
}


function watchSearchTermButton() {
	$(document).on('click', 'button.search-term', function(event) { 
  	event.preventDefault();
  	var searchTerm = $(this).text();
  	getDataAndSaveResults(searchTerm, renderSearchData, 'newest')
  });
	}

function watchNext() {
  $(document).on('click', 'button.next', function(event) { 
    $( "#start-page-search" ).hide();
    renderHeader();
    $("#search-terms").prepend("<p>Click on a search term to see the latest articles:</p>");
    $( "#start-page" ).hide();
    watchSearchTermButton();
  }); 
}


function watchNewSearch() {
  $(document).on('click', 'button.new-search', function(event) { 
    $('#js-search-results').empty();
    $('#search-terms').empty();
    $( "#header" ).hide();
    renderHome();
    renderHeader();
    state.searchTermArr = [];
  });
}


function watchFavorites() {
  $(document).on('click', 'button.favorites', function(event) { 
  renderFavorites(state.favoriteArticles);
  renderHeader();
  });
  }


$(function() {
  renderHeader();
  renderHome();
  watchSubmit();
  watchSearchBox();
  watchNext();
  watchNewSearch();
  $(document).on('click', '.add-to-fav-button', function(event) { 
    var articleId = $(this).data('article-id');
    // we have articleId
    // then we have to have article object
    // so we have to find proper article in searchResults using articleId
    // then we can finally add the object into the favoriteArticles array
    console.log(articleId);
    console.log(state.searchResults);
    // use https://api.jquery.com/jQuery.inArray/ instead
    var article = jQuery.grep(state.searchResults, function(item) {
      return item._id === articleId;
    });
    console.log(article);
    state.favoriteArticles.push(article);
    if (localStorage) {
      localStorage.setItem('articles', JSON.stringify(state.favoriteArticles))  
    }
    console.log(state.favoriteArticles);
    // renderFavoritesButton();
    watchFavorites();
    // render the fav article
    // store it somewhere, and rerender whole array
    // store using localStorage (?)
  });
});

