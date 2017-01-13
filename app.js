// add header w/ start over button
// maybe keep search bar visible
// save items to read for later


var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
var searchTermArr = [];

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

function renderSearchTermButton(searchTerms) {
  var resultElement;
  searchTerms.forEach(function(item) {
    resultElement += '<button class="search-term">' + item + '</button>';
  })
	// var resultElement = '';
	// resultElement = searchTerms.items.reduce(function(acc, item) {
 //      console.log(acc)
 //      return acc += '<button class="search-term">' + item + '</button>';
 //    }, '')
	// resultElement = '<p>Recently Searched: </p>' + resultElement;
	$('.recently-searched').html(resultElement);
}

// function renderSortButton() {
// 	var resultElement = '<button class="sort">Sort by most recent</button>'
// 	$('.recently-searched').html(resultElement);
// }

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
	    item.headline.main + '</h3></a><button>&#10133;</button><p>' + currentDate + '</p><p>' 
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
  $('.js-search-form').submit(function(e) {
    e.preventDefault();
    var query = $(this).find('.js-query').val();
    searchTermArr.push(query);
    console.log(searchTermArr);
    renderSearchTermButton(searchTermArr);
    // renderSearchTermButton(searchTermArr);
  });
}


// where do I add this in the process?
function watchSearchTermButton() {
	$(document).on('click', 'button.search-term', function(event) { 
	event.preventDefault();
	console.log("I was clicked");
	var searchTerm = $(this).text();
	console.log(searchTerm);
	getDataFromApi(searchTerm, renderSearchData, 'newest')
  });
	}

$(function(){watchSubmit();});
$(document).on('click', 'button.next', function(event) { 
    $( "#start-page" ).hide();
    watchSearchTermButton();
});
