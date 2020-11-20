<template>
  <div class="map-inspector-container">
    <div
      class="map-inspector-body"
      :class="bodyClassList"
      @dragstart="onDragStart"
      @wheel="onMouseWheelZoom"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
    >
      <img
        :src="img"
        :style="mapImageStyle()"
      />

      <div
        v-for="(n) in nodes" :key="n.title"
        class="node"
        :style="getNodeStyle(n)"
        @click="onNodeClick(n)"
      >
      </div>
    </div>
    <div
      class="map-inspector-sidebar"
      :class="sidebarClassList"
    >
      <text-content
        :content="sidebarContent"
      />
      <a
        href="#"
        @click="expandSidebar"
      >
        Toggle
      </a>
    </div>
  </div>
</template>

<script>
import TextContent from '@/components/TextContent';

export default {
  name: 'map-inspector',

  components: {
    TextContent,
  },

  props: {
    // img: null,
    mapData: null,
  },

  data() {
    return {
      dragging: false,

      zoom: 1,
      zoomRate: 20,

      minZoom: 1,
      maxZoom: 5,

      translateX: 0,
      translateY: 0,

      rawImageWidth: 0,
      rawImageHeight: 0,

      mapAreaClientRect: null,
      mapAreaWidth: 0,
      mapAreaHeight: 0,

      previousFrameMousePositionX: 0,
      previousFrameMousePositionY: 0,

      sidebarExpanded: false,
      sidebarContent: 'Content goes here [Vitrazia](/map/asylgad/vitrazia/)',
      img: null,
    };
  },

  computed: {
    bodyClassList() {
      return {
        dragging: this.dragging,
        static: !this.dragging,
      };
    },

    sidebarClassList() {
      return {
        expanded: this.sidebarExpanded,
      };
    },

    rawImageAspectRatio() {
      return this.rawImageWidth / this.rawImageHeight;
    },

    mapAreaAspectRatio() {
      return this.mapAreaWidth / this.mapAreaHeight;
    },

    minTranslationX() {
      return ((this.mapAreaWidth * this.zoom) - this.mapAreaWidth) / 2;
    },

    maxTranslationX() {
      return (this.mapAreaWidth - (this.mapAreaWidth * this.zoom)) / 2;
    },

    minTranslationY() {
      return ((this.mapAreaHeight * this.zoom) - this.mapAreaHeight) / 2;
    },

    maxTranslationY() {
      const heightRatio = this.mapAreaAspectRatio / this.rawImageAspectRatio;
      const extraHeight = ((this.mapAreaHeight * heightRatio) - this.mapAreaHeight) * this.zoom;

      return ((this.mapAreaHeight - (this.mapAreaHeight * this.zoom)) / 2) - extraHeight;
    },

    nodes() {
      return this.mapData.nodes;
    },
  },

  methods: {
    loadImage() {
      const img = new Image();
      img.onload = () => {
        this.rawImageWidth = img.width;
        this.rawImageHeight = img.height;
      };
      img.src = this.img;
    },

    getMapAreaBounds() {
      const clientRect = document.getElementsByClassName('map-inspector-body')[0]
        .getBoundingClientRect();

      this.mapAreaClientRect = clientRect;

      this.mapAreaWidth = clientRect.right - clientRect.left;
      this.mapAreaHeight = clientRect.bottom - clientRect.top;
    },

    onMouseWheelZoom(e) {
      const deltaZoom = e.deltaY / this.zoomRate;

      this.zoom -= deltaZoom;

      if (this.zoom < this.minZoom) {
        this.zoom = this.minZoom;
      } else if (this.zoom > this.maxZoom) {
        this.zoom = this.maxZoom;
      } else {
        const translateFactor = deltaZoom * (1 / this.zoom);

        this.translateX -= (e.clientX - (this.mapAreaClientRect.left + (this.mapAreaWidth / 2)))
          * -translateFactor;

        this.translateY -= (e.clientY - (this.mapAreaClientRect.top + (this.mapAreaHeight / 2)))
          * -translateFactor;
      }
    },

    onDragStart(e) {
      e.preventDefault();
      return false;
    },

    onMouseDown(e) {
      this.dragging = true;
      this.previousFrameMousePositionX = e.clientX;
      this.previousFrameMousePositionY = e.clientY;
    },

    onMouseMove(e) {
      if (this.dragging) {
        e.preventDefault();

        this.translateX += e.clientX - this.previousFrameMousePositionX;
        this.translateY += e.clientY - this.previousFrameMousePositionY;

        this.previousFrameMousePositionX = e.clientX;
        this.previousFrameMousePositionY = e.clientY;
      }
    },

    onMouseUp() {
      this.dragging = false;
    },

    mapImageStyle() {
      let width = this.mapAreaWidth * this.zoom;
      let height = this.mapAreaHeight * this.zoom;

      if (this.rawImageAspectRatio > this.mapAreaAspectRatio) {
        width = height * this.rawImageAspectRatio;
      } else {
        height = width / this.rawImageAspectRatio;
      }

      const xTranslation = (-(this.mapAreaWidth / 2) * this.zoom)
        + this.translateX
        + (this.mapAreaWidth / 2);
      const yTranslation = (-(this.mapAreaHeight / 2) * this.zoom)
        + this.translateY
        + (this.mapAreaHeight / 2);

      return {
        width: `${width}px`,
        height: `${height}px`,
        position: 'relative',
        left: `${xTranslation}px`,
        top: `${yTranslation}px`,
      };
    },

    expandSidebar(e) {
      e.preventDefault();

      this.sidebarExpanded = !this.sidebarExpanded;
    },

    getNodeStyle(node) {
      const pos = node.position;
      const ratio = (this.mapAreaWidth * this.zoom) / this.rawImageWidth;

      let posX = pos.x * ratio;
      posX += this.translateX - this.minTranslationX;
      let posY = pos.y * ratio;
      posY += this.translateY - this.minTranslationY;

      return {
        left: `${posX}px`,
        top: `${posY}px`,
      };
    },

    onNodeClick(node) {
      this.sidebarContent = node.textContent;

      if (node.nodes) {
        this.nodes = node.nodes;
      }

      if (node.href) {
        this.$router.push(node.href);
      }
    },

    adjustTranslation() {
      if (this.translateX > this.minTranslationX) {
        this.translateX = this.minTranslationX;
      }

      if (this.translateX < this.maxTranslationX) {
        this.translateX = this.maxTranslationX;
      }

      if (this.translateY > this.minTranslationY) {
        this.translateY = this.minTranslationY;
      }

      if (this.translateY < this.maxTranslationY) {
        this.translateY = this.maxTranslationY;
      }
    },
  },

  mounted() {
    document.body.addEventListener('mouseup', () => { this.onMouseUp(); });

    this.img = this.mapData.map;
  },

  watch: {
    zoom(previous, newValue) {
      const ratio = newValue / previous;
      this.translateX /= ratio;
      this.translateY /= ratio;

      if (this.zoom < this.minZoom) {
        this.zoom = this.minZoom;
      } else if (this.zoom > this.maxZoom) {
        this.zoom = this.maxZoom;
      }

      this.adjustTranslation();
    },

    dragging() {
      this.adjustTranslation();
    },

    img() {
      this.loadImage();
      this.getMapAreaBounds();
    },

    mapData() {
      this.img = this.mapData.map;
    },
  },
};
</script>

<style lang="scss" scoped>
.map-inspector-container {
  position: relative;
  height: 100%;
}

.map-inspector-body {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 75%;
  background: $gray-100;

  &.static {
    img {
      transition: all 0.2s ease;
    }

    .node {
      transition: all 0.2s ease;
    }
  }
}

.map-inspector-sidebar {
  padding: 1em;
  grid-area: sidebar;
  background: $gray-200;
  position: absolute;
  top: 0;
  left: 75%;
  bottom: 0;
  right: 0;

  transition: all 0.2s ease;

  &.expanded {
    left: 25%;
  }
}

.node {
  position: absolute;
  background-color: red;
  border-radius: 100%;
  width: 14px;
  height: 14px;
  margin: -27px 0 0 -27px;
  border: 20px solid rgba(255, 0, 0, 0.2);
  -webkit-background-clip: padding-box; /* for Safari */
    background-clip: padding-box; /* for IE9+, Firefox 4+, Opera, Chrome */
  opacity: 0;

  cursor: pointer;

  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
}
</style>
