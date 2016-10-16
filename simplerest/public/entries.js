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
      type: 'PUT',
      data: {
        image: $("#source-input").val(),
        description: $("#description-input").val()
      },
      success: function(result) {
        location.reload();
      }
    });
  });

  $(".delete-icon").click(function() {
    var element = this.parentNode;
    $.ajax({
      url: '/api/entry',
      type: 'DELETE',
      data: {
        id: this.dataset.id
      },
      success: function(response) {
        grid.masonry('remove', element);
      }
    });
  });
});
