$(document).ready(function() {

	//init variable and default value for grid size (number of squares across the width)
    var size = "24";
    //init variable and default value for effect type ("shader")
    var effect = "incGrad";
    //init variable for click-to-toggle-drawing on/off, default to false(off)
    var draw = false;

    
    //function to hide the toolbar if the screen is too small
    $(window).on('focus', function() {
            var win = $(this); //this = window
            if (win.width() <= 1350) {
                $(".toolbar").animate({
                    'left': -370
                }), 500;
                $(".container").css("margin", "auto");
            } 

            else if (win.width() > 1300) {
                $(".toolbar").animate({
                    'left': 0
                }), 500;
                $(".container").css("margin-left", "500px");

            }
        });

    
    //setup the effect radio buttons, set default checked (uses jquery ui)
    $(function() {

        $('input:radio[name=radio]').val(['incGrad']);

        $("#effect").buttonset();
    });


    //setup the rgb sliders
    $(function() {
        $("#red, #green, #blue").slider({
            orientation: "horizontal",
            range: "min",
            max: 255,
            value: 127,
            slide: refreshSwatch,
            change: refreshSwatch
        });


        //function to set sliders to random positions for random colour
        function rndColor() {
            var iRed = Math.floor((Math.random() * 255) + 1);
            var iGreen = Math.floor((Math.random() * 255) + 1);
            var iBlue = Math.floor((Math.random() * 255) + 1);

            $("#red").slider("value", iRed);
            $("#green").slider("value", iGreen);
            $("#blue").slider("value", iBlue);
        };


        rndColor();


        //function to convert rgb values from sliders to hex fromat
        function hexFromRGB(r, g, b) {
            var hexArr = [
                r.toString(16),
                g.toString(16),
                b.toString(16)
            ];
            $.each(hexArr, function(nr, val) {
                if (val.length === 1) {
                    hexArr[nr] = "0" + val;
                }
            });
            return hexArr.join("").toUpperCase();
        }


        //function to update swatch with new colour
        function refreshSwatch() {
            var red = $("#red").slider("value");
            var green = $("#green").slider("value");
            var blue = $("#blue").slider("value");
            var hex = hexFromRGB(red, green, blue);
            $("#swatch").css("background-color", "#" + hex);

        };


        //"clear drawing" button function, prompts for new grid size, redraws grid
        $("#reset").on('click', function() {
            do {
                size = prompt("Enter a size (MAX 84)", "32");
                parseInt(size);
            } while (size > 84);
            draw = false;
            drawGrid(size);
        });

        
        //sets up the grid size selector and initializes it with the size value
        $(function() {

            var spinner = $("#spinner").spinner({
                min: 8,
                max: 64,
                increment: 'fast',
                step: 8
            });

            $(function() {
                spinner.spinner("value", size);
            });

        });

        
        //click handler to turn drawing on/off, also removes the initial text in the draw area
        $(".container").on('click', function() {
            $(".draw-hint").remove();
            if (draw === true) {
                draw = false;
            } else if (draw === false) {
                draw = true;
            };
        });

        
        //function to hide the toolbar if the screen is too small
        $(window).on('resize', function() {
            var win = $(this); //this = window
            if (win.width() <= 1350) {
                $(".toolbar").animate({
                    'left': -370
                }), 500;
                $(".container").css("margin", "auto");

            } 
            else if (win.width() > 1300) {
                $(".toolbar").animate({
                    'left': 0
                }), 500;
                $(".container").css("margin-left", "500px");

            }
        });

        
        //draw the div grid using size var to calculate div size and number based on the browser window size
        function drawGrid(size) {

            $(".container").css({
                height: $(window).width() / 2 - 16,
                width: $(window).width() / 2
            });

            $(".container").empty();

            var side = ($(window).width() - 16) / 2 / size;

            for (i = 0; i < size * size; i++) {
                $(".container").append($("<div>", {
                    class: "row",
                    width: side,
                    height: side
                }));

            }
            

            //add the click to draw text in the draw area
            $(".container").append($("<div>", {
                class: "draw-hint"
            }));
            $(".draw-hint").append($("<h2>Click in this box to start drawing, click again to stop</h2>"));

            
            //handler for what to do when mouse is moved to a div in the draw area
            $('.row').mouseenter(function() {
                var red = $("#red").slider("value"),
                    green = $("#green").slider("value"),
                    blue = $("#blue").slider("value"),
                    hex = hexFromRGB(red, green, blue);

                
                //if statements to check the selected effect and what state the draw toggle is. will only execute color and opacity changes if draw is true
                if (effect === "none" && draw === true) {
                    $(this).css({
                        "background-color": "#" + hex,
                        "opacity": 1
                    });

                
                //trail effect
                } else if (effect === "trail" && draw === true) {

                    //gets opacity value of current div and converts to Int
                    var opacity = parseFloat($(this).css("opacity"));
                    var col = ($(this).css("background-color"))
                    if (opacity === 0) {
                        opacity = 1
                    }

                    $(this).css({
                        "background-color": "#" + hex,
                        "opacity": opacity -= 0.1
                    });
                    $(this).animate({
                        'opacity': opacity,
                        "background-color": col + 30
                    }, 1000);

                } else if (effect === "incGrad" && draw === true) {

                    //gets opacity value of current div and converts to Int, adds 0.1 opacity to existing opacity
                    var opacity = parseFloat($(this).css("opacity")) + 0.1;
                    if ($(this).css("background-color") !== $("#swatch").css("background-color")) {
                        opacity = 0.1;
                    };

                    $(this).css({
                        "background-color": "#" + hex,
                        "opacity": opacity
                    });

                } else if (effect === "erase" && draw === true) {

                    var opacity = parseFloat($(this).css("opacity")) - 0.25;
                    $(this).css({
                        "opacity": opacity
                    });

                };

            });

            //});
        };

        drawGrid(size);

        
        //refresh grid if spinner value changed
        $('#spinner').on("spinstop", function() {

            size = $(this).spinner('value');
            draw = false;
            drawGrid(size);

        });

        
        //gets draw effect from radio buttons
        $('#draw-effect input').on('change', function() {
            effect = ($('input[name=radio]:checked', '#effect').val());
        });

        
        //sets a random colour when button is pressed
        $("#random-color").on('click', function() {
            rndColor();
        });

    });

});