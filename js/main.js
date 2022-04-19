$(document).ready(function () {
  // =========================== Khai báo các biến ===========================
  let searchBtn = $('#searchBtn'),
    searchInput = $('#searchInput');

  // Khi vào trang homepage sẽ gọi hàm renderHeadlines để render list articles
  renderHeadlines();

  // ============== Xử lý sự kiện khi nhấn vào "My News" hoặc logo ==================
  $('.myNews').on('click', function () {
    // Ẩn / Xóa các section "báo lỗi tìm kiếm" hoặc "kết quả tìm kiếm" khi user quay về homepage My News
    $('#notFound').hide();
    $('#search__list').html('');

    // Hiển thị nút loading
    $('#headlines__list').html('<div class="loader"></div>');
    renderHeadlines();
  });

  // ============== Xử lý sự kiện khi nhấn vào nút tìm kiếm  ==================
  $(searchBtn).on('click', function () {
    let searchKeyword = $('#searchInput').val();
    $('#searchInput').val('');
    $('.close').click();
    $('#headlines__list').html('<div class="loader"></div>');
    handleSearch(searchKeyword);
  });

  // ============== Xử lý sự kiện khi user nhập keyword tìm kiếm và nhấn Enter  ==================
  $(searchInput).on('keypress', function (e) {
    let searchKeyword = $('#searchInput').val();
    if (e.which == 13 && searchKeyword) {
      $('#headlines__list').html('<div class="loader"></div>');
      $('#searchInput').val('');
      $('.close').click();
      handleSearch(searchKeyword);
    }
  });

  $(function () {
    $('#datepicker__from').datepicker();
    $('#datepicker__to').datepicker();
  });

  /**
   * @description Hàm render tin tức ra màn hình homepage sau khi gọi API
   */

  let arrayList

  function renderHeadlines() {
    $.ajax({
      url: 'https://gnews.io/api/v4/top-headlines?token=02e6c9499f435bcc39d272f7bc6b4219&lang=en',
      dataType: 'json',
      type: 'get',
      cache: false,
      success: function (result) {
        $('#headlines__list').html('').show();

        renderHTML(result.articles, '#headlines__list');
       
      },
    });
  }

  /**
   * @description Hàm xử lý tác vụ TÌM KIẾM và render ra giao diện
   * @param keyword - từ khóa user nhập vào thẻ input
   */

  function handleSearch(keyword) {
    // Dùng toán tử 3 ngôi để kiểm tra xem nếu người dùng không lựa chọn Filter ngày thì gán biến dateFrom và dateTo là ''
    let dateFrom = $('#dateFrom').val() ? new Date($('#dateFrom').val()) : '',
      dateTo = $('#dateTo').val() ? new Date($('#dateTo').val()) : '';

    // Gọi API lấy list articles
    $.ajax({
      url: `https://gnews.io/api/v4/search?q=${keyword}&token=02e6c9499f435bcc39d272f7bc6b4219&lang=en&from=${dateFrom}&to=${dateTo}`,
      dataType: 'json',
      type: 'get',
      cache: false,
      success: function (result) {
        arrayList = result.articles
        $('#headlines__list').html('');
        renderSort(result.totalArticles, 'hideBtn', 'showBtn');

        // Nếu kết quả tìm kiếm không có thì render giao diện báo k tìm thấy kết quả
        if (result.articles.length == 0) {
          $('#notFound').show();
        } else {
          $('#headlines__list').hide();
          $('#search__noti').show();
          $('#search__noti #searchResultInput').val(keyword);
          $('#search__noti em').html(`"${keyword}"`);

          renderHTML(result.articles, '#search__results');
        }
      },
    });
  }

  console.log(arrayList);

  // =================== Xử lý sự kiện click vào icon Sort tin tức theo gần nhất / cũ nhất ========================
  // Sử dụng event delegation để kiểm tra thuộc tính data-action của icon được click thuộc latest hay oldest
  $('#search__results').on('click', '.sortBtn', function (event) {
    console.log(arrayList);
    event.preventDefault();
    let action = $(this).attr('data-action');

    switch (action) {
      case 'sortLatest':
        sortList('sortLatest');
        break;

      case 'sortOldest':
        sortList('sortOldest');
        break;
    }
  });

  /**
   * @description Hàm lọc tin tức theo thời gian
   * @param action - lọc theo gần nhất / cũ nhất
   */
  function sortList(action) {
    let arrRows = $(document).find('.articles__item').get(),
      totalArticles = $('.result__count em').text();

    switch (action) {
      case 'sortOldest':
        arrRows.sort(function (a, b) {
          let dateEle1 = $(a).find('.publishDate').get(),
            dateEle2 = $(b).find('.publishDate').get(),
            date1 = $(dateEle1).text(),
            date2 = $(dateEle2).text();

          // Ref: https://thewebdev.info/2021/09/04/how-to-sort-a-javascript-array-by-iso-8601-date/
          return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
        });

        renderSort(totalArticles, 'showBtn', 'hideBtn');

        $.each(arrRows, function (index, row) {
          $('#search__results').append(row);
        });
        break;

      case 'sortLatest':
        arrRows.reverse();
        renderSort(totalArticles, 'hideBtn', 'showBtn');
        $.each(arrRows, function (index, row) {
          $('#search__results').append(row);
        });
        break;
    }
  }

  /**
   * @description Hàm render tin tức ra giao diện homepage (trang headlines)
   * @param responseAPI data trả về sau khi gọi API
   * @param elementRender section sẽ được render tin tức ra
   */

  function renderHTML(responseAPI, elementRender) {
    $(responseAPI).each(function (index, article) {
      $(elementRender).append(
        `<div class="articles__item">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-md-6 article__img" id="article__img">
              <a href="${article.url}" target="_blank"><figure><img src="${article.image}" alt="" /></figure></a>
            </div>

            <div
              class="col-xs-12 col-md-6 article__content"
              id="article__content"
            >
            <div
              class="article__item"
              id="article__item"
            >
              <a class="article__title" href="${article.url}" target="_blank">${article.title}</a>
              <p class="publishDate"><i class="fa-solid fa-clock"></i>${article.publishedAt}</p>
              <p>
                ${article.description}
              </p>
            </div>
            </div>
          </div>
        </div>
      </div>`
      );
    });
  }

  /**
   * @description Hàm render ra giao diện section tìm kiếm tin tức, gồm số tin tức tìm kiếm được và 2 icon lọc latest/oldest
   * @param totalCtn - Tổng số tin tìm kiếm được
   * @param sortLatest - tên class thể hiện việc show/hide icon sortLatest
   * @param sortOldest - tên class thể hiện việc show/hide icon sortOldest
   */
  function renderSort(totalCtn, sortLatest, sortOldest) {
    $('#search__results').html(
      `
            <div class="results__container">
            <div class="results__info">
    <div class="result__count">
      <span>Articles (<em>${totalCtn}</em>)</span>
    </div>
    <div class="sortBy">
    <div class="sortBy__latest ${sortLatest}">
    <i data-action="sortLatest" class="sortBtn fa-solid fa-arrow-down-wide-short"></i><span>Sort by <strong>Latest</strong></span>
    </div>

    <div class="sortBy__oldest ${sortOldest}">
          <i data-action="sortOldest" class="sortBtn fa-solid fa-arrow-up-wide-short"></i><span>Sort by <strong>Oldest</strong></span>
      </div>
      </div>
      </div>
      </div>
            `
    );
  }
});
