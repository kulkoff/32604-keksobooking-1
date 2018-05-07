'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
  var PHOTO_SIZE = 70;
  var fileChooserAvatar = document.querySelector('#avatar');
  var previewAvatar = document.querySelector('.ad-form-header__preview img');
  var fileChooserPlace = document.querySelector('#images');
  var previewPlace = document.querySelector('.ad-form__photo');

  fileChooserAvatar.addEventListener('change', function () { // фото для аватара
    var file = fileChooserAvatar.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        previewAvatar.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  fileChooserPlace.addEventListener('change', function () { // фото для объявления
    var file = fileChooserPlace.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();
      reader.addEventListener('load', function () {
        var placePhoto = document.createElement('img');
        placePhoto.style.width = PHOTO_SIZE + 'px';
        placePhoto.style.height = PHOTO_SIZE + 'px';
        previewPlace.appendChild(placePhoto);
        placePhoto.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  window.photo = {
    previewAvatar: previewAvatar,
    previewPlace: previewPlace
  };

})();