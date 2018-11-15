$(document).ready(function(){

    // Bind functions to navigation
    $.each($(".buttons").not(".dropmenu"), function(buttonIndex, buttonValue) {
        $(buttonValue).click(function (event) {

            event.preventDefault();
            $("#separated_content").empty();

            // Change active navigation button
            $("#navigation .buttons.active").removeClass("active");
            $(this).addClass("active");

            // Handle requests
            let request = $(this).find("a").attr("href");
            if(request === "contact") {
                loadContactsPage();
            } else if (request === "manufacturers") {
                loadManufacturersPage();
            } else if (request === "addManufacturers") {
                loadAddManufacturerPage();
            } else if (request === "cars") {
                loadCarsPage();
            } else if (request === "addCar") {
                loadAddCarPage();
            } else {
                open("index.html", "_self");
            }
        });
    });

    // Add function to the drop menu
    $(".dropmenu").click(function () {
        $(this).css("border", "12px inset #fedc9c;");
        let dropContentList = $(".dropcontent");
        for(dropContent of dropContentList) {
            if($(dropContent).css("display") === "none") {
                $(dropContent).css("display", "inline-block");
                $(this).addClass("active");
            } else {
                $(dropContent).css("display", "none");
                $(this).removeClass("active");
            }
        }
    });

    $(".clickable").click(function () {

        event.preventDefault();
        $("#separated_content").empty();

        let request = $(this).attr("href");
        if (request === 'contact') {
            $("#separated_content").append("<div id='contact_content'></div>");
            loadContactsPage();
        } else if (request === 'cars') {
            loadCarsPage();
        } else if (request === 'manufacturers') {
            loadManufacturersPage();
        } else {
            open("index.html", "_self");
        }
    });
});

function loadContactsPage() {

    $("#separated_content").html(   "<h2>Owner contacts</h2>" +
                                    "<table id='contact_content'><tr><th>Name:</th><td>Krisztián Lipták</td></tr>" +
                                    "<tr><th>Neptun code:</th><td>NK7XZU</td></tr>" +
                                    "<tr><th>E-mail:</th><td><a href='mailto:qekwaryi@uni-miskolc.hu'>qekwaryi@uni-miskolc.hu</a></td></tr></table>");
    $(this).scrollTop(0);
}

function loadManufacturersPage() {
    $("#separated_content").html("<h2>Listing manufacturers</h2>");

    $.get("manufacturers", function(manufacturers) {

        let table = $("<table id='tables_v'></table>");
        table.append("<th>Name</th><th>Country</th><th>Founded</th>");

        for (manufacturer of manufacturers) {

                //Converts first characters to uppercase
                let nameFirstChar = manufacturer.name.charAt(0).toUpperCase();
                let nameOtherChars = manufacturer.name.slice(1);
                let countryFirstChar = manufacturer.country.charAt(0).toUpperCase();
                let countryOtherChars = manufacturer.country.slice(1);

                table.append(   "<tr>" +
                                    "<td><a style='font-weight: bold' href='javascript:void(0)'>" + nameFirstChar + nameOtherChars + "</a></td>" +
                                    "<td>" + countryFirstChar + countryOtherChars + "</td>" +
                                    "<td>" + manufacturer.founded + "</td>" +
                                "</tr>");

                $("#separated_content").append(table);

            let name = manufacturer.name;
            table.find("tr:last td a").click( function() {
                getCarsForManufacturer(name, "loadManufacturersPage");
            });
        }
        $("#separated_content").append("<tr><td id='tables_v' style='border:none'><a class='buttons' href='javascript:loadAddManufacturerPage()'>+ ADD NEW MANUFACTURER</a></td></tr>");
        $(this).scrollTop(0);
    });
}

function loadAddManufacturerPage() {
    $("#separated_content").html("<h2>Add new manufacturer</h2>");

    $.get("addManufacturer.html", function(formHTML) {
        form = $(formHTML);

        form.submit(function(event) {
            event.preventDefault();
            $.ajax({
                url: 'addManufacturers',
                type: 'post',
                data: $('form').serialize(),
                success: function (data, status, jQxhr) {
                    loadManufacturersPage();
                },
                error: function (jqXhr, status, errorThrown) {
                    if (jqXhr.status === 409) {
                        alert("There is already a manufacturer with this name in the database");
                    } else {
                        alert("Something is not right, see log for more information");
                        console.log(jqXhr);
                    }
                }
            });
        });

    $("#separated_content").append(form)
    }, 'html');
    $(this).scrollTop(0);
}

function loadCarsPage() {
    $("#separated_content").html("<h2>Listing cars</h2>");

    $.get("cars", function(cars) {

        $.get("manufacturerNames", function(manufacturerNames) {
            let manufacturers = manufacturerNames;

        let available = "";
        let table = $("<table id='tables_h'></table>");
        table.append(   "<tr>" +
                            "<th style='text-align: left'>Manufacturer – Name</th><th>Consumption</th><th>Horsepower</th><th>Year</th><th>Color</th><th>Available</th>" +
                        "</tr>");

        for (car of cars) {
            let name = car.manufacturer;

            if(car.available > 0) {
                available = "<image src='images/tick.png' alt='Yes' width='20px' height='20px'>";
            } else {
                available = "<image src='images/cross.png' alt='N/A' width='20px' height='20px'>";
            }

            //Converts first characters to uppercase
            let colorFirstChar = car.color.charAt(0).toUpperCase();
            let colorOtherChars = car.color.slice(1);

            table.append(   "<tr>" +
                                "<td style='width:800px; text-align:left'><a style='font-weight:bold' href='javascript:void(0)'>" + car.manufacturer + "</a> – " + car.name + "</td>" +
                                "<td>" + car.consumption + "</td>" +
                                "<td>" + car.horsepower + " hp </td>" +
                                "<td>" + car.year + "</td>" +
                                "<td>" + colorFirstChar + colorOtherChars + "</td>" +
                                "<td style='text-align:center'>" + available + "</td>" +
                            "</tr>");

            $("#separated_content").append(table);

                if(manufacturers.includes(name)) {
                    let pageBefore = "loadCarsPage";
                    table.find("tr:last td a").click(function () {
                        getCarsForManufacturer(name, "loadCarsPage");
                        });
                }
                else {
                    table.find("tr:last td a").click(function () {
                        alert("Manufacturer not found in database! Redirecting ...");
                        loadAddManufacturerPage();
                    });

                }
        }
        $("#separated_content").append("<tr><td id='tables_h' style='border:none'><a class='buttons' href='javascript:loadAddCarPage()'>+ ADD NEW CAR</a></td></tr>");
        $(this).scrollTop(0);
        });
    });
}

function loadAddCarPage() {
    $("#separated_content").html("<h2>Add new car</h2>");

    $.get("addCar.html", function(formHTML) {
        form = $(formHTML);

        form.submit(function(event) {
            event.preventDefault();
            $.ajax({
                url: 'addCar',
                type: 'post',
                data: $('form').serialize(),
                success: function (data, status, jQxhr) {
                    loadCarsPage();
                },
                error: function (jqXhr, status, errorThrown) {
                    if (jqXhr.status === 409) {
                        alert("There is already a car with this name in the database!");
                    } else {
                        alert("Something is not right, see log for more information");
                        console.log(jqXhr);
                    }
                }
            });
        });

        $("#separated_content").append(form)
    }, 'html');
    $(this).scrollTop(0);
}

function getCarsForManufacturer(manufacturerName, pageBefore) {
    document.cookie = "name=" + manufacturerName;

    $("#separated_content").html("<h2>Listing cars for " + manufacturerName + " </h2>" );

    $.get("manufacturer", function(cars) {

        let available = "";
        let table = $("<table id='tables_v'></table>");

        for (car of cars) {

            if(car.available > 0) {
                available = "<image src='images/tick.png' alt='Yes' width='20px' height='20px'>";
            } else {
                available = "<image src='images/cross.png' alt='N/A' width='20px' height='20px'>";
            }

            //Converts first characters to uppercase
            let firstChar = car.color.charAt(0).toUpperCase();
            let otherChars = car.color.slice(1);

            table.append(   "<tr>" +
                                "<th>Manufacturer:</th><td>" + car.manufacturer + "</a></td>" +
                                "<th>Name:</th><td>" + car.name + "</td>" +
                                "<th>Consumption:</th><td>" + car.consumption + "</td>" +
                                "<th>Horsepower:</th><td>" + car.horsepower + " hp </td>" +
                                "<th>Year:</th><td>" + car.year + "</td>" +
                                "<th>Color:</th><td>" + firstChar + otherChars + "</td>" +
                                "<th>Available:</th><td>" + available + "</td>" +
                            "</tr>");

            $("#separated_content").append(table);
        }
        $("#separated_content").append("<tr><td id='tables_v' style='border:none'><a class='buttons' href='javascript:" + pageBefore + "()'" + "><- BACK</a></td></tr>");
        $(this).scrollTop(0);
    });
}