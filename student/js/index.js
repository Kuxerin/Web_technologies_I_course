$(document).ready(function () {

    $.each($(".buttons"), function (buttonIndex, buttonValue) {
        $(buttonValue).click(function (event) {

            event.preventDefault();
            $("#separated_content").empty();

            $("#navigation .buttons.active").removeClass("active");
            $(this).addClass("active");

            let request = $(this).find("a").attr("href");

            switch(request) {
                case 'contact': loadContactsPage(); break;
                case 'manufacturers': loadManufacturersPage(); break;
                case 'addManufacturers': loadAddManufacturerPage(); break;
                case 'cars': loadCarsPage(); break;
                case 'addCar': loadAddCarPage(); break;
                default: open("index.html", "_self"); break;
            }
        });
    });

    function loadContactsPage() {
        $("#separated_content").html(   "<h2>Owner contacts</h2>" +
                                        "<table id='contact_content'>" +
                                            "<tr>" +
                                                "<th>Name:</th><td>Krisztián Lipták</td>" +
                                            "</tr>" +
                                            "<tr>" +
                                                "<th>Neptun code:</th><td>NK7XZU</td>" +
                                            "</tr>" +
                                            "<tr>" +
                                                "<th>E-mail:</th><td><a href='mailto:qekwaryi@uni-miskolc.hu'>qekwaryi@uni-miskolc.hu</a></td>" +
                                            "</tr>" +
                                        "</table>");
    }

    function loadManufacturersPage() {
        $("#separated_content").html("<h2>Listing manufacturers</h2>");

        $.get("manufacturers", function (manufacturers) {

            let table = $("<table id='tables_v'></table>");
            table.append("<th>Name</th><th>Country</th><th>Founded</th>");

            for (let manufacturer of manufacturers) {

                loadManufacturersTable(manufacturer, table);

                $("#separated_content").append(table);

                let name = manufacturer.name;
                table.find("tr:last td a").click(function () {
                    getCarsForManufacturer(name, loadManufacturersPage);
                });
            }

            let addLink = $("<tr><td id='tables_v' style='border:none'><a class='buttons'>+ ADD NEW MANUFACTURER</a></td></tr>");
            addLink.click(loadAddManufacturerPage);
            $("#separated_content").append(addLink);
        });
    }

    function loadAddManufacturerPage() {
        $("#separated_content").html("<h2>Add new manufacturer</h2>");

        $.get("addManufacturer.html", function (formHTML) {
            let form = $(formHTML);

            form.submit(function (event) {
                event.preventDefault();
                $.ajax({
                    url: 'addManufacturers',
                    type: 'post',
                    data: $('form').serialize(),
                    success: function () {
                        loadManufacturersPage();
                    },
                    error: function (jqXhr) {
                        if (jqXhr.status === 409) {
                            alert("There is already a manufacturer with this name in the database");
                        } else {
                            alert("Something is not right, see log for more information");
                            console.log(jqXhr);
                        }
                    }
                });
            });

            $("#separated_content").append(form);
        }, 'html');
    }

    function loadCarsPage() {
        $("#separated_content").html("<h2>Listing cars</h2>");

        $.get("cars", function (cars) {

            $.get("manufacturerNames", function (manufacturerNames) {

                let manufacturers = manufacturerNames;
                let table = $("<table id='tables_h'></table>");
                table.append(   "<tr>" +
                                    "<th style='text-align: left'>Manufacturer – Name</th><th>Consumption</th><th>Horsepower</th><th>Year</th><th>Color</th><th>Available</th>" +
                                "</tr>");

                for (let car of cars) {

                    let name = car.manufacturer;

                    loadCarsTable(car, table);

                    $("#separated_content").append(table);

                    if (manufacturers.includes(name)) {
                        table.find("tr:last td a").click(function () {
                            getCarsForManufacturer(name, loadCarsPage);
                        });
                    }
                    else {
                        table.find("tr:last td a").click(function () {
                            alert("Manufacturer not found in database! Redirecting ...");
                            loadAddManufacturerPage();
                        });
                    }
                }

                let addLink = $("<tr><td id='tables_h' style='border:none'><a class='buttons'>+ ADD NEW CAR</a></td></tr>");
                addLink.click(loadAddCarPage);

                $("#separated_content").append(addLink);
                $(this).scrollTop(0);
            });
        });
    }

    function loadAddCarPage() {
        $("#separated_content").html("<h2>Add new car</h2>");

        $.get("addCar.html", function (formHTML) {
            let form = $(formHTML);

            form.submit(function (event) {
                event.preventDefault();
                $.ajax({
                    url: 'addCar',
                    type: 'post',
                    data: $('form').serialize(),
                    success: function () {
                        loadCarsPage();
                    },
                    error: function (jqXhr) {
                        if (jqXhr.status === 409) {
                            alert("There is already a car with this name in the database!");
                        } else {
                            alert("Something is not right, see log for more information");
                            console.log(jqXhr);
                        }
                    }
                });
            });

            $("#separated_content").append(form);
        }, 'html');
    }

    function getCarsForManufacturer(manufacturerName, clickFunction) {
        document.cookie = "name=" + manufacturerName;

        $("#separated_content").html("<h2>Listing cars for " + manufacturerName + " </h2>");

        $.get("manufacturer", function (cars) {

            let table = $("<table id='tables_v'></table>");

            for (let car of cars) {

                loadCarsTable(car, table);

                $("#separated_content").append(table);
            }
            let backLink = $("<tr><td id='tables_v' style='border:none'><a class='buttons'>BACK</a></td></tr>");
            backLink.click(clickFunction);
            $("#separated_content").append(backLink);
        });
    }

    function loadCarsTable(car, table) {
        let available;
        if (car.available > 0) {
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
    }

    function loadManufacturersTable(manufacturer, table) {

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
    }
});