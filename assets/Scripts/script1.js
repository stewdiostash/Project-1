// Declared Global Variables

var omdbAPI = "b22163a3";
var spoonacularAPI = "&apiKey=074bf8b019424ce6945ad1bc2ede2965";
// var spoonacularAPI = "&apiKey=8e22a5e31dcc4d959a0190eca3ccff29";
var searchInputEl = $("#foodSearchEl");

// ============== Order Matters for spoonacular query construction ===== ALL QUERY INPUTS MUST BE SEPARATED BY COMMAS==============
var spoonacularBaseURL = "https:api.spoonacular.com/recipes/complexSearch?query=";



// Page variables
var pageOne = $("#page-one");
var pageTwo = $("#page-two");
var pageThree = $("#page-three");
var intolerancesList = $("#intolerances-list");
var intolerancesArray = [];
var movieGenreArray = [];
var familyMode = false;

// Button Variables
var startBtn = $("#main-start-btn");
var foodNextBtn = $("#food-next-btn");
var movieNextBtn = $("#movie-next-btn");
var searchBtn = $('#searchBtnEl')

// Page Content Variables
var startCard = $("#start-card");
var foodContent = $(".food-page-content");
var movieContent = $(".movie-page-content");
var recipeResults = $("#recipe-results-container");
var suggestionsContainer = $("#mealSuggestionContainer");
var mainRecipeInfo = $("#main-recipe-info");
var mainRecipeImage = $("#main-recipe-img");


//---------------------------------------------------------------------------------------------------------------------
// Page One

// Removes content that is not the main card when the page loads
foodContent.attr("style", "display: none;");
movieContent.attr("style", "display: none;");

// !!!
// These buttons will also save the state of the checkboxes in local storage, but the checkboxes are not currently working, to fix today
// !!!

// Removes the main card and moves on to the foodContent on 'start' button click
startBtn.on("click", function () {
    startCard.attr("style", "display: none;");
    foodContent.attr("style", "display: block;");
});

// Removes the foodContent and moves on to the movieContent on 'next' button click
foodNextBtn.on("click", function () {
    foodContent.attr("style", "display: none;");
    movieContent.attr("style", "display: block;");
});

// Links to pageTwo when the movieNext button is clicked
movieNextBtn.on("click", function () {
    pageOne.attr("style", "display: none;");
    pageTwo.attr("style", "display: block;");
    $("body").attr("style", "background-color: white");
});

// Adds checkbox values to intolerancesArray, finds and removes of unchecked
intolerancesList.on("click", ".form-check-input", function (){
    if($(this).is(":checked")){
        intolerancesArray.push($(this).val());
        console.log(intolerancesArray);
    }
    else if($(this).is(":not(:checked)")){
        var position = intolerancesArray.indexOf($(this).val());
        intolerancesArray.splice(position, 1);
        console.log(intolerancesArray);
    }
})


// ------------------------------------------------------------------------------------------------------------------------
// Page Two

// Consolidates user inputs into variables and makes FIRST API call

searchBtn.on("click", function(event){
    // prevent reload
    event.preventDefault();
    // create a variable equal to the user's search input
    var searchTerms = searchInputEl.val().toLowerCase();
    console.log(searchTerms);
    // generate a string from the intolerancesArray
    var intoleranceString = intolerancesArray.toString();
    console.log(intoleranceString);
    // generate a query url based on searchTerms and intoleranceString
    var foodSearchURL = spoonacularBaseURL + searchTerms + "&intolerances=" + intoleranceString + spoonacularAPI;
    // make ajax call using foodSearchURL
    $.ajax({
        method:"GET",
        url:foodSearchURL
    }).then(function(response){
        console.log(response);
        suggestionsContainer.attr("style", "display: none;");
        var searchResponse = response.results;

        // Populates the search results container with the query response
        for (i=0; i<searchResponse.length; i++) {

            // New div to be added to the container
            var newSearchResult = $("<div>");
            newSearchResult.addClass("row border rounded my-3 p-3 bg-secondary search-result");
            newSearchResult.attr("recipeId", searchResponse[i].id);
                // Thumbnail Image
                var newThumbnail = $("<img>");
                newThumbnail.addClass("col-4");
                newThumbnail.attr("src", searchResponse[i].image);
                // Recipe Title  
                var newTitle = $("<h3>");
                newTitle.text(searchResponse[i].title);
                // Appends image and text to result div
                newSearchResult.append(newThumbnail);
                newSearchResult.append(newTitle);
            // Appends search result to results container
            recipeResults.append(newSearchResult);
        }

        // Displays the search results when they are finished populating
        recipeResults.attr("style", "display: block;");
    })
})

// Replicates above IF USER SELECTS PRE-SET CHOICES

// Use Event Delegation to listen to the mealSuggestionContainer
suggestionsContainer.on("click", '.foodSuggestionCard', function(){
    var instaSearchTerm = $(this).attr('id');
    console.log(instaSearchTerm);
    var intoleranceString = intolerancesArray.toString();
    var instaSearchUrl = spoonacularBaseURL + instaSearchTerm + "&intolerances=" + intoleranceString + spoonacularAPI;

    $.ajax({
        method:"GET",
        url:instaSearchUrl
    }).then(function(response){
        console.log(response);
        suggestionsContainer.attr("style", "display: none;");
        var searchResponse = response.results;
        // Populates the search results container with the query response
        for (i=0; i<searchResponse.length; i++) {

            // New div to be added to the container
            var newSearchResult = $("<div>");
            newSearchResult.addClass("row border rounded my-3 p-3 bg-secondary search-result");
            newSearchResult.attr("recipeId", searchResponse[i].id);
                // Thumbnail Image
                var newThumbnail = $("<img>");
                newThumbnail.addClass("col-4");
                newThumbnail.attr("src", searchResponse[i].image);
                // Recipe Title  
                var newTitle = $("<h3>");
                newTitle.text(searchResponse[i].title);
                // Appends image and text to result div
                newSearchResult.append(newThumbnail);
                newSearchResult.append(newTitle);
            // Appends search result to results container
            recipeResults.append(newSearchResult);
        }
        recipeResults.attr("style", "display: block;");
    })

    
})

// Populates final page
$(recipeResults).on("click", ".search-result" , function(event) {
    console.log("Clicked on a result");
    console.log($(this));

    // Remove the search bar and results, show a page of the recipe details
    pageTwo.attr("style", "display: none;");
    pageThree.attr("style", "display: block;");

    $.ajax ({
        method: "GET",
        url: "https://api.spoonacular.com/recipes/" + $(this).attr("recipeId") + "/information?includeNutrition=true" + spoonacularAPI
    }).then(function(response){
        console.log(response);
        // Creates text info from the response
        var finalTitle = $("<h1>");
        finalTitle.text(response.title);
        var finalInfo = $("<p>");
        finalInfo.html(response.summary);

        // Iterates and lists each ingredient
        var finalIngredients = $("<ol>");
        var firstIngredient = $("<h3>");
        firstIngredient.text("Ingredients in This Recipe:");
        finalIngredients.append(firstIngredient);
        var ingredientsList = response.extendedIngredients;
        for (i=0; i<ingredientsList.length; i++) {
            var newIngredient = $("<li>");
            newIngredient.text(ingredientsList[i].name);
            finalIngredients.append(newIngredient);
        }
        console.log(finalIngredients);
        // Iterates and lists the directions
        var finalDirections = $("<ol>");
        var firstDirection = $("<h3>");
        firstDirection.text("Step-by-Step Instructions:");
        finalDirections.append(firstDirection);

        // IF the directions include substeps, display them properly, IF NOT, display a normal numbered list
        var instructionsList = response.analyzedInstructions;
        for (i=0; i<instructionsList.length; i++) {
            if (instructionsList[i].name !== "") {
                var newInstruction = $("<li>");
                newInstruction.addClass("my-3");
                newInstruction.text(instructionsList[i].name);
                var newList = $("<ol>");
                newList.attr("style", "list-style-type: lower-alpha;")
                for (q=0; q<instructionsList[i].steps.length; q++) {
                    var newSubIntruction = $("<li>");
                    newSubIntruction.text(instructionsList[i].steps[q].step);
                    newList.append(newSubIntruction);
                }
            newInstruction.append(newList);
            finalDirections.append(newInstruction);
            } else {
                for (q=0; q<instructionsList[i].steps.length; q++) {
                    var newInstruction = $("<li>")
                    newInstruction.addClass("my-3");
                    newInstruction.text(instructionsList[i].steps[q].step);
                    finalDirections.append(newInstruction);
                }
            }
        }

        // append text info
        mainRecipeInfo.append(finalTitle);
        mainRecipeInfo.append(finalInfo);
        mainRecipeInfo.append(finalIngredients);
        mainRecipeInfo.append(finalDirections);
        // appends image
        mainRecipeImage.attr("src", response.image);
    })
});



    

    
