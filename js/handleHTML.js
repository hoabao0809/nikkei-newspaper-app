$(function () {
  // Xử lý xóa input
  $('#input-erase').on('click', function () {
    $('#searchInput').val('');
  });

  /**
   * Xử lý tác vụ liên quan thanh navbar
   */
  // FIXED NAVBAR
  let navbar = $('#header');
  $(window).scroll(function () {
    let height = $(window).scrollTop();

    if (height > 50) {
      $(navbar).addClass('fixed-top');
    } else {
      $(navbar).removeClass('fixed-top');
    }
  });

  // COLLAPSE NAVLINK
  const navClose = $('#nav-close');
  const navMenu = $('#collapsibleNavId');
  const navLink = $('.nav-link');

  if (navClose) {
    $(navClose).on('click', function () {
      $(navMenu).removeClass('show');
    });
  }
  $(navLink).each(function (index, link) {
    $(link).on('click', function () {
      $(navMenu).removeClass('show');
    });
  });
});
