(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);
})(document);

$(document).ready(function(){
    // Add minus icon for collapse element which is open by default
    $(".collapse.show").each(function(){
        $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
    });
    
    // Toggle plus minus icon on show hide of collapse element
    $(".collapse").on('show.bs.collapse', function(){
        $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function(){
        $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });
});

$(function () {
  function shown(collapsible) {
    // return shown and being transformed to shown
    return collapsible.filter('.show,:not(.show).collapsing');
  }

  $('.button-toggle').click(function () {
    var collapsible = $($(this).attr('data-target') + ' .collapse');
    if (collapsible.length > shown(collapsible).length) { // some blocks are hidden
      collapsible.collapse('show');
    } else {
      collapsible.collapse('hide');
    }
  });
  
  $('[data-toggle="tooltip"]').tooltip();
  
  $('.button-toggle').each(function () {
    var icon = $(this).find('i.fa');
    var collapsible = $($(this).attr('data-target') + ' .collapse')
    collapsible.on('show.bs.collapse hide.bs.collapse', function (e) {
      // at this time .collapsing has not been set yet, so use e.type to detect what is going to happen
      var showMinus = collapsible.length <= shown(collapsible).length + (e.type == 'show' ? +1 : -1);
      icon.toggleClass('fa-angle-double-right', !showMinus);
      icon.toggleClass('fa-angle-double-down', showMinus);
    });
  });

  $('.accordion button[data-toggle="collapse"]').popover({
    placement: 'bottom',
    html: true,
    trigger: 'hover',
    content: function () {
      return $($(this).attr('data-target')).find('.card-body').html();
    }
  });

  $('.collapse').on('show.bs.collapse hidden.bs.collapse', function (e) {
    // do not show popovers when corresponding collapsibles are not fully collapsed
    $(this).closest('.card')
      .find('button[data-toggle="collapse"]')
      .popover('hide')
      .popover(e.type == 'show' ? 'disable' : 'enable');
  });
});
