var grid = $('.grid').masonry({
  itemSelector: '.grid-item',
  percentPosition: true,
  columnWidth: '.grid-sizer'
});

grid.imagesLoaded().progress(function() {
  grid.masonry();
});

$(document).ready(function() {
  $("#add-entry").click(function() {
    $.ajax({
      url: '/api/entry',
      dataType: 'json',
      type: 'PUT',
      data: {
        image: $("#source-input").val(),
        description: $("#description-input").val()
      },
      success: function(response) {
        var item = $(response.html);
        grid.append(item).masonry('appended', item);
        $(".delete-icon[data-id=" + response.id + "]").click(remove);
        replaceInvalid('img');
      }
    });
  });
  replaceInvalid('img');
  $(".delete-icon").click(remove);
  $(".vote").click(vote);
});

function vote(e) {
  var target = $(e.target).closest("svg").get(0);
  target = $(target);
  var voteCounter = target.prev();
  var id = target.closest(".grid-item").get(0).dataset.id;
  var original = voteCounter.text();

  voteCounter.text(Number(voteCounter.text()) + 1);
  target.toggleClass('full empty');

  $.ajax({
    url: '/api/vote',
    dataType: 'json',
    type: 'PATCH',
    data: {
      id: id
    },
    success: function(response) {
      console.log(response);
    },
    error: function(response) {
      voteCounter.text(original);
      target.toggleClass('full empty');
    }
  });
}

function remove() {
  var element = this.parentNode;
  $.ajax({
    url: '/api/entry',
    type: 'DELETE',
    data: {
      id: $(this).closest(".grid-item").get(0).dataset.id
    },
    success: function(response) {
      grid.masonry('remove', element).masonry('layout');
    }
  });
}

function replaceInvalid(query) {
  $(query).one('error', function() { this.src = '/resources/placeholder.png'; });
}
