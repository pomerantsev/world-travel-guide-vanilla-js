(function () {
  let component,
      countryName,
      imageSrc;

  let getTemplate = () => `
    <h2>${countryName}</h2>
    <div>
      <img class="country-image"
           src="${imageSrc}">
    </div>
  `;

  function updateModel () {
    return new Promise(resolve => {
      countryName = new window.Chance().country({full: true});
      resolve();
    });
  }

  function updateComponent () {
    component.style.opacity = 0;
    updateModel().then(() => {
      component.innerHTML = getTemplate();
      component.style.opacity = 1;
    });
  }

  window.addEventListener('load', function () {
    component = document.getElementById('js-component-container');
    updateComponent();
    document.getElementById('js-update-button').addEventListener('click', updateComponent);
  });
})();
