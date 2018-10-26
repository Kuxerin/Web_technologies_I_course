$(document).ready(function() {
    $('button').click(function() {
        $('p').toggle(1000), function() {
            alert("asd");
        };
    });
});

$(document).ready(function() {
    $('content').load('lorem.html');

    $.each($('.menuButton'), function(mbIndex, mbValue) {
        $(mbValue.click(function(event) {
                event.preventDefault();
                if (!($(this).find('a').attr('href') == "index.html")) {
                    $('#content').load($(this).find("a").attr("href"));
                }
                else{
                    open('index.html', '_self');
                }
            }))
    })
});

function loadAuthors() {
    $.getJSON('authors', function(data) {
        var table = $('<table id="authorstable"></table>');
        table.append('<tr><th>Name</th><th>Nationality</th><th>Birth Date</th>');
        $.each(data, function(key, value) {
            var row = $('<tr></tr>');
            var nameCell = $('<td onclick="openBooks(' + "'" + value.name + "'" + ')">' + value.name + '</td>');
            var nationCell = $('<td>' + value.nationality + '</td>');
            var birthCell = $('<td>' + value.birthDate + '</td>');
            row.append(nameCell);
            row.append(nationCell);
            row.append(birthCell);
            table.append(row);
        });

        $('#content').html(table);
    })
}

function openBooks(author) {
    document.cookie = "name=" + author;

    $.getJSON('author', function(data) {
        var table = $('<table id="bookstable"></table>');
        table.append('<tr><th>Title</th><th>Genre</th><th>Author</th><th>Quantity</th><th>Available</th><th>Publisher</th>');
        $.each(data, function(key, value) {
            var row = $('<tr></tr>');
            var titleCell = $('<td>' + value.title + '</td>');
            var genreCell = $('<td>' + value.genre + '</td>');
            var authorCell = $('<td>' + value.author + '</td>');
            var quantityCell = $('<td>' + value.quantity + '</td>');
            var availableCell = $('<td>' + value.available + '</td>');
            var publisherCell = $('<td>' + value.publisher + '</td>');
            row.append(titleCell);
            row.append(genreCell);
            row.append(authorCell);
            row.append(quantityCell);
            row.append(availableCell);
            row.append(publisherCell);
            table.append(row);
        });

        $('#content').html(table);
    })
}