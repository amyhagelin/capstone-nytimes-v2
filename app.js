// add header w/ start over button
// maybe keep search bar visible
// save items to read for later
// git remote problem


var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var searchTermArr = [];
var state = {
  searchResults: [],
  favoriteArticles: []
}

// add to favorites button -> favoriteArticles.push(...)
// renderArticles(state.favoriteArticles)

/*

-> data-article-id on a button
-> get data-article-id on click
-> find the article in the list of the articles
-> push the article to the array

*/

function getDataFromApi(searchTerm, callback, sort) {
  var query = {
    //'api-key': '8eb469e30f4a480e8fbf277f47d3e99d',
    'api-key': 'd652729a81b34da49032608ce4b8cc0d',
    q: searchTerm
  }
  if (sort) {
  	query.sort = sort;
  }

  console.log(sort)
  console.log(query);
  
  $.getJSON(url, query, callback);
}

function renderHome() {
  var resultElement = 
  '<div id="start-page">' +
      '<h1>My NY Times</h1>'+
      "<p>Input the topics you'd like to read about today, clicking the + button after each one. When you're finished, click Next.</p>" +
      '<form action="#" class="js-submit-form">' +
      '<label for="query"></label>' +
         '<input type="text" class="js-query">'+
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
  var resultElement = '<div><button class="start-over">Start Over</button></div>';
  $('.header').html(resultElement);
}

function renderSearchTermButton(searchTerms) {
  // var resultElement;
  // searchTerms.forEach(function(item) {
  //   resultElement += '<button class="search-term">' + item + '</button>';
  // })
  // console.log(resultElement)
	// var resultElement = '';
  // console.log(searchTerms)
	var resultElement = searchTerms.reduce(function(acc, item) {
      console.log(acc)
      return acc += '<button class="search-term">' + item + '</button>';
    }, '')
	// resultElement = '<p>Recently Searched: </p>' + resultElement;
	$('.search-terms').html(resultElement);

}

// function renderSortButton() {
// 	var resultElement = '<button class="sort">Sort by most recent</button>'
// 	$('.recently-searched').html(resultElement);
// }

// function Animal(name) {
//   this._fancyName = 'qwe';
//   this.name = name; 
// }

// console.log(new Animal('cat'))



function renderSearchData(data) {
  var resultElement = '';
  console.log(data);
  console.log(data.response.docs[0].lead_paragraph);  
  if (data.response.docs) { 

  	// data.response.docs.sort(function(a, b) {})

    resultElement = data.response.docs.reduce(function(acc, item) {
      // console.log(acc)
      var currentDate = moment(item.pub_date).fromNow(); // .format('MMM Do YYYY')
  	  console.log(currentDate)

  	  if (item.headline.main === undefined) {
	 	return acc += '<div><a target="_blank" href="' + item.web_url + '"><h3>' + 
	    item.headline.name + '</h3></a><button>&#10133;</button><p>' + currentDate + '</p><p>' 
	    + item.snippet + '</p></div>'
  	  }
  	  else {
	    return acc += '<div><a target="_blank" href="' + item.web_url + '"><h3>' + 
	    item.headline.main + '</h3></a><button data-article-id="' + item._id + '">&#10133;</button><p>' + currentDate + '</p><p>' 
	    + item.snippet + '</p></div>'
      }
      // what to do with undefined? another if statement?
      // add .lead_paragraph or .snippet
      // add .pub_date - how can I manipulate this when displayed in HTML? 
      // Can I calculate how long ago this was published?
    }, '')
  }
  else {
    resultElement += '<p>No results</p>';
  }

  $('.js-search-results').html(resultElement);
}

function watchSubmit() {
  $(document).on('submit', '.js-submit-form', function(e) {
    e.preventDefault();
    $( "#start-page-search" ).hide();
    $( ".hide-me" ).hide();
    var query = $(this).find('.js-query').val();
    searchTermArr.push(query);
    console.log(searchTermArr);
    renderSearchTermButton(searchTermArr);
    // renderSearchTermButton(searchTermArr);
  });
}

function watchSearchBox() {
  $(document).on('submit', '.js-search-form', function(e) {
    console.log('submit')
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
	console.log("I was clicked");
	var searchTerm = $(this).text();
	console.log(searchTerm);
	getDataFromApi(searchTerm, renderSearchData, 'newest')
  });
	}

$( document ).ready(function() {
        console.log("ready");
        $(function(){renderHome();});
        $(function(){watchSubmit();});
    $(function(){watchSearchBox();});
    $(document).on('click', 'button.next', function(event) { 
        $( "#start-page-search" ).hide();
        $(function(){renderHeader();});
        $( "#start-page" ).hide();
        watchSearchTermButton();
    });
    $(document).on('click', 'button.start-over', function(event) { 
        console.log("Start Over was clicked");
        $('.js-search-results').empty();
        $('.search-terms').empty();
        $( ".header" ).hide();
        renderHome();
        searchTermArr = [];
        // watchSearchBox();
    // how to clear other data?
});
});

