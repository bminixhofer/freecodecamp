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
        var gridSelector = ".grid-item[data-id=" + response.id + "] ";
        $(gridSelector + ".delete-icon").click(remove);

        //inline is declared in inline_svg.js
        inline($(gridSelector + ".vote").get(0), function() {
          $(gridSelector + ".vote").click(vote);
        });
      }
    });
  });
  $(".delete-icon").click(remove);
  $(".vote").click(vote);
});

function vote(e) {
  var target = $(e.target).closest("svg").get(0);
  target = $(target);
  var voteCounter = target.prev();
  var id = target.closest(".grid-item").get(0).dataset.id;
  var original = Number(voteCounter.text());

  var text;
  if(target.hasClass('empty')) {
    text = original + 1;
  } else {
    text = original - 1;
  }
  voteCounter.text(text);
  target.toggleClass('full empty');

  $.ajax({
    url: '/api/vote',
    dataType: 'json',
    type: 'PATCH',
    data: {
      id: id
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
