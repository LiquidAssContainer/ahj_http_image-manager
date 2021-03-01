import Fetch from './Fetch';

export default class ImageManager {
  constructor() {
    this.fileInput = document.getElementById('file-input');
    this.label = document.getElementsByClassName('image-form_label_text')[0];
    this.imgGallery = document.getElementsByClassName('image-gallery')[0];
    this.insertAllImages();
  }

  async insertAllImages() {
    const imgLinks = await Fetch.getImageLinks();
    for (const filename of imgLinks) {
      this.insertImage(filename);
    }
  }

  insertImage(filename) {
    const src = `${Fetch.url}/images/${filename}`;
    const imgBlock = document.createElement('div');
    imgBlock.className = 'image_wrapper';

    const img = document.createElement('img');
    img.className = 'image_preview';
    img.src = src;

    imgBlock.innerHTML = `
      ${img.outerHTML}
      <button class="delete-image" data-src="${src}">×</button>
    `;
    this.imgGallery.appendChild(imgBlock);
  }

  validateFileType(file) {
    const fileTypes = ['jpeg', 'png', 'gif'];
    let { type } = file;
    type = type.split('/')[1];
    return fileTypes.includes(type);
  }

  async fileInputChangeHandler() {
    const files = [...this.fileInput.files];
    const [file] = files;

    if (this.validateFileType(file)) {
      const formData = new FormData();
      formData.append('file', file, 'filename');
      const filename = await Fetch.postImage(formData);
      this.insertImage(filename);
    } else {
      console.log('Неправильный тип файла! А на модалку не хватило бюджета');
    }

    this.fileInput.value = '';
  }

  async onDelete(target) {
    const src = target.previousElementSibling.src;
    const paths = src.split('/');
    const filename = paths[paths.length - 1];

    const response = await Fetch.deleteImage(filename);
    if (response.success) {
      const imgWrapper = target.closest('.image_wrapper');
      imgWrapper.remove();
    } else {
      // по идее сюда бы попап с ошибкой
      console.log(response.message);
    }
  }

  addEventListeners() {
    document.addEventListener('click', (e) => {
      const { target } = e;
      if (target.classList.contains('delete-image')) {
        this.onDelete(target);
      }
    });

    this.fileInput.addEventListener('change', () => {
      this.fileInputChangeHandler();
    });

    this.label.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    this.label.addEventListener('drop', (e) => {
      e.preventDefault();
      const { files } = e.dataTransfer;
      this.fileInput.files = files;
      this.fileInputChangeHandler();
    });
  }
}
