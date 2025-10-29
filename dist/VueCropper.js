'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vue = require('vue');

var _cropperjs = require('cropperjs');

var _cropperjs2 = _interopRequireDefault(_cropperjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  render: function render() {
    var crossorigin = this.crossorigin || undefined;

    return (0, _vue.h)('div', {
      ref: 'container',
      style: this.containerStyle
    }, [(0, _vue.h)('img', {
      ref: 'img',
      src: this.src,
      alt: this.alt || 'image',
      style: [{ 'max-width': '100%' }, this.imgStyle],
      crossorigin: crossorigin
    })]);
  },

  props: {
    containerStyle: Object,
    src: {
      type: String,
      default: ''
    },
    alt: String,
    imgStyle: Object,

    template: String,

    background: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    scaleStep: {
      type: Number,
      default: 0.1
    },
    themeColor: String,

    rotatable: {
      type: Boolean,
      default: true
    },
    scalable: {
      type: Boolean,
      default: true
    },
    skewable: {
      type: Boolean,
      default: false
    },
    translatable: {
      type: Boolean,
      default: true
    },

    aspectRatio: Number,
    initialAspectRatio: Number,
    initialCoverage: {
      type: Number,
      default: 0.5
    },
    movable: {
      type: Boolean,
      default: true
    },
    resizable: {
      type: Boolean,
      default: true
    },
    zoomable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },

    rows: Number,
    columns: Number,
    bordered: {
      type: Boolean,
      default: true
    },
    covered: {
      type: Boolean,
      default: true
    },

    ready: Function,
    cropstart: Function,
    cropmove: Function,
    cropend: Function,
    crop: Function,
    zoom: Function,
    imageTransform: Function,
    selectionChange: Function
  },
  mounted: function mounted() {
    this.initCropper();
  },
  unmounted: function unmounted() {
    if (this.cropper) {
      this.cropper.destroy();
    }
  },

  watch: {
    src: function src() {
      if (this.cropper) {
        this.replace(this.src);
      }
    }
  },
  methods: {
    initCropper: function initCropper() {
      var _this = this;

      var template = this.template;
      if (!template) {
        var imageAttrs = [];
        if (this.rotatable) imageAttrs.push('rotatable');
        if (this.scalable) imageAttrs.push('scalable');
        if (this.skewable) imageAttrs.push('skewable');
        if (this.translatable) imageAttrs.push('translatable');

        var selectionAttrs = [];
        if (this.movable) selectionAttrs.push('movable');
        if (this.resizable) selectionAttrs.push('resizable');
        if (this.zoomable) selectionAttrs.push('zoomable');
        if (this.multiple) selectionAttrs.push('multiple');
        if (this.keyboard) selectionAttrs.push('keyboard');
        if (this.outlined) selectionAttrs.push('outlined');
        if (this.aspectRatio) selectionAttrs.push('aspect-ratio="' + this.aspectRatio + '"');
        if (this.initialAspectRatio) selectionAttrs.push('initial-aspect-ratio="' + this.initialAspectRatio + '"');
        if (this.initialCoverage !== undefined) selectionAttrs.push('initial-coverage="' + this.initialCoverage + '"');

        var gridAttrs = [];
        if (this.rows) gridAttrs.push('rows="' + this.rows + '"');
        if (this.columns) gridAttrs.push('columns="' + this.columns + '"');
        if (this.bordered) gridAttrs.push('bordered');
        if (this.covered) gridAttrs.push('covered');

        template = '\n          <cropper-canvas ' + (this.background ? 'background' : '') + ' ' + (this.disabled ? 'disabled' : '') + '>\n            <cropper-image ' + imageAttrs.join(' ') + '></cropper-image>\n            <cropper-shade hidden></cropper-shade>\n            <cropper-handle action="select" plain></cropper-handle>\n            <cropper-selection ' + selectionAttrs.join(' ') + '>\n              <cropper-grid role="grid" ' + gridAttrs.join(' ') + '></cropper-grid>\n              <cropper-crosshair centered></cropper-crosshair>\n              <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>\n              <cropper-handle action="n-resize"></cropper-handle>\n              <cropper-handle action="e-resize"></cropper-handle>\n              <cropper-handle action="s-resize"></cropper-handle>\n              <cropper-handle action="w-resize"></cropper-handle>\n              <cropper-handle action="ne-resize"></cropper-handle>\n              <cropper-handle action="nw-resize"></cropper-handle>\n              <cropper-handle action="se-resize"></cropper-handle>\n              <cropper-handle action="sw-resize"></cropper-handle>\n            </cropper-selection>\n          </cropper-canvas>\n        ';
      }

      var options = {
        template: template,
        container: this.$refs.container
      };

      this.cropper = new _cropperjs2.default(this.$refs.img, options);

      this.$nextTick(function () {
        var canvas = _this.cropper.getCropperCanvas();
        var image = _this.cropper.getCropperImage();
        var selection = _this.cropper.getCropperSelection();

        if (canvas) {
          if (_this.cropstart) canvas.addEventListener('cropstart', _this.cropstart);
          if (_this.cropmove) canvas.addEventListener('cropmove', _this.cropmove);
          if (_this.cropend) canvas.addEventListener('cropend', _this.cropend);
          if (_this.crop) canvas.addEventListener('crop', _this.crop);
          if (_this.zoom) canvas.addEventListener('zoom', _this.zoom);
        }

        if (image) {
          if (_this.ready) image.addEventListener('ready', _this.ready);
          if (_this.imageTransform) image.addEventListener('transform', _this.imageTransform);
        }

        if (selection) {
          if (_this.selectionChange) selection.addEventListener('change', _this.selectionChange);
        }
      });
    },
    getCropperCanvas: function getCropperCanvas() {
      return this.cropper ? this.cropper.getCropperCanvas() : null;
    },
    getCropperImage: function getCropperImage() {
      return this.cropper ? this.cropper.getCropperImage() : null;
    },
    getCropperSelection: function getCropperSelection() {
      return this.cropper ? this.cropper.getCropperSelection() : null;
    },
    reset: function reset() {
      var selection = this.getCropperSelection();
      if (selection) {
        return selection.$reset();
      }
    },
    clear: function clear() {
      var selection = this.getCropperSelection();
      if (selection) {
        return selection.$clear();
      }
    },
    initCrop: function initCrop() {
      var selection = this.getCropperSelection();
      if (selection) {
        return selection.$render();
      }
    },
    replace: function replace(url) {
      if (this.cropper) {
        this.cropper.destroy();

        this.$refs.img.src = url;

        this.initCropper();
      }
    },
    enable: function enable() {
      var canvas = this.getCropperCanvas();
      if (canvas) {
        canvas.disabled = false;
      }
    },
    disable: function disable() {
      var canvas = this.getCropperCanvas();
      if (canvas) {
        canvas.disabled = true;
      }
    },
    destroy: function destroy() {
      if (this.cropper) {
        return this.cropper.destroy();
      }
    },
    move: function move(offsetX, offsetY) {
      var selection = this.getCropperSelection();
      if (selection) {
        return selection.$move(offsetX, offsetY);
      }
    },
    moveTo: function moveTo(x) {
      var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : x;

      var selection = this.getCropperSelection();
      if (selection) {
        return selection.$moveTo(x, y);
      }
    },
    relativeZoom: function relativeZoom(ratio, _originalEvent) {
      var selection = this.getCropperSelection();
      if (selection) {
        var currentScale = 1;
        return selection.$zoom(ratio);
      }
    },
    zoomTo: function zoomTo(ratio, _originalEvent) {
      var image = this.getCropperImage();
      if (image) {
        return image.$zoom(ratio);
      }
    },
    rotate: function rotate(degree) {
      var image = this.getCropperImage();
      if (image) {
        return image.$rotate(degree);
      }
    },
    rotateTo: function rotateTo(degree) {
      var image = this.getCropperImage();
      if (image) {
        var currentRotation = image.rotate || 0;
        return image.$rotate(degree - currentRotation);
      }
    },
    scaleX: function scaleX(_scaleX) {
      var image = this.getCropperImage();
      if (image) {
        var currentScaleY = image.scaleY || 1;
        return image.$scale(_scaleX, currentScaleY);
      }
    },
    scaleY: function scaleY(_scaleY) {
      var image = this.getCropperImage();
      if (image) {
        var currentScaleX = image.scaleX || 1;
        return image.$scale(currentScaleX, _scaleY);
      }
    },
    scale: function scale(scaleX) {
      var scaleY = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : scaleX;

      var image = this.getCropperImage();
      if (image) {
        return image.$scale(scaleX, scaleY);
      }
    },
    getData: function getData() {
      var rounded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var selection = this.getCropperSelection();
      if (selection) {
        var data = {
          x: selection.x,
          y: selection.y,
          width: selection.width,
          height: selection.height
        };

        if (rounded) {
          data.x = Math.round(data.x);
          data.y = Math.round(data.y);
          data.width = Math.round(data.width);
          data.height = Math.round(data.height);
        }

        return data;
      }
      return {};
    },
    setData: function setData(data) {
      var selection = this.getCropperSelection();
      if (selection && data) {
        return selection.$change(data.x || selection.x, data.y || selection.y, data.width || selection.width, data.height || selection.height);
      }
    },
    getContainerData: function getContainerData() {
      var canvas = this.getCropperCanvas();
      if (canvas) {
        return {
          width: canvas.width,
          height: canvas.height
        };
      }
      return {};
    },
    getImageData: function getImageData() {
      var image = this.getCropperImage();
      if (image) {
        return {
          left: image.x || 0,
          top: image.y || 0,
          width: image.width,
          height: image.height,
          rotate: image.rotate || 0,
          scaleX: image.scaleX || 1,
          scaleY: image.scaleY || 1,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        };
      }
      return {};
    },
    getCanvasData: function getCanvasData() {
      var image = this.getCropperImage();
      if (image) {
        return {
          left: image.x || 0,
          top: image.y || 0,
          width: image.width,
          height: image.height,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        };
      }
      return {};
    },
    setCanvasData: function setCanvasData(data) {
      var image = this.getCropperImage();
      if (image && data) {
        if (data.left !== undefined || data.top !== undefined) {
          image.$moveTo(data.left || image.x, data.top || image.y);
        }

        if (data.width !== undefined && image.width) {
          var scale = data.width / image.width;
          image.$zoom(scale);
        }
      }
    },
    getCropBoxData: function getCropBoxData() {
      return this.getData();
    },
    setCropBoxData: function setCropBoxData(data) {
      return this.setData(data);
    },
    getCroppedCanvas: async function getCroppedCanvas() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var selection = this.getCropperSelection();
      if (selection) {
        return await selection.$toCanvas(options);
      }
      return null;
    },
    setAspectRatio: function setAspectRatio(aspectRatio) {
      var selection = this.getCropperSelection();
      if (selection) {
        selection.aspectRatio = aspectRatio;
        return selection.$render();
      }
    },
    setDragMode: function setDragMode(mode) {
      var canvas = this.getCropperCanvas();
      if (canvas) {
        return canvas.$setAction(mode);
      }
    }
  }
};