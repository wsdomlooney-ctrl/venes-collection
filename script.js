document.addEventListener("DOMContentLoaded", function () {

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");

  if (menuToggle && navigation) {

    menuToggle.addEventListener("click", function () {
      navigation.classList.toggle("mobile-open");
    });

    const links = navigation.querySelectorAll("a");

    links.forEach(function (link) {
      link.addEventListener("click", function () {
        navigation.classList.remove("mobile-open");
      });
    });

  }

});
