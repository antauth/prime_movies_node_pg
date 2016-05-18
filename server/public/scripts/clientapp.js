$(document).ready(function () {
  getMovies();

  // add a movie
  $('#movieSubmit').on('click', postMovie);

  // event listeners for Movies list
  $('#movieList').on('click', '.update', putMovie);
  $('#movieList').on('click', '.delete', deleteMovie);
});

/**-------- UTILITY FUNCTIONS --------**/
function dataPrep(button) {
  // get the movie data
  var movie = {};
  console.log(button.parent().children());
  console.log(button.parent().children().serializeArray());
  $.each(button.parent().children().serializeArray(), function (i, field) {
    movie[field.name] = field.value;
  });

  console.log('dataPrep', movie);

  return movie;
}

function getMovieId(button) {
  // get the movie ID
  var movieId = button.parent().data('movieId');
  console.log('getMovieId', movieId);
  return movieId;
}

/**-------- AJAX FUNCTIONS --------**/
function putMovie(event) {
  event.preventDefault();

  var preparedData = dataPrep($(this));
  var movieId = getMovieId($(this));

  $.ajax({
    type: 'PUT',
    url: '/movies/' + movieId,
    data: preparedData,
    success: function (data) {
      getMovies();
    },
  });
}

function deleteMovie(event) {
  event.preventDefault();

  var movieId = getMovieId($(this));

  $.ajax({
    type: 'DELETE',
    url: '/movies/' + movieId,
    success: function (data) {
      getMovies();
    },
  });
}

function getMovies() {
  $.ajax({
    type: 'GET',
    url: '/movies',
    success: function (movies) {
      console.log(movies);
      $('#movieList').empty();
      movies.forEach(function (movie) {
        $container = $('<div></div>');

        // fields I want to edit
        var movieProperties = ['title', 'year', 'director'];
        movieProperties.forEach(function (prop) {
          var $el = $('<input type="text" id="' + prop + '" name="' + prop + '" />');
          $el.val(movie[prop]);
          $container.append($el);
        });

        $container.data('movieId', movie.movie_id);
        $container.append('<button class="update">Update</button>');
        $container.append('<button class="delete">Delete</button>');
        $('#movieList').append($container);
      });
    },
  });
}

function postMovie(event) {
  event.preventDefault();

  var movie = {};

  $.each($('#movieForm').serializeArray(), function (i, field) {
    movie[field.name] = field.value;
  });

  $.ajax({
    type: 'POST',
    url: '/movies',
    data: movie,
    success: function (data) {
      getMovies();
    },
  });
}
