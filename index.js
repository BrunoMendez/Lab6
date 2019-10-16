var APIKey = 'AIzaSyC-O1ln9Yz2A4sj83Sn07DmUI6t1xXOTp8';

function watchForm() {
    let form = $("#search");
    var response;
    form.on("submit", function(event) {
        event.preventDefault();
            // run get request on API
            
    var query = $("#searchBar").val();
    $.get(
    	"https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet',
            q: query,
            type: 'video',
            key: APIKey,
            maxResults: 10
        }, function(data) {
            response = data;
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            $('#videos').empty();
            $('#buttons').remove();
            $.each(data.items, function(i, item) {
                $('#videos').append(getHtml(item));
            });
            $(getButtons(prevPageToken, nextPageToken, query)).insertAfter('#videos');
        });
    });
    $('#videos').on('click', 'li', function(event) {
        event.preventDefault();
        let index = $("li").index($(this));
        let videoId = response.items[index].id.videoId;
        let videoUrl = "https://www.youtube.com/watch?v=" + videoId;
        window.open(videoUrl, '_blank');
    });
}

function next() {
    var token = $('#nextButton').data('token');
    var query = $('#nextButton').data('query');
    console.log(this);
    console.log(token);
    console.log(query);
    $('#videos').empty();
    $('#buttons').remove();
    $.get(
    	"https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet',
            q: query,
            type: 'video',
            key: APIKey,
            maxResults: 10,
            pageToken: token
        }, function(data) {
            response = data;
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            $.each(data.items, function(i, item) {
                $('#videos').append(getHtml(item));
            });
            $(getButtons(prevPageToken, nextPageToken, query)).insertAfter('#videos');
    });
}

function prev() {
    var token = $('#prevButton').data('token');
    var query = $('#prevButton').data('query');
    console.log(this);
    console.log(token);
    console.log(query);
    $('#videos').empty();
    $('#buttons').remove();
    $.get(
    	"https://www.googleapis.com/youtube/v3/search", {
            part: 'snippet',
            q: query,
            type: 'video',
            key: APIKey,
            maxResults: 10,
            pageToken: token
        }, function(data) {
            response = data;
            var nextPageToken = data.nextPageToken;
            var prevPageToken = data.prevPageToken;
            $.each(data.items, function(i, item) {
                $('#videos').append(getHtml(item));
            });
            $(getButtons(prevPageToken, nextPageToken, query)).insertAfter('#videos');
    });
}

function getButtons(prev, next, query) {
    var buttonsHtml;
    if ( !prev && !next ) {
        buttonsHtml = '';
    } else if ( !prev ) {
        buttonsHtml =   `<div id="buttons">
                            <button id="nextButton" data-token="${next}"
                            data-query="${query}" onclick="next();">Next</button>
                        </div>`
    } else if ( !next ) {
        buttonsHtml =   `<div id="buttons">
                            <button id="prevButton" data-token="${next}"
                            data-query="${query}" onclick="prev();">Next</button>
                        </div>`
    } else {
        buttonsHtml =   `<div id=buttons>
                            <button id="prevButton" data-token="${prev}"
                            data-query="${query}" onclick="prev();">Previous</button>
                            <button id="nextButton" data-token="${next}""
                            data-query="${query}" onclick="next();">Next</button>
                        </div>`
    }
    console.log(buttonsHtml);
    return buttonsHtml;
}

function getHtml(item) {
    let title = item.snippet.title;
    let thumbnailUrl = item.snippet.thumbnails.high.url;
    let html = `<li>
                    <div class="thumbnail">
                        <img src="${thumbnailUrl}">
                    </div>
                    <div class="title">
                        ${title}
                    </div>
                </li>`;
    return html;
}

function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
    gapi.client.setApiKey(APIKey);
}

watchForm();