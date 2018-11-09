$(function() {
    $('form').on('submit'), function(e) {
        e.preventDefault();

        $.ajax({
            type: "post",
            url: "addBook",
            data: $('form').serialize(),
            success: function(data) {
                openBooks();
            },
            error: function() {
                alert("oops for books");
            }
        })
    }
});