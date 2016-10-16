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
        replaceInvalid('img:last');
      }
    });
  });

  replaceInvalid('img');
  $(".delete-icon").click(remove);
});

function remove() {
  var element = this.parentNode;
  $.ajax({
    url: '/api/entry',
    type: 'DELETE',
    data: {
      id: this.dataset.id
    },
    success: function(response) {
      grid.masonry('remove', element).masonry('layout');
    }
  });
}

function replaceInvalid(query) {
  $(query).one('error', function() { this.src = '/resources/placeholder.png'; });
}
