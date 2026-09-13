document.querySelectorAll('.navitem').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.navitem').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('page-' + btn.dataset.page).classList.add('active');
    window.scrollTo(0, 0);
  });
});

document.querySelectorAll('.tabs').forEach(function (tabGroup) {
  tabGroup.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabGroup.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
      var panels = tabGroup.parentElement.querySelectorAll('.tabpanel');
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
    });
  });
});
