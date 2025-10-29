import { h } from 'vue'
import Cropper from 'cropperjs'

export default {
  render() {
    const crossorigin = this.crossorigin || undefined;

    return h('div', { 
      ref: 'container',
      style: this.containerStyle 
    }, [
      h('img', {
        ref: 'img',
        src: this.src,
        alt: this.alt || 'image',
        style: [
          { 'max-width': '100%' },
          this.imgStyle
        ],
        crossorigin,
      })
    ])
  },
  props: {
    // Library props
    containerStyle: Object,
    src: {
      type: String,
      default: ''
    },
    alt: String,
    imgStyle: Object,

    // CropperJS v2 props (many have changed)
    template: String,
    
    // Canvas props
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

    // Image props
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

    // Selection props
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
    
    // Grid props
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
    
    // Event callbacks
    ready: Function,
    cropstart: Function,
    cropmove: Function,
    cropend: Function,
    crop: Function,
    zoom: Function,
    imageTransform: Function,
    selectionChange: Function
  },
  mounted() {
    this.initCropper()
  },
  unmounted() {
    if (this.cropper) {
      this.cropper.destroy()
    }
  },
  watch: {
    src() {
      if (this.cropper) {
        this.replace(this.src)
      }
    }
  },
  methods: {
    initCropper() {
      // Build the template with proper attributes
      let template = this.template
      if (!template) {
        // Build default template with props
        const imageAttrs = []
        if (this.rotatable) imageAttrs.push('rotatable')
        if (this.scalable) imageAttrs.push('scalable')
        if (this.skewable) imageAttrs.push('skewable')
        if (this.translatable) imageAttrs.push('translatable')
        
        const selectionAttrs = []
        if (this.movable) selectionAttrs.push('movable')
        if (this.resizable) selectionAttrs.push('resizable')
        if (this.zoomable) selectionAttrs.push('zoomable')
        if (this.multiple) selectionAttrs.push('multiple')
        if (this.keyboard) selectionAttrs.push('keyboard')
        if (this.outlined) selectionAttrs.push('outlined')
        if (this.aspectRatio) selectionAttrs.push(`aspect-ratio="${this.aspectRatio}"`)
        if (this.initialAspectRatio) selectionAttrs.push(`initial-aspect-ratio="${this.initialAspectRatio}"`)
        if (this.initialCoverage !== undefined) selectionAttrs.push(`initial-coverage="${this.initialCoverage}"`)
        
        const gridAttrs = []
        if (this.rows) gridAttrs.push(`rows="${this.rows}"`)
        if (this.columns) gridAttrs.push(`columns="${this.columns}"`)
        if (this.bordered) gridAttrs.push('bordered')
        if (this.covered) gridAttrs.push('covered')

        template = `
          <cropper-canvas ${this.background ? 'background' : ''} ${this.disabled ? 'disabled' : ''}>
            <cropper-image ${imageAttrs.join(' ')}></cropper-image>
            <cropper-shade hidden></cropper-shade>
            <cropper-handle action="select" plain></cropper-handle>
            <cropper-selection ${selectionAttrs.join(' ')}>
              <cropper-grid role="grid" ${gridAttrs.join(' ')}></cropper-grid>
              <cropper-crosshair centered></cropper-crosshair>
              <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
              <cropper-handle action="n-resize"></cropper-handle>
              <cropper-handle action="e-resize"></cropper-handle>
              <cropper-handle action="s-resize"></cropper-handle>
              <cropper-handle action="w-resize"></cropper-handle>
              <cropper-handle action="ne-resize"></cropper-handle>
              <cropper-handle action="nw-resize"></cropper-handle>
              <cropper-handle action="se-resize"></cropper-handle>
              <cropper-handle action="sw-resize"></cropper-handle>
            </cropper-selection>
          </cropper-canvas>
        `
      }

      const options = {
        template,
        container: this.$refs.container
      }

      this.cropper = new Cropper(this.$refs.img, options)

      // Add event listeners on the components
      this.$nextTick(() => {
        const canvas = this.cropper.getCropperCanvas()
        const image = this.cropper.getCropperImage()
        const selection = this.cropper.getCropperSelection()

        if (canvas) {
          // Canvas events
          if (this.cropstart) canvas.addEventListener('cropstart', this.cropstart)
          if (this.cropmove) canvas.addEventListener('cropmove', this.cropmove)
          if (this.cropend) canvas.addEventListener('cropend', this.cropend)
          if (this.crop) canvas.addEventListener('crop', this.crop)
          if (this.zoom) canvas.addEventListener('zoom', this.zoom)
        }

        if (image) {
          // Image events
          if (this.ready) image.addEventListener('ready', this.ready)
          if (this.imageTransform) image.addEventListener('transform', this.imageTransform)
        }

        if (selection) {
          // Selection events
          if (this.selectionChange) selection.addEventListener('change', this.selectionChange)
        }
      })
    },

    // Get the component elements
    getCropperCanvas() {
      return this.cropper ? this.cropper.getCropperCanvas() : null
    },

    getCropperImage() {
      return this.cropper ? this.cropper.getCropperImage() : null
    },

    getCropperSelection() {
      return this.cropper ? this.cropper.getCropperSelection() : null
    },

    // Reset the image and crop box to their initial states
    reset() {
      const selection = this.getCropperSelection()
      if (selection) {
        return selection.$reset()
      }
    },

    // Clear the crop box
    clear() {
      const selection = this.getCropperSelection()
      if (selection) {
        return selection.$clear()
      }
    },

    // Init crop box manually
    initCrop() {
      const selection = this.getCropperSelection()
      if (selection) {
        return selection.$render()
      }
    },

    // Replace the image's src and rebuild the cropper
    replace(url) {
      if (this.cropper) {
        // Destroy old cropper
        this.cropper.destroy()
        // Update image src
        this.$refs.img.src = url
        // Reinitialize
        this.initCropper()
      }
    },

    // Enable (unfreeze) the cropper
    enable() {
      const canvas = this.getCropperCanvas()
      if (canvas) {
        canvas.disabled = false
      }
    },

    // Disable (freeze) the cropper
    disable() {
      const canvas = this.getCropperCanvas()
      if (canvas) {
        canvas.disabled = true
      }
    },

    // Destroy the cropper and remove the instance from the image
    destroy() {
      if (this.cropper) {
        return this.cropper.destroy()
      }
    },

    // Move the canvas with relative offsets
    move(offsetX, offsetY) {
      const selection = this.getCropperSelection()
      if (selection) {
        return selection.$move(offsetX, offsetY)
      }
    },

    // Move the canvas to an absolute point
    moveTo(x, y = x) {
      const selection = this.getCropperSelection()
      if (selection) {
        return selection.$moveTo(x, y)
      }
    },

    // Zoom the canvas with a relative ratio
    relativeZoom(ratio, _originalEvent) {
      const selection = this.getCropperSelection()
      if (selection) {
        // In v2, zoom is relative by default
        const currentScale = 1 // Get current scale if needed
        return selection.$zoom(ratio)
      }
    },

    // Zoom the canvas to an absolute ratio
    zoomTo(ratio, _originalEvent) {
      const image = this.getCropperImage()
      if (image) {
        return image.$zoom(ratio)
      }
    },

    // Rotate the canvas with a relative degree
    rotate(degree) {
      const image = this.getCropperImage()
      if (image) {
        return image.$rotate(degree)
      }
    },

    // Rotate the canvas to an absolute degree
    rotateTo(degree) {
      const image = this.getCropperImage()
      if (image) {
        // Get current rotation and calculate relative rotation needed
        const currentRotation = image.rotate || 0
        return image.$rotate(degree - currentRotation)
      }
    },

    // Scale the image on the x-axis
    scaleX(scaleX) {
      const image = this.getCropperImage()
      if (image) {
        const currentScaleY = image.scaleY || 1
        return image.$scale(scaleX, currentScaleY)
      }
    },

    // Scale the image on the y-axis
    scaleY(scaleY) {
      const image = this.getCropperImage()
      if (image) {
        const currentScaleX = image.scaleX || 1
        return image.$scale(currentScaleX, scaleY)
      }
    },

    // Scale the image
    scale(scaleX, scaleY = scaleX) {
      const image = this.getCropperImage()
      if (image) {
        return image.$scale(scaleX, scaleY)
      }
    },

    // Get the cropped area position and size data
    getData(rounded = false) {
      const selection = this.getCropperSelection()
      if (selection) {
        const data = {
          x: selection.x,
          y: selection.y,
          width: selection.width,
          height: selection.height
        }
        
        if (rounded) {
          data.x = Math.round(data.x)
          data.y = Math.round(data.y)
          data.width = Math.round(data.width)
          data.height = Math.round(data.height)
        }
        
        return data
      }
      return {}
    },

    // Set the cropped area position and size with new data
    setData(data) {
      const selection = this.getCropperSelection()
      if (selection && data) {
        return selection.$change(
          data.x || selection.x,
          data.y || selection.y,
          data.width || selection.width,
          data.height || selection.height
        )
      }
    },

    // Get the container size data
    getContainerData() {
      const canvas = this.getCropperCanvas()
      if (canvas) {
        return {
          width: canvas.width,
          height: canvas.height
        }
      }
      return {}
    },

    // Get the image position and size data
    getImageData() {
      const image = this.getCropperImage()
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
        }
      }
      return {}
    },

    // Get the canvas position and size data
    getCanvasData() {
      const image = this.getCropperImage()
      if (image) {
        return {
          left: image.x || 0,
          top: image.y || 0,
          width: image.width,
          height: image.height,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight
        }
      }
      return {}
    },

    // Set the canvas position and size with new data
    setCanvasData(data) {
      const image = this.getCropperImage()
      if (image && data) {
        if (data.left !== undefined || data.top !== undefined) {
          image.$moveTo(data.left || image.x, data.top || image.y)
        }
        // Handle scaling if width/height provided
        if (data.width !== undefined && image.width) {
          const scale = data.width / image.width
          image.$zoom(scale)
        }
      }
    },

    // Get the crop box position and size data
    getCropBoxData() {
      return this.getData()
    },

    // Set the crop box position and size with new data
    setCropBoxData(data) {
      return this.setData(data)
    },

    // Get a canvas drawn the cropped image
    async getCroppedCanvas(options = {}) {
      const selection = this.getCropperSelection()
      if (selection) {
        return await selection.$toCanvas(options)
      }
      return null
    },

    // Change the aspect ratio of the crop box
    setAspectRatio(aspectRatio) {
      const selection = this.getCropperSelection()
      if (selection) {
        selection.aspectRatio = aspectRatio
        return selection.$render()
      }
    },

    // Change the drag mode
    setDragMode(mode) {
      const canvas = this.getCropperCanvas()
      if (canvas) {
        // In v2, this is handled differently through action attributes
        // You might need to update handle actions instead
        return canvas.$setAction(mode)
      }
    }
  }
}
