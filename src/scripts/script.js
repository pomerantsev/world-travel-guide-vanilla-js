(function () {
  let getTemplate = scope => `
    <h2>${scope.countryName}</h2>
    <div>
      <img class="country-image"
           src="${scope.imageSrc}">
    </div>
  `;

  function updateModel () {
    let countryName = new window.Chance().country({full: true});
    return window.fetch(`https://country-images.herokuapp.com/image?q=${encodeURIComponent(countryName)}`)
      .then(response => response.json())
      .then(data => {
        let imageSrc = data.url;
        return {countryName, imageSrc};
      });
  }

  function updateComponent (component) {
    component.style.opacity = 0;
    updateModel().then(model => {
      component.innerHTML = getTemplate(model);
      component.style.opacity = 1;
    });
  }

  window.addEventListener('load', function () {
    let component = document.getElementById('js-component-container');
    updateComponent(component);
    document.getElementById('js-update-button').addEventListener('click', function () {
      updateComponent(component);
    });
  });
})();
