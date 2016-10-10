$("document").load(function() {
  $("sign").on("click", function() {
    window.location.href = "<some domain>/request-token";
  });
});
